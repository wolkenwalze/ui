import React from "react";
import "./EditorPhase.css";

interface EditorPhaseProps {
    children?: JSX.Element|JSX.Element[]|string
    onDropType?: (type: string) => void
    onDropID?: (id: string) => void
    noDrops?: boolean
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
        if (this.props.noDrops) {
            return
        }
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
        if (this.props.noDrops) {
            return false
        }

        for (let i=0; i < e.dataTransfer.types.length; i++) {
            if (e.dataTransfer.types[i] === "text/x-workflow-event-type" || e.dataTransfer.types[i] === "text/x-workflow-event-id") {
                return true
            }
        }
        return false
    }

    onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.canHandleDrop(e)) {
            return
        }
        e.stopPropagation();
        e.preventDefault();

        this.setState(() => {
            return {
                dropping: true,
            }
        })
    }

    onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.canHandleDrop(e)) {
            return
        }
        e.stopPropagation();
        e.preventDefault();

        this.setState(() => {
            return {
                dropping: false,
            }
        })
    }

    render() {
        return <div
            className={"editor__phase" + (this.state.dropping?" editor__phase--dragover":"")}
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
        >
            {this.props.children}
        </div>
    }


}