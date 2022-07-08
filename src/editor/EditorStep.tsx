import React from "react";
import "./EditorStep.css"
import {ReactComponent as PodIcon} from "../scenarios/pod/pod.svg";
import {ReactComponent as HTTPIcon} from "../scenarios/http/http.svg";

interface EditorStepProps {
    warning?: string
    type: string
    id: string
    draggable: boolean
    onConnectStart: (id: string, x: number, y: number) => void
    onConnect: (id: string) => void
    boxref: React.RefObject<HTMLDivElement>
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
                                this.props.type === "pod-kill" ? <PodIcon/> : <HTTPIcon/>
                            }
                        </div> : null}
                    <h2 className={"editor__step__title"}>
                        {
                            this.props.type === "pod-kill" ? "Pod scenario" : (this.props.type === "http-monitor" ? "HTTP monitor" : "Start")
                        }
                    </h2>
                </header>
                {this.props.type !== "start" ?
                    <>
                        <main className={"editor__step__content"}>
                            <table>
                                <tbody>
                                <tr>
                                    <th>Label:</th>
                                    <td>app=nginx</td>
                                </tr>
                                </tbody>
                            </table>
                        </main>
                        <footer className={"editor__step__footer"}>
                            <button className={"editor__step__button"}>Edit</button>
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