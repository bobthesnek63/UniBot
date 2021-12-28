const { Client, Collection, Intents } = require("discord.js");
let unisJson = require("./unis.json");
const uniData = require("./mongoDB/model");
const editJsonFile = require("edit-json-file");
require("dotenv").config({ path: "./.env" });

global.arr = [];
global.name = "";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.on("ready", () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.content == "!show") {
    let name = msg.author.username;
    let uniList = await getUnisList(name);

    msg.reply(`Here are your current uni programs!\n${uniList}`);
  }

  if (msg.content == "!accept") {
    global.name = msg.author.username;

    let ans = await getUnisList(global.name);
    global.arr = await getUnisArr(global.name);

    msg.reply(`Which of these programs did you get accepted to?\n${ans}`);
  }

  if (
    global.arr.length != 0 &&
    msg.author.username == global.name &&
    msg.content != "!accept"
  ) {
    var found = false;
    for (var i = 0; i < global.arr.length; ++i) {
      if (msg.content == global.arr[i]) {
        found = true;
        changeUniStatus(global.name, global.arr[i]);
        msg.reply("CONGRATS ON GETTING IN! Your Uni record has been updated");
        global.name = "";
        global.arr = [];
        return;
      }
    }
    if (!found) {
      global.name = "";
      global.arr = [];
      msg.reply(
        "You have not applied to that program. Please try again from !accept"
      );
      return;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

function changeUniStatus(nameRec, uni) {
  // let file = editJsonFile(`${__dirname}/unis.json`);
  // file.set(`${name}.${uni}`, "Accepted");
  // file.save();

  // delete require.cache[require.resolve("./unis.json")];
  // unisJson = require("./unis.json");

  uniData.findOne({ name: nameRec }, function (err, res) {
    let personUniList = res.unis;
    personUniList[uni] = "Accepted";
    console.log(personUniList);
    uniData.findOneAndUpdate(
      { name: nameRec },
      { unis: personUniList },
      { returnOriginal: false },
      function (err, doc) {
        if (err) {
          console.log("Something went wrong with the upload");
        }

        console.log(doc);
      }
    );
  });
}

async function getUnisList(nameRec) {
  try {
    let list = await uniData
      .findOne({ name: nameRec }, function (err, res) {})
      .clone();

    let ans = "**";
    list = list.unis;

    for (var i in list) {
      if (list[i] == "Accepted") {
        ans += i + "✅";
        ans += "\n";
      } else {
        ans += i;
        ans += "\n";
      }
    }
    ans += "**";
    return ans;
  } catch (err) {
    console.log(err);
  }
}

async function getUnisArr(name) {
  let ans = [];

  let list = await uniData.findOne({ name: name }).clone();
  list = list.unis;
  console.log("TEST", list);

  for (var i in list) {
    ans.push(i);
  }

  return ans;
}
