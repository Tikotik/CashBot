const colors = require("colors");
const database = require("../database");

exports.id = "addmoney";

exports.onLoad = api => {
	api.commands.add("addmoney", async (msg) => {
		let args = msg.content.substring(10).split(" ");

		let recipientID = args[0].replace("<", "");
		recipientID = recipientID.replace("!", "");
		recipientID = recipientID.replace("@", "");
		recipientID = recipientID.replace(">", "");

		let payment = Math.round(args[1]);

		if(database.isOwner(msg.author.id)) {
			if(await database.hasAccount(recipientID)) {
				let recipientAfter = await database.getAmount(recipientID) + payment;

				// Write data to database.
				database.setBalance(api.client.users.get(recipientID), recipientAfter, await database.getLastClaimed(recipientID), await database.getPrivateStatus(recipientID));

				// Sends message.
				msg.channel.send({embed: {
					title: ":white_check_mark: Add Money",
					description: `You gave **${payment} Cash** to ${api.client.users.get(recipientID).username}!`,
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/2705.png"
					}
				}});

				// Logs in console.
				console.log(colors.green(`[Bot] ${msg.author.username} gave ${payment} Cash to ${api.client.users.get(recipientID).username}!`));
			}else {
				// Sends message.
				msg.channel.send({embed: {
					title: ":x: Add Money",
					description: `${api.client.users.get(recipientID).username} does not have an account.`,
					thumbnail: {
						url: "https://images.emojiterra.com/twitter/512px/274c.png"
					}
				}});
                
				// Logs in console.
				console.log(colors.red(`[Bot] ${api.client.users.get(recipientID).username} did not have an account to receive money.`));
			}
		}else {
			// Sends message.
			msg.channel.send({embed: {
				title: ":x: Add Money",
				description: "You do not have permission to run this command",
				thumbnail: {
					url: "https://images.emojiterra.com/twitter/512px/274c.png"
				}
			}});
            
			// Logs in console.
			console.log(colors.red(`[Bot] ${msg.author.username} did not have permission to run the addmoney command.`));
		}
	});
};
