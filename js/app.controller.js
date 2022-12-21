import { locService } from './services/loc.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.panTo = panTo

function onInit() {
    initMap()
        .then(() => {
            renderLoc()
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

function renderLoc() {
    locService.getLocs()
        .then(locs => {
            let strHTML = locs.map(loc => `
        <tr>
        <td>${loc.name}</td>
        <td>${loc.createdAt}</td>
        <td>
            <button onclick="panTo(${loc.lat}, ${loc.lng})">Go</button>
            <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
        </td>
        </tr>

        `)
            document.querySelector('.locs tbody').innerHTML = strHTML.join('')
        })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo() {
    console.log('Panning the Map')
    panTo(35.6895, 139.6917)
}
function onRemoveLoc(locId) {
    locService.removeLoc(locId)
        .then(renderLoc)
}
// function onMoveToLoc(locId) {
//     locService.moveToLoc(locId)
//         .then(renderLoc)
// }

////////!MAP!///////////
// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })

            gMap.addListener("click", (mapsMouseEvent) => {
                const lat = mapsMouseEvent.latLng.toJSON().lat
                const lng = mapsMouseEvent.latLng.toJSON().lng
                locService.addLoc({ lat, lng })
                    .then(renderLoc)
            })

        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCj9jbmYp9q4hOBCC3i4e1PUZjRz6KcbqY'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}