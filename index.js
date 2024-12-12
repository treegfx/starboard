const { Client, IntentsBitField, EmbedBuilder, Guild, Message, Emoji, parseEmoji } = require('discord.js');
const { token, required } = require('./config.json');
const bot = new Client({disableMentions: 'everyone',
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessageReactions
  ],
});

bot.once('ready', () => {
    console.log("ready");
})

bot.on('messageCreate', (m) => {
    if (m.system || m.author.bot || m.channel.isThread()) return;
    if (m.channel.name == "showcase" && m.attachments.size > 0) {
        try {
            m.react('⭐');
        } catch (error) {
            console.log(error);
        }
    } else if (m.channel.name == "showcase") {
        try {
            m.delete();
        } catch (error) {
            console.log(error);
        }
    }
})
bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.emoji.name != "⭐") return;
    /*if (reaction.message.author.id === user.id) {
        try {
          await reaction.users.remove(user.id);
        } catch (error) {
          console.error(error);
        }
    }*/
    if (reaction.count === required) {
        const channel = bot.channels.cache.get('1316666077949988864');
        if (!channel) {
            console.error("channel not found!");
            return;
        }

        const embed = new EmbedBuilder()
        .setColor(0x00afff)
        .setAuthor({ 
            name: reaction.message.author.username, 
            iconURL: reaction.message.author.avatarURL() || undefined 
        });
        if (reaction.message.content.length > 0) {
            embed.setDescription(reaction.message.content);
        }
        const attachment = reaction.message.attachments.first();
        if (attachment) {
            embed.setImage(attachment.url);
        }
        embed.setTimestamp();

        channel.send({ 
            content: `:star: **${reaction.count} // [Jump!](${reaction.message.url})**`,
            embeds: [embed] 
        });
    } else if (reaction.count > required) {
        const messages = await bot.channels.cache.get('1316666077949988864').messages.fetch({ limit: 50 });

        for (const msg of messages.values()) {
            for (const embed of msg.embeds) {
                if (embed.image && embed.image.url == reaction.message.attachments.first().url) {
                    await msg.edit({ content: `:star: **${reaction.count} // [Jump!](${reaction.message.url})**`});
                    break;
                }
            }
        }
    }
});

bot.on('messageReactionRemove', async (reaction) => {
    if (reaction.emoji.name != "⭐") return;
    if (reaction.count > required) {
        const messages = await bot.channels.cache.get('1316666077949988864').messages.fetch({ limit: 50 });
    
            for (const msg of messages.values()) {
                for (const embed of msg.embeds) {
                    if (embed.image && embed.image.url == reaction.message.attachments.first().url) {
                        await msg.edit({ content: `:star: **${reaction.count} // [Jump!](${reaction.message.url})**`});
                        break;
                    }
                }
        }
    } else {
        const messages = await bot.channels.cache.get('1316666077949988864').messages.fetch({ limit: 50 });

        for (const msg of messages.values()) {
            for (const embed of msg.embeds) {
                if (embed.image && embed.image.url === reaction.message.attachments.first()?.url) {
                    try {
                        console.log(`Found matching image in message ID: ${msg.id}, deleting...`);
                        await msg.delete();
                        break;
                    } catch (error) {
                        console.error(`Failed to delete message ID: ${msg.id}`, error);
                    }
                }
            }
        }
    }
})

bot.login(token);