import "./Editor.css";
import React from "react";
import EditorPhase from "./EditorPhase";
import EditorStep from "./EditorStep";

interface EditorProps {

}

interface EditorState {
    phases: EditorPhaseData[]
}

interface EditorPhaseData {
    steps: EditorStepData[]
}

interface EditorStepData {
    id: string
    type: string
    inboundConnections: string[]
    details: Map<string, string>
}

var nextID: number = 1

function getNextID(): string {
    const id = nextID
    nextID++
    return String(id)
}

function createStep(type: string): EditorStepData {
    return {
        "id": getNextID(),
        "type": type,
        "inboundConnections": [],
        "details": new Map<string, string>(),
    }
}

export default class Editor extends React.Component<EditorProps, EditorState> {
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            phases: []
        }
    }

    render() {
        return <div className={"editor"}>
            <EditorPhase>
                <div className={"editor__step__wrapper"}>
                    <div className={"editor__step"}>
                        <header className={"editor__step__header"}>
                            <h2 className={"editor__step__title"}>Start</h2>
                        </header>
                    </div>
                    <div className={"editor__step__out"}>
                        <div className={"editor__step__out__handle"}>
                        </div>
                    </div>
                </div>
            </EditorPhase>
            {this.state.phases.map((phase, i) => {
                return <EditorPhase key={i}
                                    onDropType={(type) => {
                                        const phases = this.state.phases;
                                        phases[i].steps.push(createStep(type))
                                        this.setState((state) => {
                                            return {
                                                phases: Editor.cleanupPhases(phases),
                                            }
                                        })
                                    }}
                                    onDropID={(id) => {
                                        const phases = this.state.phases;
                                        const step = Editor.findAndRemoveStep(id, phases);
                                        if (step == null) {
                                            return
                                        }
                                        phases[i].steps.push(step)
                                        this.setState((state) => {
                                            return {
                                                phases: Editor.cleanupPhases(phases),
                                            }
                                        })
                                    }}
                >
                    {
                        phase.steps.map((step) =>
                            <EditorStep id={step.id} type={step.type} key={step.id} draggable={true}/>
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

                    this.setState((state) => {
                        return {
                            phases: Editor.cleanupPhases(phases),
                        }
                    })
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
                    this.setState((state) => {
                        return {
                            phases: Editor.cleanupPhases(phases),
                        }
                    })
                }}
            >
                <span style={{
                    color: "#777",
                }}>Drag your steps here</span>
            </EditorPhase>
        </div>
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
            console.log(steps.length, steps)
            if (steps.length === 0) {
                phases.splice(i, 1)
            }
        }
        return phases;
    }
}