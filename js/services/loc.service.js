import { storageService } from './async-storage.service.js'

export const locService = {
    getLocs,
    query,
    get,
    remove,
    save,
    getEmptyPet,
    getFilterBy,
    setFilterBy
}


const LOC_KEY = 'locDB'


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function addLoc(loc) {
    if (loc.id) {
        return storageService.put(PET_KEY, loc)
    } else {
        return storageService.post(LOC_KEY,loc)
    }
}



function addLoc(loc) {
    if (loc.id) {
        return storageService.put(PET_KEY, loc)
    } else {
        return storageService.post(LOC_KEY,loc)
    }
}

// GET לך תביא
// REMOVE למחוק
// SAVE לשמור
// PUT לעדכן
// POST להוסיף
