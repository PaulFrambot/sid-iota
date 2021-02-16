import * as SQLite from 'expo-sqlite';

import {SHA256Async} from './crypto';
import {SALT} from './salt';
import Base64 from './base64';
var btoa = Base64.btoa;
var atob = Base64.atob;

let Message = require('./messageConsts').Message;
let IotaUtilities = require('./IotaUtilities');
let generateRandomSeed = IotaUtilities.generateRandomSeed;
let generateAddress0FromSeed = IotaUtilities.generateAddress0FromSeed;

// import AppState from './appstate';
// import Message from './messageConsts';
// import {generateRandomSeed,  generateAddress0FromSeed} from './IotaUtilities';
// import sendMessageTotangle from './Tangle/tangleSenders';
// import generateHandshake1 from './handshake';


var db = SQLite.openDatabase('database.db');
var Crypto = require("./crypto");

executeSql = (sql) => new Promise((resolve , reject)=>{
    db.transaction((tx)=>{
        tx.executeSql(sql,[],(tx,results)=>{
            resolve(results.rows);
        },
        (_,error)=>{
            reject(error);
        });
    });
});


function createAllTables() {
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Message` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `timestamp` INT, `otherAddress` VARCHAR(120) DEFAULT '', `received` BOOLEAN DEFAULT '0', `type` INT, `content` TEXT);", [], (tx, results) => {
            console.log("Table Message created");
        }, (_, error) => console.log(error));
    });
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Contact` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `address` VARCHAR(120) DEFAULT '', `firstname` VARCHAR(120) DEFAULT '', `lastname` VARCHAR(120) DEFAULT '');", [], (tx, results) => {
            console.log("Table Contact created");
        });
    });
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Account` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `firstname` VARCHAR(120) DEFAULT '', `lastname` VARCHAR(120) DEFAULT '', `password_hash` VARCHAR(70) DEFAULT '', `auth_required` BOOLEAN DEFAULT '1', `seed` VARCHAR(120) DEFAULT '', `address0` VARCHAR(120) DEFAULT '',`rsa_pubkey` TEXT DEFAULT '', `rsa_privkey` TEXT DEFAULT '');", [], (tx, results) => {
            console.log("Table Account created");
        });
    });
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Crypto` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `address0` VARCHAR(120) DEFAULT '', `rsa_pubkey` TEXT DEFAULT '', `aes_key` TEXT DEFAULT '', `aes_priority` INT NOT NULL DEFAULT '0');", [], (tx, results) => {
            console.log("Table Crypto created");
        });
    });
}


/***********************
 ********MESSAGE********
 ***********************/

/* USED */
async function storeMessage(accountId, timestamp, address, received, type, content) { 
    var query = `INSERT INTO Message (account_id, timestamp, otherAddress, received, type, content) VALUES (${accountId}, ${timestamp}, "${address}", ${received ? 1 : 0}, ${type}, "${content}")`;
    executeSql(query).then(() => {console.log("Message stored. The query was : ");console.log(query)})
    .catch(function(error) {
        console.log('There has been a problem with storeMessage in models.js : ' + error);
    });
}

/* USED */
async function getConversationHistoryWithAddress(user_id, otherAddress) {
    /*
     * Récupère l'ensemble des message dont le champ otherAddress vaut l'addresse indiquée, order by timestamp
     */
    var query = `SELECT * FROM Message WHERE otherAddress = "${otherAddress}" AND account_id = ${user_id} ORDER BY timestamp`;
    var res = await executeSql(query);
    var messages = [];
    for (var i = 0; i < res.length; i++) {
        var m = res.item(i);
        if (m.type == Message.TEXT_MSG) {
            messages.push({'id' : m.id, 'received' : m.received, 'timestamp' : m.timestamp, 'type' : m.type, 'content' : m.content});
        }
    }
    return messages;
}

/* USED */
async function getConversations(accountId) {
    /*
     * Récupère l'ensemble des conversations order by timestamp
     */
    var query = `SELECT * FROM Message WHERE account_id = ${accountId} AND type = ${Message.TEXT_MSG} ORDER BY timestamp DESC`;
    var res = await executeSql(query);

    var conversations = [];
    var addressesSeen = [];
    for (var i = 0; i < res.length; i++) {
        var m = res.item(i);
        if (!addressesSeen.includes(m.otherAddress) && m.type == Message.TEXT_MSG) {
            addressesSeen.push(m.otherAddress);
            var name = await getNameFromAddress(m.otherAddress)
            .catch(function(error) {
              console.log('There has been a problem with sql operation in getNameFromAddress in models.js: ', error.message);
            });;
            conversations.push({'address' : m.otherAddress, 'firstname' : name.firstname, 'lastname' : name.lastname, 'messages' : await getConversationHistoryWithAddress(accountId, m.otherAddress), 'timestamp' : m.timestamp});
        }
    }
    return conversations;
}

