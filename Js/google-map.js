var geocoder;
var map;
/*
function initialize(lat,lon,id,address_summary) {
    geocoder = new google.maps.Geocoder();

    var mapOptions = {zoom:14,center:new google.maps.LatLng(lat,lon),mapTypeId: google.maps.MapTypeId.ROADMAP};
    
    map = new google.maps.Map(document.getElementById(id), mapOptions);
    marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(lat,lon)});
    infowindow = new google.maps.InfoWindow({content: address_summary });
    google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});infowindow.open(map,marker);
    
}
*/
function showStoreMap(address_summary,lat,lon, id) {
   // initialize(lat,lon,id,address_summary);

    geocoder = new google.maps.Geocoder();

    var mapOptions = {zoom:14,center:new google.maps.LatLng(lat,lon),mapTypeId: google.maps.MapTypeId.ROADMAP};
    
    map = new google.maps.Map(document.getElementById(id), mapOptions);
    marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(lat,lon)});
    infowindow = new google.maps.InfoWindow({content: address_summary });
    google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});infowindow.open(map,marker);

    /*var address = address_summary; //"";//document.getElementById('address').value;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });*/
}

google.maps.event.addDomListener(window, 'onclick', showStoreMap);