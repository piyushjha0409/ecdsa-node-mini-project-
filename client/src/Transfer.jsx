import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethers/lib/utils";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils"

function Transfer({ address, setBalance, setPrivateKey, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    //code from here
     const data = {
      sender: address,
      recipient,
      amount: parseInt(sendAmount)
     }

     console.log(privateKey)
     const hashMessage = toHex(keccak256(utf8ToBytes(JSON.stringify(data))))
     
     const sign = await secp.sign(hashMessage, privateKey, {recovered: true} )

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });

      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      {/* This is for the private key  */}
      <label>
        Private Key
        <input
          placeholder="Type key here"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
