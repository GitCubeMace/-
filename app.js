// マップの初期設定
var map = L.map('map').setView([35.165482, 136.905170], 15);

const googleMap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
  attribution: "<a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>"
});
const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "<a href='https://www.openstreetmap.org/' target='_blank'>Open Street Map</a>"
});
googleMap.addTo(map);

// 各種アイコンの定義
var famima_icon = L.icon({ iconUrl: 'famima_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
var lawson_icon = L.icon({ iconUrl: 'lawson_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
var seveneleven_icon = L.icon({ iconUrl: 'seven_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });
var nadiaPark_icon = L.icon({ iconUrl: 'garage_icon.jpg', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -38] });

// マーカー作成関数
function createMarker(latlng, icon, tooltipText, destination) {
  return L.marker(latlng, { icon: icon })
    .bindTooltip(tooltipText, { permanent: false, direction: 'top' })
    .bindPopup("<b>" + tooltipText + "</b><br><button onclick='startRoutingTo(" + JSON.stringify(destination) + ")'>ここへいく</button>", {
      closeButton: true,
      autoClose: false
    });
}

// マーカーリスト
const markers = {
  famima: [
    createMarker([35.16521695958036, 136.90443439331756], famima_icon, "ファミマ: ペットボトル、缶", [35.16521695958036, 136.90443439331756]),
    createMarker([35.16297713420172, 136.90985385993224], famima_icon, "ファミマ: ペットボトル、缶", [35.16297713420172, 136.90985385993224]),
    createMarker([35.16190599556575, 136.90594975275522], famima_icon, "ファミマ: ペットボトル、缶", [35.16190599556575, 136.90594975275522]),
    createMarker([35.16086982696549, 136.90168201186407], famima_icon, "ファミマ: ペットボトル、缶", [35.16086982696549, 136.90168201186407]),
    createMarker([35.1630709571074, 136.90961580592128], famima_icon, "ファミマ: ペットボトル、缶", [35.1630709571074, 136.90961580592128]),
    createMarker([35.16906151992464, 136.91176956375307], famima_icon, "ファミマ: ペットボトル、缶", [35.16906151992464, 136.91176956375307]),
    createMarker([35.16739972796713, 136.89885073488446], famima_icon, "ファミマ: ペットボトル、缶", [35.16739972796713, 136.89885073488446])
  ],
  lawson: [
    createMarker([35.16595745203772, 136.9050427475978], lawson_icon, "ローソン: プラスチック、瓶", [35.16595745203772, 136.9050427475978]),
    createMarker([35.16587221057314, 136.90275715574543], lawson_icon, "ローソン: プラスチック、瓶", [35.16587221057314, 136.90275715574543]),
    createMarker([35.16270792638545, 136.90820074594893], lawson_icon, "ローソン: プラスチック、瓶", [35.16270792638545, 136.90820074594893]),
    createMarker([35.16351216392319, 136.90874878981808], lawson_icon, "ローソン: プラスチック、瓶", [35.16351216392319, 136.90874878981808]),
    createMarker([35.16368319727152, 136.91093747237423], lawson_icon, "ローソン: プラスチック、瓶", [35.16368319727152, 136.91093747237423]),
    createMarker([35.16777333865704, 136.90483132711185], lawson_icon, "ローソン: プラスチック、瓶", [35.16777333865704, 136.90483132711185]),
    createMarker([35.15986291601836, 136.90186818848017], lawson_icon, "ローソン: プラスチック、瓶", [35.15986291601836, 136.90186818848017])
  ],
  sevenEleven: [
    createMarker([35.165725373166225, 136.9046162652689], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.165725373166225, 136.9046162652689]),
    createMarker([35.16563082048036, 136.90961477066048], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.16563082048036, 136.90961477066048]),
    createMarker([35.166967258649976, 136.90632576056274], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.166967258649976, 136.90632576056274]),
    createMarker([35.16756913247848, 136.90575165269746], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.16756913247848, 136.90575165269746]),
    createMarker([35.16659162428108, 136.90110281264984], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.16659162428108, 136.90110281264984]),
    createMarker([35.160553705103354, 136.9040092195649], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.160553705103354, 136.9040092195649]),
    createMarker([35.160260998586374, 136.90574925486104], seveneleven_icon, "セブンイレブン: プラスチック、瓶", [35.160260998586374, 136.90574925486104])
  ],
  nadiaPark: [
    createMarker([35.165482, 136.905170], nadiaPark_icon, "ナディアパーク: 一般ゴミ", [35.165482, 136.905170])
  ]
};

// マーカーのクラスタリング
var markersClusterGroup = L.markerClusterGroup();

// 現在地取得
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

// 全マーカー表示
function showAllMarkers() {
  markersClusterGroup.clearLayers();
  Object.values(markers).flat().forEach(marker => markersClusterGroup.addLayer(marker));
  map.addLayer(markersClusterGroup);

  // ボタンをすべてアクティブ化
  document.querySelectorAll(".filter-button").forEach(button => button.classList.add("active"));
}

// マーカー切替
function toggleMarkerSet(button, setName) {
  button.classList.toggle("active");
  const isActive = button.classList.contains("active");
  const markerSet = markers[setName];
  if (isActive) {
    markerSet.forEach(marker => markersClusterGroup.addLayer(marker));
  } else {
    markerSet.forEach(marker => markersClusterGroup.removeLayer(marker));
  }
  map.addLayer(markersClusterGroup);
}

// ルート案内
var routeControl;
function startRoutingTo(destination) {
  if (routeControl) {
    map.removeControl(routeControl);
  }
  routeControl = L.Routing.control({
    waypoints: [L.latLng(currentLat, currentLon), L.latLng(destination[0], destination[1])],
    createMarker: function() { return null; }
  }).addTo(map);

  // 縮尺をルート全体に合わせる
  const routeBounds = L.latLngBounds([
    [currentLat, currentLon],
    [destination[0], destination[1]]
  ]);
  map.fitBounds(routeBounds);

  document.getElementById("removeRouteButton").style.display = "block";
}

// ルート解除
function removeRoute() {
  if (routeControl) {
    map.removeControl(routeControl);
    document.getElementById("removeRouteButton").style.display = "none";
  }
}

// 地図切り替え
function showGoogleMap() {
  openStreetMap.remove();
  googleMap.addTo(map);
}
function showOpenStreetMap() {
  googleMap.remove();
  openStreetMap.addTo(map);
}

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  locate();
  showAllMarkers();
});