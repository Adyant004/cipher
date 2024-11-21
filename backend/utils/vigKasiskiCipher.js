
function kasiskiExamination(ciphertext) {
    const sequenceDistances = {};
    const n = ciphertext.length;

    for (let length = 3; length <= 5; length++) {
        for (let i = 0; i < n - length; i++) {
            const sequence = ciphertext.substring(i, i + length);
            for (let j = i + length; j < n - length; j++) {
                if (ciphertext.substring(j, j + length) === sequence) {
                    const distance = j - i;
                    if (!sequenceDistances[sequence]) {
                        sequenceDistances[sequence] = [];
                    }
                    sequenceDistances[sequence].push(distance);
                }
            }
        }
    }
    return sequenceDistances;
}

function estimateKeyLength(distances) {
    const gcd = (a, b) => (!b ? a : gcd(b, a % b));
    let possibleKeyLengths = [];

    for (const sequence in distances) {
        const sequenceDistances = distances[sequence];
        if (sequenceDistances.length > 1) {
            let seqGCD = sequenceDistances[0];
            for (let i = 1; i < sequenceDistances.length; i++) {
                seqGCD = gcd(seqGCD, sequenceDistances[i]);
            }
            possibleKeyLengths.push(seqGCD);
        }
    }

    return possibleKeyLengths.sort((a, b) =>
        possibleKeyLengths.filter(v => v === a).length - 
        possibleKeyLengths.filter(v => v === b).length
    ).pop();
}

function findKey(ciphertext, keyLength) {
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

function decryptVigenere(ciphertext, key) {
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

function getLetterFrequencies(subtext) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const frequency = Array(26).fill(0);
    for (let char of subtext) {
        const index = alphabet.indexOf(char);
        if (index !== -1) {
            frequency[index]++;
        }
    }
    return frequency;
}

function estimateKeyLengthByFrequency(ciphertext) {
    const maxKeyLength = Math.min(10, ciphertext.length); 
    let bestLength = 1;
    let bestCoincidence = 0;

    for (let length = 1; length <= maxKeyLength; length++) {
        let coincidenceIndex = 0;
        for (let i = 0; i < length; i++) {
            let subtext = "";
            for (let j = i; j < ciphertext.length; j += length) {
                subtext += ciphertext[j];
            }
            const frequencies = getLetterFrequencies(subtext);
            const n = subtext.length;
            let sum = 0;
            for (let freq of frequencies) {
                sum += freq * (freq - 1);
            }
            coincidenceIndex += sum / (n * (n - 1));
        }
        coincidenceIndex /= length;
        if (coincidenceIndex > bestCoincidence) {
            bestCoincidence = coincidenceIndex;
            bestLength = length;
        }
    }
    return bestLength;
}

function kasiskiExaminationWithFallback(ciphertext) {
    const distances = kasiskiExamination(ciphertext);
    const estimatedKeyLength = estimateKeyLength(distances);
    if (!estimatedKeyLength) {
        console.log("Kasiski examination failed; falling back to frequency analysis.");
        return estimateKeyLengthByFrequency(ciphertext);
    }
    return estimatedKeyLength;
}

module.exports = {
    kasiskiExaminationWithFallback,
    findKey,
    decryptVigenere
}