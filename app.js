const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/playerDB");

const playerSchema = {
  name: String,
  team: String,
  WAR: Number,
  AB: Number,
  H: Number,
  HR: Number,
  BA: Number,
  R: Number,
  RBI: Number,
  SB: Number
};

const Player = mongoose.model("Player", playerSchema);

// Requests that target all players

app.route("/players")

  // GET
  .get((req, res) => {
    Player.find((err, foundPlayers) => {
      if (!err)
        res.send(foundPlayers);
      else
        res.send(err);
    });
  })

  // POST
  .post((req, res) => {
    const newPlayer = new Player({
      name: req.body.name,
      team: req.body.team,
      WAR: req.body.WAR,
      AB: req.body.AB,
      H: req.body.H,
      HR: req.body.HR,
      BA: req.body.BA,
      R: req.body.R,
      RBI: req.body.RBI,
      SB: req.body.SB
    });

    newPlayer.save((err) => {
      if (!err)
        res.send("Added new player.");
      else
        res.send(err);
    });
  })

  // DELETE
  .delete((req, res) => {
    Player.deleteMany((err) => {
      if (!err)
        res.send("Deleted all players.");
      else
        res.send(err);
    });
  });

// Requests that target specific players

app.route("/players/:playerName")

  // GET
  .get((req, res) => {
    Player.findOne({
      name: req.params.playerName
    }, (err, foundPlayer) => {
      if (foundPlayer)
        res.send(foundPlayer);
      else
        res.send("Player does not exist.");
    });
  })

  // PUT
  .put((req, res) => {
    Player.replaceOne({
        name: req.params.playerName
      }, {
        name: req.body.name,
        team: req.body.team,
        WAR: req.body.WAR,
        AB: req.body.AB,
        H: req.body.H,
        HR: req.body.HR,
        BA: req.body.BA,
        R: req.body.R,
        RBI: req.body.RBI,
        SB: req.body.SB
      },
      err => {
        if (!err)
          res.send("Updated Player.");
        else
          res.send(err);
      });
  })

  // PATCH
  .patch((req, res) => {
    Player.updateOne({
        name: req.params.playerName
      }, {
        $set: req.body
      },
      err => {
        if (!err)
          res.send("Updated Player.");
        else
          res.send(err);
      });
  })

  // DELETE
  .delete((req, res) => {
    Player.deleteOne({
        name: req.params.playerName
      },
      err => {
        if (!err)
          res.send("Deleted player.");
        else
          res.send(err);
      });
  });



app.listen(3000, () => {
  console.log("Server started on port 3000");
});
