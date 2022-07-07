import React from "react";
import "./entry.css";

interface MenuEntryProps {
    icon: JSX.Element
    title: string
    description: string
    type: string
}

interface MenuEntryState {
}

export default class MenuEntry extends React.Component<MenuEntryProps, MenuEntryState> {
    constructor(props: MenuEntryProps) {
        super(props);
        this.state = {
        }
    }

    onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/x-workflow-event-type", this.props.type)
    }

    render() {
        return <div
                    draggable={true}
                    onDragStart={this.onDragStart}
                    className={"menu__entry"}
        >
            <div className={"menu__entry__icon"}>
                {this.props.icon}
            </div>
            <div className={"menu__entry__content"}>
                <h2 className={"menu__entry__title"}>{this.props.title}</h2>
                <div className={"menu__entry__description"}>{this.props.description}</div>
            </div>
        </div>
    }
}