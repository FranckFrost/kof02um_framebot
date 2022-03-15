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
  			.setDescription('The move name and input.')
  			.setRequired(true)),
  async execute(interaction) {
    const char = interaction.options.getString('character');
    const move = interaction.options.getString('move');
    // Load frame data json.
    fs.readFile("./assets/framedata.json", "utf8", (err, jsonObject) => {
      if (err) {
        // console.log("Error reading file from disk:", err);
        return interaction.reply('Could not load frame data file. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1yBxwJEmzGDqsH2Gy5bitwVe2NGQvXRIkwUP0_SmskFU) for the data.');
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
            character === 'K`' ||
            character === 'K') {
          character = 'K''
            }
        if (character === 'May Lee' ||
            character === 'May Lee(Standard)') {
          character = 'May Lee(Normal)'
            }
        // If character not found, exit.
        if (data.hasOwnProperty(character) === false) {
          return interaction.reply('Could not find character: ' + character + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1yBxwJEmzGDqsH2Gy5bitwVe2NGQvXRIkwUP0_SmskFU) for available characters.');
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
          return interaction.reply('Could not find specified move: ' + move + '. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1yBxwJEmzGDqsH2Gy5bitwVe2NGQvXRIkwUP0_SmskFU) for available data.');
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
        // Get character number for thumbnail.
        const link = this.getCharacterLink(character);
        // console.log(charNo);
        const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle(character)
          .setURL('https://dreamcancel.com/wiki/index.php/The_King_of_Fighters_2002_UM/' + link)
          .setAuthor({ name: escapedMoves, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: 'https://docs.google.com/spreadsheets/d/1yBxwJEmzGDqsH2Gy5bitwVe2NGQvXRIkwUP0_SmskFU' })
          // .setDescription('Move input')
          .setThumbnail('https://dreamcancel.com/wiki/index.php/File:02UM_' + character + '_Profile.png')
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
          .setFooter({ text: 'Got feedback? Join the bot server: https://discord.gg/2Yqnwd4cUr', iconURL: 'https://www.deviantart.com/alchemist10/art/The-King-Of-Fighters-2002-Unlimited-Match-526662291' });
          (moveData['Image'] !== null) ? embed.setImage(moveData['Image']) : embed.addField('No image was found for this move', 'Feel free to share one with the [developers](https://github.com/FranckFrost/kof02um_framebot/issues) if you have one.', true);
        return interaction.reply({embeds: [embed]});
      } catch (err) {
        console.log("Error parsing JSON string:", err);
        return interaction.reply('There was an error while processing your request, if the problem persists, contact the bot developers. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1yBxwJEmzGDqsH2Gy5bitwVe2NGQvXRIkwUP0_SmskFU) to look for the data.');
      }
    });
  },
  getCharacterLink: function(character) {
    const charLink = {
      'Andy': 'Andy Bogard',
      'Athena': 'Athena Asamiya',
      'Benimaru': 'Benimaru Nikaido',
      'Billy': 'Billy Kane',
      'Chang': 'Chang Koehan',
      'Chin': 'Chin Gentsai',
      'Choi': 'Choi Bounge',
      'Clark': 'Clark Still',
      'Foxy': 'Foxy',
      'Daimon': 'Goro Daimon',
      'Hinako': 'Hinako Shijou',
      'Iori': 'Iori Yagami',
      'Jhun': 'Jhun Hoon',
      'Joe': 'Joe Higashi',
      'Kasumi': 'Kasumi Todoh',
      'Kim': 'Kim Kaphwan',
      'Kula': 'Kula Diamond',
      'Kyo': 'Kyo Kusanagi',
      'Leona': 'Leona Heidern',
      'Xiangfei': 'Li Xiangfei',
      'Mai': 'Mai Shiranui',
      'May Lee(Normal)': 'May Lee',
      'May Lee(Hero)': 'May Lee',
      'Ralf': 'Ralf Jones',
      'Robert': 'Robert Garcia',
      'Ryo': 'Ryo Sakazaki',
      'Yamazaki': 'Ryuji Yamazaki',
      'Shingo': 'Shingo Yabuki',
      'Kensou': 'Sie Kensou',
      'Takuma': 'Takuma Sakazaki',
      'Terry': 'Terry Bogard',
      'Yashiro': 'Yashiro Nanakase',
      'Yuri': 'Yuri Sakazaki',
    };
    const link = character
    if charLink[character] {
      link = charLink[character]
    }
    return link;
  }
};
