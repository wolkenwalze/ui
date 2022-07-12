import React from "react";
import "./Output.css";
import SchemaService, {Spec} from "../SchemaService";

interface OutputProps {
    updateService: SchemaService
    initialData?: string|undefined
}

interface OutputState {
    data: Spec
    content: string,
    error: boolean,
}

export default class Output extends React.Component<OutputProps, OutputState> {
    constructor(props: OutputProps) {
        super(props);
        this.state = {
            data: {},
            content: props.initialData?props.initialData:JSON.stringify({}, null, 2),
            error: false,
        }
    }

    onDataUpdate = (spec: Spec) => {
        this.setState(() => {
            return {
                data: spec,
                content: JSON.stringify(spec, null, 2),
                error: false,
            }
        })
    }

    componentDidMount = () => {
        this.props.updateService.registerDataUpdateHandler(this.onDataUpdate)
        if (this.state.content !== "{}") {
            this.onUpdate(this.state.content)
        }
    }

    componentWillUnmount = () => {
        this.props.updateService.unregisterDataUpdateHandler(this.onDataUpdate)
    }

    onUpdate = (content: string) => {
        let spec: Spec;
        try {
            spec = JSON.parse(content)
            this.props.updateService.onUpdateSpec(spec)
            this.setState(() => {
                return {
                    data: spec,
                    content: content,
                    error: false,
                }
            })
        } catch (e: any) {
            this.setState((state) => {
                return {
                    data: state.data,
                    content: content,
                    error: true,
                }
            })
            return
        }
    }

    render() {
        return <div className={"output"}>
            <h2 className={"output__title"}>Workflow JSON</h2>
            <div className={"output__description"}>Copy the following workflow JSON to your CI system, or paste a result JSON into this box.</div>
            <textarea
                cols={80}
                rows={25}
                className={"output__content" + (this.state.error?" output__content--error":"")}
                value={this.state.content}
                onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {
                this.onUpdate(e.target.value)
            }} />
        </div>
    }
}
