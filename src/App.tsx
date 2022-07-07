import React from 'react';
import './App.css';
import Menu from "./menu/menu";
import PodScenarioMenuEntry from "./scenarios/pod/menu";
import HTTPMonitorMenuEntry from "./scenarios/http/menu";
import Output from "./output/Output";
import Editor from "./editor/Editor";

interface AppProps {

}

interface AppState {

}

export default class App extends React.Component<AppProps, AppState> {
    render() {
        return <div className={"app"}>
            <div className={"app__sidebar"}>
                <Menu>
                    <PodScenarioMenuEntry />
                    <HTTPMonitorMenuEntry />
                </Menu>
            </div>
            <div className={"app__main"}>
                <Editor />
            </div>
            <div className={"app__result"}>
                <Output />
            </div>
        </div>
    }
}