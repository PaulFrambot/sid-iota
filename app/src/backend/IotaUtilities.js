const Iota = require('@iota/core');

// Connect to a node
const iota = Iota.composeAPI({
  provider: 'https://nodes.devnet.thetangle.org:443'
});

// Define the security level of the address
const securityLevel = 2;

function generateRandomSeed() {

    var length       = 81;                            // The length of the seed and int array.
    var chars        = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9"; // The allowed characters in the seed.
    var randomValues;       // An empty array to store the random values.
    var result       = new Array(length);             // An empty array to store the seed characters.

    randomValues = Array(length).fill().map(() => Math.round(Math.random() * 37));

    var cursor = 0;                                   // A cursor is introduced to remove modulus bias.
    for (var i = 0; i < randomValues.length; i++) {   // Loop through each of the 81 random values.
        cursor += randomValues[i];                    // Add them to the cursor.
        result[i] = chars[cursor % chars.length];     // Assign a new character to the seed based on cursor mod 81.
    }

    return result.join('');                           // Merge the array into a single string and return it.

};

async function generateAddressN(seed, n) {

  return await iota.getNewAddress(seed, { index: n, securityLevel: securityLevel, total: 1 })
  .then(address => {
    console.log('The adress ' + n.toString() + ' generated is : ' + address);
    return address;
  })
  .catch(err => {
    console.log(err)
  });              

};

async function generateAddress0FromSeed(seed) {

    return await generateAddressN(seed, 0);
};






module.exports = { generateRandomSeed, generateAddress0FromSeed, generateAddressN };