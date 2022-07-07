import React from "react";
import MenuEntry from "../../menu/entry";
import {ReactComponent as HTTPIcon} from "./http.svg";

interface HTTPMonitorMenuState {

}

interface HTTPMonitorMenuProps {

}

export default class HTTPMonitorMenuEntry extends React.Component<HTTPMonitorMenuProps, HTTPMonitorMenuState> {
    render() {
        return <MenuEntry
            icon={<HTTPIcon/>}
            title="HTTP monitor"
            description="Monitor an HTTP endpoint and draw a response time graph."
            type={"http-monitor"}
        />
    }
}