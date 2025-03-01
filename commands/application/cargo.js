const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageEmbedVideo } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cargo')
    .setDescription('Pick character name and move, to get a response with all available cargo data.')
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
    const character = interaction.options.getString('character');
    const [id, move] = interaction.options.getString('move').split("??");
    console.log("cargo", character, move)

    // Fetch the cargo data with the appropriate moveId
    const url_cargo = "https://dreamcancel.com/w/index.php?title=Special:CargoExport&tables=MoveData_KOF02UM%2C&&fields=MoveData_KOF02UM.hitboxes%2C+MoveData_KOF02UM.damage%2C+MoveData_KOF02UM.guard%2C+MoveData_KOF02UM.startup%2C+MoveData_KOF02UM.active%2C+MoveData_KOF02UM.recovery%2C+MoveData_KOF02UM.hitadv%2C+MoveData_KOF02UM.blockadv%2C+MoveData_KOF02UM.invul%2C+MoveData_KOF02UM.cancel%2C+MoveData_KOF02UM.idle%2C+MoveData_KOF02UM.rank%2C+MoveData_KOF02UM.idle%2C&where=moveId+%3D+%22"+encodeURIComponent(id)+"%22&order+by=&limit=100&format=json";
    const response_cargo = await fetch(url_cargo);
    const cargo = await response_cargo.json();

    // Preparing the embed data from cargo
    let moveData = cargo[0];
    const startup = (moveData['startup'] !== null) ? moveData['startup'].toString().replaceAll('&#039;','') : '-';
    const active = (moveData['active'] !== null) ? moveData['active'].toString() : '-';
    const recovery = (moveData['recovery'] !== null) ? moveData['recovery'].toString() : '-';
    const oh = (moveData['hitadv'] !== null) ? moveData['hitadv'].toString().replaceAll('&#039;','').replaceAll(/\[\[.*?\|/g,'').replaceAll(']]','') : '-';
    const ob = (moveData['blockadv'] !== null) ? moveData['blockadv'].toString().replaceAll('&#039;','').replaceAll(/\[\[.*?\|/g,'').replaceAll(']]','') : '-';
    const inv = (moveData['invul'] !== null) ? moveData['invul'].toString().replaceAll('&#039;','') : 'No recorded invincibility.';
    const dmg = (moveData['damage'] !== null) ? moveData['damage'].toString().replaceAll('&#039;','') : '-';
    const guard = (moveData['guard'] !== null) ? moveData['guard'].toString().replaceAll('&#039;','').replaceAll(/\[\[.*?\|/g,'').replaceAll(']]','') : '-';
    const cancel = (moveData['cancel'] !== null) ? moveData['cancel'].toString().replaceAll('&#039;','').replaceAll(/\[\[.*?\|/g,'').replaceAll(']]','') : '-';
    const rank = (moveData['rank'] !== null) ? moveData['rank'].toString() : '-';
    const idle = (moveData['idle'] !== null) ? moveData['idle'].toString() : '-';
    let hitboxes = (moveData['hitboxes'] !== null) ? moveData['hitboxes'].toString().trim().split(',') : [];
    
    // Get character link and img for header and thumbnail.
    const link = 'https://dreamcancel.com/wiki/The_King_of_Fighters_2002_UM/' + this.getCharacterLink(character);
    const img = this.getCharacterImg(character);
    const embeds = [];
    const embed = new MessageEmbed()
      .setColor('#0x1a2c78')
      .setTitle(character)
      .setURL(link)
      .setAuthor({ name: move, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: link + '/Data' })
      // .setDescription('Move input')
      .setThumbnail('https://tiermaker.com/images/chart/chart/the-king-of-fighters-2002-um-characters-137019/64px-portraitkof2002um' + img + 'png.png')
      .addFields(
        { name: 'Startup', value: startup, inline: true },
        { name: 'Active', value: active, inline: true },
        { name: 'Recovery', value: recovery, inline: true },
        { name: '\u200B', value: '\u200B' },
        )
    if (idle == "yes") {
      embed.addField({ name: 'Rank', value: rank})
    }else{
      embed.addFields(
        { name: 'Damage', value: dmg, inline: true },
        { name: 'Cancel', value: cancel, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Guard', value: guard, inline: true },
        { name: 'On hit', value: oh, inline: true },
        { name: 'On block', value: ob, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Invincibility', value: inv },
        // { name: 'Inline field title', value: 'Some value here', inline: true },
        )
    }
      embed.setFooter({ text: 'Got feedback? Join the 02UM server: discord.gg/8JNXHxf', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
      if (hitboxes.length === 0) {
        embed.addField('No image was found for this move', 'Feel free to share with the [developers](https://github.com/FranckFrost/kof02um_framebot/issues) if you have one.', true);
      } else {
        let ind = "url\":\""
        
        let url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
        let response = await fetch(url)
        let car = await response.text()
        let s = car.indexOf(ind) + ind.length
        let image = car.slice(s,car.indexOf("\"",s))
        embed.setImage(image)
        embeds.push(embed)

        if (hitboxes.length > 0) {
          url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
          response = await fetch(url)
          car = await response.text()
          s = car.indexOf(ind) + ind.length
          let image1 = car.slice(s,car.indexOf("\"",s))
          const embed1 = new MessageEmbed().setImage(image1)
          embeds.push(embed1)
        }

        if (hitboxes.length > 0) {
          url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
          response = await fetch(url)
          car = await response.text()
          s = car.indexOf(ind) + ind.length
          let image2 = car.slice(s,car.indexOf("\"",s))
          const embed2 = new MessageEmbed().setImage(image2)
          embeds.push(embed2)
        }

        if (hitboxes.length > 0) {
          url = "https://dreamcancel.com/w/api.php?action=query&format=json&prop=imageinfo&titles=File:" + encodeURIComponent(hitboxes.shift()) + "&iiprop=url"
          response = await fetch(url)
          car = await response.text()
          s = car.indexOf(ind) + ind.length
          let image3 = car.slice(s,car.indexOf("\"",s))
          const embed3 = new MessageEmbed().setImage(image3)
          embeds.push(embed3)
        }
        
        return interaction.reply({embeds: embeds});
      }
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
      return character.replace(' ','_');
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
      return character.toLowerCase().trim();
    }
    return charImg[character];
  }
};
