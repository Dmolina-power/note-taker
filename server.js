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

app.get("/api/notes", function(req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
        if (err) throw err;
        console.log(data);
        var notes = JSON.parse(data);
        res.json(notes);
    })
});

app.post("/api/notes", function(req, res) {
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
        })
    })
});