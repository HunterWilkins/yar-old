let db = require("../models");

module.exports = function(app) {

    app.get("/api/currentUser/:settings", function(req, res) {
        db.User.findOne({
            id: req.session.userId
        }).then(function(dbUser){
            let results = {
                username: dbUser.username,
                name: dbUser.name,
                gender: dbUser.gender,
                age: dbUser.age,
                race: dbUser.race,
                religion: dbUser.religion,
                outgoing: dbUser.outgoing,
                prolife: dbUser.prolife,
                politics: dbUser.politics,
                role: dbUser.role,
                interests: dbUser.interests,
                babies: dbUser.babies,
                leisure: dbUser.leisure,
                priority: dbUser.priority,
                priorities: dbUser.priorities,
                attraction: dbUser.attraction,
                sexy: dbUser.sexy,
                image: dbUser.image,
                height : dbUser.height,
                weight : dbUser.weight,
                termination : dbUser.termination,
                city: dbUser.city,
                state: dbUser.state,
                confrontation : dbUser.confrontation,
            }
            if (req.params.settings === "settings") {
                results.password = dbUser.password;
         
            }
            res.json(results);
            
        }).catch(err => res.json(err));
    });

    app.post("/api/users/:filter", function(req, res) {
        console.log(req.body);
        let filterObj = {
            gender: req.body.gender === "male" ? "female" : "male",
            prolife: req.body.prolife == "true" ? "true" : "false", 
        }

        if (req.params.filter !== "all") {
            filterObj[req.body.filterField] = req.body.filter; 
        }
        
        console.log(filterObj);

        db.User.find(filterObj).then(function(matches) {
            console.log(matches);
            let results = [];
            
            matches.forEach(item => {
                let relevantInfo = {
                    username: item.username,
                    name: item.name,
                    age: item.age,
                    religion: item.religion,
                    politics: item.politics,
                    role: item.role,
                    image: item.image,
                    height: item.height,
                    weight: item.weight,
                    babies: item.babies,
                    race: item.race,
                    outgoing: item.outgoing,
                    state: item.state,
                    city: item.city
                }

                results.push(relevantInfo);
            });
          
            res.json(results);
        }).catch(err => res.json(err));
    });

    app.get("/api/matchmaker/:filter", function(req, res) {
        db.User.findOne({
            username: req.session.username,
            id: req.session.userId
        }).then(function(user) {
            console.log(user);
            let filterObj = {
                gender: user.gender === "male" ? "female" : "male",
                prolife: user.prolife == true ? true : false,
            }
            // switch (req.params.filter) {
            //     case "ideal": 
            //         filterObj.politics = user.politics,
            //         filterObj.religion = user.religion,
            //         filterObj.babies = user.babies,
            //         filterObj.state = user.state
            //         break;
            //     default: 
            //     break;
            // }

            console.log(filterObj);

            db.User.find(filterObj).then(function(matches) {
                console.log(matches);
                let results = [];
                
                matches.forEach(match => {
                    let relevantInfo = {
                        username: match.username,
                        name: match.name,
                        age: match.age,
                        religion: match.religion,
                        politics: match.politics,
                        role: match.role,
                        image: match.image,
                        height: match.height,
                        weight: match.weight,
                        babies: match.babies,
                        race: match.race,
                        outgoing: match.outgoing,
                        state: match.state,
                        city: match.city
                    }

                    let similarities = 0;
                    
                    let criteria = [
                        "race",
                        "age",
                        "religion",
                        "outgoing",
                        "politics",
                        "role",
                        "babies",
                        "state"
                    ];

                    console.log(Math.abs(user.role - match.role));

                    criteria.forEach(item => {
                        if (item === "role" && Math.abs(user.role - match.role) >= 3) {
                            similarities++;
                        }
                        
                        else if (item === "age") {
                            if (Math.abs(user.age - match.age) <= 3) {
                                similarities++;
                            }
                        }
            
                        else if (item === "babies") {
                            if (Math.abs(user.babies - match.babies) <= 2) {
                                similarities++;
                            }
                        }
            
                        else if (user[item] === match[item]) {
                            similarities++;
                        }
                    });

                    if (req.params.filter === "ideal" && similarities === criteria.length) {
                        results.push(relevantInfo);
                    }

                    else if (req.params.filter === "secondary" && similarities <= 5 && similarities >= 3) {
                        results.push(relevantInfo);
                    }

                });
              
                res.json(results);
            }).catch(err => res.json(err));
        })
    });

    app.get("/api/user/:username", function(req, res) {
        db.User.findOne({
            username: req.params.username
        }).then(function(dbUser) {
            let matchInfo = {
                biology: {
                    name: dbUser.name,
                    username: dbUser.username,
                    age: dbUser.age,
                    image: dbUser.image,
                    gender: dbUser.gender,
                    race: dbUser.race,
                    height: dbUser.height,
                    weight: dbUser.weight,    
                },

                personality: {
                    religion: dbUser.religion,
                    outgoing: dbUser.outgoing,
                    // prolife: dbUser.prolife,
                    politics: dbUser.politics,
                    role: dbUser.role,
                    
                },

                answers: {
                    interests: dbUser.interests,
                    priority: dbUser.priority,
                    priorities: dbUser.priorities,
                    termination: dbUser.termination,
                    babies: dbUser.babies,
                    leisure: dbUser.leisure,
                    confrontation: dbUser.confrontation,
                    sexy: dbUser.sexy,
                },

                flags: dbUser.flags,
                stars: dbUser.stars
            };
            res.json(matchInfo);
        }).catch(err => res.json(err));
    });

    app.get("/api/matchmaker", function(req, res) {
        db.User.findOne({
            username: req.session.username
        }).then(function(user) {
            db.User.find({
                gender: user.gender === "male" ? "female" : "male",
                prolife: user.prolife === true ? true : false
            }).then(function(matches) {

            })
        })
    })

    app.post("/api/signup", function(req, res) {
        const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        let randomAlpha = "";
        for(var i = 0; i < 30; i++) {
            let randIndex = Math.floor(Math.random()*15);
            randomAlpha += alphabet[randIndex];
        }
        
        let id = Date.now().toString() + randomAlpha + (Math.floor(Math.random()*20000)).toString();
        console.log(id);

        req.body.id = id;

        db.User.create(req.body).then(function(dbUser) {
            console.log("Successfully Added");
            req.session.userId = dbUser.id;
            req.session.username = dbUser.username;
            res.json(dbUser);
        }).catch(err => console.log(err));

    });

    app.post("/api/messages", function(req, res) {
        console.log("Finding Chats for Fullscreen =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/");
        console.log(req.body.recipient);
        console.log(req.body.author);
        db.Chat.findOne({
            recipient: req.body.recipient.username,
            author: req.body.author.username
        }).then(function(dbChat) {
            if (dbChat === null) {
                db.Chat.findOne({
                    recipient: req.body.author.username,
                    author: req.body.recipient.username
                }).then(function(dbBackupChat) {
                    res.json(dbBackupChat);
                })
            }

            else {
                res.json(dbChat);
            }
        }).catch(err => res.json(err));
    });

    app.post("/api/signin", function(req, res) {
        console.log(req.body);
        db.User.findOne({
            username: req.body.username,
            password: req.body.password
        }).then(function(dbUser) {
            console.log(dbUser);
            if (dbUser) {
                req.session.username = dbUser.username;
                req.session.userId = dbUser.id;
                console.log("Successfully Logged In");
                res.json(dbUser);
            }
            else {
                console.log("No User Found");
                res.sendStatus(500);
            }
        }).catch(err => console.log(err));
    });

    app.post("/api/logout", function(req, res) {
        req.session.destroy();
        res.sendStatus(200);
    })

    app.put("/api/user/update", function(req, res) {
        console.log(req.body);
        db.User.findOneAndUpdate({
            id : req.session.userId 
        }, req.body, {useFindAndModify: false}).then(function(dbUser) {
            res.json(dbUser);
        }).catch(err => console.log(err));
    });

    app.delete("/api/user/delete", function(req, res) {
        db.User.deleteOne({
            id: req.body.id
        }).then(function(dbUser) {
            res.json(dbUser);
        }).catch(err => console.log(err));
    });

    app.put("/api/message", function(req, res) {
        db.Chat.findOne({
            author: req.body.author.username,
            recipient: req.body.recipient.username            
        }).then(function(dbChat) {
            if (dbChat === null) {
                db.Chat.findOne({
                    author: req.body.recipient.username,
                    recipient: req.body.author.username
                }).then(function(dbBackupChat) {
                    if (dbBackupChat === null) {
                        console.log("No previous chat found where " + req.body.author.username + "sent " + req.body.recipient.username + " a message.");
                        db.Chat.create({
                            author: req.body.author.username,
                            recipient: req.body.recipient.username,
                            messages: [
                                {p: req.body.author.username,
                                text: req.body.text}
                            ],
                            id: Math.floor(Math.random()*800)
                        });        
                    }

                    else {
                        console.log("Found chat!");
                        db.Chat.findOneAndUpdate({
                            author: req.body.recipient.username,
                            recipient: req.body.author.username  
                        }, {$push: {messages: {p: req.body.author.username, text: req.body.text }}}, {useFindAndModify: false}).then(function(IhateThis) {
                        res.sendStatus(200);
                            
                            console.log(IhateThis);
                        });
                    }
                });
            }

            else {
                db.Chat.findOneAndUpdate({
                    author: req.body.author.username,
                    recipient: req.body.recipient.username  
                }, {$push: {messages: {p: req.body.author.username, text: req.body.text }}}, {useFindAndModify: false}).then(function(IhateThis) {
                    console.log(IhateThis);
                    res.sendStatus(200);
                });
            }
        }).catch(err => console.log(err));
    });
}