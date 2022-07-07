import React from "react";
import "./EditorStep.css"
import {ReactComponent as PodIcon} from "../scenarios/pod/pod.svg";
import {ReactComponent as HTTPIcon} from "../scenarios/http/http.svg";

interface EditorStepProps {
    warning?: string
    type: string
    id: string
    draggable: boolean
}

interface EditorStepState {

}

export default class EditorStep extends React.Component<EditorStepProps, EditorStepState> {
    constructor(props: EditorStepProps) {
        super(props);
        this.state = {}
    }

    onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/x-workflow-event-id", this.props.id)
    }

    render() {
        return <div
            className={"editor__step__wrapper" + (this.props.draggable?" editor__step__wrapper--draggable":"") + (this.props.warning ? " editor__step__wrapper--warning" : "")}
            draggable={this.props.draggable}
            onDragStart={this.onDragStart}
        >
            <div className={"editor__step__in"}>
                <div className={"editor__step__in__handle"}>
                </div>
            </div>
            {this.props.warning ?
                <div className={"editor__step__warning__handle"} title={this.props.warning}>
                    ⚠️
                </div>
                : null}
            <div className={"editor__step"}>
                <header className={"editor__step__header"}>
                    <div className={"editor__step__icon"}>
                        {
                            this.props.type === "pod-kill" ? <PodIcon/> : <HTTPIcon/>
                        }
                    </div>
                    <h2 className={"editor__step__title"}>
                        {
                            this.props.type === "pod-kill" ? "Pod scenario" : "HTTP monitor"
                        }
                    </h2>
                </header>
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
                    <button className={"editor__step__button"} disabled={true}
                            title={"Please paste a result JSON into the box on the right to view results."}>Results
                    </button>
                </footer>
            </div>
            <div className={"editor__step__out"}>
                <div className={"editor__step__out__handle"}>
                </div>
            </div>
        </div>
    }
}