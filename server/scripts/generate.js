const {utils, getPublicKey} = require("ethereum-cryptography/secp256k1")
const {toHex} = require("ethereum-cryptography/utils")
const fs = require('fs')
const {get} = require('http')

function generateKeys(count){

    const wallet_addresses = {}
    var privateKey;
    var publicKey;
    var walletAddress;

    for(let i=0; i<count; i++){
        privateKey = utils.randomPrivateKey()
        publicKey = getPublicKey(privateKey)

        // for the wallet address we have to make it slice 20 of the public key
        walletAddress = `0x${toHex(publicKey.slice(1).slice(-20))}`
        wallet_addresses[walletAddress] = Math.floor(Math.random() * 100) + 50
    }

    const KeysInfo = {
        PrivateKey : toHex(privateKey),
        PublicKey: toHex(publicKey),
        wallet_address: walletAddress
    }
   
    getKeys(KeysInfo)
    return wallet_addresses
}

//function for getting the keys
async function getKeys(KeysInfo){
  fs.writeFileSync('../keys.json', JSON.stringify(KeysInfo), 'utf-8')
}
//function for getting the wallet address
async function getAddress(count){
  fs.writeFileSync('../address.json', JSON.stringify(generateKeys(count)), 'utf-8')
}

// call the function 
getAddress(3);