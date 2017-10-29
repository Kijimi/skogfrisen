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
		if (args.length < 1) return;
		const { RichEmbed } = require('discord.js');
		const entries = {
			soren: {
				title: "Soren",
				color: "#5dade2",
				description: "Soren (pronounced sorr-en) is a male [Barn Owl](http://guardiansofgahoole.wikia.com/wiki/Barn_Owls), or Tyto alba, and was the main protagonist of the first six Guardians of Ga'Hoole books and the deuteragonist of the last 9 books, as well as the leader of [the Band](http://guardiansofgahoole.wikia.com/wiki/The_Band) and creator of the [Chaw of Chaws](http://guardiansofgahoole.wikia.com/wiki/Chaw_of_Chaws).",
				image: "https://vignette.wikia.nocookie.net/guardiansofgahoole/images/d/dd/Soren9937.JPG/revision/latest?cb=20161225012250",
				url: "http://guardiansofgahoole.wikia.com/wiki/Soren_(Books)"
			},
			gylfie: {
				title: "Gylfie",
				color: "#5dade2",
				description: "Gylfie (pronounced gill-fee) is a female elf owl, or Micrathene whitneyi. She was hatched and raised in the [Desert of Kuneer](http://guardiansofgahoole.wikia.com/wiki/The_Desert_of_Kuneer), but was later kidnapped by a [St. Aggie's](http://guardiansofgahoole.wikia.com/wiki/St._Aegolius_Academy_for_Orphaned_Owls) patrol when she fell out of her nest trying to fly before she was ready. She is a member of [the Band](http://guardiansofgahoole.wikia.com/wiki/The_Band) (and the only female as well) and the [Chaw of Chaws](http://guardiansofgahoole.wikia.com/wiki/Chaw_of_Chaws), as well as [Soren](http://guardiansofgahoole.wikia.com/wiki/Soren)'s best friend.",
				image: "https://vignette.wikia.nocookie.net/guardiansofgahoole/images/0/09/Cowdrey_Gylfie_.png/revision/latest?cb=20160720183102",
				url: "http://guardiansofgahoole.wikia.com/wiki/Gylfie_(Books)"
			},
			digger: {
				title: "Digger",
				color: "#5dade2",
				description: "Digger is a male [Burrowing Owl](http://guardiansofgahoole.wikia.com/wiki/Burrowing_Owl), or Athene cunicularia. He is one of the four members of [the Band](http://guardiansofgahoole.wikia.com/wiki/The_Band). He was proven useful as a tracking owl at the [Great Ga'Hoole Tree](http://guardiansofgahoole.wikia.com/wiki/Great_Ga%27Hoole_Tree), and he is also a member of the [Chaw of Chaws](http://guardiansofgahoole.wikia.com/wiki/Chaw_of_Chaws).",
				image: "https://vignette.wikia.nocookie.net/guardiansofgahoole/images/e/e1/Digger.png/revision/latest?cb=20110815002101",
				url: "http://guardiansofgahoole.wikia.com/wiki/Digger_(Books)"
			},
		};

		let entrySearch = args[0].toLowerCase();

		if (!entries.hasOwnProperty(entrySearch)) return message.reply("No entry for your search, please check your spelling or contact an administrator if the issue persists.");

		let entry = entries[entrySearch];

		let embed = new RichEmbed()
						.setTitle(entry.title)
						.setURL(entry.url)
						.setThumbnail(entry.image)
						.setDescription(entry.description)
						.setColor(entry.color);

		return message.channel.send({ embed });
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
