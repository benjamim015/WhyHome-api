const cloudant = require("../ibmCloudant");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var dbname = "users";
var db = null;

db = cloudant.db.use(dbname);

exports.signUp = (req, res, next) => {
  const user = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
  };

  bcrpyt.hash(user.password, 10, (errBcrypt, hash) => {
    if (errBcrypt) {
      return res.status(500).send({ error: errBcrypt });
    }

    db.insert(
      {
        _id: user.email,
        name: user.name,
        surname: user.surname,
        password: hash,
      },
      (err, data) => {
        console.log("data:", data);
        if (err) {
          return res.status(500).send({
            error: err,
            response: null,
          });
        }
        res.status(201).send({
          msg: "User added",
          user: {
            name: user.name,
            surname: user.surname,
            email: user.email,
          },
        });
      }
    );
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  db.get(email, (err, data) => {
    if (err || data == null) {
      return res.status(401).send({
        msg: "Authentication failure",
        response: null,
      });
    }
    bcrpyt.compare(password, data.password, (error, result) => {
      if (error) {
        return res.status(401).send({
          msg: "Authentication failure",
          response: null,
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            name: data.name,
            email: data._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).send({
          msg: "Successfully authenticated",
          token: token,
          data: data,
        });
      }

      return res.status(401).send({
        msg: "Authentication failure",
        response: null,
      });
    });
  });
};
