let db = require("../models");

module.exports = function(app) {
    app.get("/api/users/all", function(req, res) {
        db.User.find({}).then(function(dbUser) {
            res.json(dbUser);
        }).catch(err => console.log(err));
    });

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

        db.User.create({
            username: req.body.username,
            password: req.body.password,
            id: id
        }).then(function(dbUser) {
            console.log("Successfully Added");
            req.session.userId = dbUser.id;
            req.session.username = dbUser.username;
            res.json(dbUser);
        }).catch(err => console.log(err));

    });

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
}