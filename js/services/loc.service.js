import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    addLoc,
    removeLoc,
    getLocBySearch,
    getUrl,
    getParam,
    setLoc
}


let gLat
let gLng
const API_KEY = 'AIzaSyD2BO1ZuhBV_3IMU5L1VTCoB_c0rRFCkcM'
const LOC_KEY = 'locDB'

function getLocBySearch(place) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${API_KEY}`).then((res) => res.json())
}

function getParam() {
    return new URLSearchParams(window.location.search)
}

function setLoc(lat, lng) {
    gLat = lat
    gLng = lng
}

function getUrl() {
        return `https://shanianconina.github.io/travel-tip/?lat=${gLat}&lng=${gLng}`
}


function getLocs() {
    return storageService.query(LOC_KEY)
}

function addLoc(loc) {
    loc.name = prompt('Enter the location name')
    loc.createdAt = getTime()
    if (loc.id) return storageService.put(LOC_KEY, loc)
    else return storageService.post(LOC_KEY, loc)
}

function removeLoc(locId) {
    return storageService.remove(LOC_KEY, locId)

}

function getTime() {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()

    return today = dd + '/' + mm + '/' + yyyy;
}