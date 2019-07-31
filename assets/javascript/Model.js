"use strict";
/* global Utility */

class Model {

    constructor() {

        this._joobleAPI = new JoobleAPI();
        this._jobs = [];
    }

    getJobsFromAPI(keywords, location, radius, salary) {

        let promise = this._joobleAPI.sendRequestToAPI(keywords, location, radius, salary);

        promise.then(() => {

            if (this._joobleAPI.isNewSearch()) {

                this._jobs = [];
            }

            for (let apiJobOBJ of this._joobleAPI.getAPIResponseJobs()) {

                this._jobs.push(new Job(apiJobOBJ));
            }
        });

        return promise;
    }

    getJobsJSONForTable() {

        let jobsJSON = [];

        for (let job of this._jobs) {

            jobsJSON.push(job.getJobJSON());
        }

        return jobsJSON;
    }
}


class JoobleAPI {

    constructor() {

        this._apiRoot = "https://us.jooble.org/api/";
        this._apiKey = "90cb62a5-06c3-4da7-984e-5203f2c4e6cf";

        this._joobleJSONRequest = null;
        this._page = 1;
        this._isNewSearch = false;

        this._apiResponse = null;
        this._areJobsConsumed = false;
    }

    sendRequestToAPI(keywords, location, radius, salary) {

        keywords = keywords.trim();
        location = location.trim();
        radius = radius.trim();
        salary = salary.trim();

        this._isNewSearch = false;

        if (this._joobleJSONRequest === null) {

            this._joobleJSONRequest = new JoobleJSONRequest(keywords, location, radius, salary);

            this._isNewSearch = true;
        }
        else if (!this._joobleJSONRequest.isSameRequest(keywords, location, radius, salary)) {

            this._joobleJSONRequest = new JoobleJSONRequest(keywords, location, radius, salary);

            this._isNewSearch = true;

            this._page = 1;
        }
        else {

            this._page++;
        }

        const connection =
        {
            url: this._apiRoot + this._apiKey,
            method: "POST",
            data: this._joobleJSONRequest.getJSONRequestOBJ(this._page)
        };

        this._areJobsConsumed = false;

        $.ajax(connection).then((response) => {

            this._apiResponse = response;

            if (this._apiResponse.jobs.length < 20) {

                this._page = 1;
            }

            this._areJobsConsumed = true;

        }).catch(() => {

            alert("Class:JoobleAPI:getJobsFromAPI Jooble API did not respond correctly");
            throw new Error("Class:JoobleAPI:getJobsFromAPI Jooble API did not respond correctly");
        });

        return Utility.createPromise(() => this._areJobsConsumed === true);
    }

    isNewSearch() {

        return this._isNewSearch;
    }

    getAPIResponseJobs() {

        return this._apiResponse.jobs;
    }
}


class JoobleJSONRequest {

    constructor(keywords, location, radius, salary) {

        this._keywords = keywords;
        this._location = location;
        this._radius = radius;
        this._salary = salary;
    }

    isSameRequest(keywords, location, radius, salary) {

        if (this._keywords !== keywords) { return false; }

        if (this._location !== location) { return false; }

        if (this._radius !== radius) { return false; }

        if (this._salary !== salary) { return false; }

        return true;
    }

    getJSONRequestOBJ(pageNumber) {

        if (pageNumber < 1) {

            alert("Class:JoobleJSONRequest:getJSONRequest page number supplied < 1");
            throw new Error("Class:JoobleJSONRequest:getJSONRequest page number supplied < 1");
        }

        const request = JSON.stringify(
            {
                keywords: this._keywords,
                location: this._location,
                radius: this._radius,
                salary: this._salary,
                page: pageNumber
            }
        );

        return request;
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

    getJobJSON() {

        let jobJSON = [];

        const applyHereBTN = '<button class=\"applyBTN\" onclick=\"window.open(\'' + this._link + '\',\'_blank\')\">Apply Here</button>';

        jobJSON.push(this._title);
        jobJSON.push(this._location);
        jobJSON.push(this._company);
        jobJSON.push(this._salary);
        jobJSON.push(this._type);
        jobJSON.push(this._source);
        jobJSON.push(this._snippet);
        jobJSON.push(this._updated);
        jobJSON.push(applyHereBTN);

        return jobJSON;
    }
}