/* USED */
async function deleteMessage(messageId) {
    var query = `DELETE FROM Message WHERE id = ${messageId}`;
    executeSql(query).then(console.log(`Message ${messageId} deleted`));
}

async function getLastTimestamp(accountId) {
    var query = `SELECT timestamp FROM Message WHERE account_id = ${accountId} AND received = 1 ORDER BY timestamp DESC LIMIT 0,1`;
    var r = await executeSql(query);
    return r.length >= 1 ? r.item(0).timestamp : 0 ;
}

async function deleteAllMessagesWithContact(address) {
    var query = `DELETE FROM Message WHERE otherAddress = "${address}"`;
    executeSql(query).then(console.log(`A message of the contact at address ${address} deleted`));
}


/***********************
 ********CONTACT********
 ***********************/

async function addContact(accountId, firstname, lastname, address, publicKey, isAddedViaHandshake=false) {
    console.log("*** Logs de addContact ***");
    console.log(accountId);
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Crypto` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `address0` VARCHAR(120) DEFAULT '', `rsa_pubkey` TEXT DEFAULT '', `aes_key` TEXT DEFAULT '', `aes_priority` INT NOT NULL DEFAULT '0');", [], (tx, results) => {
        });
    });
    var query = `INSERT INTO Contact (account_id, firstname, lastname, address) VALUES (${accountId}, "${firstname}", "${lastname}", "${address}")`;
    await executeSql(query).then(console.log("A contact was added"));

    var query2 = `INSERT INTO Crypto (account_id, address0, rsa_pubkey) VALUES (${accountId}, "${address}", "${publicKey}")`;
    await executeSql(query2).then(console.log("His public key was added"));
    
    if (!isAddedViaHandshake && !(await isKnown(accountId, address))) {
        let generateHandshake1 = require('./handshake').generateHandshake1;
        var names = await getUsername(accountId);
        require('./Tangle/tangleSenders').sendMessageToTangle(accountId, address, generateHandshake1(names.firstname, names.lastname, await getRSAPubKey(null, accountId)), Math.floor((new Date()).getTime()/ 1000), Message.HS1_MSG);
    }
}

async function getAllContacts(account_id) {
    //returns a list of couples ( id (prim key) , name))
    var query = `SELECT id, firstname, lastname, address FROM Contact WHERE account_id = ${account_id}`;
    var res = await executeSql(query);

    var ret = [];
    for (var i = 0; i < res.length; i++) {
        ret.push({'id' : res.item(i).id, 'firstName' : res.item(i).firstname, 'lastName' : res.item(i).lastname, 'address' : res.item(i).address })
    }
    return ret;
}

async function isInContacts(account_id, address) {
    var query = `SELECT firstname FROM Contact WHERE account_id = ${account_id} AND address = "${address}"`;
    return (await executeSql(query)).length >= 1;
}

async function getNameFromAddress(otherAddress) {
    var query = `SELECT firstname, lastname FROM Contact WHERE address = "${otherAddress}" LIMIT 0,1`;
    var a = (await executeSql(query)).item(0);
    return {'firstname' : a.firstname, 'lastname' : a.lastname};
}

async function getAddressFromName(firstname, lastname) {
    var query = `SELECT address FROM Contact WHERE firstname = "${firstname}" AND lastname = "${lastname}" LIMIT 0,1`;
    return (await executeSql(query)).item(0).address;
}

async function setNameForAddress(address, firstname, lastname) {
    var query = `UPDATE Contact SET firstname = "${firstname}", lastname = "${lastname}" WHERE address = "${address}"`;
    executeSql(query).then(console.log(`Updated ${address}'s name : it is now ${firstname}`));
}

async function deleteContact(address) {
    var query = `DELETE FROM Contact WHERE address = "${address}"`;
    executeSql(query).then(console.log(`Contact at address ${address} deleted`));
}





/***********************
 ********ACCOUNT********
 ***********************/

 //USED
async function createAccount(firstname, lastname, password, auth_required) {
    var password_hash = await SHA256Async(password + SALT);
    var seed = generateRandomSeed();
    var address0 = await generateAddress0FromSeed(seed);
    address0 = address0[0];
    var RSAkeys = Crypto.RSAGenerateKeys();
    
    var query = `INSERT INTO Account (firstname, lastname, password_hash, auth_required, seed, address0, rsa_pubkey, rsa_privkey) VALUES ("${firstname}", "${lastname}", "${password_hash}", ${auth_required ? 1 : 0}, "${seed}", "${address0}", "${btoa(RSAkeys.publicKey)}", "${btoa(RSAkeys.privateKey)}")`;
    await executeSql(query);
}

async function deleteAccount(accountId) {
    var query = `DELETE FROM Account WHERE id = ${accountId}`;
    executeSql(query).then(console.log(`Account ${accountId} deleted`));
}

