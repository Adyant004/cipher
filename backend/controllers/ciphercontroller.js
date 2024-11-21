const { gcd, decryptAffine } = require('../utils/affineCipher');
const { generateKeyMapping, decryptSubstitution } = require('../utils/subsCipher');
const { kasiskiExaminationWithFallback, decryptVigenere,findKey} = require('../utils/vigKasiskiCipher');
const { decryptVigenereIC, estimateKeyLengthByIC, findKeyIC } = require('../utils/vigIOC');

const decryptCaeser = (req,res) => {
    const { ciphertext } = req.body;

    let possibleTexts = [];
    for(let key=1; key<=26; key++){
        let tmpText = "";
        for(let c of ciphertext){
            let t = c.charCodeAt(0) - 'A'.charCodeAt(0) - key;
            if(t < 0){
                t += 26;
            }
            tmpText += String.fromCharCode(t + 'A'.charCodeAt(0));
        }
        possibleTexts.push(tmpText);
    }

    res.status(200).json(possibleTexts);
}

const FreqAffineCipher = (req,res) =>{
    const { ciphertext } = req.body;

    const freqEnglish = {
        'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7, 'S': 6.3,
        'H': 6.1, 'R': 6.0, 'D': 4.3, 'L': 4.0, 'C': 2.8, 'U': 2.8, 'M': 2.4,
        'W': 2.4, 'F': 2.2, 'G': 2.0, 'Y': 2.0, 'P': 1.9, 'B': 1.5, 'V': 1.0,
        'K': 0.8, 'J': 0.2, 'X': 0.2, 'Q': 0.1, 'Z': 0.1
    };

    let bestScore = Infinity;
    let bestDecryption = '';

    for (let a = 1; a < 26; a++) {
        if (gcd(a, 26) !== 1) continue; 

        for (let b = 0; b < 26; b++) {
            const decryptedText = decryptAffine(ciphertext, a, b);
            if (!decryptedText) continue;

            let frequency = {};
            for (const char of decryptedText) {
                if (char.match(/[A-Z]/)) {
                    frequency[char] = (frequency[char] || 0) + 1;
                }
            }

            const totalChars = decryptedText.length;
            let score = 0;

            for (const char in freqEnglish) {
                const observedFreq = (frequency[char] || 0) / totalChars * 100;
                score += Math.abs(observedFreq - freqEnglish[char]);
            }

            if (score < bestScore) {
                bestScore = score;
                bestDecryption = decryptedText;
            }
        }
    }

    console.log(bestDecryption);

    res.status(200).json(bestDecryption);
}

const freqSubstitutionCipher = (req,res) => {
    const {ciphertext} = req.body;
    const keyMapping = generateKeyMapping(ciphertext);
    const decryption = decryptSubstitution(ciphertext, keyMapping);

    res.status(200).json(decryption);
}

const vigenereDecryptWithKasiski = (req,res) => {
    let { ciphertext } = req.body;

    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');

    const estimatedKeyLength = kasiskiExaminationWithFallback(ciphertext);

    const deducedKey = findKey(ciphertext, estimatedKeyLength);

    if (!deducedKey) {
        console.log("No key could be deduced.");
        return { key: "", plaintext: ciphertext };
    }

    const plaintext = decryptVigenere(ciphertext, deducedKey);

    res.status(200).json({ key: deducedKey, plaintext: plaintext });
}

const vigenereDecryptWithIC = (req,res) => {
    let { ciphertext } = req.body;
    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');

    const estimatedKeyLength = estimateKeyLengthByIC(ciphertext);

    const deducedKey = findKeyIC(ciphertext, estimatedKeyLength);

    if (!deducedKey) {
        console.log("No key could be deduced.");
        return { key: "", plaintext: ciphertext };
    }

    const plaintext = decryptVigenereIC(ciphertext, deducedKey);

   res.status(200).json({ key: deducedKey, plaintext: plaintext });
}

module.exports = {
    decryptCaeser,
    FreqAffineCipher,
    freqSubstitutionCipher,
    vigenereDecryptWithKasiski,
    vigenereDecryptWithIC
}