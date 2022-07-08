import React from "react";
import "./Line.css"

interface LineProps {
    x1: number
    y1: number
    x2: number
    y2: number
}

interface LineState {

}

export default class Line extends React.Component<LineProps, LineState> {
    render() {
        return (
            <div
                className={"line" + (this.props.x1 < this.props.x2 ? " line--right" : " line--left") + (this.props.y1 < this.props.y2 ? " line--down" : " line--up")}
                style={{
                    height: (Math.abs(this.props.y2 - this.props.y1)) + "px",
                    width: (Math.abs(this.props.x2 - this.props.x1)) + "px",
                    left: (Math.min(this.props.x1, this.props.x2)) + "px",
                    top: (Math.min(this.props.y1, this.props.y2)) + "px",
                }}
            >
                <div className={"line__component line__component--1"}></div>
                <div className={"line__component line__component--2"}></div>
            </div>
        );
    }
}