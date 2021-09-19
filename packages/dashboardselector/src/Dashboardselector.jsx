import React, { Component } from 'react';
import { StyledContainer, StyledGreeting } from './DashboardselectorStyles';
import ListDashboards from '@splunk/listdashboards';
import Select from '@splunk/react-ui/Select';
import ColumnLayout from '@splunk/react-ui/ColumnLayout';
import Datetime from "react-datetime";
import Link from '@splunk/react-ui/Link';




class DashboardSelector extends Component {

    constructor(props) {
        super(props);
        this.state = { pickertype: "rangeslider", dashboardid: "", rangeStart: "", rangeEnd: ""};
        this.handleChangePickerType = this.handleChangePickerType.bind(this);
        this.handleDashboardIdChange = this.handleDashboardIdChange.bind(this);
        this.startChange = this.startChange.bind(this);
        this.endChange = this.endChange.bind(this);

    }

    handleDashboardIdChange(event, { value }) {
        console.log({ value })
        this.setState({
            dashboardid: value
        });
    };

    handleChangePickerType(event, { value }) {
        console.log({ value })

        this.setState({
            pickertype: value
        });
    };

    startChange(event) {
        this.setState({
            rangeStart: event.format("YYYY-MM-DD HH:mm:ss")
        });
    };

    endChange(event) {
        this.setState({
            rangeEnd: event.format("YYYY-MM-DD HH:mm:ss")
        });
    };


    render() {

        var url = window.location.href.replace(/[^\/]+$/, '') + this.state.pickertype + "?dashboardid=" + encodeURIComponent(this.state.dashboardid) + "&rangeStart=" + encodeURIComponent(this.state.rangeStart) + "&rangeEnd=" + encodeURIComponent(this.state.rangeEnd)

        var startPicker = <Datetime onChange={this.startChange}/>

        var endPicker = <Datetime onChange={this.endChange}/>
        

        const colStyle = {
            border: `0px solid`,
            padding: 5,
            minHeight: 10,
            width: '100%',
            paddingLeft: 10
        };

        const calColStyle = {
            border: `0px solid`,
            padding: 5,
            minHeight: 10,
            width: '100%',
            paddingReft: 50
        };


        return (
            <StyledContainer>
                <p>Use the following form to build your custom dashboard URL:</p>
                <ColumnLayout gutter={1}>
                    <ColumnLayout.Row>
                        <ColumnLayout.Column style={colStyle}>Select Dashboard:</ColumnLayout.Column>
                        <ColumnLayout.Column style={colStyle}>Select Type of Input:</ColumnLayout.Column>
                        <ColumnLayout.Column style={colStyle}>Select Range Start:</ColumnLayout.Column>
                        <ColumnLayout.Column style={colStyle}>Select Range End:</ColumnLayout.Column>
                    </ColumnLayout.Row>
                    <ColumnLayout.Row>
                        <ColumnLayout.Column style={colStyle} span={1}>
                            <ListDashboards changehandler={this.handleDashboardIdChange} />
                        </ColumnLayout.Column>
                        <ColumnLayout.Column style={colStyle} span={1}>
                            <Select onChange={this.handleChangePickerType}>
                                <Select.Option value="rangeslider" label="Range Slider" />
                                <Select.Option value="timelapse" label="Timelapse" />
                            </Select>
                        </ColumnLayout.Column>
                        <ColumnLayout.Column style={calColStyle} span={1}>
                            {startPicker}
                        </ColumnLayout.Column>
                        <ColumnLayout.Column style={calColStyle} span={1}>
                            {endPicker}
                        </ColumnLayout.Column>
                    </ColumnLayout.Row>
                    <ColumnLayout.Row>
                        <ColumnLayout.Column style={colStyle} span={4}>
                            <p>Use the following link to view your custom dashboard:</p>
                            <Link to={url}>{url}</Link>
                        </ColumnLayout.Column>
                    </ColumnLayout.Row>
                </ColumnLayout>


            </StyledContainer>


        );
    }
}

export default DashboardSelector;