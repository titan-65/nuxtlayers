/**
 * Firebase Firestore Adapter
 */
import { getFirestore } from 'firebase-admin/firestore'
import type { DatabaseAdapter, Document, QueryOptions } from '../../types'

export function createFirebaseAdapter(): DatabaseAdapter {
    const db = getFirestore()

    const applyQuery = (ref: any, options?: QueryOptions) => {
        let query = ref

        if (options?.where) {
            for (const [field, value] of Object.entries(options.where)) {
                query = query.where(field, '==', value)
            }
        }

        if (options?.orderBy) {
            query = query.orderBy(options.orderBy.field, options.orderBy.direction)
        }

        if (options?.limit) {
            query = query.limit(options.limit)
        }

        if (options?.offset) {
            query = query.offset(options.offset)
        }

        return query
    }

    return {
        async create(collection, data) {
            const docRef = await db.collection(collection).add({
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            return { id: docRef.id, ...data }
        },

        async findById(collection, id) {
            const doc = await db.collection(collection).doc(id).get()
            if (!doc.exists) return null
            return { id: doc.id, ...doc.data() } as Document
        },

        async findMany(collection, options) {
            const query = applyQuery(db.collection(collection), options)
            const snapshot = await query.get()
            return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        },

        async findOne(collection, options) {
            const results = await this.findMany(collection, { ...options, limit: 1 })
            return results[0] || null
        },

        async update(collection, id, data) {
            await db.collection(collection).doc(id).update({
                ...data,
                updatedAt: new Date().toISOString()
            })
            return this.findById(collection, id) as Promise<Document>
        },

        async delete(collection, id) {
            await db.collection(collection).doc(id).delete()
            return true
        },

        async count(collection, options) {
            const query = applyQuery(db.collection(collection), options)
            const snapshot = await query.count().get()
            return snapshot.data().count
        },

        async createMany(collection, data) {
            const batch = db.batch()
            const docs: Document[] = []

            for (const item of data) {
                const ref = db.collection(collection).doc()
                batch.set(ref, {
                    ...item,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                docs.push({ id: ref.id, ...item })
            }

            await batch.commit()
            return docs
        }
    }
}
