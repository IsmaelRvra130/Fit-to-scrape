//Dependencies
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://www.orlandoweekly.com/",function(err, res, body){
        var $ = cheerio.load(body);
        var articles = [];
        $("div.latestTsr").each(function(i, element){
            var head = $(this)
            .children()
            .children("h3")
            .text();
            var sum = $(this)
            .children()
            .children(".byline")
            .text();

            if (head && sum) {
                var headNeat = head.replace(/(\r\n\|\n|\r|\t|\s+)/gm," ").trim();
                var sumNeat = sum.replace(/(\r\n\|\n|\r|\t|\s+)/gm," ").trim();

                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };
                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;