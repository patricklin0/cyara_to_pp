import '../Styles/Help.css';
import React, { Component } from 'react';

import CyaraToPureProject_ScreenShot1 from '../resources/CyaraToPureProject_ScreenShot1.png';
import CyaraToPureProject_ScreenShot2 from '../resources/CyaraToPureProject_ScreenShot2.png';
import CyaraToPureProject_ScreenShot3 from '../resources/CyaraToPureProject_ScreenShot3.png';

import { Button, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'cPP'
        };
        this.navigate = this.navigate.bind(this);
    }
    navigate(e) {
        this.setState({
            page: e.target.getAttribute('pageid')
        });
        /*
        if(e.target.id === 'button-cpp') {
            this.setState({
                page: cpp
            })
        } else if(e.target.id === 'button-jpp') {

        }*/
    }
    helpContent(page) {
        let content;
        if(page === 'cPP') {
            content =
            <div>
                <h3 className='FeatureTitle'>Cyara to PureProject</h3>
                <div className='HelpParagraph'>
                    This option will transform a file exported from Cyara and transforms it into a file that can be consumed by PureProject's import function.
                    <div className='HelpSteps'>
                        <ul>1. Select the test cases you need for export</ul>
                        <ul>2. Hit Action > Export</ul>
                        <ul><Image border='0' src={CyaraToPureProject_ScreenShot1} rounded/></ul>
                        <ul>3. Hit 'Ok' with the default settings. The resulting file will be named 'TestCases.xml'.</ul>
                        <ul><Image className='export-screenshot' border='1' src={CyaraToPureProject_ScreenShot2} rounded/></ul>
                        <ul>4. Navigate to the <Link to='/Transformer'>Transformer</Link> page and select the output 'TestCases.xml' file.</ul>
                        <ul><Image border='0' src={CyaraToPureProject_ScreenShot3} rounded/></ul>
                        <ul>The resulting output file will be ready to be imported into PureProject.</ul>
                    </div>
                </div>
            </div>
        } else if(page === 'jPP') {
            content = <div>Jira to PureProject TBD</div>
        }
        return(
            <div>
                <h1>Help Page</h1>
                <div className='PageContent HelpPage'>
                    <Col md={2}>
                        <div className='buffer-30' />
                        <div id='class-navigation'>
                            <ul><Button pageid='cPP' bsStyle='primary' onClick={this.navigate}>Cyara to PureProject</Button></ul>
                            <ul><Button pageid='jPP' bsStyle='primary' onClick={this.navigate}>Jira to PureProject</Button></ul>
                        </div>
                    </Col>
                    <Col md={10} className='HelpContent'>
                        {content}
                    </Col>
                    <div className='buffer' />
                </div>
            </div>
        )
    }
    render() {
        return (
            <div>
                {this.helpContent(this.state.page)}
            </div>
        );
    }
}
export default Help;

/*
            <div>
                <h1>Help Page</h1>
                <div className='PageContent HelpPage'>
                    <Col md={2}>
                        <div className='buffer' />
                        <div id='class-navigation'>
                            <ul><Button className='noHover' onClick={this.navigate} mouseover={this.mouseover}>Cyara to PureProject</Button></ul>
                            <ul><Button className='noHover' onClick={this.navigate} mouseover={this.mouseover}>Jira to PureProject</Button></ul>
                        </div>
                    </Col>
                    <Col md={10}>
                        <h3 className='FeatureTitle'>Cyara to PureProject</h3>
                        <div className='HelpParagraph'>
                            This option will transform a file exported from Cyara and transforms it into a file that can be consumed by PureProject's import function.
                            <div className='HelpSteps'>
                                <ul>1. Select the test cases you need for export</ul>
                                <ul>2. Hit Action > Export</ul>
                                <ul><Image border='0' src={CyaraToPureProject_ScreenShot1} rounded/></ul>
                                <ul>3. Hit 'Ok' with the default settings. The resulting file will be named 'TestCases.xml'.</ul>
                                <ul><Image className='export-screenshot' border='1' src={CyaraToPureProject_ScreenShot2} rounded/></ul>
                                <ul>4. Navigate to the <Link to='/Transformer'>Transformer</Link> page and select the output 'TestCases.xml' file.</ul>
                                <ul><Image border='0' src={CyaraToPureProject_ScreenShot3} rounded/></ul>
                                <ul>The resulting output file will be ready to be imported into PureProject.</ul>
                            </div>
                        </div>
                    </Col>
                    <div className='buffer' />
                </div>
            </div>
*/