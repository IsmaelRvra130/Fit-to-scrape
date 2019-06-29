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
    
    //Fetching all articles from api/fetch
    router.get("/api/fetch", function(req, res){
        headlinesController.fetch(function(err, docs){

            //If no new articles send a message
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles today. Check back tomorrow!"
                });
            } // If new articles add a message
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!!"
                });
            }
        });
    });
    
    //Getting all the headlines in db
    router.get("/api/headlines", function(req, res){
        var query = {};
            //If user saved article
        if (req.query.saved) {
            query = req.query;
        }
            //If no articles saved, send everything.
        headlinesController.get(query, function(data){
            res.json(data);
        });
    });

    //Deletes specific article by id
    router.delete("/api/headlines/:id", function(req, res){
        var query = {};
        query.id = req.params.id;
        headlinesController.delete(query, function(err, data){
            res.json(data);
        });
    });

    //Update headlines.
    router.patch("/api/headlines", function(req, res){
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });

    //Gets notes from associated headline
    router.get("/api/notes/:headlines_id?", function(req, res){
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headlines_id;
        }

        notesController.get(query, function(err, data){
            res.json(data);
        });
    });

    //Deletes notes
    router.delete("/api/notes/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });

    //Post new notes to articles.
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });

}