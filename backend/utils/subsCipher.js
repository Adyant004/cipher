function getLetterFrequency(text) {
    const frequency = {};
    const totalLetters = text.replace(/[^A-Z]/g, "").length;
    
    for (let char of text) {
        if (char.match(/[A-Z]/)) {
            frequency[char] = (frequency[char] || 0) + 1;
        }
    }

    for (let char in frequency) {
        frequency[char] = (frequency[char] / totalLetters) * 100;
    }
    return frequency;
}

function decryptSubstitution(ciphertext, keyMapping) {
    return ciphertext.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            return keyMapping[char] || char;
        }
        return char; 
    }).join('');
}

function generateKeyMapping(ciphertext) {
    const englishFreqOrder = "ETAOINSHRDLCUMWFGYPBVKJXQZ";

    const cipherFreq = getLetterFrequency(ciphertext);

    const sortedCipherLetters = Object.keys(cipherFreq).sort((a, b) => cipherFreq[b] - cipherFreq[a]);

    const keyMapping = {};
    sortedCipherLetters.forEach((char, index) => {
        keyMapping[char] = englishFreqOrder[index];
    });

    return keyMapping;
}

module.exports = {
    decryptSubstitution,
    generateKeyMapping
}