/* global bootbox*/
$(document).ready(function(){
    // Referencing article container div we will be rendering all articles into.
    var articleContainer = $(".article-container");
    // Adding event listeners for dynamically generated buttons for deleting article notes
    // pulling up article notes, saving, and deleting notes.
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    // InitPage kicks off when page is loaded.
    initPage();

    function initPage() {
        // Empty article container, run AJAX req for any saved headlines.
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data){
            // If we have headlines, render then to page
            if (data && data.length) {
                renderArticles(data);
            } else {
                // Otherwise render a message explaining no articles
                renderEmpty();
            }
        });
    }

    // This function handles appending HTML containing our article data to the page
    function renderArticles(articles) {
        var articlePanels = [];
        // Looping through array of JSON containting all available articles in db
        for (var i = 0; i < articles.length; i ++) {
            articlePanels.push(createPanel(articles[i]));
        }
        // Once we have all of the HTML for the articles stored in array
        // append them to the articlePanels container
        articleContainer.append(articlePanels);
    }

    //This function takes in a single JSON object for an article/headline
    // it constructs a jquery element containting all of the formatted HTML for the article panel
    function createPanel(article) {
        var panel =
        $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a class='btn btn-danger delete'>",
            "Delete from Saved",
            "</a>",
            "<a class='btn btn-info notes'>Article Notes</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
            ].join(""));
            // We attach the articles id to the jQuery element
            // We will use this when trying to figure out which article the user wants to remove or open
            // notes for
        panel.data("_id", article._id);
        // We return the constructed panel jQuery element
        return panel;
    }

    // This function renders some HTML to the page explaing we dont have any articles to view
    // Useing a joined array of HTML string data because its easer to read.
    function renderEmpty() {
        var emptyAlert =
        $(["<div class='alert alert-warning text-center'>",
            "<h4>Uh oh, looks like we dont have any saved articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>Would you like to browse available articles?</3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a href='/'>Browse Articles</a></h4>",
            "</div>",
            "</div>"
            ].join(""));
            // Appending this data to the page.
            articleContainer.append(emptyAlert);
    }
   
    // This function handles rendering note list items to our noes modal
    // Setting up an array of notes to render after finished
    // Also setting up a currentNote variale to temporarily store each note
    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            //If no notes leave user a message.
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            // If notes, go through each one.
            for (var i = 0; i < data.notes.length; i++){
                currentNote = $([
                    //Build a li element to contain our noteText and delete button
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class=='btn btn-danger note-delete'>X</button>",
                    "</li>"
                ].join(""));
                //Store the note id on the delete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                // Add current note to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        //Now append the notesToRender to the note-container inside the note modal.
        $(".note-container").append(notesToRender);
    }

    //This function handles deleting article/headlines
    function handleArticleDelete() {
        // We grab the id of the article to delete from the panel element the delete button sits inside.
        var acrticleToDelete = $(this).parents(".panel").data();
        // Using a delete method
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + acrticleToDelete._id
        }).then(function(data){
            // If this works out run initpage again which will render our saved list.
            if (data.ok) {
                initPage
            }
        });
    }
     //This function handles opening the notes modal and displaying notes
     // We grab the id of the aricle to get notes from the panel element.

     function handleArticleNotes() {
         var currentArticle = $(this).parents(".panel").data();
         // Grab any notes with this headline/article id.
         $.get("/api/notes/" + currentArticle._id).then(function(data){
             //Construct notes modal
             var modalText = [
                 "<div class='container-fluid text-center'>",
                 "<h4>Notes For Articles: ",
                 currentArticle._id,
                 "</h4>",
                 "<hr />",
                 "<ul class='list-group note-container'>",
                 "</ul>",
                 "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                 "<button class='btn btn-success save'>Save Note</button>",
                 "</div>"
                ].join("");
                // Adding the formatted HTML to the note modal
                bootbox.dialog({
                    message: modalText,
                    closeButton: true
                });
                var noteData = {
                    _id: currentArticle._id,
                    notes: data || []
                };
                // Adding some info about the article and article notes to the save button for easy access.
                //When trying to add a new note
                $(".btn.save").data("article", noteData);
                //renderNoteList will populate with actual note inside of the modal.
                renderNotesList(noteData);
         });
     }

     //This funcion handles what happens when a user tries to save a new note from article.
     function handleNoteSave() {
          // Setting a variable to hold some formatted data about out note,
            //grabbing the note typed into the input box.
         var noteData;
         var newNote = $(".bootbox-body textarea").val().trim();
         // If we have daa typed into the note input format it
         // and post it to the "/api/notes" route.
         if (newNote) {
             noteData = {
                 _id: $(this).data("article")._id,
                 noteText: newNote
             };
             $.post("/api/notes", noteData).then(function(){
                 // when complete. close the modal
                 bootbox.hideAll();
             });
         }
     }

     //This function handles the deletetion of notes.
     function handleNoteDelete() {
         //First we grab the id of the note we want to delete
         // We stored this data on the delete button when we created it
         var noteToDelete = $(this).data("_id");
         //Perform an DELETE req to "/api/notes/" with the id of the note.
         $.ajax({
             url: "/api/notes/" + noteToDelete,
             method: "DELETE"
         }).then(function(){
             //When done hide the modal
             bootbox.hideAll();
         });
     }

});