import '../Styles/Transformer.css'
import { errorMessage as alertErrorMessage } from '../config/errorMessage';
import { extraReplacements, tags } from '../config/config'

import React from 'react';
import XLSX from 'xlsx';
import { Button, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom';

import Papa from 'papaparse';

class TagRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thisID: props.thisID,
            checked: props.checked,
            name: props.name
        }
        this.handleCheck = this.handleCheck.bind(this);
    }
    handleCheck() {
        if(this.state.checked === 'checked') {
            this.setState({
                checked: ''
            });
        } else {
            this.setState({
                checked: 'checked'
            });
        }
    }
    render() {
        return(
            <div className='TagRow'>
                <Col md={2}>
                    <input type='checkbox' id={this.state.thisID} checked={this.state.checked} onChange={this.handleCheck}/>
                </Col>
                <Col md={10}>
                    {this.state.name}
                </Col>
            </div>
        );
    }
}

class Transformer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            output: '',
            errorMessage: '',
            cPPChecked: true,
            jPPChecked: false,
            cjChecked: false,
            radio: 'cPP'
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.pickRadio = this.pickRadio.bind(this);
        this.cycleParse = this.cycleParse.bind(this);

        this.fileInput = React.createRef();
    }
    cyaraParse(text) {
        var data = []
        data.push(this.generateSchedule('Open Hours'));
        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, 'text/xml');
            var TestCases = xmlDoc.getElementsByTagName('TestCase');
            var Blocks = xmlDoc.getElementsByTagName('Block')
            //console.log(TestCases)
            //console.log(Blocks)
            //var rows = xmlDoc.getElementsByTagName('Row');
            for(var i = 0; i < TestCases.length; i++) {
                var completedRow = [];
                completedRow.push('');
                completedRow.push(TestCases[i].children[0].innerHTML);
                completedRow.push(TestCases[i].children[3].innerHTML);

                var steps = '>>Dial into ' + TestCases[i].children[4].innerHTML;
                var stepNewline = '\n';

                var results = '';
                var resultNewLine = '';

                var replacementCount = 0;
                var replacements = [];
                // Looking for array positions
                var tree_definition = {};
                var nodes = [
                    'Scenario',
                    'DataInputs',
                    'Steps',
                    'CallSteps',
                    'Description',
                    'ExpectedText',
                    'ReplyText'
                ];
                var block_tree_definition = {};
                var blockNodes = [
                    'BlockName',
                    'FolderPath',
                    'Steps',
                    'CallSteps',
                    'ExpectedText',
                    'Description',
                    'ReplyText'
                ];
                //console.log(TestCases)

                // Under <TestCase> : Looking for 'DataInputs', 'Steps'
                for(var ss = 0; ss < TestCases[i].children.length; ss++) {
                    for(var tt = 0; tt < nodes.length; tt++) {
                        //console.log(TestCases[i].children[ss].nodeName)
                        if(TestCases[i].children[ss].nodeName === nodes[tt]) {
                            tree_definition[nodes[tt]] = ss;
                        }
                    }
                }
                // Under <TestCase> -> <DataInputs> : Looking for 'Scenario'
                for(var ss = 0; ss < TestCases[i].children[tree_definition['DataInputs']].children.length; ss++) {
                    for(var tt = 0; tt < nodes.length; tt++) {
                        //console.log(TestCases[i].children[ss].nodeName)
                        if(TestCases[i].children[tree_definition['DataInputs']].children[ss].nodeName === nodes[tt]) {
                            tree_definition[nodes[tt]] = ss;
                        }
                    }
                }
                // Under <TestCase> -> <Steps> : Looking for 'CallSteps'
                for(var ss = 0; ss < TestCases[i].children[tree_definition['Steps']].children.length; ss++) {
                    for(var tt = 0; tt < nodes.length; tt++) {
                        //console.log(TestCases[i].children[ss].nodeName)
                        if(TestCases[i].children[tree_definition['Steps']].children[ss].nodeName === nodes[tt]) {
                            tree_definition[nodes[tt]] = ss;
                        }
                    }
                }
                if(TestCases[i].children[tree_definition['DataInputs']].children.length > 0) {
                    for(var a = 0; a < TestCases[i].children[tree_definition['DataInputs']].children[tree_definition['Scenario']].children.length; a++) {
                        for(var b = 0; b < TestCases[i].children[tree_definition['DataInputs']].children[tree_definition['Scenario']].children[a].attributes.length; b++) {
                            if(TestCases[i].children[tree_definition['DataInputs']].children[tree_definition['Scenario']].children[a].attributes[b].nodeName === 'name') {
                                if(TestCases[i].children[tree_definition['DataInputs']].children[tree_definition['Scenario']].children[a].attributes[b].nodeValue === 'Empty') continue;
                                replacements.push([TestCases[i].children[tree_definition['DataInputs']].children[tree_definition['Scenario']].children[a].attributes[b].nodeValue, TestCases[i].children[tree_definition['DataInputs']].children[tree_definition['Scenario']].children[a].innerHTML]);
                            }
                        }
                    }
                }
                for(var j = 0; j < TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children.length; j++) {
                    if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['Steps']].innerHTML === '') {
                        // Under <TestCase> -> <Steps> -> <CallSteps> -> <Step> : Looking for 'Description', 'ExpectedText', 'ReplyText'
                        for(var ss = 0; ss < TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children.length; ss++) {
                            for(var tt = 0; tt < nodes.length; tt++) {
                                //console.log(TestCases[i].children[ss].nodeName)
                                if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[ss].nodeName === nodes[tt]) {
                                    tree_definition[nodes[tt]] = ss;
                                }
                            }
                        }
                        if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['Description']].innerHTML !== '') {
                            var m;
                            var contains = false;
                            for(m = 0; m < tags.length; m++) {
                                if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['Description']].innerHTML.includes('[' + tags[m][1] + ']')) {
                                    results += resultNewLine + '>>' + '[' + tags[m][1] + '] = ' + TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['ExpectedText']].innerHTML;
                                    resultNewLine = '\n';
                                    contains = true;
                                    break;
                                }
                            }
                            if(contains) continue;
                        }

                        if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['ExpectedText']].innerHTML !== '') {
                            if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['ExpectedText']].innerHTML === '{*}' && TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['Description']].innerHTML !== '') {
                                steps += stepNewline + '>>' + TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['Description']].innerHTML + ": [Replace]"
                                replacementCount++;
                            } else if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['ExpectedText']].innerHTML === '{*}') {
                                steps += stepNewline + '>>' + '[Replace]';
                                replacementCount++;
                            } else {
                                steps += stepNewline + '>>' + TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['ExpectedText']].innerHTML
                            }

                            stepNewline = '\n';
                        }
                        if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['ReplyText']].innerHTML !== '') {
                            steps += stepNewline + '>>' + TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['ReplyText']].innerHTML
                            stepNewline = '\n';
                        }
                    } else {
                        //console.log(Blocks)
                        for(var k = 0; k < Blocks.length; k++) {
                            // Under <Blocks> -> <Block>: Looking for 'BlockName', FolderPath', 'Steps'
                            for(var ss = 0; ss < Blocks[k].children.length; ss ++) {
                                for(var tt = 0; tt < blockNodes.length; tt++) {
                                    if(Blocks[k].children[ss].nodeName === blockNodes[tt]) {
                                        block_tree_definition[blockNodes[tt]] = ss;
                                    }
                                }
                            }
                            // Under <Blocks> -> <Block> -> <Steps>: Looking for 'CallSteps'
                            for(var ss = 0; ss < Blocks[k].children[block_tree_definition['Steps']].children.length; ss ++) {
                                for(var tt = 0; tt < blockNodes.length; tt++) {
                                    if(Blocks[k].children[block_tree_definition['Steps']].children[ss].nodeName === blockNodes[tt]) {
                                        block_tree_definition[blockNodes[tt]] = ss;
                                    }
                                }
                            }//
                            var pathName = Blocks[k].children[block_tree_definition['FolderPath']].innerHTML + '\\' + Blocks[k].children[block_tree_definition['BlockName']].innerHTML;
                            if(TestCases[i].children[tree_definition['Steps']].children[tree_definition['CallSteps']].children[j].children[tree_definition['Steps']].innerHTML === pathName) {
                                // Under <Blocks> -> <Block> -> <Steps>: Looking for 'CallSteps'
                                for(var ss = 0; ss < Blocks[k].children[block_tree_definition['Steps']].children.length; ss ++) {
                                    for(var tt = 0; tt < blockNodes.length; tt++) {
                                        if(Blocks[k].children[block_tree_definition['Steps']].children[ss].nodeName === blockNodes[tt]) {
                                            block_tree_definition[blockNodes[tt]] = ss;
                                        }
                                    }
                                }
                                for(var l = 0; l < Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children.length; l++) {
                                    // Under <Blocks> -> <Block> -> <Steps> -> <CallSteps>: Looking for 'Description', 'ExpectedText', 'ReplyText'
                                    for(var ss = 0; ss < Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children.length; ss ++) {
                                        for(var tt = 0; tt < blockNodes.length; tt++) {
                                            if(Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[ss].nodeName === blockNodes[tt]) {
                                                block_tree_definition[blockNodes[tt]] = ss;
                                            }
                                        }
                                    }                                    
                                    try {
                                        if(Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['ExpectedText']].innerHTML !== '') {
                                            var thisDescription = Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['Description']].innerHTML
                                            var containsTag = false;
                                            for(var ti = 0; ti < tags.length; ti++) {
                                                if('[' + tags[ti][1] + ']' === thisDescription) {
                                                    results += resultNewLine + '[' + tags[ti][1] + '] = ' + Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['ExpectedText']].innerHTML;
                                                    containsTag = true;
                                                }
                                            }
                                            if(containsTag) continue;
                                            if(Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['ExpectedText']].innerHTML === '{*}') {
                                                steps += stepNewline + '>>' + Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['Description']].innerHTML + ': [Replace]';
                                                replacementCount++;
                                            } else {
                                                steps += stepNewline + '>>' + Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['ExpectedText']].innerHTML;
                                            }
                                        }
                                        if(Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['ReplyText']].innerHTML !== '') {
                                            steps += stepNewline + '>>' + Blocks[k].children[block_tree_definition['Steps']].children[block_tree_definition['CallSteps']].children[l].children[block_tree_definition['ReplyText']].innerHTML;
                                        }
                                    } catch (e) {
                                        console.log('Block with no steps.');
                                    }
                                    stepNewline = '\n';
                                    resultNewLine = '\n';
                                }
                                break;
                            }
                        }
                    }
                }
                for(var y = 0; y < replacementCount; y++) {
                    steps = steps.replace('[Replace]', '"Unspecified verbiage, please check with design document for verbiage."');
                }
                for(var p = 0; p < replacements.length; p++) {
                    steps = steps.replace('[' + replacements[p][0] + ']', replacements[p][1]);
                }                
                for(var p = 0; p < extraReplacements.length; p++) {
                    var word = extraReplacements[p][0];
                    var regex = new RegExp(word, 'g');
                    steps = steps.replace(regex, extraReplacements[p][1]);
                }

                completedRow.push(steps);
                completedRow.push(results);
                //console.log(steps);
                data.push(completedRow);
            }
        } catch (e) {
            alert(e + alertErrorMessage);
            console.log(e);
        }
        try {
            var ws = XLSX.utils.aoa_to_sheet(data, { header:1, raw:true })
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "TestCases");
            
            // Generate Excel File 

            XLSX.writeFile(wb, "sheetjs.xlsx");
        } catch (e) {
            console.log('test')
            alert(e + alertErrorMessage);;
            console.log(e);
        }
    }
    jiraParse(text) {
        var data = []
        data.push(this.generateSchedule('Open Hours'));
        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, 'text/xml');
            var Items = xmlDoc.getElementsByTagName('item');
            //console.log(Items);
            for(var i = 0; i < Items.length; i++) {
                var completedRow = [];
                completedRow.push('');
                //completedRow.push(Items[i].children[0].innerHTML);
                completedRow.push(Items[i].children[6].innerHTML + ' (' + Items[i].children[5].innerHTML + ')');
                var Description = Items[i].children[3].innerHTML;
                Description = this.tagRemove(Description)
                completedRow.push(Description);
                var Steps;
                for(var l = 0; l < Items[i].children.length; l++) {
                    if(Items[i].children[l].nodeName === 'customfields') {
                        Steps = Items[i].children[l].children['customfield_13054'].children[1].children[0].children;
                        break;
                    }
                }
                var steps = '';
                var stepNewline = '';
                var results = '';
                var resultNewLine = '';
                var tempString;
                for(var j = 0; j < Steps.length; j++) {
                    var stepValue = Steps[j].children[1].innerHTML
                    var contains = false;
                    var tagValue = '';
                    var tagComparison = stepValue.substring(9, stepValue.length - 3);
                    for(var k = 0; k < tags.length; k++) {
                        if('[' + tags[k][1] + ']' === (tagComparison)) {
                            tagValue = tags[k];
                            contains = true;
                            break;
                        }
                    }
                    if(contains) {
                        //console.log(Steps[j].children[3].innerHTML)
                        results += resultNewLine + '>>' + tagComparison + ' = ' + Steps[j].children[3].innerHTML.substring(9, Steps[j].children[3].innerHTML.length - 3);
                        resultNewLine = '\n';
                    } else {
                        if(stepValue.substring(9, stepValue.length - 3) !== '' &&
                           stepValue.substring(9, stepValue.length - 3) !== ' ' &&
                           stepValue.substring(9, stepValue.length - 3) !== '  ') {
                            /*
                            if(stepValue.substring(9, stepValue.length - 3).substr(1,2) == 'VP') {
                                VP = stepValue.substring(9, stepValue.length - 3);
                            }*/
                            tempString = stepValue.substring(9, stepValue.length - 3);
                            steps += stepNewline + '>>' + stepValue.substring(9, stepValue.length - 3);
                            stepNewline = '\n';
                        }
                        if(Steps[j].children[3].innerHTML.substring(9, Steps[j].children[3].innerHTML.length - 3) !== '' &&
                           Steps[j].children[3].innerHTML.substring(9, Steps[j].children[3].innerHTML.length - 3) !== ' ' &&
                           Steps[j].children[3].innerHTML.substring(9, Steps[j].children[3].innerHTML.length - 3) !== '  ') {
                            tempString = Steps[j].children[3].innerHTML.substring(9, Steps[j].children[3].innerHTML.length - 3)
                            steps += stepNewline + '>>' + Steps[j].children[3].innerHTML.substring(9, Steps[j].children[3].innerHTML.length - 3);
                            stepNewline = '\n';
                        }
                    }
                }
                steps += '\n';
                results += stepNewline + '>>' + tempString;
                results += '\n';
                completedRow.push(steps);
                completedRow.push(results);
                //console.log(completedRow)

                data.push(completedRow);
            }
        } catch (e) {
            alert(e + alertErrorMessage);
            console.log(e);
        }
        try {
            console.log(data)
            var ws = XLSX.utils.aoa_to_sheet(data, { header:1, raw:true })
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "TestCases");
            
            // Generate Excel File
            XLSX.writeFile(wb, "sheetjs.xlsx");
        } catch (e) {
            alert(e + alertErrorMessage);;
            console.log(e);
        }
    }
    tagRemove(text) {
        var finalText;

        finalText = text.split('&lt;').join('<');
        finalText = finalText.split('&gt;').join('>');

        finalText = finalText.replace(/<\/?[^>]+(>|$)/g, "");

        /*
        if(finalText !== text) {
            this.tagRemoverHelper(finalText);
        }*/
        return finalText;
    }
    tagRemoverHelper(text) {
        var finalText = text;
        var i = finalText.indexOf('<');
        var j = finalText.indexOf('>') + 1;
        console.log(i + '|' + j)
        console.log(finalText.substr(j + finalText.length - 4))
        /*
        var finalText = text;
        var uu = 0;
        while(uu < 100000) {
            console.log('---------------------------')

            var compareText = finalText;
            var i = finalText.indexOf('<');
            var j = finalText.indexOf('>') + 1;
            var tag = finalText.substr(i, j);
            console.log(i + '|' +j)
            console.log(tag)
            //finalText = finalText.split(tag).join('');
            var location = finalText.indexOf(tag);
            console.log(location)
            var dummyText = finalText;
            console.log(dummyText.substr(0, location))
            console.log(dummyText.substr(location + tag.length, dummyText.length - 1))
            finalText = dummyText.substr(0, location) + dummyText.substr(location + tag.length, dummyText.length - 1);

            break;
            console.log(finalText)
            if(compareText === finalText) {
                break;
            }
            uu++;
        }
        console.log(finalText)
        return finalText;
        */
    }
    cycleParse(text) {
        var parsed = Papa.parse(text);
        var searchString = 'id in (';
        var comma = '';
        for(var i = 4; i < parsed.data.length - 1; i++) {
            searchString += comma + '"' + parsed.data[i][0] + '"';
            comma = ',';
        }
        searchString += ')';
        try {
            //console.log(searchString)
            this.setState({
                output: searchString
            })
        } catch (e) {
            alert(e + alertErrorMessage);;
            console.log(e)
        }
    }
    handleSubmit(event) {
        var xml = ['jPP', 'cPP'];
        var csv = ['cj'];

        event.preventDefault();
        if(this.fileInput.current.files.length == 0) {
            this.setState({
                errorMessage: 'No file chosen'
            })
        } else if(xml.includes(this.state.radio) && this.fileInput.current.files[0].name.substr(this.fileInput.current.files[0].name.length - 4) !== '.xml') {
            this.setState({
                errorMessage: 'Not an .XML file'
            })
        } else if(csv.includes(this.state.radio) && this.fileInput.current.files[0].name.substr(this.fileInput.current.files[0].name.length - 4) !== '.csv') {
            this.setState({
                errorMessage: 'Not an .CSV file'
            })
        } else {
            this.setState({
                errorMessage: ''
            })
            this.handleFileChosen(this.fileInput.current.files[0]);
        }
    }
    generateSchedule(name) {
        return ['Schedule:' + name,'','','','',''];
    }
    handleFileChosen = (file) => {
        try {
            var fileReader = new FileReader();
            fileReader.onloadend = () => {
                if(this.state.radio === 'cPP') {
                    this.cyaraParse(fileReader.result);
                } else if(this.state.radio === 'jPP') {
                    this.jiraParse(fileReader.result);
                } else if(this.state.radio === 'cj') {
                    this.cycleParse(fileReader.result);
                } else {
                }
            };
            fileReader.readAsText(file);
        } catch (e) {
            alert(e + alertErrorMessage);;
            console.log(e);
        }
    }
    getTags() {
        var tagList = [];
        for(var i = 0; i < tags.length; i++) {
            tagList.push(
                <TagRow thisID={tags[i][0]} name={tags[i][1]} checked={tags[i][2]} key={tags[i][3]}/>
            )
        }
        return tagList;
    }
    pickRadio(event) {
        if(event.target.id === 'jPP') {
            this.setState({
                jPPChecked: true,
                cPPChecked: false,
                cjChecked: false,
                radio: 'jPP'
            });
        } else if(event.target.id === 'cPP') {
            this.setState({
                jPPChecked: false,
                cPPChecked: true,
                cjChecked: false,
                radio: 'cPP'
            });
        } else if(event.target.id === 'cj') {
            this.setState({
                jPPChecked: false,
                cPPChecked: false,
                cjChecked: true,
                radio: 'cj'
            });
        } else {
            console.log("Radio button Error.");
        }
    }
    render() {
        return (
            <div className=''>
                <div>
                    <h1>PureProject Formatter</h1>
                    <Link to='/Help'>Help</Link>
                </div>
                <div className='PageContent'>
                    <div className='ContentPane'>
                        <Col md={6} className='max-height'>
                            <div className='PaneColumn'>
                                <h5>XML File</h5>
                                <div id='FilePicker'>
                                    <input type='file' ref={this.fileInput}/>
                                </div>
                            </div>
                            <div>
                                Output
                            </div>
                            <div id='outputs'>
                                <textarea value={this.state.output} />
                            </div>
                        </Col>
                        <Col md={6} className='max-height'>
                            <div className='PaneColumn'>
                                <div className='HeaderContainer'>
                                    <h5>Parameters</h5>
                                </div>
                                <div id='Transformer'>
                                    <div id='TagPanel'>
                                        {/* this.getTags() */}
                                        <div className='RadioRow'>
                                            <Col md={2}>
                                                <input type='radio' checked={this.state.cPPChecked} id='cPP' onChange={this.pickRadio}/>
                                            </Col>
                                            <Col md={10}>
                                                Cyara to PureProject
                                            </Col>
                                        </div>
                                        <div className='RadioRow'>
                                            <Col md={2}>
                                                <input type='radio' checked={this.state.jPPChecked} id='jPP' onChange={this.pickRadio}/>
                                            </Col>
                                            <Col md={10}>
                                                Jira to PureProject
                                            </Col>
                                        </div>
                                        <div className='RadioRow'>
                                            <Col md={2}>
                                                <input type='radio' checked={this.state.cjChecked} id='cj' onChange={this.pickRadio}/>
                                            </Col>
                                            <Col md={10}>
                                                Cycle to Jira
                                            </Col>
                                        </div>
                                        <div id='ButtonPane'>
                                            <Button id='SubmitButton' type='submit' onClick={this.handleSubmit}>Transform</Button>
                                        </div>
                                        <div id='errorMessage'>
                                            { this.state.errorMessage }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </div>
                </div>
            </div>
        )
    }
}
export default Transformer;