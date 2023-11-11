const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

function isSqlInjection(input) {
    const cleanInput = input.replace(/\s+/g, '').toLowerCase();
    const tautology = [
        "'or''='",             
        "'or'1'='1",           
        "1=1",                 
        "'='",                 
        "1<>2",                // nije tautologija, ali često se koristi
        "'or'1=1",             
        "'or''='or'",          
        "x=x",                 
        "'x'='x'",             
        "a=a",                 
        "'a'='a'",             
        "'or'x='x'",           
        "'or'a='a'",           
        "''=''",               
        "true=true",           
        "false=false",         
        "'or'true",            
        "'or'true='true'",     
        "'or'false='false'",      
    ];

    return tautology.some(pattern => cleanInput.includes(pattern));
}

const studentData = {
    "12345678": 56,
    "12345679": 43,
    "12345676": 80,
    "12345675": 40,
    "12345674": 12,
    "12345673": 92
}

let vulnerable = false;

app.get('/', (req, res) => {
    res.render('home', { vulnerable });
});

app.post('/submit', (req, res) => {
    const { jmbag, vulnerabilityCheckbox } = req.body;
    vulnerable = vulnerabilityCheckbox === 'on';

    if (vulnerable && isSqlInjection(jmbag)) {
        res.render('results', {studentData: studentData })
    } else if (!vulnerable && isSqlInjection(jmbag)) {
        res.send(`<script>alert("NAPAD DETEKTIRAN I SPRIJEČEN!");</script>`);
    } else if (studentData[jmbag]) {
        res.render('results', {studentData: {[jmbag]: studentData[jmbag]}})
        // res.send(`Rezultat za JMBAG ${jmbag}: ${studentData[jmbag]}`);
    } else if (jmbag) {
        res.send("Sori, taj student nije pisao ispit");
    } else {
        res.send("Krivi unos");
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
