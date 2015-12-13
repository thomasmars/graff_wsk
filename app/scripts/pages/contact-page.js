/**
 * Created by thoma_000 on 01.10.2015.
 */
define(['jquery', 'google-maps'], function ($) {

  var ContactPage = function () {
    this.initGoogleMap();
  };

  ContactPage.prototype.initGoogleMap = function () {
    // Init google maps
    var $map = $('.google-map');
    var mapOptions = {
      center: new google.maps.LatLng(69.6532027, 18.9602434),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var request = {
      placeId: 'ChIJSynjsFPExEURtEOBL_BSAmI'  // Graff Brygghus Storgata 101, 9008 Tromsø
    };

    var googleMap = new google.maps.Map($map.get(0), mapOptions);
    var infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(googleMap);
    service.getDetails(request, function (place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        // If the request succeeds, draw the place location on the map
        // as a marker, and register an event to handle a click on the marker.
        var marker = new google.maps.Marker({
          map: googleMap,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(googleMap, this);
        });
      }
    });
  };

  return ContactPage;

});
