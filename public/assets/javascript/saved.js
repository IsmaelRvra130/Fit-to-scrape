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
            // If notes go through each one.
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
    

})