//Tells page to load my html before my js.
$(document).ready(function(){
    
    //Adding event listeners.
   var articleContainer = $(".article-container");
   $(document).on("click", ".btn.save", handleArticleSave);
   $(document).on("click", ".scrape-new", handleArticleScrape);

   //Once page is ready run initPage function to start.
   initPage();

   function initPage() {
       //Empty articles container, run AJAX req for any unsaved headlines.
       articleContainer.empty();
       $.get("/api/headline?saved=false")
       .then(function(data){
           //If we have headlines, render to page
           if (data && data.length) {
               renderArticles(data);
           }
           else {
               //otherwise render a messae explaining no articles.
               renderEmpty();
           }
       });
   }

   function renderArticles(articles) {
       //This function handles appending HTML containting article data to page.
       //Passing array of JSON of all available articles in db
       var articlesPanels = [];
       //We pass each article JSON object to the createPanel function which returns Bootstrap
       //panel with article data inside.
       for (var i = 0; i < articles.length; i ++){
           articlesPanels.push(createPanel(articles[i]));
       }
       //Once we have HTML for articles stored in array
       //append them to articlesPanel container.
       articleContainer.append(articlesPanels);
   }

   //function takes in a single JSON object for an article/headline
   //Constructs a jquery element containing all of the formatted HTML for the
   //article panel
   function createPanel(article){
    var panel = 
        $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
        ].join(""));
        panel.data("_id", article._id);
        return panel;
   }

   //This function renders HTML to page explainging we dont have any new articles.
   function renderEmpty() {
       var emptyAlert = 
       $(["<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What would you like to do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping new articles</a><h4>",
        "<h4><a href='/saved'>Go to Saved articles</a></h4>",
        "</div>",
        "</div>"
        ].join(""));
        //Appending this data to page
        articleContainer.append(emptyAlert);
   }

   // This function is triggered when user wantes to save article.
   function handleArticleSave(){
       //Rendering article to the element useing .data method.
       var articleToSave = $(this).parents(".panel").data();
       articleToSave.saved = true;
       // Using patch method to update existing records in collection.
       $.ajax({
           method: "PATCH",
            url: "/api/headline",
            data: articleToSave
       })
       .then(function(data){
           // If successful, mongoose will send back an object 
           // containing a key of "ok" with the value of 1 ("true")
           if (data.ok) {
               initPage();
           }
       });
   }

    // This function handles the user clicking "scrape new article" button.
   function handleArticleScrape() {
       $.get("/api/fetch")
       .then(function(data){
           // If we are able to scrape compare articles already in collection
           // and let user know how many unique articles we are able to save
           initPage();
           bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
       });
   }

});