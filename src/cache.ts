import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb'

const STORE_NAME = 'spotLabel'
const dbP = openDB(STORE_NAME, 1, {
  upgrade(db) {
    db.createObjectStore('cache')
  },
}).catch()

export const setValue = (key: string, value: Record<string, any>) =>
  dbP.then(db => db.put('cache', value, key))

export const getValue = (key: string) => dbP.then(db => db.get('cache', key))
export const clearCache = () => deleteDB(STORE_NAME)

Object.assign(window, {
  getValue,
  setValue,
  clearCache,
})
