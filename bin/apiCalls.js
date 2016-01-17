/**
 * Created by lukmaan on 12/9/15.
 */

// Modules
var fs = require('fs');
var request = require('request');

// Variables required for authentication
var clientID = "000000004C173F9C";
var redirectURL = "https://login.live.com/oauth20_desktop.srf";
var clientSecret = "teleimScpiCfqxiDGl9b6CYFGy9MZoBG";

// These are tokens generated after the user gives us permissions logging in with MSA.
var expOneToken = {
    refreshToken: "" // enter first token here
}
var expTwoToken = {
    refreshToken: "" // enter second token here
}

// Variables for API call parameters
var startTime = "2015-12-27T23%3A00%3A00.000Z";
var endTime = "2016-01-04T23%3A00%3A00.000Z";
var period = "Daily";

// Variables for API call options
var summaryCall = "https://api.microsofthealth.net/v1/me/Summaries/" + period + "?startTime=" + startTime + "&endTime=" + endTime;
var activityCall = "https://api.microsofthealth.net/v1/me/Activities/?startTime=" + startTime + "&endTime=" + endTime + "&activityIncludes=Details,MapPoints&activityTypes=Run";

// We need a new set of tokens every time using the refresh token before making the call.
// Called in www
// There are two types of callType, the two URL above. For further pages, the nextPage is used.
var refreshingToken = function(callType, filename, token) {

    var myData = [];

    request({
        url: 'https://login.live.com/oauth20_token.srf?client_id=' + clientID + '&redirect_uri=' + redirectURL + '&client_secret=' + clientSecret + '&refresh_token=' + token.refreshToken + '&grant_type=refresh_token',
        method: 'GET'
    }, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log("got access token:");
            var data = JSON.parse(body);
            console.log(token.refreshToken);
            token.refreshToken = data.refresh_token;
            console.log(token.refreshToken);
            var accessToken = data.access_token;

            function requestData() {


                console.log("Requesting data.")
                request({
                    url: callType,
                    method: 'GET',
                    headers: {
                        'Authorization': 'bearer ' + accessToken
                    }
                }, function(error, response, body) {
                    if (error) {
                        console.log(error);
                    } else {

                        console.log(JSON.parse(body).nextPage);

                        if (JSON.parse(body).hasOwnProperty('summaries')) {

                            myData.push.apply(myData, JSON.parse(body).summaries);

                            if (JSON.parse(body).hasOwnProperty("nextPage")) {

                                callType = JSON.parse(body).nextPage;
                                requestData();
                                console.log(callType);


                            } else {
                                fs.writeFileSync(filename, JSON.stringify(myData));
                                console.log("Summaries data written to file");
                            }

                        } else if (JSON.parse(body).hasOwnProperty('runActivities')) {

                            myData.push.apply(myData, JSON.parse(body).runActivities);

                            if (JSON.parse(body).hasOwnProperty("nextPage")) {

                                callType = JSON.parse(body).nextPage;
                                requestData();
                                console.log(callType);


                            } else {
                                fs.writeFileSync(filename, JSON.stringify(myData));
                                console.log("Activities data written to file");
                            }
                        }
                    }
                })
            };

            requestData()

        }
    });
};

// Various exports
module.exports.refreshingToken = refreshingToken;
module.exports.summaryCall = summaryCall;
module.exports.activityCall = activityCall;
module.exports.expOneToken = expOneToken;
module.exports.expTwoToken = expTwoToken;