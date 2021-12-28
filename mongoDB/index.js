const mongoose = require("mongoose");
const uniData = require("./model");
const uniJSON = require("../unis.json");
require("dotenv").config({ path: "./.env" });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_KEY);

let entryNum;
mongoose.connection
  .once("open", () => {
    uniData.count({}, (err, count) => {
      // console.log("Entry number: " + count);

      if (count === 0) {
        var pranav = new uniData({
          name: "bobthesnek63",
          unis: uniJSON["bobthesnek63"],
        });
        var zoya = new uniData({
          name: "zoya",
          unis: uniJSON["zoya"],
        });
        var haram = new uniData({
          name: "haram",
          unis: uniJSON["haram"],
        });
        var dev = new uniData({
          name: "singhster",
          unis: uniJSON["singhster"],
        });
        pranav.save();
        zoya.save();
        haram.save();
        dev.save();
      }
    });
  })
  .on("error", (err) => {
    console.log("Connection Error: " + err);
  });
