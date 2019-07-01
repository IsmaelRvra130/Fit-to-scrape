//Bringing in our scrape script to makeDate.
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//Bring in the Headline and Note mongoose models.
var Headline = require("../models/Headline");

module.exports = {
    //function to fetch and scrape articles to make a date and set saved to false.
    fetch: function(cb) {
        scrape(function(data) {
            var articles = data;
            for (var i = 0; i < articles.length; i++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            //mongo inserting articles into Headline in db
            Headline.collection.insertMany(articles, {ordered:false}, function(err, docs){
                cb(err, docs);
            });
        });
    },
    // function to delete article
    delete: function(query, cb) {
        Headline.remove(query, cb);
    },
    // Get Items and sort from most recent to less recent.
    get: function(query, cb) {
        Headline.find(query)
        .sort({
            _id:-1
        })
        .exec(function(err, doc){
            cb(doc);
        });
    },
    //updates articles
    update: function(query, cb) {
        Headline.update({_id: query._id}, {
            $set: query
        }, {}, cb);
    }

};