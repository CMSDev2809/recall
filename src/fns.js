const fs = require("fs");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("ryleysflower");

const location = "http://localhost:8081";

module.exports = {
  encryptCard: object => ({
    firstName: object.firstName,
    lastName: object.lastName,
    cardNumber: cryptr.encrypt(object.cardNumber),
    expDate: cryptr.encrypt(object.expDate),
    cardHolder: cryptr.encrypt(object.cardHolder),
    securityCode: cryptr.encrypt(object.securityCode),
    amount: cryptr.encrypt(object.amount),
    billingAddress: cryptr.encrypt(object.billingAddress),
    billingAddress2: cryptr.encrypt(object.billingAddress2),
    city: cryptr.encrypt(object.city),
    state: cryptr.encrypt(object.state),
    zip: cryptr.encrypt(object.zip),
    phoneNumber: cryptr.encrypt(object.phoneNumber),
    purpose: cryptr.encrypt(object.purpose),
    notes: cryptr.encrypt(object.notes),
    processing: object.processing
  }),
  decryptCard: object => ({
    id: object._id,
    firstName: object.firstName,
    lastName: object.lastName,
    cardNumber: cryptr.decrypt(object.cardNumber),
    expDate: cryptr.decrypt(object.expDate),
    cardHolder: cryptr.decrypt(object.cardHolder),
    securityCode: cryptr.decrypt(object.securityCode),
    amount: cryptr.decrypt(object.amount),
    billingAddress: cryptr.decrypt(object.billingAddress),
    billingAddress2: cryptr.decrypt(object.billingAddress2),
    city: cryptr.decrypt(object.city),
    state: cryptr.decrypt(object.state),
    zip: cryptr.decrypt(object.zip),
    phoneNumber: cryptr.decrypt(object.phoneNumber),
    purpose: cryptr.decrypt(object.purpose),
    notes: cryptr.decrypt(object.notes),
    processing: object.processing
  }),
  writeToken: token => {
    fs.writeFile("/tmp/test", token, err => {
      if (err) {
        return console.log(err);
      }
    });
  },
  writeToSave: obj => {
    fs.writeFile("save", JSON.stringify(obj), err => {
      if (err) {
        return console.log(err);
      }
    });
  },
  readFromSave: async () => {
    const obj = await new Promise((resolve, reject) => {
      fs.readFile("save", "utf-8", (err, data) => {
        err ? reject(err) : resolve(JSON.parse(data));
      });
    }).then(res => res);
    return obj;
  },
  ping: async () => {
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const ping = await new Promise((resolve, reject) => {
      setTimeout(function() {
        reject(new Error("timeout"));
      }, 10000);
      fetch(`${location}:${port}/ping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => resolve(res.json()));
    });
    return ping;
  },
  readToken: async () => {
    const token = await new Promise((resolve, reject) => {
      fs.readFile("/tmp/test", "utf-8", (err, data) => {
        err ? reject(err) : resolve(data);
      });
    }).then(res => res);
    return token;
  },
  getUserAccess: async token => {
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const accessLevel = await fetch(`${location}:${port}/get_user_access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      }
    }).then(res => res.json());
    return accessLevel;
  },
  createUser: async (username, password) => {
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const user = await fetch(`${location}:${port}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json());
    return user;
  },
  loginUser: async (username, password) => {
    const base64 = require("base-64");
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const user = await fetch(`${location}:${port}/authenticate`, {
      method: "post",
      headers: {
        authorization: "Basic " + base64.encode(username + ":" + password),
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(res => res.json());
    return user;
  },
  getCards: async name => {
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const cards = await fetch(`${location}:${port}/get_cards?name=${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json());
    return cards;
  },
  getTasks: async name => {
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const cards = await fetch(`${location}:${port}/get_tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json());
    return cards;
  },
  createCard: async cardData => {
    const base64 = require("base-64");
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const user = await fetch(`${location}:${port}/create_card`, {
      method: "post",
      headers: {
        authorization: "Basic " + base64.encode("data"),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cardData)
    }).then(res => res.json());
    return user;
  },
  updateCard: async (id, data) => {
    const base64 = require("base-64");
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const obj = {
      id,
      data
    };
    const user = await fetch(`${location}:${port}/update_card`, {
      method: "post",
      headers: {
        authorization: "Basic " + base64.encode("data"),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    }).then(res => res.json());
    return user;
  },
  deleteCard: async id => {
    const base64 = require("base-64");
    const location = await module.exports.readFromSave().then(res => res.db);
    const port = await module.exports.readFromSave().then(res => res.port);
    const user = await fetch(`${location}:${port}/delete_card`, {
      method: "delete",
      headers: {
        authorization: "Basic " + base64.encode("data"),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    }).then(res => res.json());
    return user;
  }
};
