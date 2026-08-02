/**
 * DataProvider — the interface both adapters implement. JSDoc-only (no runtime).
 *
 * @typedef {Object} QueryOptions
 * @property {Array<[string, string, any]>} [filters] - e.g. [['subsidiary','==','ACS']]
 * @property {[string, 'asc'|'desc']} [orderBy]
 * @property {number} [limit]
 *
 * @typedef {Object} DataProvider
 * @property {(resource: string, opts?: QueryOptions) => Promise<any[]>}      list
 * @property {(resource: string, id: string|number) => Promise<any>}          get
 * @property {(resource: string, data: object, id?: string) => Promise<any>}  create
 * @property {(resource: string, id: string|number, data: object) => Promise<any>} update
 * @property {(resource: string, id: string|number) => Promise<void>}         remove
 * @property {(resource: string, opts: QueryOptions) => Promise<any[]>}       query
 * @property {(path: string, file: File) => Promise<string>}                  uploadFile
 * @property {(name: string, payload?: object) => Promise<any>}               callFunction
 */

export const PROVIDERS = { FIREBASE: 'firebase', DJANGO: 'django' };
