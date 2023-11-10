const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let vulnerable = false;

const { studentData, isSqlInjection } = require('./data');

app.get('/', (req, res) => {
    res.render('home', { vulnerable });
});

app.post('/submit', (req, res) => {
    const { jmbag, vulnerabilityCheckbox } = req.body;
    vulnerable = vulnerabilityCheckbox === 'on';

    if (vulnerable && isSqlInjection(jmbag)) {
        res.send(`SQL Injection detected. Data: ${JSON.stringify(studentData)}`);
    } else if (!vulnerable && isSqlInjection(jmbag)) {
        res.send(`<script>alert("NAPAD DETEKTIRAN");</script>`);
    } else if (studentData[jmbag]) {
        res.send(`Rezultat za JMBAG ${jmbag}: ${studentData[jmbag]}`);
    } else if (jmbag) {
        res.send("Sori, taj student nije pisao ispit");
    } else {
        res.send("Krivi unos");
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
