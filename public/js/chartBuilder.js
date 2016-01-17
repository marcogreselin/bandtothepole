var expCalData1 = [];
var expCalData2 = [];
var expDistData1 = [];
var expDistData2 = [];
var dates = [];

// runs at page load.
$(function(){
    getData1(expCalData1, expCalData2, expDistData1, expDistData2, dates, getData2);
});

// get data of explorer one from downloaded file
// callback: same for explorer 2
function getData1(expCalData1, expCalData2, expDistData1, expDistData2, date, callback) {


    $.getJSON('./data/expOneSummaryData.json',
        function (data) {

            for (var i = data.length - 1; i >= 0; i--) {

                dates.push(data[i].parentDay.substr(5, 5));

                if (data[i].caloriesBurnedSummary.hasOwnProperty('totalCalories')) {
                    expCalData1.push(data[i].caloriesBurnedSummary.totalCalories);
                } else {
                    expCalData1.push(0);
                }

                if (data[i].distanceSummary.hasOwnProperty('totalDistance')) {
                    expDistData1.push(data[i].distanceSummary.totalDistance / 100000);
                } else {
                    expDistData1.push(0);
                }

            }

            callback(expCalData1, expCalData2, expDistData1, expDistData2, date, setData);

        });
}

// gets data for explorer 2. 
// callback: drawing the chart
function getData2(expCalData1, expCalData2, expDistData1, expDistData2, dates, callback) {

    $.getJSON('./data/expTwoSummaryData.json',
        function (data) {

            for (var i = data.length - 1; i >= 0; i--) {

                if (data[i].caloriesBurnedSummary.hasOwnProperty('totalCalories')) {
                    expCalData2.push(data[i].caloriesBurnedSummary.totalCalories);
                } else {
                    expCalData2.push(0);
                }

                if (data[i].distanceSummary.hasOwnProperty('totalDistance')) {
                    expDistData2.push(data[i].distanceSummary.totalDistance / 100000);
                } else {
                    expDistData2.push(0);
                }
            }

            callback(expCalData1, expCalData2, expDistData1, expDistData2, dates, drawChart);

        });
}

// Function with things needed to draw the chart
// Callback is the function to draw the chart
function setData(CalDataHold1, CalDataHold2, DistDataHold1, DistDataHold2, date, callback) {

    var caloriesChartData = {
        labels: date,
        datasets: [
            {
                label: "James",
                fillColor: "rgba(34,34,34,0.2)",
                strokeColor: "rgba(34,34,34,1)",
                pointColor: "rgba(34,34,34,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(34,34,34,1)",
                data: CalDataHold1
            },
            {
                label: "Anita",
                fillColor: "rgba(39,128,227,0.2)",
                strokeColor: "rgba(39,128,227,1)",
                pointColor: "rgba(39,128,227,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(39,128,227,1)",
                data: CalDataHold2
            }
        ]
    };

    var distanceChartData = {
        labels: date,
        datasets: [
            {
                label: "Anita & James",
                fillColor: "rgba(39,128,227, 0.5)",
                strokeColor: "rgba(39,128,227,0.8)",
                highlightFill: "rgba(39,128,227,0.75)",
                highlightStroke: "rgba(39,128,227,1)",
                data: expDistData1
            },

            // anita commented out becuase irrelevant to compare
            // {
            //     label: "Anita",
            //     fillColor: "rgba(151,187,205,0.5)",
            //     strokeColor: "rgba(151,187,205,0.8)",
            //     highlightFill: "rgba(151,187,205,0.75)",
            //     highlightStroke: "rgba(151,187,205,1)",
            //     data: DistDataHold2
            // }
        ]
    };

    callback(caloriesChartData, distanceChartData);

}

// draws the function using the given specs
function drawChart(calData, distData) {

    var ctxCalories = document.getElementById("caloriesChart").getContext("2d");
    var caloriesLine = new Chart(ctxCalories).Line(calData, {
        responsive: true,
    });
    $("#legend").html(caloriesLine.generateLegend());
    console.log(caloriesLine.generateLegend())

    var ctxDistance = document.getElementById("distanceChart").getContext("2d");
    var distanceBar = new Chart(ctxDistance).Bar(distData, {
        responsive: true
    });


}

