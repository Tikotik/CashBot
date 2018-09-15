const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "pickpocket";

exports.onLoad = api => {
    api.commands.add("pickpocket", (msg) => {
        fsn.readJSON("./accounts.json").then((accountDB) => {
            let args = msg.content.substring(12).split(" ");
            let recipientID = args[0].replace("<", "");
            recipientID = recipientID.replace("!", "");
            recipientID = recipientID.replace("@", "");
            recipientID = recipientID.replace(">", "");
            let win = Math.floor(Math.random() * 10) + 1;
            let account = accountDB[msg.author.id];
            let recipientAccount = accountDB[api.client.users.get(recipientID).id];

            // Checks if both users have an account.
            if(account !== undefined) {
                if(recipientAccount !== undefined) {
                    // Checks if recipient is the user.
                    if(msg.author.id !== api.client.users.get(recipientID).id) {
                        if(account.amount !== 0) {
                            if(recipientAccount.amo !== 0) {
                                if(win === 10) {
                                    let accountAfter = parseFloat(Number(account.amount + (recipientAccount.amount / 10)).toFixed(2));
                                    let recipientAfter = parseFloat(Number(recipientAccount.amount - (recipientAccount / 10)).toFixed(2));
                                    
                                    // Set JSON information.
                                    accountDB[msg.author.id] = {
                                        owner: msg.author.username,
                                        amount: accountAfter,
                                        lastClaimed: account.lastClaimed,
                                        private: account.private
                                    };
        
                                    accountDB[api.client.users.get(recipientID).id] = {
                                        owner: api.client.users.get(recipientID).username,
                                        amount: recipientAfter,
                                        lastClaimed: recipientAccount.lastClaimed,
                                        private: recipientAccount.private
                                    };
                                    
                                    // Writes data to JSON.
                                    fsn.writeJSON("./accounts.json", accountDB, {
                                        replacer: null,
                                        spaces: 4
                                    }).then(() => {
                                        // Send message.
                                        msg.channel.send({embed: {
                                            title: ":white_check_mark: Pickpocket",
                                            description: `You successfully pickpocketed ${api.client.users.get(recipientID).username} and got 10% of their money.`,
                                            thumbnail: {
                                                url: "https://sometag.org/_assets/emoji/twitter/white-heavy-check-mark_2705.png"
                                            }
                                        }});
            
        
                                        // Logs in console.
                                        console.log(colors.green(`${msg.author.username} pickpocketed ${api.client.users.get(recipientID).username} and succeeded.`));
                                    });
                                }else {
                                    let accountAfter = parseFloat(Number(account.amount - (account.amount / 10)).toFixed(2));
                                    let recipientAfter = parseFloat(Number(recipientAccount.amount + (account.amount / 10)).toFixed(2));
                                    
                                    // Set JSON information.
                                    accountDB[msg.author.id] = {
                                        owner: msg.author.username,
                                        amount: accountAfter,
                                        lastClaimed: account.lastClaimed,
                                        private: account.private
                                    };
        
                                    accountDB[api.client.users.get(recipientID).id] = {
                                        owner: api.client.users.get(recipientID).username,
                                        amount: recipientAfter,
                                        lastClaimed: recipientAccount.lastClaimed,
                                        private: recipientAccount.private
                                    };
                                    
                                    // Writes data to JSON.
                                    fsn.writeJSON("./accounts.json", accountDB, {
                                        replacer: null,
                                        spaces: 4
                                    }).then(() => {
                                        // Send message.
                                        msg.channel.send({embed: {
                                            title: ":x: Pickpocket",
                                            description: `You failed to pickpocket ${api.client.users.get(recipientID).username} and they got 10% of your money.`,
                                            thumbnail: {
                                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                            }
                                        }});
                                        
                                        // Logs in console.
                                        console.log(colors.green(`${msg.author.username} pickpocketed ${api.client.users.get(recipientID).username} and failed.`));
                                    });
                                }
                            }else {
                                // Sends message.
                                msg.channel.send({embed: {
                                    title: ":x: Pickpocket",
                                    description: `${api.client.users.get(recipientID).username} has nothing to pickpocket from.`,
                                    thumbnail: {
                                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                    }
                                }});

                                // Logs in console.
                                console.log(colors.red(`${api.client.users.get(recipientID).username} didn't have enough Cash to get pickpocketed from ${msg.author.username} command.`));
                            }
                        }else {
                            // Sends message.
                            msg.channel.send({embed: {
                                title: ":x: Pickpocket",
                                description: "You do not have enough Cash for that action.",
                                thumbnail: {
                                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                                }
                            }});

                            // Logs in console.
                            console.log(colors.red(`${msg.author.username} didn't have enough Cash to run the fiftyfifty command.`));
                        }
                    }else {
                        // Sends message.
                        msg.channel.send({embed: {
                            title: ":x: Pickpocket",
                            description: "You cannot pickpocket yourself.",
                            thumbnail: {
                                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                            }
                        }});

                        // Logs in console.
                        console.log(colors.red(`${msg.author.username} tried to pickpocket themself.`));
                    }
                }else {
                    // Sends message.
                    msg.channel.send({embed: {
                        title: ":x: Pickpocket",
                        description: `${api.client.users.get(recipientID).username} does not have an account.`,
                        thumbnail: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                        }
                    }});

                    // Logs in console.
                    console.log(colors.red(`${api.client.users.get(recipientID).username} didn't have an account to recieve a payment from ${msg.author.username}.`));
                }
            }else {
                // Sends message.
                msg.channel.send({embed: {
                    title: ":x: Pickpocket",
                    description: "You do not have an account, use `$new` to create a new account.",
                    thumbnail: {
                        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Fxemoji_u274C.svg/1024px-Fxemoji_u274C.svg.png"
                    }
                }});

                // Logs in console.
                console.log(colors.red(`${msg.author.username} didn't have an account to run the pay command.`));
            }
        });
    });
};
