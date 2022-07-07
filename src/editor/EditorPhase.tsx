import React from "react";
import "./EditorPhase.css";

interface EditorPhaseProps {
    children?: JSX.Element|JSX.Element[]|string
    onDropType?: (type: string) => void
    onDropID?: (id: string) => void
}

interface EditorPhaseState {
    dropping: boolean
}

export default class EditorPhase extends React.Component<EditorPhaseProps, EditorPhaseState> {
    constructor(props: EditorPhaseProps) {
        super(props);
        this.state = {
            dropping: false
        }
    }

    onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const eventType = e.dataTransfer.getData("text/x-workflow-event-type")
        if (eventType && this.props.onDropType) {
            this.props.onDropType(eventType);
        }
        const eventID = e.dataTransfer.getData("text/x-workflow-event-id")
        if (eventID && this.props.onDropID) {
            this.props.onDropID(eventID)
        }
        this.setState((state) => {
            if (!state.dropping) {
                return state
            }
            return {
                dropping: false,
            }
        })
    }

    canHandleDrop = (e: React.DragEvent<HTMLDivElement>):boolean =>  {
        const eventType = e.dataTransfer.getData("text/x-workflow-event-type")
        const eventID = e.dataTransfer.getData("text/x-workflow-event-id")
        return ((eventType !== "" && this.props.onDropType !== null) || (eventID !== "" && this.props.onDropID !== null))
    }

    onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.canHandleDrop(e)) {
            return
        }
        e.stopPropagation();
        e.preventDefault();

        this.setState((state) => {
            return {
                dropping: true,
            }
        })
    }

    onDragExit = (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.canHandleDrop(e)) {
            return
        }
        e.stopPropagation();
        e.preventDefault();

        this.setState((state) => {
            return {
                dropping: false,
            }
        })
    }

    render() {
        return <div
            className={"editor__phase" + (this.state.dropping?" editor__phase--dragover":"")}
            onDragOver={this.onDragOver}
            onDragExit={this.onDragExit}
            onDrop={this.onDrop}
        >
            {this.props.children}
        </div>
    }


}