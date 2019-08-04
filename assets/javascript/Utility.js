"use strict";
/* global moment */

class Utility {

    static createPromise(waitCondition) {

        const poll = (resolve) => {

            if (waitCondition()) {

                resolve();
            }
            else {

                setTimeout(() => poll(resolve), 100);
            }
        };

        return new Promise(poll);
    }

    static isJobTitleInValid(jobTitle) {

        if (jobTitle.length < 3) {

            return true;
        }

        if (!isNaN(jobTitle)) {  //So it is a number (all characters are numbers)

            return true;
        }

        return false;
    }

    static isLocationInValid(location) {

        if (location.length < 2) {

            return true;
        }

        if (!isNaN(location)) {  //So it is a number (all characters are numbers)

            if (location.length !== 5) {  //validates that it is a correct zip code

                return true;
            }
        }

        if (location.length === 2) {

            let locationUpper = location.toUpperCase();

            let states = ["AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA",
                "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT",
                "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC",
                "SD", "TN", "TX", "UM", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];

            if (!states.includes(locationUpper)) {

                return true;
            }
        }

        return false;
    }

    static isRadiusInValid(radius) {

        //check if all characters are numbers as parseInt() will generate a number if the first charaters in a string are numbers (even if followed with letters)
        if (isNaN(radius)) {

            return true;
        }

        //parse it as an Integer now
        radius = parseInt(radius);

        const isRadiusNumber = typeof radius === 'number';

        if (!isRadiusNumber || isNaN(radius)) {

            return true;
        }

        const acceptableRadius = [5, 10, 15, 25, 50];

        if (!acceptableRadius.includes(radius)) {

            return true;
        }

        return false;
    }

    static isSalaryInValid(salary) {

        //check if all characters are numbers as parseInt() will generate a number if the first charaters in a string are numbers (even if followed with letters)
        if (isNaN(salary)) {

            return true;
        }

        //parse it as an Integer now
        salary = parseInt(salary);

        const isSalaryNumber = typeof salary === 'number';

        if (!isSalaryNumber || isNaN(salary)) {

            return true;
        }

        const acceptableSalaryMin = 33500;
        const acceptableSalaryMax = 200000;

        if (salary < acceptableSalaryMin || salary > acceptableSalaryMax) {

            return true;
        }

        return false;
    }
}

// @ts-ignore
const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
const isEdge = navigator.userAgent.indexOf("Edge") > -1;
// @ts-ignore
const isChrome = !!window.chrome && !isOpera && !isEdge;
// @ts-ignore
const isExplorer = typeof document !== 'undefined' && !!document.documentMode && !isEdge;
// @ts-ignore
const isFirefox = typeof window.InstallTrigger !== 'undefined';
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);