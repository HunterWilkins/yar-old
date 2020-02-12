let db = require("../models");

module.exports = function(app) {

    app.get("/api/currentUser", function(req, res) {
        db.User.findOne({
            username: req.session.username,
            id: req.session.userId
        }).then(function(dbUser){
            res.json(dbUser);
        });
    });

    app.get("/api/users/all", function(req, res) {
        db.User.findOne({
            id: req.session.userId
        }).then(function(dbUser) {
            console.log(dbUser);
            db.User.find({
                gender: dbUser.gender === "male" ? "female" : "male"
            }).then(function(dbResults) {
                res.json(dbResults);
            })
            
        }).catch(err => console.log(err));
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
                    priorities: dbUser.priorities,
                    babies: dbUser.babies,
                    leisure: dbUser.leisure,
                    priority: dbUser.priority,
                    sexy: dbUser.sexy,
                },
                
            };
            res.json(matchInfo);
        }).catch(err => console.log(err));
    })

    app.post("/api/signup", function(req, res) {
        console.log(req.body);
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
    })

    app.post("/api/signin", function(req, res) {
        console.log(req.body);
        db.User.findOne({
            username: req.body.username,
            password: req.body.password
        }).then(function(dbUser) {
            console.log(dbUser);
            if (dbUser) {
                req.session.userId = dbUser.id;
                req.session.username = dbUser.username;
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
        db.User.findOneAndUpdate({
            id : req.body.id 
        }, {[req.body.field] : req.body.value}).then(function(dbUser) {
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
                });
            }
        }).catch(err => console.log(err));
    })
}