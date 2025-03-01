// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const keepAlive = require('./server');
const path = require('path')
const fetch = require('node-fetch'); // to fetch the cargo table (from the module node-fetch@2, pas node-fetch)

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
	if (autocomplete.commandName === 'embed' || autocomplete.commandName === 'frames' || autocomplete.commandName === 'cargo') {
    let currentOption = autocomplete.options.getFocused(true);
    let currentName = currentOption.name;
    let currentValue = currentOption.value;

    if (autocomplete.commandName === 'cargo'){
	    let cargo_characters = []
	    const url_char = "https://dreamcancel.com/w/index.php?title=Special:CargoExport&tables=MoveData_KOF02UM%2C&&fields=MoveData_KOF02UM.chara%2C&&group+by=MoveData_KOF02UM.chara&order+by=&limit=100&format=json"
	    const response_char = await fetch(url_char);
	    const cargo_char = await response_char.json();
	    for (let x in cargo_char) {
		    cargo_characters.push(cargo_char[x]["chara"])
	    }
	    characters = cargo_characters;
    }

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
	    // Capitilize first letter of char name.
	    let char = character.charAt(0).toUpperCase() + character.slice(1);
	    // Validate extra names.
	    if (char === 'Mary') char = 'Blue Mary';
	    if (char === 'O.Chris') char = 'Orochi Chris';
	    if (char === 'O.Shermie') char = 'Orochi Shermie';
	    if (char === 'O.Yashiro') char = 'Orochi Yashiro';
	    if (char === 'Ex kensou' || char === 'Ex Kensou') char = 'EX Kensou';
	    if (char === 'Ex robert' || char === 'Ex Robert') char = 'EX Robert';
	    if (char === 'Ex takuma' || char === 'Ex Takuma') char = 'EX Takuma';
	    if (char === 'K Dash' || char === 'K`') char = 'K';
	    if (char === 'May Lee' || char === 'May Lee(Standard)') char = 'May Lee(Normal)'
	    character = char
	    if (autocomplete.commandName === 'cargo') {
		    if (!characters.includes(character)) {
			    moveObj["name"] = 'No cargo data available for specified character. Gather framedata with /frames instead.';
                            moveObj["value"] = 'No cargo data available for specified character. Gather framedata with /frames instead.';
                            options.push(moveObj);
		    } else {
			    let move = "";
			    let val = "";
			    const url_moves = "https://dreamcancel.com/w/index.php?title=Special:CargoExport&tables=MoveData_KOF02UM%2C&&fields=MoveData_KOF02UM.input%2C+MoveData_KOF02UM.input2%2C+MoveData_KOF02UM.name%2C+MoveData_KOF02UM.moveId%2C&where=chara+%3D+%22"+encodeURIComponent(character)+"%22&order+by=MoveData_KOF02UM._ID+ASC&limit=100&format=json"
			    const response_moves = await fetch(url_moves);
			    const cargo_moves = await response_moves.json();
			    for (let x in cargo_moves) {
				    move = cargo_moves[x]["name"]
				    if (cargo_moves[x]["input"] !== null) {
					    move = cargo_moves[x]["name"] + " (" + cargo_moves[x]["input"] + ")"
					    if (cargo_moves[x]["input2"] !== null) {
						    move = cargo_moves[x]["name"] + " ([" + cargo_moves[x]["input"] + "] / [" + cargo_moves[x]["input2"] + "])"
						    val = cargo_moves[x]["moveId"] + "??" + move
						    if (val.length > 100) move = cargo_moves[x]["name"] + " ([" + cargo_moves[x]["input"].trim() + "] / [" + cargo_moves[x]["input2"].trim() + "])";
					    }
				    }
				    if (move.toLowerCase().includes(currentValue.toLowerCase())) {
					    moveObj = {}
					    moveObj["name"] = move;
					    moveObj["value"] = cargo_moves[x]["moveId"] + "??" + move;
					    if (options.length < 25) options.push(moveObj);
				    }
			    }
					  }
	    } else {
		    if (json[character] === undefined) {
			    moveObj["name"] = 'Moves not found for specified character, try another character';
			    moveObj["value"] = 'Moves not found for specified character, try another character';
			    options.push(moveObj);
		    } else {
			    let moves = [];
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
					    if (options.length < 25) options.push(moveObj);
				    }
			    })
					  }
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
  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} with ${guild.memberCount} members.`)
  });

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
