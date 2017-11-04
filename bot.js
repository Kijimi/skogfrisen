const botSettings = require("./settings.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async ready => {
	console.log(`${bot.user.username} is online.`);
	bot.user.setGame(`on ${bot.guilds.size} servers`);

	bot.generateInvite(["ADMINISTRATOR"]).then(function(link) {
		console.log(link);
	}).catch (err => {
		console.log(err.stack);
	});
});

bot.on("message", async message => {
	if(message.author.bot) return;

	let args = message.content.slice(botSettings.prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();
	
    if(message.content.indexOf(botSettings.prefix) !== 0) return;

	if(command === "ping") {
		const m = await message.channel.send("Calculating ping...");
		m.edit(`Skogfrisen's latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms.`);
	}
	if (!message.member.roles.find('name', 'would fuck dynablade')) return; // Does not have the right role to use
	message.delete().then(m => {
    	message.channel.send(args.join(" "));
	}).catch(e => {
    	console.log("Could not delete message");
});
	
	if(command === "nsfw") {
		const member = message.member;
		const role = message.member.guild.roles.find('name', 'no-nsfw');

		if (member.roles.find('name', 'no-nsfw')) {	//	Has role, so remove it
			member.removeRole(role).then(m => {
				console.log(`Removed role from ${m.nickname}`);
			}).catch(console.error);
		} else {	//	Does not have role, add it
			member.addRole(role).then(m => {
				console.log(`Added role to ${m.nickname}`);
			}).catch(console.error);
		}
	}


    if(command === `wiki`) {
        if (args.length < 1) return;
        const { RichEmbed } = require('discord.js');
        const entrySearch = args[0].toLowerCase();
        const entryPath = `./storage/wiki/${entrySearch}.json`;

        fs.stat(entryPath, (err, stat) => {
            if (err == null) {	//	Found file
				fs.readFile(entryPath, (err, data) => {
					if (err) throw new Error (err);
					
					let entry = JSON.parse(data);
					let embed = new RichEmbed()
									.setTitle(entry.title)
									.setURL(entry.url)
									.setThumbnail(entry.image)
									.setDescription(entry.description)
									.setColor(entry.color);
			
					return message.channel.send({ embed });
				});
			} else if (err.code == "ENOENT") {
				return message.reply("No entry for your search, please check your spelling or contact an administrator if the issue persists.");
			}
        });
    }

if (command === "shutdown") {
    message.channel.send("Shutting down...").then(() => {
        bot.destroy().then(() => {
            console.log("Bot shut down.");
            process.exit(1);
        }).catch(err => {
            console.log("Error when shutting down, wtf?", err);
            process.exit(1);
        });
    });
}


});	//	DO NOT TOUCH THIS


bot.login(botSettings.token);



process.on('unhandledRejection', err => {
	console.trace('Uncaught Promise Error', err);
});

process.on('uncaughtException', err => {
	let errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
	console.trace("Uncaught Exception: ", errorMsg);
});
