// マップの初期設定
var map = L.map('map').setView([35.165482, 136.905170], 15);

const googleMap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
  attribution: "<a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>"
});
const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "<a href='https://www.openstreetmap.org/' target='_blank'>Open Street Map</a>"
});
googleMap.addTo(map);

var famima_icon = L.icon({ iconUrl: 'famima_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
var lawson_icon = L.icon({ iconUrl: 'lawson_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
var seveneleven_icon = L.icon({ iconUrl: 'seven_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
var nadiaPark_icon = L.icon({ iconUrl: 'garage_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });

function createMarker(latlng, icon, tooltipText, destination) {
  return L.marker(latlng, { icon: icon })
    .bindTooltip(tooltipText, { permanent: false, direction: 'top' })
    .bindPopup("<b>" + tooltipText + "</b><br><button onclick='startRoutingTo(" + JSON.stringify(destination) + ")'>ここへいく</button>", {
      closeButton: true,
      autoClose: false
    });
}

const markers = {
  famima: createMarker([35.170485, 136.905915], famima_icon, "ファミマ: ペットボトル、缶", [35.170485, 136.905915]),
  lawson: createMarker([35.175485, 136.910915], lawson_icon, "ローソン: プラスチック、瓶", [35.175485, 136.910915]),
  sevenEleven: createMarker([35.180485, 136.915915], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.180485, 136.915915]),
  nadiaPark: createMarker([35.165482, 136.905170], nadiaPark_icon, "ナディアパーク: 一般ゴミ", [35.165482, 136.905170])
};

var markersClusterGroup = L.markerClusterGroup();

let currentLat, currentLon;
function locate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        map.setView(new L.LatLng(currentLat, currentLon), 15);
        L.marker([currentLat, currentLon]).addTo(map).bindPopup("あなたの位置").openPopup();
        showAllMarkers();
      },
      function() {
        alert("現在地を取得できませんでした。");
      }
    );
  } else {
    alert("このブラウザでは現在地取得がサポートされていません。");
  }
}

function showAllMarkers() {
  Object.values(markers).forEach(marker => markersClusterGroup.addLayer(marker));
  map.addLayer(markersClusterGroup);

  // 全てのボタンをアクティブ化
  document.getElementById("famimaButton").classList.add("active");
  document.getElementById("lawsonButton").classList.add("active");
  document.getElementById("sevenElevenButton").classList.add("active");
}

var routeControl;
function startRoutingTo(destination) {
  if (routeControl) {
    map.removeControl(routeControl);
  }
  routeControl = L.Routing.control({
    waypoints: [L.latLng(currentLat, currentLon), L.latLng(destination[0], destination[1])],
    createMarker: function() { return null; }
  }).addTo(map);
  document.getElementById("removeRouteButton").style.display = "block";
}

function removeRoute() {
  if (routeControl) {
    map.removeControl(routeControl);
    document.getElementById("removeRouteButton").style.display = "none";
  }
}

function toggleMarkerSet(button, setName) {
  button.classList.toggle("active");
  const isActive = button.classList.contains("active");
  const marker = markers[setName];
  if (isActive) {
    markersClusterGroup.addLayer(marker);
    map.addLayer(markersClusterGroup);
  } else {
    markersClusterGroup.removeLayer(marker);
  }
}

function showGoogleMap() {
  openStreetMap.remove();
  googleMap.addTo(map);
}

function showOpenStreetMap() {
  googleMap.remove();
  openStreetMap.addTo(map);
}

document.addEventListener("DOMContentLoaded", () => {
  locate();
});
