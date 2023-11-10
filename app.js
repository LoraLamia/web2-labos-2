const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('styles.css'));

let vulnerable = false;

const { studentData, isSqlInjection } = require('./data');

app.get('/', (req, res) => {
    res.render('home', { vulnerable });
});

app.post('/submit', (req, res) => {
    const { jmbag, vulnerabilityCheckbox } = req.body;
    vulnerable = vulnerabilityCheckbox === 'on';

    if (vulnerable && isSqlInjection(jmbag)) {
        // Vraćanje svih podataka iz dictionary-a
        res.send(`SQL Injection detected. Data: ${JSON.stringify(studentData)}`);
    } else if (!vulnerable && isSqlInjection(jmbag)) {
        // Alert za detekciju napada
        res.send(`<script>alert("NAPAD DETEKTIRAN");</script>`);
    } else if (studentData[jmbag]) {
        // Povrat rezultata studenta
        res.send(`Rezultat za JMBAG ${jmbag}: ${studentData[jmbag]}`);
    } else if (jmbag) {
        // JMBAG ne postoji
        res.send("Sori, taj student nije pisao ispit");
    } else {
        // Nevaljani unos
        res.send("Ne znam");
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
