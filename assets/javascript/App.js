"use strict";
/* global ViewController */

class App {

    constructor() {

        this._viewController = null;
    }

    startApp() {
    
        this._viewController = new ViewController();
    }
}


// $(document).ready(function () {


//     $("#search-btn").on("click", function () {
//         console.log("here");
//         var inputKeyword = $("#keyword-input").val().trim();
//         var inputLocation = $("#location-input").val().trim();

//         $.ajax({
//             url: "https://us.jooble.org/api/90cb62a5-06c3-4da7-984e-5203f2c4e6cf",
//             method: "POST",
//             data: JSON.stringify({
//                 keywords: inputKeyword,
//                 location: inputLocation,
//             })
//         }).then(function (response) {
//             console.log(response.jobs)

//             for (let i = 0; i < response.jobs.length; i++) {
//                 var jobsBox = $("<div>");
//                 jobsBox.addClass("border border-secondary");
//                 jobsBox.attr("id", "jobsBox");

//                 var jobTitle = $("<p>");
//                 jobTitle.text("Title : " + response.jobs[i].title);

//                 var jobLocation = $("<p>");
//                 jobLocation.text("Location : " + response.jobs[i].location);

//                 var snippet = $("<p>");
//                 snippet.html("Snippet : " + response.jobs[i].snippet);

//                 var link = $("<a>");
//                 link.attr('href', response.jobs[i].link)
//                 link.html(response.jobs[i].link);

//                 var applyHere = $("<button>");
//                 applyHere.addClass("applyBtn btn btn-primary");
//                 applyHere.text("Apply Here");
                
                

//                 jobsBox.append(jobTitle).append(jobLocation).append(snippet).append(applyHere);

//                 $("#results-display").prepend(jobsBox);
//             }


//         })

//     });
// });