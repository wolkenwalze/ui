import React from "react";
import "./menu.css";

interface MenuProps {
    children: JSX.Element|JSX.Element[]
}

interface MenuState {

}

export default class Menu extends React.Component<MenuProps, MenuState> {
    render() {
        return <div className={"menu"}>
            <h1>Add workflow items</h1>
            <div className={"menu__entries"}>
                {this.props.children}
            </div>
        </div>
    }
}