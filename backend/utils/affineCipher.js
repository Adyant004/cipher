function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return -1; 
}

function decryptAffine(ciphertext, a, b) {
    const m = 26; 
    const a_inv = modInverse(a, m);
    if (a_inv === -1) return null; 

    return ciphertext.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            const y = char.charCodeAt(0) - 65;
            const x = (a_inv * (y - b + m)) % m;
            return String.fromCharCode(x + 65);
        }
        return char; 
    }).join('');
}

module.exports = {
    gcd,
    decryptAffine
}