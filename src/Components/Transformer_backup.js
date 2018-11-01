import React from 'react';

class Transformer extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    cyaraParse(text) {
        var parseAndFormat = (tag) => {
            var finalTag = xmlDoc.getElementsByTagName(tag)[0].outerHTML;
            //console.log((finalTag.replace('↵', '')).trim())
            return (finalTag.replace('↵', '')).trim();
        }
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text, 'text/xml');

        // Retain headers
        var DocumentProperties = parseAndFormat('DocumentProperties');
        var OfficeDocumentSettings = parseAndFormat('OfficeDocumentSettings');
        var ExcelWorkbook = parseAndFormat('ExcelWorkbook');
        var Styles = parseAndFormat('Styles');

        // Actual table
            var usefulColumns = [0,12,13,15];

            // Column info
            var newColumns = [];
            var columns = xmlDoc.getElementsByTagName('Column');
            for(var i = 0; i < usefulColumns.length; i++) {
                newColumns.push(columns[usefulColumns[i]]);
            }

            // Cells
            var rows = xmlDoc.getElementsByTagName('Row');
            var newRows = [];
            for(var i = 0; i < rows.length; i++) {
                var cells = rows[i].children
                var useRows = [];
                for(var j = 0; j < usefulColumns.length; j++) {
                    useRows.push(cells[usefulColumns[j]].children[0].outerHTML);
                }
                newRows.push(useRows);
            }
            
            // Putting column and rows together with table
            var table = xmlDoc.getElementsByTagName('Table');
            table[0].innerHTML = '';


            for(var i = 0; i < newColumns.length; i++) {
                table[0].innerHTML += "\n" + newColumns[i].outerHTML;
            }

            var finalRows = '';
            for(var i = 0; i < newRows.length; i++) {
                var rowOpenTag = '<Row ss:AutoFitHeight="0" ss:Height="13.5">';
                var rowEndTag = '</Row>';

                var newRow = '';
                for(var j = 0; j < newRows[i].length; j++) {
                    var cellOpenTag = '<Cell ss:StyleID="hr_left">';
                    var cellEndTag = '</Cell>';
                    var newInnerHTML = cellOpenTag + "\n" + newRows[i][j] + "\n" + cellEndTag;
                    newRow += newInnerHTML;
                 }
                 finalRows += rowOpenTag + "\n" + newRow + "\n" + rowEndTag;
                }
            table[0].innerHTML += finalRows;
            //console.log(table[0]);

        // Putting everything together
        var Workbook = xmlDoc.getElementsByTagName('Workbook');
        var Worksheet = '<Worksheet ss:Name="TestCases">\n' + table[0].outerHTML + '</Worksheet>\n';
        var WorksheetOptions = '<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">\n<PageSetup>\n<Layout x:Orientation="Landscape" />\n</PageSetup>\n<Zoom>90</Zoom>\n<Selected />\n<FreezePanes />\n<SplitHorizontal>1</SplitHorizontal>\n<TopRowBottomPane>1</TopRowBottomPane>\n<ActivePane>2</ActivePane>\n<ProtectObjects>False</ProtectObjects>\n<ProtectScenarios>False</ProtectScenarios>\n</WorksheetOptions>';
        Workbook[0].innerHTML = DocumentProperties + OfficeDocumentSettings + ExcelWorkbook + Styles + "\n" + Worksheet + WorksheetOptions;

        var finalXML = Workbook[0].outerHTML.replace('↵', '');
        finalXML = '<?xml version="1.0" encoding="utf-8"?>\n' + '<?mso-application progid="Excel.Sheet"?>\n' + finalXML;
        console.log(finalXML);
    }

    handleSubmit(event) {
        event.preventDefault();
        //console.log(this.fileInput.current.files[0]);
        this.handleFileChosen(this.fileInput.current.files[0]);
    }

    handleFileChosen = (file) => {
        var fileReader = new FileReader();
        fileReader.onloadend = () => {
            this.cyaraParse(fileReader.result);
        };
        fileReader.readAsText(file);
    }
    render() {
        return (
            <div>
                <div>
                    <h1>Cyara to PureProject</h1>
                    <h3>File</h3> 
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input type='file' ref={this.fileInput}/>
                    </div>
                    <div>
                        <button type='submit'>Transform</button>
                    </div>
                </form>
            </div>
        )
    }
}
export default Transformer;