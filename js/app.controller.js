import { locService } from './services/loc.service.js'

window.onload = onInit
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.panTo = panTo
window.onSearchLoc = onSearchLoc
window.onCopyLocation = onCopyLocation

function onInit() {
    const param = locService.getParam()
    if (param.get('lat') && param.get('lng')) {
        initMap(+param.get('lat'), +param.get('lng'))
            .then(() => {
                renderLoc()
                console.log('Map is ready')
            })
            .catch(() => console.log('Error: cannot init map'))
        return
    }
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
                <button onclick="panTo(${loc.lat},${loc.lng})">Go</button>
                <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
                </td>
            </tr>
        `)
            document.querySelector('.locs tbody').innerHTML = strHTML.join('')
        })
}

function onCopyLocation() {
    const url = locService.getUrl()
    navigator.clipboard.writeText(url)
}

function onSearchLoc(ev) {
    ev.preventDefault()
    locService.getLocBySearch(document.querySelector('.search-box').value)
        .then(loc => {
            panTo(loc.results[0].geometry.location.lat , loc.results[0].geometry.location.lng)
        })
    clearBoxSearch()
}

function clearBoxSearch() {
    document.querySelector('.search-box').value = ''
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
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

function onRemoveLoc(locId) {
    locService.removeLoc(locId)
        .then(renderLoc)
}


////////!MAP!///////////
var gMap
const API_KEY = 'AIzaSyD2BO1ZuhBV_3IMU5L1VTCoB_c0rRFCkcM'

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

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
    locService.setLoc(lat, lng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}