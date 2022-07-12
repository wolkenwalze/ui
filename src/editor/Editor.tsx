import "./Editor.css";
import React from "react";
import EditorPhase from "./EditorPhase";
import EditorStep from "./EditorStep";
import SchemaService, {Spec, Step, Step as SchemaStep} from "../SchemaService";
import Line from "./Line";

interface EditorProps {
    updateService: SchemaService
}

interface Connecting {
    startID: string
    startX: number
    startY: number
    x: number
    y: number
}

interface EditorState {
    phases: EditorPhaseData[]
    connecting?: Connecting
}

interface EditorPhaseData {
    steps: EditorStepData[]
}

interface EditorStepData {
    id: string
    type: string
    inboundConnections: string[]
    details: Map<string, string>,
    ref: React.RefObject<HTMLDivElement>
}

function getNextID(): string {
    return crypto.randomUUID()
}

function createStep(type: string): EditorStepData {
    return {
        "id": getNextID(),
        "type": type,
        "inboundConnections": [],
        "details": new Map<string, string>(),
        "ref": React.createRef<HTMLDivElement>(),
    }
}

export default class Editor extends React.Component<EditorProps, EditorState> {
    private readonly startRef: React.RefObject<HTMLDivElement>;

    constructor(props: EditorProps) {
        super(props);
        this.state = {
            phases: []
        }
        this.startRef = React.createRef<HTMLDivElement>()
    }

    componentDidMount() {
        this.props.updateService.registerSpecUpdateHandler(this.updateSpec)
    }

    componentWillUnmount() {
        this.props.updateService.unregisterSpecUpdateHandler(this.updateSpec)
    }

    onConnectStart = (id: string, x: number, y: number) => {
        this.setState((state) => {
            return {
                phases: state.phases,
                connecting: {
                    startID: id,
                    startX: x,
                    startY: y,
                    x: x,
                    y: y,
                }
            }
        })
    }

    onConnectMove = (x: number, y: number) => {
        this.setState((state) => {
            if (!state.connecting) {
                return state
            }
            return {
                phases: state.phases,
                connecting: {
                    startID: state.connecting.startID,
                    startX: state.connecting.startX,
                    startY: state.connecting.startY,
                    x: x,
                    y: y,
                }
            }
        })
    }

    onConnectAbort = () => {
        this.setState((state) => {
            return {
                phases: state.phases,
                connecting: undefined,
            }
        })
    }

    onConnect = (id: string) => {
        if (!this.state.connecting) {
            return
        }
        const phases = this.state.phases
        for (let i = 0; i < phases.length; i++) {
            for (let j = 0; j < phases[i].steps.length; j++) {
                if (phases[i].steps[j].id === id) {
                    phases[i].steps[j].inboundConnections.push(this.state.connecting.startID)
                }
            }
        }
        this.setStateAndPropagate({
            phases: phases
        })
    }

    updateSpec = (spec: Spec) => {
        const phases: EditorPhaseData[] = []
        const steps: EditorStepData[] = []
        const stepsByID: Map<string, EditorStepData> = new Map()
        const findInboundConnections = (id: string, steps: Step[] | undefined, initialSteps: string[] | undefined) => {
            const result: string[] = []
            if (steps !== undefined) {
                for (let step of steps) {
                    for (let nextStepID of step.nextSteps) {
                        if (nextStepID === id) {
                            result.push(step.id)
                            break
                        }
                    }
                }
            }
            if (initialSteps !== undefined) {
                for (let initialStep of initialSteps) {
                    if (initialStep === id) {
                        result.push("0")
                    }
                }
            }
            return result
        }

        if (spec.steps !== undefined) {
            for (const step of spec.steps) {
                const stepData = {
                    id: step.id,
                    type: step.type,
                    inboundConnections: findInboundConnections(step.id, spec.steps, spec.initialSteps),
                    details: new Map<string, string>(),
                    ref: React.createRef<HTMLDivElement>()
                }
                steps.push(stepData)
                stepsByID.set(stepData.id, stepData)
            }
        }

        while (steps?.length > 0) {
            const phase: EditorPhaseData = {
                steps: [],
            }
            for (const step of steps) {
                let hasInboundConnections = false
                for (const inboundConnection of step.inboundConnections) {
                    if (inboundConnection !== "0") {
                        hasInboundConnections = true
                        break
                    }
                }
                if (!hasInboundConnections) {
                    const stepData = stepsByID.get(step.id)
                    if (!stepData) {
                        throw new Error("Step with ID not found " + step.id)
                    }
                    stepData.inboundConnections = findInboundConnections(stepData.id, spec.steps, spec.initialSteps)
                    phase.steps.push(stepData)
                }
            }
            for (const step of phase.steps) {
                const index = steps.indexOf(step)
                steps.splice(index, 1)
            }
            phases.push(phase)

            for (const step of steps) {
                for (const removedStep of phase.steps) {
                    const index = step.inboundConnections.indexOf(removedStep.id)
                    if (index >= 0) {
                        step.inboundConnections.splice(index, 1)
                    }
                }
            }
        }

        this.setState((state) => {
            return {
                phases: phases,
                connecting: state.connecting,
            }
        })
        // Hack: update links once the refs exist.
        setTimeout(() => {
            this.setState((state) => {
                return state
            })
        },0)
    }

