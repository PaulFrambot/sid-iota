let Crypto = require('./crypto');
import Base64 from './base64';
var btoa = Base64.btoa;
var atob = Base64.atob;
// import * as Crypto from './crypto';
// import * as Storage from './models';

function generateHandshake1(firstname, lastname, RSAPubKey) {
    var message_content = "pubkey:";
    message_content = message_content + btoa(RSAPubKey);
    message_content = message_content + "_firstname:" + btoa(firstname);
    message_content = message_content + "_lastname:" + btoa(lastname);
    return message_content;
}

async function generateHandshake2(account_id, otherAddressRSAPubKey) {
    var priority = Math.floor((Math.random() * 1000000) + 1);
    var RSAPrivKey = await require('./models').getRSAPrivKey(account_id);
    var AESkey = await Crypto.AESGenerateKeyAsync();
    var message_content = "aes_key:";
    message_content = message_content + Crypto.RSAEncryptWithPubKey(AESkey, otherAddressRSAPubKey);
    message_content = message_content + '_sign:' + Crypto.RSASignWithPrivKey(AESkey, RSAPrivKey);
    message_content = message_content + '_prio:' + priority.toString();
    console.log("Handshake 2 content (clear)");
    console.log(message_content);
    console.log("AES key in base64 (what is signed) : ");
    console.log(AESkey);
    return {"key" : AESkey, "message" : message_content, "priority" : priority};
}

module.exports = { generateHandshake1, generateHandshake2 };