module.exports = function(app) {
    app.get("/", function(req, res) {
        if (req.session.userId) {
            res.render("dashboard", {session: req.session});
        }
        else {
            res.render("landing");
        }
    });

    app.get("/bio/:user", function(req, res) {
        if (req.session.userId) {
            res.render("bio", {session: req.session});
        }
        else {
            res.render("bio");
        }
    });

    app.get("/dash", function(req, res) {
        if (req.session.userId) {
            res.render("dashboard", {session: req.session});
        }

        else {
            res.render("landing")
        }
    })

    app.get("/users/:username", function(req, res) {
        if (req.session.userId) {
            res.render("profile", {session: req.session})
        }

        else {
            res.render("landing");
        }

    });

    app.get("/settings", function(req, res) {
        res.render(req.session.userId ? "settings" : "landing");
    });

    app.get("/messages", function(req,res) {
        res.render(req.session.userId ? "messaging" : "landing");
    })

    app.get("*", function(req, res) {
        res.render("landing");
    });
}