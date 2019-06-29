//Bringing scrape function.
var scrape = require("../scripts/scrape");

//Bringing headlines and notes from controller.
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");



module.exports = router => {
    //Renders homepage
    router.get("/", function(req, res) {
        res.render("home");
    });

    //Renders saved.handlebars page
    router.get("/saved", function(req, res){
        res.render("saved");
    });
}