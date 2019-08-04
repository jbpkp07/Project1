"use strict";
/* global Model, Utility */

class ViewController {

    constructor() {

        this._model = new Model();

        this._jobResultsTBL = $("#jobResultsTBL");

        // @ts-ignore
        this._jobResultsDataTable = this._jobResultsTBL.DataTable({

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

        this._searchIcon = $("#searchIcon");
        this._searchJobsSubmitBtn = $("#searchJobsSubmitBtn");

        this._jobTitleValue = null;
        this._locationValue = null;
        this._radiusValue = null;
        this._salaryValue = null;

        this.assignInputListeners();

        this.assignUpdateTableListener();

        this.assignZipCodeListener();

        // this._model.setZipCode();
    }

    assignInputListeners() {

        this._searchJobsSubmitBtn.click((event) => {

            event.preventDefault();

            if (this.isAllInputValid()) {

                // this.resetInputValidation();

                this._model.getJobsFromAPI(this._jobTitleValue, this._locationValue, this._radiusValue, this._salaryValue);
            }
        });

        this._jobTitleInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._jobTitleValue.length === 0) {

                this.removeValidationStyle(this._jobTitleInput);    
            }
            else if (Utility.isJobTitleInValid(this._jobTitleValue)) {

                this.markAsInValidStyle(this._jobTitleInput);
            }
            else {

                this.markAsValidStyle(this._jobTitleInput);
            }

            this.isAllInputValid();
        });

        this._jobLocationInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._locationValue.length === 0) {

                this.removeValidationStyle(this._jobLocationInput);
            }
            else if (Utility.isLocationInValid(this._locationValue)) {

                this.markAsInValidStyle(this._jobLocationInput);
            }
            else {

                this.markAsValidStyle(this._jobLocationInput);
            }

            this.isAllInputValid();
        });

        this._jobRadiusInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._radiusValue.length === 0) {

                this.removeValidationStyle(this._jobRadiusInput);
            }
            else if (Utility.isRadiusInValid(this._radiusValue)) {

                this.markAsInValidStyle(this._jobRadiusInput);
            }
            else {

                this.markAsValidStyle(this._jobRadiusInput);
            }

            this.isAllInputValid();
        });

        this._jobSalaryInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._salaryValue.length === 0) {

                this.removeValidationStyle(this._jobSalaryInput);
            }
            else if (Utility.isSalaryInValid(this._salaryValue)) {

                this.markAsInValidStyle(this._jobSalaryInput);
            }
            else {

                this.markAsValidStyle(this._jobSalaryInput);
            }

            this.isAllInputValid();
        });
    }

    assignUpdateTableListener() {

        addEventListener("updateTable", () => {

            const jobsJSON = this._model.getAllJobsJSONForTable();

            this._jobResultsDataTable.clear().rows.add(jobsJSON).draw(false);
        });
    }

    assignZipCodeListener() {

        addEventListener("zipCodeReady", () => {

            const zipCode = this._model.getZipCode().toString();
    
            this._jobLocationInput.val(zipCode);
        });
    }

    gatherAllInputValues() {

        this._jobTitleValue = this._jobTitleInput.val().toString().trim();
        this._locationValue = this._jobLocationInput.val().toString().trim();
        this._radiusValue = this._jobRadiusInput.val().toString().trim();
        this._salaryValue = this._jobSalaryInput.val().toString().trim();
    }

    resetInputValidation() {

        this.removeValidationStyle(this._jobTitleInput);
        this.removeValidationStyle(this._jobLocationInput);
        this.removeValidationStyle(this._jobRadiusInput);
        this.removeValidationStyle(this._jobSalaryInput);

        // this._jobTitleInput.val("");
        // this._jobLocationInput.val("");
        // this._jobRadiusInput.val("");
        // this._jobSalaryInput.val("");

        this.showInActiveSearchIcon();
    }

    isAllInputValid() {

        this.gatherAllInputValues();

        let isValid = true;

        if (this._jobTitleValue.length === 0 && this._locationValue.length === 0) { //&& this._radiusValue.length === 0 && this._salaryValue.length === 0) {

            this.resetInputValidation();

            return false;
        }

        if (Utility.isJobTitleInValid(this._jobTitleValue)) {

            this.markAsInValidStyle(this._jobTitleInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobTitleInput);
        }

        if (Utility.isLocationInValid(this._locationValue)) {

            this.markAsInValidStyle(this._jobLocationInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobLocationInput);
        }

        if (Utility.isRadiusInValid(this._radiusValue)) {

            this.markAsInValidStyle(this._jobRadiusInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobRadiusInput);
        }

        if (Utility.isSalaryInValid(this._salaryValue)) {

            this.markAsInValidStyle(this._jobSalaryInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobSalaryInput);
        }

        if (isValid) {

            this.showActiveSearchIcon();
        }
        else {

            this.showInActiveSearchIcon();
        }

        return isValid;
    }

    showActiveSearchIcon() {

        this._searchIcon.attr("src", "./assets/images/searchIcon_Active.png");
    }

    showInActiveSearchIcon() {

        this._searchIcon.attr("src", "./assets/images/searchIcon_Inactive.png");
    }

    removeValidationStyle(element) {

        element.attr("style", "");
    }

    markAsValidStyle(element) {

        element.attr("style", "border: 2px solid rgba(42,252,156,1.0);");
    }

    markAsInValidStyle(element) {

        element.attr("style", "border: 2px solid rgba(251,103,105,1.0);");
    }
}