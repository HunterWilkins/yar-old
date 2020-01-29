module.exports = function(app) {
    app.get("/", function(req, res) {
        console.log(req.session.userId);
        res.render("landing", {session: req.session});
    });

    app.get("/bio", function(req, res) {
        res.render("bio");
    })

    app.get("*", function(req, res) {
        console.log(req.session.userId);
        res.render("landing", {session: req.session});
    });
}