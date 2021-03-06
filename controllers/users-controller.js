const cloudant = require("../ibmCloudant");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var dbname = "users";
var db = null;

db = cloudant.db.use(dbname);

const nodemailer = require("nodemailer");

exports.emailVerification = async (req, res, next) => {
  const user = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
  };

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `"WhyHome" <WhyHome015@gmail.com>`,
    to: `${user.email}`,
    subject: "WhyHome",
    text: "Verificar conta!",
    html: `<a href="https://rest-api-whyhome.herokuapp.com/users/signUp?name=${user.name}&surname=${user.surname}&email=${user.email}&password=${user.password}">Clique aqui para verificar sua conta</a>`,
  });

  res.status(200).send({
    msg: "Verifique seu e-mail!",
  });
};

exports.signUp = (req, res, next) => {
  const user = {
    name: req.query.name,
    surname: req.query.surname,
    email: req.query.email,
    password: req.query.password,
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
        if (err) {
          return res.status(500).send("<h2>Erro!</h2>");
        }
        res
          .status(201)
          .send(
            "<h2>Você foi registrado com sucesso! Já pode voltar para o aplicativo.</h2>"
          );
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
                    tipo: req.body.type,
                    genero: req.body.genero,
                    ano: req.body.ano,
                    artista: req.body.artista,
                    imagem: req.body.imagem,
                    disponivelEm: req.body.disponivelEm,
                  },
                ]
              : req.body.type == "movie" || req.body.type == "serie"
              ? [
                  ...data.userList,
                  {
                    nome: req.body.nome,
                    tipo: req.body.type,
                    generos: req.body.generos,
                    ano: req.body.ano,
                    imdbRating: req.body.imdbRating,
                    restricao: req.body.restricao,
                    sinopse: req.body.sinopse,
                    imagem: req.body.imagem,
                    disponivelEm: req.body.disponivelEm,
                  },
                ]
              : [
                  ...data.userList,
                  {
                    nome: req.body.nome,
                    tipo: req.body.type,
                    genero: req.body.generos,
                    ano: req.body.ano,
                    autor: req.body.autor,
                    copias: req.body.copias,
                    sinopse: req.body.sinopse,
                    imagem: req.body.imagem,
                    disponivelEm: req.body.disponivelEm,
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

exports.getMyList = (req, res, next) => {
  const email = req.body.email;

  db.get(email, (err, data) => {
    if (err) {
      return res.status(401).send({
        msg: "Authentication failure",
        response: null,
      });
    } else {
      return res.status(200).send({
        userList: data.userList,
      });
    }
  });
};

exports.removeFromMyList = (req, res, next) => {
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
          userList: [
            ...data.userList.filter((res) => {
              if (res.nome !== req.body.nome) {
                return res;
              }
            }),
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
              msg: "Item removido da lista com sucesso!!",
            });
          }
        }
      );
    }
  });
};

exports.addRatingTo = (req, res, next) => {
  dbname = "mocks";
  db = cloudant.db.use(dbname);

  const type = req.body.type;
  const name = req.body.name;
  const rating = req.body.rating;

  db.get(type, (err, data) => {
    if (err) {
      return res.status(400).send({
        msg: "Tipo não encontrado!",
        response: null,
      });
    }
    db.insert(
      {
        _id: data._id,
        _rev: data._rev,
        series: [
          ...data.series.map((res) => {
            if (res.nome == name) {
              res.qunatidadeNotas = res.qunatidadeNotas + 1;
              res.notas = [...res.notas, rating];
              let total = 0;
              res.notas.map((resp) => {
                total += resp;
              });
              res.mediaNotas = total / res.qunatidadeNotas;
              return res;
            }
            return res;
          }),
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
            msg: "Nota adicinada com sucesso!!",
          });
        }
      }
    );
  });
};
