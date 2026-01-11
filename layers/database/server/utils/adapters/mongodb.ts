/**
 * MongoDB Adapter
 */
import { MongoClient, Db, ObjectId } from 'mongodb'
import type { DatabaseAdapter, Document, QueryOptions } from '../../types'

let client: MongoClient | null = null
let db: Db | null = null

export function createMongoAdapter(uri: string, dbName?: string): DatabaseAdapter {
    const initClient = async () => {
        if (!client) {
            client = new MongoClient(uri)
            await client.connect()
            db = client.db(dbName)
        }
        return db!
    }

    const buildFilter = (where?: Record<string, any>): Record<string, any> => {
        if (!where) return {}

        const filter: Record<string, any> = {}
        for (const [field, value] of Object.entries(where)) {
            if (field === 'id') {
                filter._id = new ObjectId(value)
            } else {
                filter[field] = value
            }
        }
        return filter
    }

    const toDocument = (doc: any): Document => {
        const { _id, ...rest } = doc
        return { id: _id.toString(), ...rest }
    }

    return {
        async create(collection, data) {
            const database = await initClient()
            const result = await database.collection(collection).insertOne({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            return { id: result.insertedId.toString(), ...data }
        },

        async findById(collection, id) {
            const database = await initClient()
            const doc = await database.collection(collection).findOne({ _id: new ObjectId(id) })
            return doc ? toDocument(doc) : null
        },

        async findMany(collection, options) {
            const database = await initClient()
            let cursor = database.collection(collection).find(buildFilter(options?.where))

            if (options?.orderBy) {
                cursor = cursor.sort({ [options.orderBy.field]: options.orderBy.direction === 'asc' ? 1 : -1 })
            }

            if (options?.offset) {
                cursor = cursor.skip(options.offset)
            }

            if (options?.limit) {
                cursor = cursor.limit(options.limit)
            }

            const docs = await cursor.toArray()
            return docs.map(toDocument)
        },

        async findOne(collection, options) {
            const database = await initClient()
            const doc = await database.collection(collection).findOne(buildFilter(options?.where))
            return doc ? toDocument(doc) : null
        },

        async update(collection, id, data) {
            const database = await initClient()
            await database.collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: { ...data, updatedAt: new Date() } }
            )
            return this.findById(collection, id) as Promise<Document>
        },

        async delete(collection, id) {
            const database = await initClient()
            await database.collection(collection).deleteOne({ _id: new ObjectId(id) })
            return true
        },

        async count(collection, options) {
            const database = await initClient()
            return database.collection(collection).countDocuments(buildFilter(options?.where))
        },

        async createMany(collection, data) {
            const database = await initClient()
            const docs = data.map(d => ({
                ...d,
                createdAt: new Date(),
                updatedAt: new Date()
            }))

            const result = await database.collection(collection).insertMany(docs)
            return Object.values(result.insertedIds).map((id, i) => ({
                id: id.toString(),
                ...data[i]
            }))
        },

        async deleteMany(collection, options) {
            const database = await initClient()
            const result = await database.collection(collection).deleteMany(buildFilter(options?.where))
            return result.deletedCount
        }
    }
}
