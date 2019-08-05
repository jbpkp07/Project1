"use strict";
/* global Utility, H */

class GeoCoderAPI {

    constructor() {

        this._APIConnectionOBJ = 
        {
            "app_id": "757glFXSECswLKpQnUvY",
            "app_code": "awv7DrKyPmij6xLUXh7OYg"
        };

        // @ts-ignore
        this._platform = new H.service.Platform(this._APIConnectionOBJ);

        this._geocoder = this._platform.getGeocodingService();

        this._latitude = null;
        this._longitude = null;
        this._zipCode = null;
    }

    setUserLocation() {

        if (this._zipCode === null) {

            this.getLatLongFromBrowser().then(() => {

                this.reverseGeocode();
            });
        }
        else {

            dispatchEvent(new CustomEvent("zipCodeReady"));
        }
    }

    getLatLongFromBrowser() {

        let hasAcquiredLatLong = false;

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition((position) => {
      
                this._latitude = position.coords.latitude;
                this._longitude = position.coords.longitude;

                hasAcquiredLatLong = true;
            });
        }
        else {

            alert("Geolocation is not supported by this browser!");
        }

        return Utility.createPromise(() => hasAcquiredLatLong === true);
    }

    reverseGeocode() {

        if (this._latitude !== null && this._longitude !== null) {

            const queryOBJ =
            {
                mode: "retrieveAddresses",
                maxresults: 1,
                prox: this._latitude + "," + this._longitude
            };

            this._geocoder.reverseGeocode(

                queryOBJ, 

                (data) => { 

                    this._zipCode = data.Response.View[0].Result[0].Location.Address.PostalCode;
  
                    dispatchEvent(new CustomEvent("zipCodeReady"));
                }, 

                (error) => { console.error(error); }
            );
        }
    }
}