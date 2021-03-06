import '../Styles/Help.css';
import React, { Component } from 'react';

import CyaraToPureProject_ScreenShot1 from '../resources/CyaraToPureProject_ScreenShot1.png';
import CyaraToPureProject_ScreenShot2 from '../resources/CyaraToPureProject_ScreenShot2.png';
import CyaraToPureProject_ScreenShot3 from '../resources/CyaraToPureProject_ScreenShot3.png';
import JiraToPureProject_ScreenShot1 from '../resources/JiraToPureProject_ScreenShot1.png';
import JiraToPureProject_ScreenShot2 from '../resources/JiraToPureProject_ScreenShot2.png';
import JiraToPureProject_ScreenShot3 from '../resources/JiraToPureProject_ScreenShot3.png';
import CycleToJira_ScreenShot1 from '../resources/CycleToJira_ScreenShot1.png';
import CycleToJira_ScreenShot2 from '../resources/CycleToJira_ScreenShot2.png';
import CycleToJira_ScreenShot3 from '../resources/CycleToJira_ScreenShot3.png';
import PP_ScreenShot1 from '../resources/PP_ScreenShot1.png';
import PP_ScreenShot2 from '../resources/PP_ScreenShot2.png';
import PP_ScreenShot3 from '../resources/PP_ScreenShot3.png';
import PP_ScreenShot4 from '../resources/PP_ScreenShot4.png';
import PP_ScreenShot5 from '../resources/PP_ScreenShot5.png';
import PP_ScreenShot6 from '../resources/PP_ScreenShot6.png';
import cat from '../resources/confusedcat.png';

