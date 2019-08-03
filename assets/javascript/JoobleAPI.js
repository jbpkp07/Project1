"use strict";
/* global Utility, joobleBackupData */

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

        //Very first search, or new search parameters, reset page back to 1
        if (this._joobleJSONRequest === null || !this._joobleJSONRequest.isSameRequest(keywords, location, radius, salary)) {

            this._joobleJSONRequest = new JoobleJSONRequest(keywords, location, radius, salary);

            this._isNewSearch = true;

            this._page = 1;
        }
        else {  //Exact same search parameters, now grab next page

            this._page++;

            //If existing apiResponse returned less than 20 jobs, reset page back to 1
            if (this._apiResponse.jobs.length < 20) {

                this._page = 1;
            }
        }

        const connection =
        {
            url: this._apiRoot + this._apiKey,
            method: "POST",
            data: this._joobleJSONRequest.getJSONAPIRequestOBJ(this._page)
        };

        this._areJobsConsumed = false;

        $.ajax(connection).then((response) => {
            
            this._apiResponse = response;
     
            this._areJobsConsumed = true;

        }).catch(() => {

            alert("Class:JoobleAPI:getJobsFromAPI Jooble API did not respond correctly");

            //Use offloaded jobs JSON data instead for presentation purposes. Jooble's API has had inconsistent uptime. Oh well...
            // @ts-ignore
            this._apiResponse = joobleBackupData;

            this._isNewSearch = true; //Treated as new search because we are using offloaded data.

            this._areJobsConsumed = true;
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

    getJSONAPIRequestOBJ(pageNumber) {

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
                page: pageNumber.toString()
            }
        );

        return request;
    }
}