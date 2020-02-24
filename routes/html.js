module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("landing", {session: req.session});
    });

    app.get("/bio", function(req, res) {
        res.render("bio");
    });

    app.get("/dash", function(req, res) {
        res.render("dashboard", {session: req.session});
    })

    app.get("/users/:username", function(req, res) {
        res.render("profile", {session: req.session})
    })

    app.get("*", function(req, res) {
        res.render("landing", {session: req.session});
    });
}