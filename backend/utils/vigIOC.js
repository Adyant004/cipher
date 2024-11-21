function calculateIC(subtext) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const frequency = Array(26).fill(0);
    let n = subtext.length;

    for (let char of subtext) {
        const index = alphabet.indexOf(char);
        if (index !== -1) {
            frequency[index]++;
        }
    }

    let ic = 0;
    for (let freq of frequency) {
        ic += (freq * (freq - 1));
    }
    ic /= (n * (n - 1));
    return ic;
}

function estimateKeyLengthByIC(ciphertext) {
    const typicalIC = 0.068; 
    const maxKeyLength = Math.min(10, ciphertext.length);
    let bestLength = 1;
    let closestICDifference = Infinity;

    for (let length = 1; length <= maxKeyLength; length++) {
        let averageIC = 0;
        for (let i = 0; i < length; i++) {
            let subtext = "";
            for (let j = i; j < ciphertext.length; j += length) {
                subtext += ciphertext[j];
            }
            averageIC += calculateIC(subtext);
        }
        averageIC /= length;

        let icDifference = Math.abs(averageIC - typicalIC);
        if (icDifference < closestICDifference) {
            closestICDifference = icDifference;
            bestLength = length;
        }
    }
    return bestLength;
}

function findKeyIC(ciphertext, keyLength) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let key = "";

    for (let i = 0; i < keyLength; i++) {
        let frequency = Array(26).fill(0);
        for (let j = i; j < ciphertext.length; j += keyLength) {
            const char = ciphertext[j];
            const index = alphabet.indexOf(char);
            if (index !== -1) {
                frequency[index]++;
            }
        }

        let maxMatch = 0;
        let bestShift = 0;
        for (let shift = 0; shift < 26; shift++) {
            let match = 0;
            for (let k = 0; k < 26; k++) {
                match += frequency[k] * englishFrequencies[(k + shift) % 26];
            }
            if (match > maxMatch) {
                maxMatch = match;
                bestShift = shift;
            }
        }
        key += alphabet[bestShift];
    }
    return key;
}

const englishFrequencies = [
    0.082, 0.015, 0.028, 0.043, 0.127, 0.022, 0.020, 0.061,
    0.070, 0.002, 0.008, 0.040, 0.024, 0.067, 0.075, 0.019,
    0.001, 0.060, 0.063, 0.091, 0.028, 0.010, 0.023, 0.001,
    0.020, 0.001
];

function decryptVigenereIC(ciphertext, key) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let plaintext = "";

    for (let i = 0; i < ciphertext.length; i++) {
        const charIndex = alphabet.indexOf(ciphertext[i]);
        const keyIndex = alphabet.indexOf(key[i % key.length]);
        if (charIndex !== -1 && keyIndex !== -1) {
            const decryptedIndex = (charIndex - keyIndex + 26) % 26;
            plaintext += alphabet[decryptedIndex];
        } else {
            plaintext += ciphertext[i];
        }
    }
    return plaintext;
}

module.exports = {
    estimateKeyLengthByIC,
    findKeyIC,
    decryptVigenereIC
}
