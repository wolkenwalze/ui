import React from "react";
import "./EditorStep.css"
import {ReactComponent as PodIcon} from "../scenarios/pod/pod.svg";
import {ReactComponent as HTTPIcon} from "../scenarios/http/http.svg";
import {ReactComponent as SleepIcon} from "../scenarios/sleep/sleep.svg";

interface EditorStepProps {
    warning?: string
    type: string
    id: string
    draggable: boolean
    onConnectStart: (id: string, x: number, y: number) => void
    onConnect: (id: string) => void
    onEdit?: () => void
    boxref: React.RefObject<HTMLDivElement>
    parameters: Map<string,string>
}

interface EditorStepState {
    outX?: number
    outY?: number
    connecting: boolean
}

export default class EditorStep extends React.Component<EditorStepProps, EditorStepState> {
    private readonly outRef: React.RefObject<HTMLDivElement>;
    constructor(props: EditorStepProps) {
        super(props);
        this.state = {
            connecting: false
        }
        this.outRef = React.createRef<HTMLDivElement>()
    }

    onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/x-workflow-event-id", this.props.id)
    }

    componentDidMount() {
        const current = this.outRef.current
        if (current === null) {
            return
        }
        const rect = current.getBoundingClientRect()
        this.setState((state) => {
            return {
                outX: rect.x,
                outY: rect.y,
                connecting: state.connecting,
            }
        })
    }

    render() {
        function getTitle(type: string) {
            switch (type) {
                case "pod-kill":
                    return "Pod scenario"
                case "http-monitor":
                    return "HTTP monitor"
                case "sleep":
                    return "Sleep"
                default:
                    return "Start"
            }
        }

        function getIcon(type: string) {
            switch (type) {
                case "pod-kill":
                    return <PodIcon/>
                case "http-monitor":
                    return <HTTPIcon/>
                case "sleep":
                    return <SleepIcon />
                default:
                    return null
            }
        }

        function renderParameters(type: string, parameters: Map<string, string>) {
            function renderPodParameters(parameters: Map<string, string>) {
                const namespacePattern = parameters.get("namespace-pattern")
                const namePattern = parameters.get("name-pattern")
                return <table className={"editor__step__table"}>
                    <tbody>
                    <tr>
                        <th>Namespace pattern:</th>
                        <td>{namespacePattern?namespacePattern:".*"}</td>
                    </tr>
                    <tr>
                        <th>Pod name pattern:</th>
                        <td>{namePattern?namePattern:".*"}</td>
                    </tr>
                    </tbody>
                </table>
            }

            function renderHTTPMonitorParameters(parameters: Map<string, string>) {
                const target = parameters.get("target")
                const time = parameters.get("time")
                return <table className={"editor__step__table"}>
                    <tbody>
                    <tr>
                        <th>Target URL:</th>
                        <td>{target?target:"http://localhost"}</td>
                    </tr>
                    <tr>
                        <th>Time:</th>
                        <td>{time?time:"5m"}</td>
                    </tr>
                    </tbody>
                </table>
            }

            function renderSleepParameters(parameters: Map<string, string>) {
                if (!parameters) {
                    parameters = new Map<string,string>()
                }

                const time = parameters.get("time")
                return <table className={"editor__step__table"}>
                    <tbody>
                    <tr>
                        <th>Time:</th>
                        <td>{time?time:"10s"}</td>
                    </tr>
                    </tbody>
                </table>
            }

            switch (type) {
                case "start":
                    return null
                case "pod-kill":
                    return renderPodParameters(parameters)
                case "http-monitor":
                    return renderHTTPMonitorParameters(parameters)
                case "sleep":
                    return renderSleepParameters(parameters)
            }
        }

        return <div
            className={"editor__step__wrapper" + (this.props.draggable ? " editor__step__wrapper--draggable" : "") + (this.props.warning ? " editor__step__wrapper--warning" : "")}
            draggable={this.props.draggable}
            onDragStart={this.onDragStart}
            onDragOver={(e: React.DragEvent<any>) => {
                let found = false
                for (let type of e.dataTransfer.types) {
                    if (type === "text/x-workflow-connect-id") {
                        found = true
                    }
                }
                if (!found) {
                    return
                }
                this.setState((state) => {
                    return {
                        outX: state.outX,
                        outY: state.outY,
                        connecting: true,
                    }
                })
            }}
            onDragExit={(e: React.DragEvent<any>) => {
                this.setState((state) => {
                    return {
                        outX: state.outX,
                        outY: state.outY,
                        connecting: false,
                    }
                })
            }}
            onDrop={(e: React.DragEvent<any>) => {
                const connectID = e.dataTransfer.getData("text/x-workflow-connect-id")
                if (!connectID) {
                    return
                }
                e.stopPropagation()
                this.props.onConnect(this.props.id)
                this.setState((state) => {
                    return {
                        outX: state.outX,
                        outY: state.outY,
                        connecting: false,
                    }
                })
            }}
        >
            {this.props.warning ?
                <div className={"editor__step__warning__handle"} title={this.props.warning}>
                    ⚠️
                </div>
                : null}
            <div className={"editor__step" + (this.state.connecting?" editor__step--connecting":"")} ref={this.props.boxref}>
                <header className={"editor__step__header"}>
                    {this.props.type !== "start" ?
                        <div className={"editor__step__icon"}>
                            {
                                getIcon(this.props.type)

                            }
                        </div> : null}
                    <h2 className={"editor__step__title"}>
                        {
                            getTitle(this.props.type)
                        }
                    </h2>
                </header>
                {this.props.type !== "start" ?
                    <>
                        <main className={"editor__step__content"}>
                            {renderParameters(this.props.type, this.props.parameters)}
                        </main>
                        <footer className={"editor__step__footer"}>
                            <button className={"editor__step__button"} onClick={this.props.onEdit}>Edit</button>
                            <button
                                className={"editor__step__button"}
                                disabled={true}
                                title={"Please paste a result JSON into the box on the right to view results."}
                            >Results
                            </button>
                        </footer>
                    </>
                    : null}
            </div>
            <div className={"editor__step__out"}>
                <div
                    ref={this.outRef}
                    className={"editor__step__out__handle"}
                    draggable={true}
                    onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                        if (!this.outRef.current) {
                            return
                        }
                        e.stopPropagation()
                        e.dataTransfer.setData("text/x-workflow-connect-id", this.props.id)
                        const rect = this.outRef.current.getBoundingClientRect()
                        this.props.onConnectStart(this.props.id, rect.x + rect.width/2, rect.y + rect.height/2)
                    }}
                ></div>
            </div>
        </div>
    }
}