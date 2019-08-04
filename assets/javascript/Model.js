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

            if (this._joobleAPI.isNewSearch()) {

                this._jobs = [];
            }

            for (let apiJobOBJ of this._joobleAPI.getAPIResponseJobs()) {

                this._jobs.push(new Job(apiJobOBJ));
            }

            dispatchEvent(new CustomEvent("updateTable"));
        });
    }

    getAllJobsJSONForTable() {

        let jobsJSON = [];

        for (let job of this._jobs) {

            jobsJSON.push(job.getJobJSONForTable());
        }

        return jobsJSON;
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