function initMap() {
    // Sets the color specs for the map
    // from https://snazzymaps.com/style/42163/flat-clean-ice-greys
    var mapStyle = [{
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }, {
            "color": "#dd1a1a"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#d52121"
        }]
    }, {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [{
            "color": "#babdc8"
        }, {
            "visibility": "on"
        }]
    }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#e3e7f2"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }];
    // Instanciate map.
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {
            lat: 51.566,
            lng: 0.13
        },
        scrollwheel: false,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        styles: mapStyle
    });

    var datHold = [];

    setPath(datHold, map, function(data) {
        addPath(map, data, setInfowindows);
    });
}

// creates a dataHold object which will be used by Google Maps.
function setPath(dataHold, map, callback) {

    $.getJSON('./data/expOneActivityData.json',
        function(data) {

            dataHold = [];
            var LatLngListCenter = [];
            var LatLngListCenterCount = 0;

            for (var i = data.length - 1; i >= 0; i--) {

                if (data[i].hasOwnProperty('mapPoints')) {

                    for (var j = data[i].mapPoints.length - 1; j >= 0; j--) {

                        if (data[i].mapPoints[j].hasOwnProperty('location')) {


                            dataHold.push({

                                "lat": data[i].mapPoints[j].location.latitude / 10000000,
                                "lng": data[i].mapPoints[j].location.longitude / 10000000

                            })

                            console.log("test:" + i + ", " + j);
                            console.log(data[i].mapPoints[j].location.latitude / 10000000);
                            console.log(data[i].mapPoints[j].location.longitude / 10000000);

                            LatLngListCenter[LatLngListCenterCount] = new google.maps.LatLng(data[i].mapPoints[j].location.latitude / 10000000, data[i].mapPoints[j].location.longitude / 10000000);
                            LatLngListCenterCount++;

                            break;
                        }
                    }
                }
            }
            //from http://blog.shamess.info/2009/09/29/zoom-to-fit-all-markers-on-google-maps-api-v3/
            console.log(LatLngListCenter[1])
            var bounds = new google.maps.LatLngBounds();
            //  Go through each...
            // var LatLngListCenter = new Array (new google.maps.LatLng (52.537,-2.061), new google.maps.LatLng (52.564,-2.017));

            for (var i = 0, LtLgLen = LatLngListCenter.length; i < LtLgLen; i++) {
                //  And increase the bounds to take this point
                bounds.extend(LatLngListCenter[i]);
                console.log(LatLngListCenter[i]);
            }
            //  Fit these bounds to the map
            console.log(map)
            map.fitBounds(bounds);

            //NEW CENTER
            map.panBy(0, -115);
            callback(dataHold);



        }
    );


};

// the callback is commented in
// this adds a line and icons to the map
function addPath(map, expeditionCoordinates, callback) {

    console.log("adding");
    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
    };
    var trekLine = new google.maps.Polyline({
        path: expeditionCoordinates,
        geodisc: true,
        stokeColor: '#FF0000',
        strokeOpacity: 0,
        strokeWeight: 4,
        map: map,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '20px'
        }],
    });
    //trekLine.setMap(map);


    var markers = [];
    var infoWindows = [];
    var openIW=new google.maps.InfoWindow();

    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    var image = {
        url: 'img/flag.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };
    // Adds the boxes to each marker and close them if another is opened.
    for (var i = 0; i < expeditionCoordinates.length; i++) {

        infoWindow = new google.maps.InfoWindow({
            content: "Day " + (i + 1)
        });

        marker = new google.maps.Marker({
            position: expeditionCoordinates[i],
            map: map,
            icon: image,
            shape: shape,
            title: 'yes',
            zIndex: i,
            infoWindowIndex: i
        });

        google.maps.event.addListener(marker, 'click', 
            function(event)
            {
                infoWindows[this.infoWindowIndex].open(map, this);
                openIW.close();
                openIW=infoWindows[this.infoWindowIndex];

            });
        infoWindows.push(infoWindow);
        markers.push(marker);

        console.log("oh yes")

    }

    callback(markers, infowindows, expeditionCoordinates, map);

}


function setInfowindows(markers, infowindows, expeditionCoordinates, map) {
    // for (var i = 0; i < data.length; i++) {
    //     markers[i].addListener('click', function() {
    //         infowindows[i].open(map, markers[i]);
    //     });
    // }
}