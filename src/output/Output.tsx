import React from "react";
import "./Output.css";
import SchemaService, {Spec} from "../SchemaService";

interface OutputProps {
    updateService: SchemaService
}

interface OutputState {
    data: Spec
}

export default class Output extends React.Component<OutputProps, OutputState> {
    constructor(props: OutputProps) {
        super(props);
        this.state = {
            data: {}
        }
    }

    onDataUpdate = (spec: Spec) => {
        this.setState(() => {
            return {
                data: spec,
            }
        })
    }

    componentDidMount = () => {
        this.props.updateService.registerDataUpdateHandler(this.onDataUpdate)
    }

    componentWillUnmount = () => {
        this.props.updateService.unregisterDataUpdateHandler(this.onDataUpdate)
    }

    render() {
        return <div className={"output"}>
            <h2 className={"output__title"}>Workflow JSON</h2>
            <div className={"output__description"}>Copy the following workflow JSON to your CI system, or paste a result JSON into this box.</div>
            <textarea cols={80} rows={25} className={"output__content"} value={JSON.stringify(this.state.data, null, 2)} readOnly={true} />
        </div>
    }
}
