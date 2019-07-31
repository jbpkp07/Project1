"use strict";
/* global Model, Utility */

class ViewController {

    constructor() {

        this._model = new Model();

        this._jobResultsTBL = $("#jobResultsTBL");

        // @ts-ignore
        this._jobResults = this._jobResultsTBL.DataTable({

            "info": false,
            "pagingType": "numbers",
            columns: [
                { title: "Job Title" },
                { title: "Location" },
                { title: "Company" },
                { title: "Salary" },
                { title: "Type" },
                { title: "Source" },
                { title: "Snippet" },
                { title: "Updated" },
                { title: "Link" }
            ]
        });

        this._jobTitleInput = $("#jobTitleInput");
        this._jobLocationInput = $("#jobLocationInput");
        this._jobRadiusInput = $("#jobRadiusInput");
        this._jobSalaryInput = $("#jobSalaryInput");
        this._searchJobsSubmitBtn = $("#searchJobsSubmitBtn");

        this._tablePollFrequencyMS = 1000;
        this._isTablePollStarted = false;

        this.assignSubmitBtnListener();

        // this.updateSchedulePoll(this._tablePollFrequencyMS);
    }

    assignSubmitBtnListener() {

        this._searchJobsSubmitBtn.click((event) => {

            event.preventDefault();


            const jobTitle = this._jobTitleInput.val().toString().trim();
            const location = this._jobLocationInput.val().toString().trim();
            const radius = this._jobRadiusInput.val().toString().trim();
            const salary = this._jobSalaryInput.val().toString().trim();

            const isInputValid = this.isInputValid(jobTitle, location, radius, salary);

            if (isInputValid) {
      
                this.resetInputValidation();

                this._jobTitleInput.val("");
                this._jobLocationInput.val("");
                this._jobRadiusInput.val("");
                this._jobSalaryInput.val("");

                this._model.getJobsFromAPI(jobTitle, location, radius, salary).then(() => {

                    const jobsJSON = this._model.getJobsJSONForTable();

                    this._jobResults.clear().rows.add(jobsJSON).draw(false);
                });
            }
        });
    }

    resetInputValidation() {
        
        this._jobTitleInput.attr("style", "");
        this._jobLocationInput.attr("style", "");
        this._jobRadiusInput.attr("style", "");
        this._jobSalaryInput.attr("style", "");
    }

    isInputValid(jobTitle, location, radius, salary) {

        let isValid = true;

        if (jobTitle.length === 0 && location.length === 0 && radius.length === 0 && salary.length === 0) {

            this.resetInputValidation();

            return false;
        }

        if (Utility.isJobTitleInValid(jobTitle)) {

            this._jobTitleInput.attr("style", "border: 2px solid red;");

            isValid = false;
        }
        else {

            this._jobTitleInput.attr("style", "border: 2px solid green;");
        }

        if (Utility.isLocationInValid(location)) {

            this._jobLocationInput.attr("style", "border: 2px solid red;");

            isValid = false;
        }
        else {

            this._jobLocationInput.attr("style", "border: 2px solid green;");
        }

        if (Utility.isRadiusInValid(radius)) {

            this._jobRadiusInput.attr("style", "border: 2px solid red;");

            isValid = false;
        }
        else {

            this._jobRadiusInput.attr("style", "border: 2px solid green;");
        }

        if (Utility.isSalaryInValid(salary)) {

            this._jobSalaryInput.attr("style", "border: 2px solid red;");

            isValid = false;
        }
        else {

            this._jobSalaryInput.attr("style", "border: 2px solid green;");
        }

        return isValid;
    }













    // updateSchedulePoll(pollFrequencyMS) {

    //     if (!this._isTablePollStarted) {

    //         this._isTablePollStarted = true;

    //         setInterval(() => {

    //             // this._jobResults.clear().rows.add(this._model.getTrainsJSON()).draw(false);

    //         }, pollFrequencyMS);
    //     }
    // }

    // static removeTrain(key) {

    //     var event = new CustomEvent("removeBtnClicked", {

    //         detail: {
    //             databaseKey: key
    //         }
    //     });

    //     dispatchEvent(event);
    // }
}