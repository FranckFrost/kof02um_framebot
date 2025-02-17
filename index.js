// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const keepAlive = require('./server');
const path = require('path')
// const fetch = require('node-fetch'); to fetch the cargo table (from the module node-fetch@2, pas node-fetch)

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const appCommandFiles = fs.readdirSync('./commands/application').filter(file => file.endsWith('.js'));
const guildCommandFiles = fs.readdirSync('./commands/guild').filter(file => file.endsWith('.js'));

for (const file of appCommandFiles) {
  const command = require(`./commands/application/${file}`);
  client.commands.set(command.data.name, command);
}
for (const file of guildCommandFiles) {
  const command = require(`./commands/guild/${file}`);
  client.commands.set(command.data.name, command);
}

/* Getting data directly from cargo. It works but it'd be too tedious to navigate the characters and moves
Would need to change the structure of the json for it to be like the framedata sheet

async function getData() {
  const url = "https://dreamcancel.com/wiki/Special:CargoExport?title=Special%3ACargoQuery&tables=MoveData_KOF02UM%2C+&fields=MoveData_KOF02UM.chara%2C+MoveData_KOF02UM.input%2C+MoveData_KOF02UM.input2%2C+MoveData_KOF02UM.startup%2C+MoveData_KOF02UM.name%2C+&where=&join_on=&group_by=&having=&order_by%5B0%5D=MoveData_KOF02UM.chara&order_by_options%5B0%5D=ASC&limit=&offset=&format=json";
  const response = await fetch(url);

  const cargo = await response.json();
  console.log(cargo[0]["input"]);
}
getData();
return; the return for testing */

let json = null
let characters = []
client.once('ready', () => {
  json = fs.readFileSync("./assets/framedata02um.json", 'utf8');
  json = JSON.parse(json);
  Object.keys(json).forEach(function (key) {
    characters.push(key);
  })
  console.log('Ready!');
});
client.on('interactionCreate', async autocomplete => {
	if (!autocomplete.isAutocomplete()) return;
  // console.log(autocomplete.commandName)
	if (autocomplete.commandName === 'embed' || autocomplete.commandName === 'frames') {
    let currentOption = autocomplete.options.getFocused(true);
    let currentName = currentOption.name;
    let currentValue = currentOption.value;

    const options = [];
    if (currentName === "character") {
      characters.forEach((character) => {
        if (character.toLowerCase().includes(currentValue.toLowerCase())) {
          let charObj = {}
          charObj["name"] = character;
          charObj["value"] = character;
          if (options.length < 25) {
            options.push(charObj);
          }
        }
      })
    }
    // 
    let character = autocomplete.options.getString('character')
    // If move is focused 
    if (currentName === "move" && character !== "") {
      // currentValue = autocomplete.options.getFocused()
      let moveObj = {}
      if (json[character] === undefined) {
        // Capitilize first letter of char name.
        let char = character.charAt(0).toUpperCase() + character.slice(1);
        // Temp: validate extra names.
        if (char === 'Mary') {
          char = 'Blue Mary'
            }
        if (char === 'O.Chris') {
          char = 'Orochi Chris'
            }
        if (char === 'O.Shermie') {
          char = 'Orochi Shermie'
            }
        if (char === 'O.Yashiro') {
          char = 'Orochi Yashiro'
            }
        if (char === 'Ex kensou' ||
            char === 'Ex Kensou') {
          char = 'EX Kensou'
            }
        if (char === 'Ex robert' ||
            char === 'Ex Robert') {
          char = 'EX Robert'
            }
        if (char === 'Ex takuma' ||
            char === 'Ex Takuma') {
          char = 'EX Takuma'
            }
        if (char === 'K Dash' ||
            char === 'K`') {
          char = 'K'
            }
        if (char === 'May Lee' ||
            char === 'May Lee(Standard)') {
          char = 'May Lee(Normal)'
            }
        character = char
      }
      if (json[character] === undefined) {
        moveObj["name"] = 'Moves not found for specified character, try another character';
        moveObj["value"] = 'Moves not found for specified character, try another character';
        options.push(moveObj);
      } else {
        let moves = [] 
        Object.keys(json[character]).forEach(function (key) {
          moves.push(key);
        })
        // console.log(moves)
        // console.log('currval ' + currentValue)
        moves.forEach((move) => {
          if (move.toLowerCase().includes(currentValue.toLowerCase())) {
            moveObj = {}
            moveObj["name"] = move;
            moveObj["value"] = move;
            // console.log(move)
            if (options.length < 25) {
              options.push(moveObj);
            }
          }
        }) 
      }
    }
		await autocomplete.respond(options);
	}
});
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
client.on("ready", () => {
  console.log(`Hi, ${client.user.username} is now online and used in ${client.guilds.cache.size} servers.`);

  client.user.setPresence({
    status: "online",
    activities: [{
      name: 'Kyo. Use /frames or /help to get started.'
    }],
  }); 
});
// Keep bot alive. (doesn't seem to work on raspberry, port issue to look into later)
// keepAlive();
// Login to Discord with your client's token
const token = process.env['DISCORD_TOKEN']
client.login(token);
