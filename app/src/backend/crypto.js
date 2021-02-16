import * as Random from 'expo-random'
import * as ExpoCrypto from 'expo-crypto'
import * as CryptoJS from 'react-native-crypto-js'
var RSAKey = require('./RSAlib/rsa');


// RSA
function RSAEncryptWithPubKey(message, pubKey) {
    var rsa = new RSAKey();
    rsa.setPublicString(pubKey);
    return rsa.encrypt(message); //returns the RSA encrypted message
}

function RSASignWithPrivKey(message, privKey) {
    var rsa = new RSAKey();
    rsa.setPrivateString(privKey);
    return rsa.encryptPrivate(message); //signs the message
}

function RSAVerifyWithPubKey(signature, message, pubKey) {
    var rsa = new RSAKey();
    rsa.setPublicString(pubKey);
    return message == rsa.decryptPublic(signature); //retruns true if the signature is valid
}

function RSADecryptWithPrivKey(encryptedMessage, privKey) { //returns a string containing the message
    var rsa = new RSAKey();
    rsa.setPrivateString(privKey);
    return rsa.decrypt(encryptedMessage); //decrypt the message
}

function RSAGenerateKeys() { //returns a JSON : {'publicKey': pubKey, 'privateKey': privKey}
    var rsa = new RSAKey();
    rsa.generate(2048, '10001');
    return {'publicKey' : rsa.getPublicString(), 'privateKey' : rsa.getPrivateString()};
}


// AES
function AESEncrypt(message, AES_key) { //returns the encryption of the message
    return CryptoJS.AES.encrypt(message,AES_key).toString();
}

function AESDecrypt(message, AES_key) { //returns an 'utf8' string of the decrypted message
    return CryptoJS.AES.decrypt(message, AES_key).toString(CryptoJS.enc.Utf8);
}

async function AESGenerateKeyAsync(length = 64) { //generates an AES key
    //return CryptoJS.PBKDF2("Secret Passphrase", CryptoJS.lib.WordArray.random(128/8), { keySize: length/32 }).toString();
    return await generateBytesAsync(length); // low security because of deterministic random with seeds, but PBKDF2 librairies doesn't work with expo
}


// SHA256
async function SHA256Async(message) {
    let result = await ExpoCrypto.digestStringAsync(ExpoCrypto.CryptoDigestAlgorithm.SHA256, message);
    return result.toString('base64');
}


// random bytes
async function generateBytesAsync(length) { //returns random bytes (base64 encoded)
    if (length <= 1024){
        let u8 = await Random.getRandomBytesAsync(length);
        return Buffer.from(u8).toString('base64');
    } else {
        let nLoop = Math.floor(length/1024);
        let u8 = new Uint8Array(length);
        
        for (let i=0; i<nLoop; i++){
            u8.set(await Random.getRandomBytesAsync(1024), i*1024);
        }
        
        if ((length - nLoop*1024) > 0) { u8.set(await Random.getRandomBytesAsync(length - nLoop*1024), nLoop*1024); }
        
        return Buffer.from(u8).toString('base64');
    }
}



// tests
// RSA
/*let cles = JSON.parse(RSAGenerateKeys());
let pubKey = cles['publicKey'];
let privKey = cles['privateKey'];
let message = "bonjour c'est Jackie"
let encryptedMessage = RSAEncryptWithPubKey(message, pubKey);
let signature = RSASignWithPrivKey(message, privKey);

console.log('RSA tests :');
console.log(pubKey + '\n');
console.log(privKey + '\n');
console.log('Original message :\n' + message +'\n');
console.log('Encrypted message (base64) :\n' + encryptedMessage + '\n');
console.log('Signature :\n' + signature + '\n');
console.log('Decrypted message :\n' + RSADecryptWithPrivKey(encryptedMessage, privKey) + '\n');
console.log('Signature check with another public key : ' + RSAVerifyWithPubKey(signature, message, JSON.parse(RSAGenerateKeys())['publicKey']));
console.log('Signature check with the right public key: ' + RSAVerifyWithPubKey(signature, message, pubKey) + '\n\n\n');

//AES
let cle = AESGenerateKey();
let message2 = "bonjour c'est Jackie"
let AESEncryptedMessage = AESEncrypt(message, cle);

console.log('AES tests :');
console.log('AES key : ' + cle + '\n');
console.log('Original message :\n' + message2 +'\n');
console.log('Encrypted message :\n' + AESEncryptedMessage + '\n');
console.log('Decrypted message :\n' + AESDecrypt(AESEncryptedMessage, cle));*/



//MODULE EXPORTS
module.exports = {RSAEncryptWithPubKey, RSADecryptWithPrivKey, RSAVerifyWithPubKey, RSASignWithPrivKey, RSAGenerateKeys, AESEncrypt, AESDecrypt, AESGenerateKeyAsync, SHA256Async, generateBytesAsync}