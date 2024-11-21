const express = require('express');
const router = express.Router();

const {decryptCaeser , FreqAffineCipher, freqSubstitutionCipher, vigenereDecryptWithKasiski, vigenereDecryptWithIC} = require('../controllers/ciphercontroller')

router.route('/caeser').post(decryptCaeser)
router.route('/affine').post(FreqAffineCipher);
router.route('/subs').post(freqSubstitutionCipher);
router.route('/vignere/kasiski').post(vigenereDecryptWithKasiski);
router.route('/vignere/ic').post(vigenereDecryptWithIC);

module.exports = {
    router
}