// Filter selectors
$("#james").click(function () {
    var caloriesChartData = {
        labels: dates,
        datasets: [
            {
                label: "James",
                fillColor: "rgba(34,34,34,0.2)",
                strokeColor: "rgba(34,34,34,1)",
                pointColor: "rgba(34,34,34,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(34,34,34,1)",
                data: expCalData1
            }
        ]
    };
    var ctxCalories = document.getElementById("caloriesChart").getContext("2d");
    var caloriesLine = new Chart(ctxCalories).Line(caloriesChartData, {
        responsive: true,
    });
    getHeartbeat(hb, heartbeatVal, nothing,'./data/expOneSummaryData.json');
    $("#rate-text").html("The average Heart Rate of James yesterday was:");
});

$("#anita").click(function () {
    var caloriesChartData = {
        labels: dates,
        datasets: [
            {
                label: "James",
                fillColor: "rgba(39,128,227,0.2)",
                strokeColor: "rgba(39,128,227,1)",
                pointColor: "rgba(39,128,227,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(39,128,227,1)",
                data: expCalData2
            }
        ]
    };
    var ctxCalories = document.getElementById("caloriesChart").getContext("2d");
    var caloriesLine = new Chart(ctxCalories).Line(caloriesChartData, {
        responsive: true
    });
    getHeartbeat(hb, heartbeatVal, nothing,'./data/expTwoSummaryData.json');
    $("#rate-text").html("The average Heart Rate of Anita yesterday was:");
});

$("#together").click(function () {
var caloriesChartData = {
        labels: dates,
        datasets: [
            {
                label: "James",
                fillColor: "rgba(34,34,34,0.2)",
                strokeColor: "rgba(34,34,34,1)",
                pointColor: "rgba(34,34,34,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(34,34,34,1)",
                data: expCalData1
            },
            {
                label: "Anita",
                fillColor: "rgba(39,128,227,0.2)",
                strokeColor: "rgba(39,128,227,1)",
                pointColor: "rgba(39,128,227,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(39,128,227,1)",
                data: expCalData2
            }
        ]
    };
    var ctxCalories = document.getElementById("caloriesChart").getContext("2d");
    var caloriesLine = new Chart(ctxCalories).Line(caloriesChartData, {
        responsive: true
    });
    getHeartbeat(hb, heartbeatVal, nothing,'./data/expTwoSummaryData.json');
    $("#rate-text").html("The average Heart Rate of Anita yesterday was:");
});

/*
The heart beat section
*/

// HB in bpm
var heartbeatVal = 0;
// HB for animation
var hb = 0;

function getHeartbeat(hb, heartbeatVal, callback, path) {

    $.getJSON(path,

        function (data) {

            if (data[0].heartRateSummary.hasOwnProperty('averageHeartRate')) {
                heartbeatVal = (data[0].heartRateSummary.averageHeartRate);

            } else {
                heartbeatVal = 80;
            }

            hb = (heartbeatVal / 60 * 1000) / 2;
            document.getElementById("heartValue").innerHTML = heartbeatVal + "bpm";
console.log(path);
            callback(hb);
        });
}


// Animation heartbeat / cortana logo.
function heartbeat(hb) {
    if ($(window).width() <= 991) {
        (function pulse(back) {
            $('#seventyfive').animate(
                {
                    'font-size': '0px',
                    'padding-left': (back) ? '20px' : '0px',
                    'padding-top': (back) ? '20px' : '0px',
                    'padding-right': (back) ? '20px' : '0px',
                    'padding-bottom': (back) ? '20px' : '0px',
                    opacity: (back) ? 1 : 0.5,
                    margin: '0px'
                }, hb, function () {
                    pulse(!back);
                });
            $('#seventyfive img').animate(
                {
                    'width': (back) ? '70px' : '90px',
                    'height': (back) ? '70px' : '90px',
                    margin: '0px'
                }, hb);
        })(false);
    } else {
        (function pulse(back) {
            $('#seventyfive').animate(
                {
                    'font-size': '110px',
                    'padding-left': (back) ? '10px' : '0px',
                    'padding-top': (back) ? '10px' : '0px',
                    'padding-right': (back) ? '10px' : '0px',
                    'padding-bottom': (back) ? '10px' : '0px',
                    opacity: (back) ? 1 : 0.5
                }, hb, function () {
                    pulse(!back);
                });
            $('#seventyfive img').animate(
                {
                    'width': (back) ? '120px' : '140px',
                    'height': (back) ? '120px' : '140px'
                }, hb);
        })(false);
    }
}
// the following is used in case together is selected due to browser constraints
function nothing(){}

// Calls the function that finds the HB.
// callback the function that generated the animation
getHeartbeat(hb, heartbeatVal, heartbeat,'./data/expOneSummaryData.json')