import { Button, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'cPP'
        };
        this.navigate = this.navigate.bind(this);
        this.redirect = this.redirect.bind(this);
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
    redirect(e) {
        e.preventDefault();
        this.setState({
            page: e.target.getAttribute('pageid')
        });
        window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
    }
    helpContent(page) {
        let content;
        if(page === 'cPP') {
            content =
            <div>
                <h3 className='FeatureTitle'>Cyara to PureProject</h3>
                <div className='HelpParagraph'>
                    This option will take a file exported from Cyara and transforms it into a file that can be consumed by PureProject's import function. <br />
                    <div className='HelpSteps'>
                        <ul>1. Select the test cases you need for export</ul>
                        <ul>2. Hit [Action > Export]</ul>
                        <ul><Image border='0' src={CyaraToPureProject_ScreenShot1} rounded/></ul>
                        <ul>3. Hit 'Ok' with the default settings. This will output an XML file ('TestCases.xml').</ul>
                        <ul><Image className='export-screenshot' border='1' src={CyaraToPureProject_ScreenShot2} rounded/></ul>
                        <ul>4. Navigate to the <Link to='/Transformer'>Transformer</Link> page and select the 'TestCases.xml' file as an input. Make sure the 'Cyara to PureProject' radio button is selected. Hit 'Transform'.</ul>
                        <ul><Image border='0' src={CyaraToPureProject_ScreenShot3} rounded/></ul>
                        <ul>The resulting output file will be ready to be imported into PureProject.</ul>
                        <br /><br />
                        <ul>To import the resulting file, please refer to this <Link pageid='pp' to='/' onClick={this.redirect}>help page</Link>.</ul>
                    </div>
                    <div className='buffer' />
                </div>
            </div>
        } else if(page === 'jPP') {
            content = 
            <div>
                <h3 className='FeatureTitle'>Jira to PureProject</h3>
                <div className='HelpParagraph'>
                    !!! 5/21/2019 There's currently a large bug with this function. May or may not work as intended. <br /><br />
                    This option will transform a file exported from Jira and transforms it into a file can be consued by PureProject's import function. <br />
                    *This function is only intended to be used with an export file from a search result page in Jira.
                    <div className='HelpSteps'>
                        <ul>1. Make a search within the Jira's search function</ul>
                        <ul><Image border='0' src={JiraToPureProject_ScreenShot1} rounded/></ul>
                        <ul>2. On the top right, hit right click and 'Save link as...' on [Export > XML] from the top right of the search page. This will output an XML file ('SearchRequest.xml').</ul>
                        <ul><Image border='0' src={JiraToPureProject_ScreenShot2} rounded/></ul>
                        <ul>3. Navigate to the <Link to='/Transformer'>Transformer</Link> page and select the 'SearchRequest.xml' file as in input. Make sure the 'Jira to PureProject' radio button is selected. Hit 'Transform'.</ul>
                        <ul><Image border='0' src={JiraToPureProject_ScreenShot3} rounded/></ul>
                        <ul>The resulting output file will be ready to be imported into PureProject.</ul>
                        <br /><br />
                        <ul>To import the resulting file, please refer to this <Link pageid='pp' to='/' onClick={this.redirect}>help page</Link>.</ul>
                    </div>
                    <div className='buffer' />
                </div>
            </div>
        } else if(page === 'cj') {
            content =
            <div>
                <h3 className='FeatureTitle'>Cycle to Jira</h3>
                <div className='HelpParagraph'>
                    This option will transform a file exported from a cycle in Jira and transforms it into a Jira search string. This Jira search string can then be used in a Jira search in which its output can be used for the 'Jira to PureProject' option.<br />
                    *The output will be in the 'Output' box and instead of a file.
                    <div className='HelpSteps'>
                        <ul>1. Navigate to the 'Test Cycles' location within Jira. Right click on you cycle and hit 'Export Cycle'. This will output a Cycle-xxx.CSV file.</ul>
                        <ul><Image border='0' src={CycleToJira_ScreenShot1} rounded/></ul>
                        <ul>2. Navigate to the <Link to='/Transformer'>Transformer</Link> page and select the 'Cycle-xxx.xml' file as in input. Make sure the 'Cycle to Jira' radio button is selected. Hit 'Transform'.</ul>
                        <ul><Image border='0' src={CycleToJira_ScreenShot2} rounded/></ul>
                        <ul>The resulting search string will be in the 'Output' box.</ul>
                    </div>
                    <div className='HelpSteps'>
                        <h4>Using the search string</h4>
                        <ul>To use the search string, navigate to the search page in Jira. Hit 'Advanced' copy-and-paste the search string into the field and hit search.</ul>
                        <ul><Image border='0' src={CycleToJira_ScreenShot3} rounded/></ul>
                        <ul>Use this search result for a <Link pageid='jPP' to='/' onClick={this.redirect}>Jira to PureProject</Link> function.</ul>
                    </div>
                    <div className='buffer' />
                </div>
            </div>
        } else if(page === 'pp') {
            content = 
            <div>
                <h3 className='FeatureTitle'>PureProject Import Instructions</h3>
                <div className='HelpParagraph'>
                    Both the 'Jira to PureProject' and 'Cyara to PureProject' options will output a file. This page will instruct you to import the file onto PureProject.
                    <div className='HelpSteps'>
                        <ul>1. Navigate to one of your projects and go to the Quality Tab.</ul>
                        <ul><Image border='0' src={PP_ScreenShot1} rounded/></ul>
                        <ul>2. Create a new test cycle (Skip this step if importing to existing cycle).</ul>
                        <ul><Image border='0' src={PP_ScreenShot2} rounded/></ul>
                        <ul>3. Hit update on your new created test cycle.</ul>
                        <ul><Image border='0' src={PP_ScreenShot3} rounded/></ul>
                        <ul>4. Hit Import Test Cases -> Choose File. Choose your file downloaded from 'Jira to PureProject' and 'Cyara to PureProject' then hit Import.</ul>
                        <ul><Image border='0' src={PP_ScreenShot4} rounded/></ul>
                        <ul>5. Your test case should now be imported. Select a 'Mapped Scenario' for all your test cases then hit 'Confirm Selection'.</ul>
                        <ul><Image border='0' src={PP_ScreenShot5} rounded/></ul>
                        <ul>6. PureProject will now have your test cases in the system.</ul>
                        <ul><Image border='0' src={PP_ScreenShot6} rounded/></ul>
                    </div>
                </div>
            </div>
        } else {
            content = 
            <div>
                <h3>
                    You're not supposed to be able to reach this page. Congratulations, you confused the cat. Please contact patrick.lin@genesys.com.
                    <br /><br />
                    <ul id='confused_cat'><Image border='0' src={cat} rounded/></ul>
                </h3>
            </div>
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
                            <ul><Button pageid='cj' bsStyle='primary' onClick={this.navigate}>Cycle to Jira</Button></ul>
                            <ul><Button pageid='pp' bsStyle='primary' onClick={this.navigate}>PureProject Import</Button></ul>
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