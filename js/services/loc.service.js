import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    addLoc
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
    loc.createdAt = new Date
    if (loc.id) return storageService.put(LOC_KEY, loc)
    else return storageService.post(LOC_KEY, loc)
}


// GET לך תביא
// REMOVE למחוק
// SAVE לשמור
// PUT לעדכן
// POST להוסיף
