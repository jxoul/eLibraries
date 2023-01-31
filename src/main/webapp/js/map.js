//Markers
var map;
const zoom = 11;

function forMap() {
  $("#map-btn").on("click", showMap);
}

function showMap() {
  var lat = $("#lat").val();
  var lon = $("#lon").val();
  var addr = $("#address").val();

  $("#map").prop("hidden");

  map = new OpenLayers.Map("map");
  var mapLayer = new OpenLayers.Layer.OSM();
  map.addLayer(mapLayer);
  var markers = new OpenLayers.Layer.Markers("Markers");
  map.addLayer(markers);
  var position = setPosition(lat, lon);
  var mar = new OpenLayers.Marker(position);
  markers.addMarker(mar);
  mar.events.register("mousedown", mar, function (evt) {
    handler(position, addr);
  });
  map.setCenter(position, zoom);
}

function setPosition(lat, lon) {
  var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
  var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position = new OpenLayers.LonLat(lon, lat).transform(
    fromProjection,
    toProjection
  );
  return position;
}

function handler(position, message) {
  var popup = new OpenLayers.Popup.FramedCloud(
    "Popup",
    position,
    null,
    message,
    null,
    true
  );
  map.addPopup(popup);
}
