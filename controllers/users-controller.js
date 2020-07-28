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
        userList: [],
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

exports.addToMyList = (req, res, next) => {
  const email = req.body.email;

  db.get(email, (err, data) => {
    if (err) {
      return res.status(401).send({
        msg: "Authentication failure",
        response: null,
      });
    } else {
      db.insert(
        {
          _id: data._id,
          _rev: data._rev,
          name: data.name,
          surname: data.surname,
          password: data.password,
          userList:
            req.body.type == "music"
              ? [
                  ...data.userList,
                  {
                    nome: req.body.nome,
                    genero: req.body.genero,
                    ano: req.body.ano,
                    artista: req.body.artista,
                    imagem: req.body.imagem,
                  },
                ]
              : [
                  ...data.userList,
                  {
                    nome: req.body.nome,
                    generos: req.body.generos,
                    ano: req.body.ano,
                    imdbRating: req.body.imdbRating,
                    restricao: req.body.restricao,
                    sinopse: req.body.sinopse,
                    imagem: req.body.imagem,
                  },
                ],
        },
        (err, data) => {
          if (err) {
            return res.status(401).send({
              msg: "Authentication failure",
              response: null,
            });
          } else {
            return res.status(200).send({
              msg: "Item adicinado a lista com sucesso!!",
            });
          }
        }
      );
    }
  });
};
