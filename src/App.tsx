import React from 'react';
import './App.css';
import Menu from "./menu/menu";
import PodScenarioMenuEntry from "./scenarios/pod/menu";
import HTTPMonitorMenuEntry from "./scenarios/http/menu";
import Output from "./output/Output";
import Editor from "./editor/Editor";
import SchemaService from "./SchemaService";
import SleepMenuEntry from "./scenarios/sleep/menu";

interface AppProps {
    initialData?: string
}

interface AppState {
}

export default class App extends React.Component<AppProps, AppState> {
    private readonly updateService: SchemaService;
    constructor(props: AppProps) {
        super(props);
        this.updateService = new SchemaService()
        this.state = {}
    }

    render() {
        return <div className={"app"}>
            <div className={"app__sidebar"}>
                <Menu>
                    <PodScenarioMenuEntry />
                    <HTTPMonitorMenuEntry />
                    <SleepMenuEntry />
                </Menu>
            </div>
            <div className={"app__main"}>
                <Editor updateService={this.updateService} />
            </div>
            <div className={"app__result"}>
                <Output updateService={this.updateService} initialData={this.props.initialData} />
            </div>
        </div>
    }
}