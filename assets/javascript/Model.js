"use strict";
/* global GeoCoderAPI, JoobleAPI, Utility */

class Model {

    constructor() {

        this._geoCoderAPI = new GeoCoderAPI();

        this._joobleAPI = new JoobleAPI();

        this._jobs = [];
    }

    getJobsFromAPI(keywords, location, radius, salary) {

        let promise = this._joobleAPI.sendRequestToAPI(keywords, location, radius, salary);

        promise.then(() => {

            if (this._joobleAPI._isLastPageReached) {

                dispatchEvent(new CustomEvent("updateResults"));

                return;
            }

            if (this._joobleAPI.isNewSearch()) {

                this._jobs = [];
            }

            for (let apiJobOBJ of this._joobleAPI.getAPIResponseJobs()) {

                this._jobs.push(new Job(apiJobOBJ));
            }

            dispatchEvent(new CustomEvent("updateResults"));
        });
    }

    getAllJobsJSONForTable() {

        let jobsJSON = [];

        for (let job of this._jobs) {

            jobsJSON.push(job.getJobJSONForTable());
        }

        return jobsJSON;
    }

    getAllJobsForCarousel() {

        let carouselItems = [];

        for (let job of this._jobs) {

            carouselItems.push(job.getJobCarouselItem());
        }

        return carouselItems;
    }

    setZipCode() {

        this._geoCoderAPI.setUserLocation();
    }

    getZipCode() {

        return this._geoCoderAPI._zipCode;
    }
}


class Job {

    constructor(apiJobOBJ) {

        this._company = apiJobOBJ.company;
        this._link = apiJobOBJ.link;
        this._location = apiJobOBJ.location;
        this._salary = apiJobOBJ.salary;
        this._snippet = apiJobOBJ.snippet;
        this._source = apiJobOBJ.source;
        this._title = apiJobOBJ.title;
        this._type = apiJobOBJ.type;
        this._updated = apiJobOBJ.updated;

        this.setEmptyResults();
    }

    setEmptyResults() {

        if (typeof this._company === 'undefined' || this._company.length === 0) { 
            this._company = "---"; 
        }
        if (typeof this._link === 'undefined' || this._link.length === 0) {
            this._link = "---"; 
        }
        if (typeof this._location === 'undefined' || this._location.length === 0) { 
            this._location = "---"; 
        }
        if (typeof this._salary === 'undefined' || this._salary.length === 0) { 
            this._salary = "---"; 
        }
        if (typeof this._snippet === 'undefined' || this._snippet.length === 0) {
            this._snippet = "---"; 
        }
        if (typeof this._source === 'undefined' || this._source.length === 0) { 
            this._source = "---"; 
        }
        if (typeof this._title === 'undefined' || this._title.length === 0) { 
            this._title = "---"; 
        }
        if (typeof this._type === 'undefined' || this._type.length === 0) { 
            this._type = "---"; 
        }
        if (typeof this._updated === 'undefined' || this._updated.length === 0) { 
            this._updated = "---"; 
        }
    }

    getJobJSONForTable() {

        let jobJSON = [];

        const applyHereBTN = '<button id=\"applyBTN\" onclick=\"window.open(\'' + this._link + '\',\'_blank\')\">Apply</button>';

        const title = $("<span>").text(this._title).attr("style", "color: rgba(0,174,239,1.0);");

        jobJSON.push(title[0].outerHTML);
        jobJSON.push(this._location);
        jobJSON.push(this._company);
        jobJSON.push(this._salary);
        jobJSON.push(this._updated.substring(0, 10));  //Date only, remove time
        jobJSON.push(applyHereBTN + "<br>" + this._source);

        return jobJSON;
    }

    getJobCarouselItem() {

        const jobCarousel = $("<div>").addClass("carousel-item");

        const carouselCaption = $("<div>").addClass("carousel-caption d-none d-block");

        const slideHeading = $("<h1>").text(this._title);

        const location = $("<h6>").html("Location: &nbsp;&nbsp;" + this._location);

        const snippet = $("<p>").html("<p> Snippet: &nbsp;&nbsp;" + this._snippet + "</p>");

        const company = $("<h6>").html("Company: &nbsp;&nbsp;" + this._company);

        const applyHereBTN = '<button id=\"applyBTN\" onclick=\"window.open(\'' + this._link + '\',\'_blank\')\">Apply</button>';

        carouselCaption.append(slideHeading).append(location).append(company).append(snippet).append(applyHereBTN);

        jobCarousel.append(carouselCaption);

        return jobCarousel;
    }
}