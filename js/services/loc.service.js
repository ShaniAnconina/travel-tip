import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    addLoc,
    removeLoc,
}


const LOC_KEY = 'locDB'


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

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


// GET לך תביא
// REMOVE למחוק
// SAVE לשמור
// PUT לעדכן
// POST להוסיף
