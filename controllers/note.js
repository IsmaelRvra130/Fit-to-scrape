//controller for our notes.

var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    // Gets all notes associated with articles
    get: function(data, cb) {
        Note.find({
            _headlineId: data._id
        }, cb);
    },
    // taking data from user and cb function
    save: function(data, cb) {
        var newNote = {
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
            //takes notes and creates one.
        Note.create(newNote, function(err,doc){
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },
    // Function to delete notes associated with article id
    delete: function(data, cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }
};