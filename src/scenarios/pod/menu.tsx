import React from "react";
import MenuEntry from "../../menu/entry";
import {ReactComponent as PodIcon} from "./pod.svg";

interface PodScenarioMenuState {

}

interface PodScenarioMenuProps {

}

export default class PodScenarioMenuEntry extends React.Component<PodScenarioMenuProps, PodScenarioMenuState> {
    render() {
        return <MenuEntry
            icon={<PodIcon/>}
            title="Pod scenario"
            description="Remove pods based on labels and observe recovery of the application."
            type={"pod-kill"}
        />
    }
}