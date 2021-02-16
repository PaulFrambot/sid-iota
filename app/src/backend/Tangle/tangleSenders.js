import { AESEncrypt, RSAEncryptWithPubKey } from '../crypto';
import * as Storage from '../models';

const Message = require('../messageConsts').Message;

const Iota = require('@iota/core');
const iota = Iota.composeAPI({
    provider: 'https://nodes.thetangle.org:443'
});

const Converter = require('@iota/converter');
const depth = 3;
const minimumWeightMagnitude = 14;




async function sendMessageToTangle(account_id, address, messageStr,timestamp, type=Message.TEXT_MSG, resend=false) {
    if (!resend) { await Storage.storeMessage(account_id, timestamp, address, false, type, messageStr); }

    /**
     * Envoie un message à l'adresse précisée.
     */
    console.log("Sending a message of type " + type.toString());
    console.log(messageStr);

    var contentSent;
    if (type != Message.HS1_MSG && type != Message.HS2_MSG && await Storage.isKnown(account_id, address)) { // cas où on envoye un message classique à un contact déjà handshaké
        let AESKey = await Storage.getAESKey(account_id, address)
        console.log("Encrypting the message : " + messageStr + " --- with the key : " + AESKey);
        contentSent = AESEncrypt(messageStr, AESKey);
    } else if (type == Message.HS1_MSG || type == Message.HS2_MSG) {
        // on envoie le message en raw, la crypto est assurée par les fonctions generateHandshakeX()
        contentSent = messageStr;
    }
    else { // cas où on veut envoyer un message classique sans s'être handshaked
        console.log("You are not allowed to send a message to this person right now");
        return -1;
    }
    const seed = "NIMPORTEQUOIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII";
    const messageJSON = JSON.stringify({'sender' : RSAEncryptWithPubKey(await Storage.getAddress0(account_id) + "-" + Math.floor((Math.random() * 1000000) + 1).toString(), await Storage.getRSAPubKey(address)), 'type' : type, 'content' : contentSent,'timestamp' : timestamp});
    const messageInTrytes = Converter.asciiToTrytes(messageJSON);
    const transfers = [
        {
            value: 0,
            address: address,
            message: messageInTrytes
        }
        ];
    
    iota.prepareTransfers(seed, transfers)
        .then(trytes => {
            return iota.sendTrytes(trytes, depth, minimumWeightMagnitude);
        })
        .then(bundle => {
            console.log("La PoW est terminée, le message est envoyé, voici le bundle[0].hash: ", bundle[0].hash)
        })
        .catch(err => {
            console.log('Est-ce que c\'est la JSON parse error ?');
            console.log("Bon, on renvoie...");
            sendMessageToTangle(account_id, address, messageStr,timestamp, type, true)
            console.log(err);
        });
}


module.exports = { sendMessageToTangle};