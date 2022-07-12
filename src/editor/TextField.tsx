import React from "react";
import "./TextField.css";

interface TextFieldProps {
    id: string
    label: string
    value?: string
    onChange: (value: string) => void
}

interface TextFieldState {
}

export default class TextField extends React.Component<TextFieldProps, TextFieldState> {
    render() {
        return <div className={"editor__dialog__form__field"}>
            <label htmlFor={this.props.id}>{this.props.label}</label>
            <input
                id={this.props.id}
                type={"text"}
                value={this.props.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.props.onChange(e.target.value)
                }}
            />
        </div>
    }
}