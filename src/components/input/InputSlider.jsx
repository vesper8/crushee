import React from "react";
import { PureComponent } from "react";

export default class InputSlider extends PureComponent {

    firingEvent = false
    handleChange = (event) => {
        this.setState({ level: this.cap(event.target.value) }, this.fireChange)
    }

    handleWheel = (event) => {
        if(this.props.scrolling === false) return false;
        this.setState({ level: this.cap((this.state.level * 1) + Math.round(event.deltaY * -1 * 0.01)) }, this.fireChange)
    }

    fireChange = () => {
        if (this.firingEvent === false && this.props.onChange && typeof this.props.onChange == "function") {
            this.firingEvent = true
            this.props.onChange(this.cap(this.state.level) * 1, this)
            this.firingEvent = false
        }
    }

    getName = () => {
        if (this.props.name) {
            return (
                <div className="name-row">
                    <div className="icon">{(this.props.monitortype == "wmi" ? <span>&#xE770;</span> : <span>&#xE7F4;</span>)}</div>
                    <div className="title">{this.props.name}</div>
                </div>
            )
        }
    }

    cap = (level) => {
        const min = (this.props.min || 0) * 1
        const max = (this.props.max || 100) * 1
        let capped = level * 1
        if (level < min) {
            capped = min
        } else if (level > max) {
            capped = max
        }
        return capped
    }

    progressStyle = () => {
        const min = (this.props.min || 0) * 1
        const max = (this.props.max || 100) * 1
        const level = this.state.level
        return { width: (0 + (((level - min) * (100 / (max - min))))) + "%" }
    }

    constructor(props) {
        super(props);
        this.state = {
            level: this.cap((this.props.level === undefined ? 50 : this.props.level)),
        }
        this.fireChange()
    }

    componentDidUpdate(oldProps) {
        if(oldProps.max != this.props.max || oldProps.min != this.props.min || oldProps.level != this.props.level) {
            this.setState({
                level: this.cap(this.props.level)
            }, () => {
                if(oldProps.level === this.props.level) {
                    this.fireChange()
                }
            })
        }
    }

    render() {
        const min = (this.props.min || 0) * 1
        const max = (this.props.max || 100) * 1
        const level = this.cap(this.state.level)
        return (
                <div className="input--range">
                    <div className="rangeGroup">
                        <input type="range" min={min} max={max} value={level} data-percent={level + "%"} onChange={this.handleChange} onWheel={this.handleWheel} className="range" />
                        <div className="progress" style={this.progressStyle()}></div>
                    </div>
                    <input type="number" min={min} max={max} value={level} onChange={this.handleChange} onWheel={this.handleWheel} className="val" />
                </div>
        );
    }

};