import React from "react";
import "./EditorDialog.css";
import TextField from "./TextField";

type saveHandler = (params: Map<string,string>) => void
type cancelHandler = () => void

interface EditorDialogProps {
    type?: string
    params?: Map<string,string>
    onSave: saveHandler
    onCancel: cancelHandler
}

interface EditorDialogState {
    params: Map<string,string>
}

export default class EditorDialog extends React.Component<EditorDialogProps, EditorDialogState> {
    constructor(props: EditorDialogProps) {
        super(props);
        this.state = {
            params: this.props.params?this.props.params:new Map()
        }
    }

    render() {
        if (!this.props.type) {
            return null
        }
        return <div className={"editor__dialog"}>
            <div className={"editor__dialog__background"} onClick={this.props.onCancel}></div>
            <div className={"editor__dialog__wrapper"}>
                <div className={"editor__dialog__window"}>
                    <header>
                        <h2>Edit step</h2>
                    </header>
                    {this.getEditForm()}
                    <footer>
                        <button onClick={this.props.onCancel}>Cancel</button>
                        <button onClick={this.onSave} className={"default"}>Save</button>
                    </footer>
                </div>
            </div>
        </div>
    }

    getEditForm = () => {
        switch (this.props.type) {
            case "sleep":
                return this.getSleepForm()
            case "http-monitor":
                return this.getHTTPForm()
            case "pod-kill":
                return this.getPodForm()
            default:
                return null;
        }
    }

    onSave = () => {
        this.props.onSave(this.state.params)
    }

    getSleepForm = () => {
        const time = this.state.params.get("time")
        return <main>
            <TextField id={"sleepTime"} label={"Time:"} value={time?time:"10s"} onChange={
                (value: string) => {
                    this.setState((state) => {
                        const params = state.params
                        params.set("time", value)
                        return {
                            params: params,
                        }
                    })
                }
            } />
        </main>
    }

    getHTTPForm = () => {
        const target = this.state.params.get("target")
        const time = this.state.params.get("time")
        return <main>
            <TextField id={"target"} label={"Target URL:"} value={target?target:"http://localhost"} onChange={
                (value: string) => {
                    this.setState((state) => {
                        const params = state.params
                        params.set("target", value)
                        return {
                            params: params,
                        }
                    })
                }
            } />
            <TextField id={"httpTime"} label={"Time:"} value={time?time:"5m"} onChange={
                (value: string) => {
                    this.setState((state) => {
                        const params = state.params
                        params.set("time", value)
                        return {
                            params: params,
                        }
                    })
                }
            } />
        </main>
    }

    getPodForm = () => {
        const ns = this.state.params.get("namespace-pattern")
        const name = this.state.params.get("name-pattern")
        return <main>
            <TextField id={"podNamespace"} label={"Namespace pattern:"} value={ns?ns:".*"} onChange={
                (value: string) => {
                    this.setState((state) => {
                        const params = state.params
                        params.set("namespace-pattern", value)
                        return {
                            params: params,
                        }
                    })
                }
            } />
            <TextField id={"podName"} label={"Name pattern:"} value={name?name:".*"} onChange={
                (value: string) => {
                    this.setState((state) => {
                        const params = state.params
                        params.set("name-pattern", value)
                        return {
                            params: params,
                        }
                    })
                }
            } />
        </main>
    }
}