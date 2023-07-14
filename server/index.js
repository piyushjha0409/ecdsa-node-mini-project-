const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "042aae4183b067762b8c7ae02d7216248de27fac4415cab0f87a5e106dcc326d15e298de2dca272098b302fe39334cab572113b4d02458ab81036bf831f31dbf5b": 100,
  "0457a80ffb45336543f3237ade1d6222827aa49a7c7ff140735aae19b51462c197b9daab557416a6430c436186acfbf2ad8d5bf608c3d52a615146374e443c8bb2": 50,
  "041aedb4af9d1ac1fda5f3443e8fe4683292697b24d0b659499a5b21973b01af019aef1b9713185aec38dc5b23f1a842939d072ffc623fbdd494d9a65baf417496": 75,
};

//this api is for the fetching of balance of the wallet address
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

//this is send api route
app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
