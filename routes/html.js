module.exports = function(app) {
    app.get("/", function(req, res) {
        console.log(req.session.userId);
        res.render("landing", {session: req.session});
    });

    app.get("*", function(req, res) {
        console.log(req.session.userId);
        res.render("landing", {session: req.session});
    });
}