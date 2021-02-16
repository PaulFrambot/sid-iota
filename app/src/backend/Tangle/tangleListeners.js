///////////////////////////////
// Listen to live transactions
///////////////////////////////
import * as Storage from '../models';
import * as Crypto from '../crypto';
import { generateHandshake2 } from '../handshake';
import { sendMessageToTangle } from './tangleSenders';
import intervalId from './Interval';
const Message = require('../messageConsts').Message;
import Base64 from '../base64';
var btoa = Base64.btoa;
var atob = Base64.atob;

const Iota = require('@iota/core');
const iota = Iota.composeAPI({
  provider: 'https://nodes.thetangle.org:443'
});
const Extract = require('@iota/extract-json');



async function handleReceivedMessage(account_id, message, timestamp) {
  /*
   * Prend en entrée le message raw (en JSON). Stocke le message dans la db, traite la commande si c'est une commande, demande un refresh d'affichage et notifie l'utilisateur
   */

  console.log("Message Received !");
  console.log(message);
  var RSAPrivKey = await Storage.getRSAPrivKey(account_id);
  var sender = Crypto.RSADecryptWithPrivKey(message.sender, RSAPrivKey).split('-')[0];
  var content;
  var signature;
  var priority;
  if (await Storage.isKnown(account_id, sender)) {
    console.log("Trying to decrypt the message : " + message.content + " --- with the key  : " + await Storage.getAESKey(account_id, sender));
    content = Crypto.AESDecrypt(message.content, await Storage.getAESKey(account_id, sender));
  } else if (message.type == Message.HS2_MSG) {
    aes_key = message.content.split("aes_key:")[1].split("_sign:")[0];
    console.log("Clé AES chiffrée : ");
    console.log(aes_key);
    var aes_key_clear = await Crypto.RSADecryptWithPrivKey(aes_key, RSAPrivKey);
    console.log("Clé AES déchiffrée : ");
    console.log(aes_key_clear);
    content = "aes_key:" + aes_key_clear + "_sign:" + message.content.split("_sign:").slice(1).join('');
    signature = content.split('_sign:')[1].split('_prio:')[0];
    priority = content.split('_prio:')[1];


    if (Crypto.RSAVerifyWithPubKey(signature, aes_key_clear, await Storage.getRSAPubKey(sender))) {
      content = content.split('_sign:')[0];
    } else {
      // Crash, it does not come from sender
      console.log('Haha it\'s not from you');
      content = "sespatrébontoussa";
    }
   } else {
    console.log("Le message reçu n'est pas de quelqu un de isKnown ni un Message.HS2_MSG" )
    content = message.content;
  }

  console.log("On va le stocker dans la base de données !");
  console.log("Le timestamp : " + timestamp.toString());
  console.log("L'adresse de l'envoyeur : " + sender);
  console.log("Le type du message : " + message.type.toString());
  console.log("Le contenu : " + content);

  await Storage.storeMessage(account_id, timestamp, sender, true, message.type, content);
  
  // process le message
  if (message.type == Message.CMD_MSG) {
      var command = content.split(':')[0];
      var cmd_arg = content.split(':').slice(1).join("");
      switch (command) {
          case 'name' : {
              if (!(await Storage.addressHasSurname(sender))) {
                  Storage.setNameForAddress(sender, cmd_arg);
              }
          }
          default : {
              console.log(`Unknown command received : ${command}`);
          }
      }
  } else if (message.type == Message.HS1_MSG) {
    console.log("C'est un message de handshake 1");
    var rest = content.split('pubkey:').slice(1).join("");
    var senderRSAPubKey = atob(rest.split('_firstname:')[0]);
    rest = rest.split('_firstname:').slice(1).join("");
    var firstname = atob(rest.split('_lastname:')[0]);
    rest = rest.split('_lastname:').slice(1).join("");
    var lastname = atob(rest);
    console.log("Il a été envoyé par " + firstname + " " + lastname);
    console.log("Il contient la clé publique suivante : ");
    console.log(senderRSAPubKey);
    console.log("On l'ajoute aux contacts");
    await Storage.addContact(account_id, firstname, lastname, sender, btoa(senderRSAPubKey), true); // registers RSA pubkey and adds to contacts

    message_content = await generateHandshake2(account_id, senderRSAPubKey);
    Storage.registerAESKey(account_id, sender, message_content.key, message_content.priority);
    message_content = message_content.message;
    console.log("On lui répond");
    sendMessageToTangle(account_id, sender, message_content, Math.floor((new Date()).getTime()/ 1000),Message.HS2_MSG);


  } else if (message['type'] == Message.HS2_MSG) {
    console.log("C'est un message de handshake 2");
    var command = content.split(':')[0];
    var aes_key = content.split(':').slice(1).join("");
    if (command == 'aes_key') {
      Storage.registerAESKey(account_id, sender, aes_key, priority);
    }
  }

  if (message.type == Message.TEXT_MSG && (await Storage.isInContacts(account_id, sender))) {
    console.log(`Notification: ${(await Storage.getNameFromAddress(sender)).firstname} vous a envoyé un message`);
  }
  // TODO rafraichir l'affichage et notifier l'utilisateur

}


async function processMissedTransactions(account_id){
  iota.getAccountData(await Storage.getSeed(account_id)).then(async (accountData) => {
      let history = accountData.transactions;
      let deletkey = [];
      for (let i = 0; i < history.length; i++) {
       await iota.getBundle(history[i])
        .then(async bundle => {
          var jsonBundle = JSON.parse(Extract.extractJson(bundle));
          console.log(" Historique des messages: On avait reçu un message à ce timestamp : " + jsonBundle.timestamp.toString());
          //console.log(temp);
          console.log("*********************************************************************************** listeneeeeeeeeeeeeeeeeeeeeeeeeeeer");
          if (jsonBundle.timestamp > await Storage.getLastTimestamp(account_id)) {
            handleReceivedMessage(account_id, jsonBundle, jsonBundle.timestamp);
          }
        })
        .catch(err => {
            deletkey.push(i);
        });
      }
      console.log("before for in listenerHandler ****************************");
      try{
      for (let j =0 ;j < deletkey.length ; j++)
      {
        deletkey[j] = deletkey[j] - j; 
        history.splice(deletkey[j], 1);
      }}
      catch(error)
      {
        console.log("crashing when deleting");
      }
  }).catch(function(error) {
    console.log('There has been a problem with getting the account data in tangleListeners.js: ' + error);
  });
}

async function startProcessingMessages(account_id) {
  intervalId[0] = setInterval(() => processMissedTransactions(account_id), 25000);
}


module.exports = { startProcessingMessages }