const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uuid = require("uuid").v4;
console.log(uuid());

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var dataNotes = [];

app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    console.log(data);
    var notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post("/api/notes", function (req, res) {
  let newNote = req.body;
  console.log(newNote);
  newNote.id = uuid();

  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});
app.delete("/api/notes/:id", function (req, res) {
  var noteIdToDelete = req.params.id;
  var noteDeleted = false;
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
    const notes = JSON.parse(data);

    for (var i = 0; i < notes.length && !noteDeleted; i++) {
      if (notes[i].id === noteIdToDelete) {
        console.log(notes[i].id);
        notes.splice(i, 1);
        noteDeleted = true;
      }
    }

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(notes);
    });
  });
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => console.log("App listening on PORT: " + PORT));
