import React from "react";
import "./Output.css";

interface OutputProps {

}

interface OutputState {

}

export default class Output extends React.Component<OutputProps, OutputState> {
    render() {
        return <div className={"output"}>
            <h2 className={"output__title"}>Workflow JSON</h2>
            <div className={"output__description"}>Copy the following workflow JSON to your CI system, or paste a result JSON into this box.</div>
            <textarea cols={80} rows={25} className={"output__content"} />
        </div>
    }
}