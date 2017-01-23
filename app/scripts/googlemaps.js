function myMap() {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
        center: new google.maps.LatLng(-15.7876253,-47.9077034),
        zoom: 10
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
}
function init_map() {
    var var_location = new google.maps.LatLng(-15.7876253,-47.9077034);
    var var_mapoptions = {
        center: var_location,
        zoom: 16
    };
    var var_marker = new google.maps.Marker({
        position: var_location,
        map: var_map,
        title: "MPDFT"
    });
    var var_map = new google.maps.Map(document.getElementById("map-container"), var_mapoptions);
    var_marker.setMap(var_map);
}
google.maps.event.addDomListener(window, 'load', init_map);
