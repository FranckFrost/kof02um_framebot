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

    try {
      // Fetch the cargo data with the appropriate moveId
      const url_cargo = "https://dreamcancel.com/w/index.php?title=Special:CargoExport&tables=MoveData_KOF02UM%2C&&fields=MoveData_KOF02UM.hitboxes%2C+MoveData_KOF02UM.images%2C+MoveData_KOF02UM.damage%2C+MoveData_KOF02UM.guard%2C+MoveData_KOF02UM.startup%2C+MoveData_KOF02UM.active%2C+MoveData_KOF02UM.recovery%2C+MoveData_KOF02UM.hitadv%2C+MoveData_KOF02UM.blockadv%2C+MoveData_KOF02UM.invul%2C+MoveData_KOF02UM.cancel%2C+MoveData_KOF02UM.idle%2C+MoveData_KOF02UM.rank%2C+MoveData_KOF02UM.idle%2C&where=moveId+%3D+%22"+encodeURIComponent(id)+"%22&order+by=&limit=100&format=json";
      const response_cargo = await fetch(url_cargo);
      const cargo = await response_cargo.json();
  
      // Preparing the embed data from cargo
      let moveData = cargo[0];
      const startup = this.getHyperLink(moveData['startup']);
      const active = this.getHyperLink(moveData['active']);
      const recovery = this.getHyperLink(moveData['recovery']);
      const rank = this.getHyperLink(moveData['rank']);
      const idle = this.getHyperLink(moveData['idle']);
      const oh = this.getHyperLink(moveData['hitadv']);
      const ob = this.getHyperLink(moveData['blockadv']);
      const inv = this.getHyperLink(moveData['invul'],1);
      const dmg = this.getHyperLink(moveData['damage']);
      const guard = this.getHyperLink(moveData['guard']);
      const cancel = this.getHyperLink(moveData['cancel']);
      let images = (moveData['images'] !== null) ? moveData['images'].toString().trim().split(',') : [];
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
      if (idle === "yes") {
        hitboxes = images
        embed.addFields({ name: 'Rank', value: rank})
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
        }
      return interaction.reply({embeds: embeds});
      } catch (err) {
        console.log("Error finishing cargo request", err);
        return interaction.reply('There was an error while processing your request, if the problem persists, contact the bot developers. Refer to the [Google sheet](https://docs.google.com/spreadsheets/d/1lzpQMoGAboJezLT9WRd3O-vlNDNRlgF_47ShtBGZ3G4) to look for the data.');
      }
  },
  getHyperLink: function(str,inv) {
    if (inv && str === null) return 'No recorded invincibility.';
    if (str === null) return '-';
    let t="", u="", v=[], w=[], x=[], y=[], z=str.toString().replaceAll('&#039;','').split(',')
    for (let i in z) {
        y[i] = z[i].match(/.*?\[\[.*?\]\].*/g)
    }
    for (let i in y) {
      if (y[i] === null) {
          x.push(z[i])
      }else{
          let wiki = "https://dreamcancel.com/wiki/"
          for (let j in y[i]) {
              w = y[i][j].replace(']]','').split('[[')
              v = w[1].split('|')
              if (v[1].includes("HKD")) u = " \'Hard Knockdown\'"
              if (v[1].includes("SKD")) u = " \'Soft Knockdown\'"
              x.push(w[0] + '[' + v[1] + '](' + wiki + v[0] + u + ')')
          }
      }
    }
    for (let i in x) {
        t = t + x[i] + ','
    }
    return r.slice(0, -1);
  },
  getCharacterImg: function(character) {
    const chartImg = {
      'EX Kensou': 'kensouex',
      'EX Robert': 'robertex',
      'EX Takuma': 'takumaex',
      'Blue Mary': 'bluemary',
      'Ryuji Yamazaki': 'yamazaki',
      'Goro Daimon': 'daimon',
      'Sie Kensou': 'kensou',
      'May Lee(Normal)': 'maylee',
      'May Lee(Hero)': 'maylee',
      'Li Xiangfei': 'xiangfei',
      'Orochi Chris': 'orochichris',
      'Orochi Shermie': 'orochishermie',
      'Orochi Yashiro': 'orochiyashiro',
    };
    if (chartImg[character] === undefined) {
      return character.toLowerCase().split(' ')[0];
    }
    return chartImg[character];
  }
};