    setStateAndPropagate = (newState: EditorState) => {
        this.setState(() => {
            return {
                phases: Editor.cleanupPhases(newState.phases),
            }
        })
        const steps: Map<string, SchemaStep> = new Map()
        const initialSteps: string[] = []
        for (const phase of newState.phases) {
            for (const step of phase.steps) {
                steps.set(step.id, {
                    id: step.id,
                    type: step.type,
                    params: new Map(),
                    nextSteps: []
                })
                for (const prevStep of step.inboundConnections) {
                    if (prevStep === "0") {
                        initialSteps.push(step.id)
                    } else {
                        steps.get(prevStep)?.nextSteps.push(step.id)
                    }
                }
            }
        }
        const finalSteps: SchemaStep[] = []
        steps.forEach((value) => {
            finalSteps.push(value)
        })
        const spec: Spec = {
            initialSteps: initialSteps,
            steps: finalSteps,
        }
        this.props.updateService.onUpdateData(spec)
    }

    render() {
        return <div
            className={"editor"}
            onDragOver={(e: React.DragEvent<any>) => {
                if (this.state.connecting) {
                    e.preventDefault()
                    this.onConnectMove(e.pageX, e.pageY)
                }
            }}
            onDragEnd={() => {
                if (this.state.connecting) {
                    this.onConnectAbort()
                }
            }}
        >
            {this.renderConnecting()}
            {this.renderConnections()}
            <EditorPhase noDrops={true}>
                <EditorStep
                    boxref={this.startRef}
                    id={"0"}
                    type={"start"}
                    draggable={false}
                    onConnectStart={this.onConnectStart}
                    onConnect={this.onConnect}
                    parameters={new Map()}
                />
            </EditorPhase>
            {this.state.phases.map((phase, i) => {
                return <EditorPhase
                    key={i}
                    onDropType={(type) => {
                        const phases = this.state.phases;
                        phases[i].steps.push(createStep(type))
                        this.setStateAndPropagate({phases})
                    }}
                    onDropID={(id) => {
                        const phases = this.state.phases;
                        const step = Editor.findAndRemoveStep(id, phases);
                        if (step == null) {
                            return
                        }
                        phases[i].steps.push(step)
                        this.setStateAndPropagate({phases})
                    }}
                >
                    {
                        phase.steps.map((step) =>
                            <EditorStep
                                boxref={step.ref}
                                id={step.id}
                                type={step.type}
                                key={step.id}
                                draggable={true}
                                warning={(step.inboundConnections.length === 0 ? "No inbound connections" : "")}
                                onConnectStart={this.onConnectStart}
                                onConnect={this.onConnect}
                                parameters={step.details}
                            />
                        )
                    }
                </EditorPhase>
            })}
            <EditorPhase
                onDropType={(type) => {
                    const phases = this.state.phases;
                    const step = createStep(type);
                    const phase: EditorPhaseData = {
                        steps: [
                            step,
                        ]
                    };
                    phases.push(phase)

                    this.setStateAndPropagate({phases})
                }}
                onDropID={(id) => {
                    const phases = this.state.phases;
                    const step = Editor.findAndRemoveStep(id, phases);
                    if (step === null) {
                        return
                    }
                    const phase: EditorPhaseData = {
                        steps: [
                            step,
                        ]
                    };
                    phases.push(phase)
                    this.setStateAndPropagate({phases})
                }}
            >
                <span style={{
                    color: "#777",
                }}>Drag your steps here</span>
            </EditorPhase>
        </div>
    }

    private renderConnections() {
        const result: JSX.Element[] = []
        for (let phase of this.state.phases) {
            for (let j = 0; j < phase.steps.length; j++) {
                const step = phase.steps[j]
                const current = step.ref.current
                if (current === null) {
                    continue
                }
                const targetBounds = current.getBoundingClientRect()
                step.inboundConnections.forEach((connection) => {
                    const sourceBounds = this.findCoordinates(connection)
                    result.push(
                        <Line
                            key={step.id + "-" + connection}
                            x1={sourceBounds.x + sourceBounds.width / 2}
                            y1={sourceBounds.y + sourceBounds.height}
                            x2={targetBounds.x + targetBounds.width / 2}
                            y2={targetBounds.y}
                        />
                    )
                })
            }
        }
        return result
    }

    private renderConnecting() {
        const connecting = this.state.connecting
        if (connecting === undefined) {
            return null
        }
        return <Line x1={connecting.startX} y1={connecting.startY} x2={connecting.x} y2={connecting.y}/>
    }

    private static findAndRemoveStep(id: string, phases: EditorPhaseData[]) {
        let step: EditorStepData | null = null
        for (let phase of phases) {
            for (let j = 0; j < phase.steps.length; j++) {
                if (phase.steps[j].id === id) {
                    step = phase.steps[j]
                    phase.steps.splice(j, 1)
                }
            }
        }
        return step;
    }

    private static cleanupPhases(phases: EditorPhaseData[]): EditorPhaseData[] {
        for (let i = 0; i < phases.length; i++) {
            const steps = phases[i].steps
            if (steps.length === 0) {
                phases.splice(i, 1)
            }
        }
        return phases;
    }

    private findRef(id: string): React.RefObject<HTMLDivElement> {
        if (id === "0") {
            return this.startRef
        }
        for (let i = 0; i < this.state.phases.length; i++) {
            const steps = this.state.phases[i].steps
            for (let j = 0; j < steps.length; j++) {
                if (steps[j].id === id) {
                    return steps[j].ref
                }
            }
        }
        throw new Error("Step not found: " + id)
    }

    private findCoordinates(id: string) {
        const ref: React.Ref<HTMLDivElement> = this.findRef(id)
        const current = ref.current
        if (current == null) {
            throw new Error("Missing ref current for " + id)
        }
        return current.getBoundingClientRect()
    }
}