async function getAllAccounts() {
    var query = `SELECT id, firstname, lastname, auth_required, address0 FROM Account`;
    var res = await executeSql(query);
    var ret = Array(res.length)
    for (var i = 0; i < res.length; i++) {
        var r = res.item(i);
        ret[i] = {'id' : r.id, 'firstName' : r.firstname, 'lastName' : r.lastname, 'auth_required' : r.auth_required, 'address0' : r.address0};
    }
   return ret;
}

async function getRSAPrivKey(id){
    var query = `SELECT rsa_privkey FROM Account WHERE id = ${id} LIMIT 0,1`;
    return atob((await executeSql(query)).item(0).rsa_privkey);
}

async function getSeed(id) {
    var query = `SELECT seed FROM Account WHERE id = ${id} LIMIT 0,1`;
    return (await executeSql(query)).item(0).seed;
}





/***********************
 ********CRYPTO********
 ***********************/

async function registerRSAPubKey(account_id, address0, rsaPubKey) {
    var query = `INSERT INTO Crypto (account_id, address0, rsa_pubkey) VALUES (${account_id}, "${address0}", "${btoa(rsaPubKey)}")`;
    executeSql(query).then(console.log("Public RSA key registered !"));
}

async function registerAESKey(account_id, address0, aes_key, priority) {
    var query = `UPDATE Crypto SET aes_key = "${btoa(aes_key)}" WHERE address0 = "${address0}" AND account_id = ${account_id} AND aes_priority < ${priority}`;
    executeSql(query).then(console.log("AES key registered !"));
}

async function getRSAPubKey(address0=null, account_id=null) {
    var ret;
    if (address0 == null) {
        var query = `SELECT rsa_pubkey FROM Account WHERE id = "${account_id}" LIMIT 0,1`;
        var res = await executeSql(query);
        return res.length == 1 ? atob(res.item(0).rsa_pubkey) : "";
    } else {
        var query = `SELECT rsa_pubkey FROM Crypto WHERE address0 = "${address0}" LIMIT 0,1`;
        var res = await executeSql(query);
        return res.length == 1 ? atob(res.item(0).rsa_pubkey) : "";
    }
}

async function getAESKey(account_id, address0) {
    var query = `SELECT aes_key FROM Crypto WHERE address0 = "${address0}" AND account_id = ${account_id} LIMIT 0,1`;
    return atob((await executeSql(query)).item(0).aes_key);
}

async function isKnown(account_id, address0) {
    // for logs purposes
    var query2 = `SELECT * FROM Crypto WHERE account_id = ${account_id}`;
    console.log(await executeSql(query2));

    var query = `SELECT * FROM Crypto WHERE address0 = "${address0}" AND aes_key != '' AND account_id = ${account_id} LIMIT 0,1`;
    return (await executeSql(query)).length >= 1;
}



// fonctions pratiques

async function getUsername(accountId) {
    var query = `SELECT firstname, lastname FROM Account WHERE id = ${accountId} LIMIT 0,1`;
    var res = (await executeSql(query)).item(0);
    var ret = {'firstname' : res.firstname, 'lastname' : res.lastname};
    return ret;
}

async function getAddress0(accountId) {
    var query = `SELECT address0 FROM Account WHERE id = ${accountId} LIMIT 0,1`;
    return (await executeSql(query)).item(0).address0;
}



/******************
   SUPPLÉMENTAIRE
 ******************/



async function setSurname(address, surname) {
    var query = `UPDATE Contact SET name = "${surname}", is_surname = true WHERE address = "${address}"`;
    executeSql(query).then(console.log(`Updated ${address}'s surname : it is now ${name}`));
}

async function resetSurname(address) {
    var name = "Unknown";
    message = await getMessageWithAddress(address);
    for (var i = 0; i < message.length; i++) {
        var m = message[i];
        if (m.type == Message.CMD_MESSAGE) {
            var command = m.content.split(':')[0];
            var cmd_arg = m.content.split(':').slice(1).join("");
            if (command == "name") {
                name = cmd_arg;
            }
        }
    }
    var query = `UPDATE Contact SET name = "${name}", is_surname = false WHERE address = "${address}"`;
    executeSql(query).then(console.log(`Reset ${address}'s name : it is now ${name}`));
}

function addressHasSurname(address) {
    var query = `SELECT is_surname FROM Contact WHERE address = "${address}" LIMIT 0,1`;
    return db.transaction((tx) => {
        return tx.executeSql(query, [], (tx, results) => {
            return results.rows.item(0).is_surname == 1;
        });
    });
}


module.exports = {
    storeMessage, getConversationHistoryWithAddress, getConversations, deleteMessage, getLastTimestamp, addContact,
    getAllContacts, isInContacts, getNameFromAddress, getAddressFromName, setNameForAddress, deleteContact, deleteAllMessagesWithContact,
    createAccount, deleteAccount, getAllAccounts, getRSAPrivKey, getSeed, registerRSAPubKey, registerAESKey,
    getRSAPubKey, getAESKey, isKnown, getUsername, getAddress0, createAllTables }