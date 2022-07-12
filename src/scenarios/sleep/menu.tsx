import React from "react";
import MenuEntry from "../../menu/entry";
import {ReactComponent as SleepIcon} from "./sleep.svg";

interface SleepMenuState {

}

interface SleepMenuProps {

}

export default class SleepMenuEntry extends React.Component<SleepMenuProps, SleepMenuState> {
    render() {
        return <MenuEntry
            icon={<SleepIcon/>}
            title="Sleep"
            description="Wait for a specified amount of time."
            type={"sleep"}
        />
    }
}