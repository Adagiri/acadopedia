const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const axios = require("axios");
const Tasks = require("./models/tasks.mongo");
// const restVersionOneApis = require("./routes/restVersionOneApis");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Hello ${req.ip}, how may i help you ❓`);
});

app.get("/users", (req, res) => {});

app.use(express.static(path.join(__dirname, "..", "public")));
// app.use("/v1", restVersionOneApis);

app.get("/auth", (req, res) => {
  return res.sendFile(path.join(__dirname, "..", "public", "auth.html"));
});

app.post("/", (req, res) => {
  // token=94c1f7dbec6170884e89c051558e95378db45864da7fe05d7ba2dfaddc321f4b

  axios
    .get(
      "https://opentdb.com/api.php?amount=7&category=23&token=b1424ab70b8a777696cd2d9f653d44abaf3607df64c1b7225eedb39a57ddd966"
    )
    .then(function (response) {
      // handle success
      response.data.results.forEach(async (task) => {
        const newTask = {
          type: "MULTIPLE_CHOICE",
          difficulty: task.difficulty.toUpperCase(),
          question: task.question,
          verified: true,
          author: { name: "opentdb.com" },
          category: ["2"],
        };
        if (task.type === "boolean") {
          newTask.type = task.type.toUpperCase();
          if (task.correct_answer === "False") newTask.boolean = false;
          else {
            newTask.boolean = true;
          }
        } else {
          // correct_answer: String
          // incorrect_answers: [String]
          const letters = [
            "a",
            "z",
            "y",
            "l",
            "o",
            "p",
            "q",
            "r",
            "b",
            "u",
            "m",
            "k",
            "n",
            "q",
          ];

          const multiple_choice = [
            {
              id: String(
                Math.floor(Math.random() * (100000 - 5 + 1) + 5)
              ).concat(letters[Math.floor(Math.random() * letters.length - 1)]),
              text: task.correct_answer,
              c: true,
            },
          ];
          const incorrect = task.incorrect_answers.map((elem) => {
            return {
              id: String(
                Math.floor(Math.random() * (100000 - 5 + 1) + 5)
              ).concat(letters[Math.floor(Math.random() * letters.length - 1)]),
              text: elem,
              c: false,
            };
          });
          multiple_choice.push(...incorrect);
          const sorted_multiple_choice = multiple_choice.sort(function (a, b) {
            var nameA = a.text.toUpperCase(); // ignore upper and lowercase
            var nameB = b.text.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });
          newTask.multiple_choice = sorted_multiple_choice;
        }

        await Tasks.create(newTask);
      });

      res.json("done");
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

// app.get("/*", (req, res) => {
//   return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });

module.exports = app;
