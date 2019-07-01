//Bringing scrape function.
var scrape = require("../scripts/scrape");

//Bringing headlines and notes from controller.
var headlinesController = require("../controllers/headline");
var notesController = require("../controllers/note");



module.exports = function(router) {
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
    router.get("/api/headline", function(req, res){
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
    router.delete("/api/headline/:id", function(req, res){
        var query = {};
        query.id = req.params.id;
        headlinesController.delete(query, function(err, data){
            res.json(data);
        });
    });

    //Update headlines.
    router.patch("/api/headline", function(req, res){
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });

    //Gets notes from associated headline
    router.get("/api/note/:headline_id?", function(req, res){
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }

        notesController.get(query, function(err, data){
            res.json(data);
        });
    });

    //Deletes notes
    router.delete("/api/note/:id", function(req, res){
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });

    //Post new notes to articles.
    router.post("/api/note", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });

}