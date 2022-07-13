import React from "react";
import "./ResultDialog.css";
import Result from "../Result";
import {BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Bar} from 'recharts';

interface ResultDialogProps {
    id: string
    type: string
    result: Result
    onClose: () => void
}

interface ResultDialogState {
}

export default class ResultDialog extends React.Component<ResultDialogProps, ResultDialogState> {
    render() {
        if (!this.props.type) {
            return null
        }
        return <div className={"editor__results"}>
            <div className={"editor__results__background"} onClick={this.props.onClose}></div>
            <div className={"editor__results__wrapper"}>
                <div className={"editor__results__window"}>
                    <header>
                        <h2>Results</h2>
                    </header>
                    <main>
                        {this.props.result.error?<div className={"error"}>{this.props.result.error}</div>:null}
                        {this.props.result.podName?<table>
                            <tbody>
                                <tr>
                                    <th>Pod namespace:</th>
                                    <td>{this.props.result.podNamespace}</td>
                                </tr>
                                <tr>
                                    <th>Pod name:</th>
                                    <td>{this.props.result.podName}</td>
                                </tr>
                            </tbody>
                        </table>:null}
                        {this.props.result.latencies?this.renderLatencies():null}
                    </main>
                    <footer>
                        <button onClick={this.props.onClose}>Close</button>
                    </footer>
                </div>
            </div>
        </div>
    }

    private renderLatencies() {
        const data: ChartEntry[] = []
        this.props.result.latencies?.forEach((value, key) => [
            data.push({time: new Date(Date.parse(key)).toLocaleString(), latency: value/1000000})
        ])
        return <div className={"latencies"}>
            <ResponsiveContainer width="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickCount={4}/>
                    <YAxis allowDecimals={true} unit={"ms"} />
                    <Tooltip formatter={(value: number) => value + " ms"} />
                    <Bar dataKey="latency" fill="#008100" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    }
}

interface ChartEntry {
    time: string
    latency: number
}