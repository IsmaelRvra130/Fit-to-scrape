//Require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");


//Set up port.
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
var router = express.Router();

require("./config/routes")(router); 
//Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));

//Connect handlebars to express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//Use bodyParser in app
app.use(bodyParser.urlencoded({
    extended: false
}));

//Have every request go through router middleware
app.use(router);
//Use morgan logger got loggin requests
app.use(logger("dev"));

//if deployted, use the deployed db. otherwise use the local mongodb
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//Connect mongoose to our db
mongoose.connect(db, function(error){
    if (error) {
        console.log(error);
    } else {
        console.log("mongoose connection is successful");
    }
});
//Port engaged.
app.listen(PORT, function() {
    console.log("Engaged on port:" + PORT);
})