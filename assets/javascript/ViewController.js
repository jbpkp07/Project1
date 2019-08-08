"use strict";
/* global Model, Utility */

class ViewController {

    constructor() {

        this._model = new Model();

        this._header = $("#header");

        this._techinLogoBigWrapper = $("#techinLogoBigWrapper");
        this._techinLogoBigIMG = $("#techinLogoBig");
        this._techinLogoIMG = $("#techinLogo");
        this._jobTitleInput = $("#jobTitleInput");
        this._jobLocationInput = $("#jobLocationInput");
        this._jobLocationIcon = $("#locationIcon");
        this._jobRadiusInput = $("#jobRadiusInput");
        this._jobSalaryInput = $("#jobSalaryInput");

        this._searchIcon = $("#searchIcon");
        this._searchJobsSubmitBtn = $("#searchJobsSubmitBtn");

        this._jobTitleValue = null;
        this._locationValue = null;
        this._radiusValue = null;
        this._salaryValue = null;

        this._switchWrapper = $("#switchWrapper");
        this._resultsSwitch = $("#resultsSwitch");
        this._currentResultsViewType = "Carousel";

        this._loading = $("#loading");

        this._jobResultsTBLWrapper = $("#jobResultsTBLWrapper");
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
                { title: "Posted" },
                { title: "Link" }
            ],
            columnDefs: [
                { targets: "_all", className: 'dt-center' }
            ]
        });

        this._jobsCarouselContainer = $("#jobsCarouselContainer");
        this._jobsCarousel = $("#jobs-carousel");
        this._carouselIndicators = $("#carousel-indicators");
        this._carouselInner = $("#carousel-inner");

        this._isStartCompleted = false;

        this.startSequence();

        this.assignInputListeners();

        this.assignZipCodeListeners();

        this.assignUpdateResultsListener();
    }

    startSequence() {

        this.showBigLogo().then(() => {

            setTimeout(() => {

                this.slideBigLogo().then(() => {

                    this.showLogo();
                    
                    this.showHeader().then(() => {

                        this.hideBigLogo();

                        this.showJobTitleInput();

                        this.showJobLocationInput();

                        this.showLocationIcon();

                        this.showJobRadiusInput();

                        this.showJobSalaryInput();

                        this.showSearchIcon();

                        this._jobTitleInput.focus();
                    });
                });

            }, 500);
        });
    }

    assignInputListeners() {

        this._techinLogoIMG.click(() => {

            this.resetInputValues();
        });

        this._searchJobsSubmitBtn.click((event) => {

            event.preventDefault();

            if (this.isAllInputValid()) {

                this.hideResultsSwitch();

                this.hideResultsCarousel();

                this.hideResultsTable().then(() => {

                    if (!this._isStartCompleted) {

                        this.slideHeaderUp().then(() => {

                            this._isStartCompleted = true;
                        });

                        setTimeout(() => {

                            this.showLoadingIndicator();

                            this._model.getJobsFromAPI(this._jobTitleValue, this._locationValue, this._radiusValue, this._salaryValue);

                        }, 500);  //Delay allows header to clear before loading indicator displays
                    }
                    else {

                        this.showLoadingIndicator();

                        this._model.getJobsFromAPI(this._jobTitleValue, this._locationValue, this._radiusValue, this._salaryValue);
                    }
                });
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

        this._resultsSwitch.click(() => {

            const previousValue = this._resultsSwitch.val();

            if (previousValue === "Carousel") {

                this._currentResultsViewType = "Table";

                this._resultsSwitch.val("Table");
            }
            else {

                this._currentResultsViewType = "Carousel";

                this._resultsSwitch.val("Carousel");
            }

            this.showCurrentResultsViewType();
        });
    }

    assignZipCodeListeners() {

        this._jobLocationIcon.mouseenter(() => {

            this.showActiveLocationIcon();
        });

        this._jobLocationIcon.mouseleave(() => {

            this.showInActiveLocationIcon();
        });

        this._jobLocationIcon.click(() => {

            this._model.setZipCode();
        });

        addEventListener("zipCodeReady", () => {

            const zipCode = this._model.getZipCode().toString();

            this._jobLocationInput.val(zipCode);

            this._jobLocationInput.focus();

            this.isAllInputValid();
        });
    }

    assignUpdateResultsListener() {

        addEventListener("updateResults", () => {

            let promise = Utility.createPromise(() => this._isStartCompleted === true);

            promise.then(() => {

                setTimeout(() => {

                    this.hideLoadingIndicator().then(() => {

                        this.reDrawTable();

                        this.reDrawCarousel();

                        this.showResultsSwitch();

                        this.showCurrentResultsViewType();
                    });

                }, 1500);
            });
        });
    }

    reDrawTable() {

        const jobsJSON = this._model.getAllJobsJSONForTable();

        this._jobResultsDataTable.clear().rows.add(jobsJSON).draw(false);
    }

    reDrawCarousel() {

        const carouselItems = this._model.getAllJobsForCarousel();

        this._carouselInner.empty();

        this._carouselIndicators.empty();

        for (let i = 0; i < carouselItems.length; i++) {

            this._carouselInner.append(carouselItems[i]);

            $('<li id="jobCarouselIndicator" data-target="#jobs-carousel" data-slide-to="' + i + '"></li>').appendTo(this._carouselIndicators);
        }

        $('.carousel-item').first().addClass('active');
        $('.carousel-indicators > li').first().addClass('active');
    }

    showCurrentResultsViewType() {

        if (this._currentResultsViewType === "Carousel") {

            this.hideResultsTable().then(() => {

                this.showResultsCarousel();
            });
        }
        else {

            this.hideResultsCarousel().then(() => {

                this.showResultsTable();
            });
        }
    }

    gatherAllInputValues() {

        this._jobTitleValue = this._jobTitleInput.val().toString().trim();
        this._locationValue = this._jobLocationInput.val().toString().trim();
        this._radiusValue = this._jobRadiusInput.val().toString().trim();
        this._salaryValue = this._jobSalaryInput.val().toString().trim();
    }

    resetInputValues() {

        this._jobTitleInput.val("");
        this._jobLocationInput.val("");
        this._jobRadiusInput.val("50");
        this._jobSalaryInput.val("33500");

        this.resetInputValidation();
    }

    resetInputValidation() {

        this.removeValidationStyle(this._jobTitleInput);
        this.removeValidationStyle(this._jobLocationInput);
        this.removeValidationStyle(this._jobRadiusInput);
        this.removeValidationStyle(this._jobSalaryInput);

        this.showInActiveSearchIcon();
    }

    isAllInputValid() {

        this.gatherAllInputValues();

        let isValid = true;

        if (this._jobTitleValue.length === 0 && this._locationValue.length === 0) {

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

    showActiveLocationIcon() {

        this._jobLocationIcon.attr("src", "./assets/images/locationIcon_Active.png");
    }

    showInActiveLocationIcon() {

        this._jobLocationIcon.attr("src", "./assets/images/locationIcon_Inactive.png");
    }

    showActiveSearchIcon() {

        this._searchIcon.attr("src", "./assets/images/searchIcon_Active.png");
    }

    showInActiveSearchIcon() {

        this._searchIcon.attr("src", "./assets/images/searchIcon_Inactive.png");
    }

    removeValidationStyle(element) {

        element.css("border", "");
    }

    markAsValidStyle(element) {

        element.css("border", "2px solid rgba(42,252,156,1.0)");
    }

    markAsInValidStyle(element) {

        element.css("border", "2px solid rgba(251,103,105,1.0)");
    }

    showLoadingIndicator() {

        this._loading.fadeTo(500, 1.0);
    }

    hideLoadingIndicator() {

        return this._loading.fadeTo(250, 0.0).promise();
    }

    showResultsTable() {

        this._jobResultsTBLWrapper.fadeIn(500);
    }

    hideResultsTable() {

        return this._jobResultsTBLWrapper.fadeOut(250).promise();
    }

    showResultsCarousel() {

        this._jobsCarouselContainer.fadeIn(500);
    }

    hideResultsCarousel() {

        return this._jobsCarouselContainer.fadeOut(250).promise();
    }

    showBigLogo() {

        return this._techinLogoBigWrapper.fadeTo(1500, 1.0).promise();
    }

    slideBigLogo() {

        const toTop = this._techinLogoIMG.offset().top;
        const toLeft = this._techinLogoIMG.offset().left;

        const fromLeft = this._techinLogoBigIMG.offset().left;

        this._techinLogoBigIMG.attr("style", "position: fixed; left: " + Math.floor(fromLeft) + "px;");

        return this._techinLogoBigIMG.animate({ width: "164px", height: "60px", top: toTop, left: toLeft }, 750).promise();
    }

    hideBigLogo() {

        this._techinLogoBigIMG.hide(0);
    }

    showHeader() {

        return this._header.fadeTo(500, 1.0).promise();
    }

    slideHeaderUp() {

        return this._header.animate({ top: '0%' }, 750).promise();
    }

    showLogo() {

        this._techinLogoIMG.fadeTo(0, 1.0);
        // this._techinLogoIMG.animate({ top: "21.5%", opacity: "1.0" }, 750);
    }

    showJobTitleInput() {

        this._jobTitleInput.animate({ width: "25%", opacity: "1.0" }, 750);
    }

    showJobLocationInput() {

        this._jobLocationInput.animate({ width: "25%", opacity: "1.0" }, 750);
    }

    showLocationIcon() {

        this._jobLocationIcon.fadeTo(750, 1.0);
    }

    showJobRadiusInput() {

        this._jobRadiusInput.animate({ width: "13%", opacity: "1.0" }, 750);
    }

    showJobSalaryInput() {

        this._jobSalaryInput.animate({ width: "15%", opacity: "1.0" }, 750);
    }

    showSearchIcon() {

        this._searchIcon.fadeTo(250, 1.0);
    }

    showResultsSwitch() {

        this._switchWrapper.fadeTo(500, 1.0);
    }

    hideResultsSwitch() {

        this._switchWrapper.fadeTo(250, 0.0);
    }
}