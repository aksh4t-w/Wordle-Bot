import dictionary from "word-list-json";
// var dictionary = import("word-list-json");
// const dictionary = require("./employees.json");

import express from "express";
import cors from "cors";
let port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

let word_list = [];

const s = "ae";
const pos = "---ae";

dictionary.map((word) => {
  if (word.length == 5) {
    word_list.push(word);
  }
});

const getWordsByChars = (s, ns = "") => {
  return word_list
    .map((word) => {
      let possible_word = true;
      s.split("").forEach((c) => {
        possible_word = possible_word && word.includes(c);
      });

      ns.split("").forEach((c) => {
        possible_word = possible_word && !word.includes(c);
      });

      if (possible_word) return word;
    })
    .filter((word) => word);
};

const getWordsByCharPositions = (pos, notChars = "") => {
  if (pos === "") return [];
  word_list = word_list
    .map((word) => {
      let possible_word = true;
      notChars.split("").forEach((c) => {
        possible_word = possible_word && !word.includes(c);
      });
      if (possible_word) return word;
    })
    .filter((word) => word);

  let pattern = "";

  pos.split("").map((e) => {
    if (e == "-") pattern += "[a-z]";
    else pattern += e;
  });

  pattern = new RegExp(pattern);

  return word_list
    .map((word) => {
      if (pattern.test(word)) return word;
    })
    .filter((word) => word);
};

app.get("/", (req, res) => {
  res.send({ msg: "Successful response." });
});

app.post("/getWords", (req, res) => {
  const wordsByChars = getWordsByChars(
    req.body.charsPresent,
    req.body.charsNotPresent
  );

  const wordsByPos = getWordsByCharPositions(
    req.body.positions,
    req.body.charsNotPresent
  );

  // console.log(req.body);
  res.send({ wordsByChars, wordsByPos });
});

app.listen(port, () =>
  console.log(`Example app is listening on port ${port}.`)
);

// getWordsByChars("re", "gadtos");
// console.log(getWordsByCharPositions("---er", "jokfivstng"));
