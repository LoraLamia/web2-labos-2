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
        "'or''='",      
        "'or'1'='1",    
        "1=1",          
        "'='",          
        "1<>2",         
        "'or'1=1",      
    ];

    return tautology.some(pattern => cleanInput.includes(pattern));
}


module.exports = { studentData, isSqlInjection };
