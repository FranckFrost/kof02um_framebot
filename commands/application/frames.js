const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { MessageEmbedVideo } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('frames')
    .setDescription('Pick character name and move, to get a response with all available move data.')
    .addStringOption(character =>
  		character.setName('character')
        .setAutocomplete(true)
  			.setDescription('The character name (e.g. Kyo, Iori).')
  			.setRequired(true))
    .addStringOption(move =>
  		move.setName('move')
        .setAutocomplete(true)
  			.setDescription('The move name or input.')
  			.setRequired(true)),
  async execute(interaction) {
    const char = interaction.options.getString('character');
    const move = interaction.options.getString('move');
    // Load frame data json.
    fs.readFile("./assets/framedata.json", "utf8", (err, jsonObject) => {
      if (err) {
        // console.log("Error reading file from disk:", err);
        return interaction.reply('Could not load frame data file. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1lzpQMoGAboJezLT9WRd3O-vlNDNRlgF_47ShtBGZ3G4) for the data.');
      }
      try {
        let data = JSON.parse(jsonObject);
        // Capitilize first letter of character name.
        let character = char.charAt(0).toUpperCase() + char.slice(1);
        // Temp: validate extra names.
        if (character === 'Mary') {
          character = 'Blue Mary'
            }
        if (character === 'O.Chris') {
          character = 'Orochi Chris'
            }
        if (character === 'O.Shermie') {
          character = 'Orochi Shermie'
            }
        if (character === 'O.Yashiro') {
          character = 'Orochi Yashiro'
            }
        if (character === 'Ex kensou' ||
            character === 'Ex Kensou') {
          character = 'EX Kensou'
            }
        if (character === 'Ex robert' ||
            character === 'Ex Robert') {
          character = 'EX Robert'
            }
        if (character === 'Ex takuma' ||
            character === 'Ex Takuma') {
          character = 'EX Takuma'
            }
        if (character === 'K Dash' ||
            character === 'K`') {
          character = 'K'
            }
        if (character === 'May Lee' ||
            character === 'May Lee(Standard)') {
          character = 'May Lee(Normal)'
            }
        // If character not found, exit.
        if (data.hasOwnProperty(character) === false) {
          return interaction.reply('Could not find character: ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1lzpQMoGAboJezLT9WRd3O-vlNDNRlgF_47ShtBGZ3G4) for available characters.');
        }
        // Trim extra whitespaces from move.
        /* let parsedMove = move.trim();
        let singleButton = false
        // Check if single button passed.
        if (parsedMove.match(/^[+\-aAbBcCdD() .]+$/g)) {
          singleButton = true
          // console.log(parsedMove)
          // Preppend "far" to return valid value.
          parsedMove = (parsedMove === 'cd' || parsedMove === 'CD') ? parsedMove : 'far ' + parsedMove;
        }
        // console.log(parsedMove)
        // Convert dots into whitespaces.
        parsedMove = parsedMove.replace('.', ' ')
        // Trim whitespaces and add caps, turning "236 a" into "236A".
        if (parsedMove.match(/^[\d+ $+\-aAbBcCdD().]+$/g) ) {
          parsedMove = parsedMove.toUpperCase()
          parsedMove = parsedMove.replace(' ', '')
          console.log("Is this still useful? " + parsedMove)
        } */
        console.log(character)
        let escapedMoves = move
        /* console.log(parsedMove)
        let escapedMoves = ''
        const moveArray = parsedMove.split(" ")
        moveArray.forEach((element) => {
          // Turn ABCD to uppercase if they are not.
          if (element.match(/^[+\-aAbBcCdD() .]+$/g) ) {
            element = element.toUpperCase()
          }
          escapedMoves += element + ' ';
        }) ;
        escapedMoves = escapedMoves.trimEnd();*/
        // If move not found, exit.
        if (data[character].hasOwnProperty(escapedMoves) === false) {
          return interaction.reply('Could not find specified move: ' + move + 'for ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1lzpQMoGAboJezLT9WRd3O-vlNDNRlgF_47ShtBGZ3G4) for available data.');
        }
        let moveData = data[character][escapedMoves];
        const startup = (moveData['Startup (F)'] !== null) ? moveData['Startup (F)'].toString() : '-';
        const active = (moveData['Active (F)'] !== null) ? moveData['Active (F)'].toString() : '-';
        const recovery = (moveData['Recovery (F)'] !== null) ? moveData['Recovery (F)'].toString() : '-';
        const oh = (moveData['On Hit (F)'] !== null) ? moveData['On Hit (F)'].toString() : '-';
        const ob = (moveData['On Guard (F)'] !== null) ? moveData['On Guard (F)'].toString() : '-';
        const notes = (moveData['Notes'] !== null) ? moveData['Notes'].toString() : 'No notes found.';
        const dmg = (moveData['Damage'] !== null) ? moveData['Damage'].toString() : '-';
        // Get lowercase trimmed character name for official site url.
        let lowerCaseChar = character.toLowerCase();
        lowerCaseChar = lowerCaseChar.split(/\s+/).join('');
        // Get character link and img for header and thumbnail.
        const link = this.getCharacterLink(character);
        const img = this.getCharacterImg(character);
        // console.log(charNo);
        const embeds = [];
        const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle(character)
          .setURL('https://dreamcancel.com/wiki/The_King_of_Fighters_2002_UM/' + link)
          .setAuthor({ name: escapedMoves, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: 'https://docs.google.com/spreadsheets/d/1lzpQMoGAboJezLT9WRd3O-vlNDNRlgF_47ShtBGZ3G4' })
          // .setDescription('Move input')
          .setThumbnail('https://tiermaker.com/images/chart/chart/the-king-of-fighters-2002-um-characters-137019/64px-portraitkof2002um' + img + 'png.png')
          .addFields(
            { name: 'Startup', value: startup, inline: true },
            { name: 'Active', value: active, inline: true },
            { name: 'Recovery', value: recovery, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Damage', value: dmg, inline: true },
            { name: 'On hit', value: oh, inline: true },
            { name: 'On block', value: ob, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Notes', value: notes },
            // { name: 'Inline field title', value: 'Some value here', inline: true },
          )
          .setFooter({ text: 'Got feedback? Join the 02UM server: discord.gg/8JNXHxf', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
          (moveData['Image'] != null) ? embed.setImage(moveData['Image']) : embed.addField('No image was found for this move', 'Feel free to share with the [developers](https://github.com/FranckFrost/kof02um_framebot/issues) if you have one.', true);
        embeds.push(embed);
        if (moveData['Image1'] != null) {
          const embed1 = new MessageEmbed().setImage(moveData['Image1']);
          embeds.push(embed1);
        }
        if (moveData['Image2'] != null) {
          const embed2 = new MessageEmbed().setImage(moveData['Image2']);
          embeds.push(embed2);
        }
        if (moveData['Image3'] != null) {
          const embed3 = new MessageEmbed().setImage(moveData['Image3']);
          embeds.push(embed3);
        }
        if (moveData['Image4'] != null) {
          const embed4 = new MessageEmbed().setImage(moveData['Image4']);
          embeds.push(embed4);
        }
        if (moveData['Image5'] != null) {
          const embed5 = new MessageEmbed().setImage(moveData['Image5']);
          embeds.push(embed5);
        }
        if (moveData['Image6'] != null) {
          const embed6 = new MessageEmbed().setImage(moveData['Image6']);
          embeds.push(embed6);
        }
        if (moveData['Image7'] != null) {
          const embed7 = new MessageEmbed().setImage(moveData['Image7']);
          embeds.push(embed7);
        }
        if (moveData['Image8'] != null) {
          const embed8 = new MessageEmbed().setImage(moveData['Image8']);
          embeds.push(embed8);
        }
        if (moveData['Image9'] != null) {
          const embed9 = new MessageEmbed().setImage(moveData['Image9']);
          embeds.push(embed9);
        } //10 embeds max per message
        return interaction.reply({embeds: embeds});
      } catch (err) {
        console.log("Error parsing JSON string:", err);
        return interaction.reply('There was an error while processing your request, if the problem persists, contact the bot developers. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1lzpQMoGAboJezLT9WRd3O-vlNDNRlgF_47ShtBGZ3G4) to look for the data.');
      }
    });
  },
  getCharacterLink: function(character) {
    const charLink = {
      'Andy': 'Andy_Bogard',
      'Athena': 'Athena_Asamiya',
      'Benimaru': 'Benimaru_Nikaido',
      'Billy': 'Billy_Kane',
      'Blue Mary': 'Blue_Mary',
      'EX Kensou': 'EX_Kensou',
      'EX Robert': 'EX_Robert',
      'EX Takuma': 'EX_Takuma',
      'Orochi Chris': 'Orochi_Chris',
      'Orochi Shermie': 'Orochi_Shermie',
      'Orochi Yashiro': 'Orochi_Yashiro',
      'Chang': 'Chang_Koehan',
      'Chin': 'Chin_Gentsai',
      'Choi': 'Choi_Bounge',
      'Clark': 'Clark_Still',
      'Foxy': 'Foxy',
      'Daimon': 'Goro_Daimon',
      'Hinako': 'Hinako_Shijou',
      'Iori': 'Iori_Yagami',
      'Jhun': 'Jhun_Hoon',
      'Joe': 'Joe_Higashi',
      'K': 'K%27',
      'Kasumi': 'Kasumi_Todoh',
      'Kim': 'Kim_Kaphwan',
      'Kula': 'Kula_Diamond',
      'Kyo': 'Kyo_Kusanagi',
      'Leona': 'Leona_Heidern',
      'Xiangfei': 'Li_Xiangfei',
      'Mai': 'Mai_Shiranui',
      'May Lee(Normal)': 'May_Lee',
      'May Lee(Hero)': 'May_Lee',
      'Ralf': 'Ralf_Jones',
      'Robert': 'Robert_Garcia',
      'Ryo': 'Ryo_Sakazaki',
      'Yamazaki': 'Ryuji_Yamazaki',
      'Shingo': 'Shingo_Yabuki',
      'Kensou': 'Sie_Kensou',
      'Takuma': 'Takuma_Sakazaki',
      'Terry': 'Terry_Bogard',
      'Yashiro': 'Yashiro_Nanakase',
      'Yuri': 'Yuri_Sakazaki'
    };
    if (charLink[character] === undefined) {
      return character;
    }
    return charLink[character];
  },
  getCharacterImg: function(character) {
    const charImg = {
      'EX Kensou': 'kensouex',
      'EX Robert': 'robertex',
      'EX Takuma': 'takumaex',
      'Kyo-1': 'kyo1',
      'Kyo-2': 'kyo2',
      'May Lee(Normal)': 'maylee',
      'May Lee(Hero)': 'maylee',
    };
    if (charImg[character] === undefined) {
      return character.toLowerCase().replace(' ', '');
    }
    return charImg[character];
  }
};
