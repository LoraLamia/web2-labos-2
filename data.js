const studentData = {
    "12345678": 56,
    "12345679": 43,
    "12345676": 80,
    "12345675": 40,
    "12345674": 12,
    "12345673": 92
}

function isSqlInjection(input) {
    const cleanInput = input.replace(/\s+/g, '').toLowerCase();
    const tautology = [
        "'or''='",             // ' OR ''='
        "'or'1'='1",           // ' OR '1'='1'
        "1=1",                 // 1=1
        "'='",                 // '='
        "1<>2",                // 1<>2 (nije tautologija, ali često se koristi)
        "'or'1=1",             // ' OR 1=1
        "'or''='or'",          // ' OR ''=' OR '
        "x=x",                 // x=x
        "'x'='x'",             // 'x'='x'
        "a=a",                 // a=a
        "'a'='a'",             // 'a'='a'
        "'or'x='x'",           // ' OR x='x'
        "'or'a='a'",           // ' OR a='a'
        "''=''",               // ''=''
        "true=true",           // true=true
        "false=false",         // false=false
        "'or'true",            // ' OR true
        "'or'true='true'",     // ' OR true='true'
        "'or'false='false'",      
    ];

    return tautology.some(pattern => cleanInput.includes(pattern));
}


module.exports = { studentData, isSqlInjection };
