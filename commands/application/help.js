const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Describes how to use the commands to retrieve frame data'),
  async execute(interaction) {
    const embed = new MessageEmbed()
          .setColor('#0x1a2c78')
          .setTitle('Need Help?')
          .setAuthor({ name: 'KOF02UM FrameBot', iconURL: 'https://cdn.discordapp.com/icons/630700639382405120/2f0abc591122b2bd038650bee6868faa.png', url: 'https://discord.gg/8JNXHxf' })
          .addFields(
            { name: 'Getting started', value: 'The bot provides a "move per command" response where you get to ask for information of a certain move of a certain character individually per request. The bot uses autocomplete, so please keep typing to filter the results to your needs. The bot has a **/frames** slash command which accept 2 arguments:', inline: false },
            { name: '\u200B', value: '\u200B' },
            { name: 'Character', value: 'The **character** which is a case insensitive string (e.g. vanessa, Chris, iori)', inline: false },
            { name: 'Move', value: 'The **move** name or input which is a case insensitive string (e.g. crouchA, psycho ball)', inline: false },
            { name: '\u200B', value: '\u200B' },
            { name: 'Demo', value: 'The following is a visual representation of how the bot works:', inline: false },
          )
          .setImage('https://media.giphy.com/media/LrqUuAZB2E3hGvHtOH/giphy.gif')
          .setFooter({ text: 'Got feedback? Join the 02UM server: https://discord.gg/8JNXHxf', iconURL: 'https://cdn.iconscout.com/icon/free/png-128/discord-3-569463.png' });
        return interaction.reply({embeds: [embed]});
  },
};
