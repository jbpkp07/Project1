"use strict";
/* global Utility, joobleBackupData */

class JoobleAPI {

    constructor() {

        this._apiRoot = "https://cors-anywhere.herokuapp.com/https://us.jooble.org/api/";
        this._apiKeys = [];

        //API keys are only good for 500 requests, so we have some backups to extend usage ;-)
        this._apiKeys.push("3531ac66-d0c2-4e98-9aa2-ad8a5ac15f43"); //first attempt
        this._apiKeys.push("dfb10486-b958-4acd-bf42-d94fc3d27862"); //second attempt
        this._apiKeys.push("865766bc-4b97-4d89-ab0d-804949ff6e6d"); //third attempt
        this._apiKeys.push("90cb62a5-06c3-4da7-984e-5203f2c4e6cf"); //fourth attempt

        this._connectionAttempt = 0;

        this._joobleJSONRequest = null;
        this._page = 1;
        this._isNewSearch = false;
        this._isLastPageReached = false;

        this._apiResponse = null;
        this._areJobsConsumed = false;
    }

    sendRequestToAPI(keywords, location, radius, salary) {

        keywords = keywords.trim();
        location = location.trim();
        radius = radius.trim();
        salary = salary.trim();

        this._isNewSearch = false;
        this._isLastPageReached = false;

        //Very first search, or new search parameters, reset page back to 1
        if (this._joobleJSONRequest === null || !this._joobleJSONRequest.isSameRequest(keywords, location, radius, salary)) {

            this._joobleJSONRequest = new JoobleJSONRequest(keywords, location, radius, salary);

            this._isNewSearch = true;

            this._page = 1;
        }
        else {  //Exact same search parameters, now grab next page

            this._page++;

            //If existing apiResponse returned less than 20 jobs, reset page back to 1 and return (no additional results)
            if (this._apiResponse.jobs.length < 20) {

                this._page = 1;

                this._isLastPageReached = true;

                return Utility.createPromise(() => this._areJobsConsumed === true);
            }
        }

        this.postToAPI();

        return Utility.createPromise(() => this._areJobsConsumed === true);
    }

    postToAPI() {

        const connection =
        {
            url: this._apiRoot + this._apiKeys[this._connectionAttempt],
            method: "POST",
            data: this._joobleJSONRequest.getJSONAPIRequestOBJ(this._page)
        };

        this._areJobsConsumed = false;

        $.ajax(connection).then((response) => {
            
            this._apiResponse = response;
     
            this._connectionAttempt = 0;

            this._areJobsConsumed = true;

        }).catch(() => {

            if (this._connectionAttempt === this._apiKeys.length - 1) { //final attempt failed
  
                alert("Jooble API did not respond correctly after final attempt.\rLoading sample data likely unrelated to your search.");

                //Use offloaded jobs JSON data instead for presentation purposes. Jooble's API has had inconsistent uptime. Oh well...
                // @ts-ignore
                this._apiResponse = joobleBackupData;
    
                this._isNewSearch = true; //Treated as new search because we are using offloaded data.
    
                this._connectionAttempt = 0;

                this._areJobsConsumed = true;
            }
            else {

                console.log("Jooble API did not respond correctly. Re-trying with different API key.");
                
                this._connectionAttempt++;

                this.postToAPI();  //try again with different API key
            }
        });
    }

    isNewSearch() {

        return this._isNewSearch;
    }

    isLastPageReached() {

        return this._isLastPageReached;
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