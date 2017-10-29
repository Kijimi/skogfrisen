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
	if(message.content.indexOf(botSettings.prefix) !== 0) return;

	let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(botSettings.prefix)) return;

	if(command === "ping") {
		const m = await message.channel.send("Calculating ping...");
		m.edit(`Skogfrisen's latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms.`);
	}
	if(command === "talk") {
		message.delete().catch(O_o=>{}).then;
		message.channel.send(args.join(" "));
	}
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
		const { RichEmbed } = require('discord.js');
		const entries = {
			soren: {
				title: "Soren",
				color: "#5dade2",
				description: "Soren (pronounced sorr-en) is a male Barn Owl, or Tyto alba, and was the main protagonist of the first six Guardians of Ga'Hoole books and the deuteragonist of the last 9 books, as well as the leader of the Band and creator of the Chaw of Chaws.",
				image: "https://vignette.wikia.nocookie.net/guardiansofgahoole/images/d/dd/Soren9937.JPG/revision/latest?cb=20161225012250",
				url: "URL HERE"
			}
		};

		let entrySearch = args[0].toLowerCase();
		let entry = entries[entrySearch];

		let embed = new RichEmbed()
						.setTitle(entry.title)
						.setURL(entry.url)
						.setThumbnail(entry.image)
						.setDescription(entry.description)
						.setColor(entry.color);

		return message.channel.send({ embed });
	}




});	//	DO NOT TOUCH THIS


bot.login(botSettings.token);
