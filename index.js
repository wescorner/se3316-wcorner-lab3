const jsonTimetable = require('C:/Users/Wesley/Documents/GitHub/se3316-lab3-wcorner/Lab3-timetable-data.json');
const express = require('express');
const app = express();
const port = 3000;

let alltimetables = JSON.parse(JSON.stringify(jsonTimetable));



//root
app.get('/', (req, res) => {
    res.send('Hello World');
});

//for listing all timetable data
app.get('/api/courses', (req, res) => {
    console.log(`GET request for ${req.url}`);
    res.send(alltimetables);
});

//for retrieving all subject codes without duplication
app.get('/api/subjectcodes', (req, res) => {

    var subjects = [];

    alltimetables.forEach(addSubject);

    function addSubject(item){
        if(subjects.includes(item.subject)){      
        }
        else{
            subjects.push(item.subject)
        }
    }
    console.log(`GET request for ${req.url}`);
    res.send(subjects);
});

//for retrieving all descriptions without duplication
app.get('/api/descriptions', (req, res) => {

    var descriptions = [];

    alltimetables.forEach(addDescription);

    function addDescription(item){
        if(descriptions.includes(item.className)){       
        }
        else{
        descriptions.push(item.className)
        }
    }
    console.log(`GET request for ${req.url}`);
    res.send(descriptions);
});

//for retrieving all course codes for a given subject code
app.get('/api/coursecodes/:subjectcode_id', (req, res) => {
    const id = req.params.subjectcode_id;
    console.log(`GET request for ${req.url}`);

    var coursecodes = [];

    alltimetables.forEach(addCourseCode);

    function addCourseCode(item){
        if(id == item.subject){
            coursecodes.push(item.catalog_nbr);
        }
    }

    if(coursecodes.length == 0){
        res.status(404).send(`Error- subject code ${id} was not found!`);
    }
    else{
        res.send(coursecodes);
    }
    
});

//for retrieving a timetable with a given subject and course code
app.get('/api/courses/:subjectcode_id/:coursecode_id', (req, res) => {
    const subjectid = req.params.subjectcode_id;
    const courseid = req.params.coursecode_id;
    console.log(`GET request for ${req.url}`);

    var timetable = [];

    alltimetables.forEach(addTimetable);

    function addTimetable(item){
        if (subjectid == item.subject && courseid == item.catalog_nbr){
            timetable.push(item);
        }
    }

    let x = 0;
    let y = 0;

    //if no timetables were added 
    if(timetable.length == 0){
        for(let i = 0; i < alltimetables.length; i++){
            if(alltimetables[i].subject == subjectid){
                x++;
            }
            if(alltimetables[i].catalog_nbr == courseid){
                y++;
            }
        }
        if(x == 0 && y > 0){
            res.status(500).send(`Error- ${subjectid} was not found!`);
        }
        else if(x > 0 && y == 0) {
            res.status(500).send(`Error- ${courseid} was not found!`)
        }
        else{
            res.status(500).send(`Error- ${subjectid} and ${courseid} were not found!`)
        }
    }
    else{
        res.send(timetable);
    }
   
});

//opening port
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});