        /*
        if(false) {
        // Build Excel Cage
        var data = []
        var header = ['Test ID','Objective','Data','Steps','Expected Results','Actual Results','Comments']
        var generateSchedule = (name) => {
            return ['Schedule:' + name,'','','','',''];
        }

        // Build data
        data.push(generateSchedule('Open Hours'));

        var parseAndFormat = (text, tag) => {
            var thisDoc = parser.parseFromString(text, 'text/xml');
            var finalTag = thisDoc.getElementsByTagName(tag)[0].outerHTML;
            return (finalTag.replace('↵', '\n')).trim();
        }

        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, 'text/xml');
            var rows = xmlDoc.getElementsByTagName('Row');
            var nextSame = false;
            var step = '';
            var stepNewLine = '';
            var results = '';
            var resultsNewLIne = '';
            var completedRow = [];
            for(var i = 1; i < rows.length; i++) {
                var cellRows = rows[i].children;
                var contains = false;

                if(!nextSame) {
                    console.log('reache')
                    completedRow.push('');
                    completedRow.push(cellRows[0].children[0].innerHTML);
                    completedRow.push(cellRows[2].children[0].innerHTML);
                    nextSame = true;
                }
                for(var k = 0; k < tags.length; k++) {
                    if(cellRows[12].children[0].innerHTML.includes('[' + tags[k][1] + ']')) {
                        results += resultsNewLIne + '>>' + '[' + tags[k][1] + '] = ' + cellRows[13].children[0].innerHTML
                        resultsNewLIne = '\n';
                        contains = true;
                        break;
                    } 
                }
                if(!contains) {
                    if(!(cellRows[13].children[0].innerHTML === '')) {
                        step += stepNewLine + '>>' + cellRows[13].children[0].innerHTML;
                        stepNewLine = "\n";
                    }
                    if(!(cellRows[15].children[0].innerHTML === '')) {
                        step += stepNewLine + '>>' + cellRows[15].children[0].innerHTML;
                    }
                }
                if(i + 1 == rows.length) {
                    completedRow.push(step);
                    completedRow.push(results);
                    completedRow.push('');
                    data.push(completedRow);
                    break;
                }
                if(rows[i+1].children[0].children[0].innerHTML != cellRows[0].children[0].innerHTML) {
                    nextSame = false;
                    completedRow.push(step);
                    completedRow.push(results);
                    completedRow.push('');
                    step = '';
                    stepNewLine = '';
                    results = '';
                    resultsNewLIne = '';
                    data.push(completedRow);
                    completedRow = [];
                }
            }
            console.log(data)
        } catch (e) {
            console.log ('Parser: ' + e);
        }
    }*/