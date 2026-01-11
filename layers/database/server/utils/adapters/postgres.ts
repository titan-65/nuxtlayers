/**
 * PostgreSQL / Neon Adapter
 * Works with any PostgreSQL database including Neon
 */
import { Pool, PoolConfig } from 'pg'
import type { DatabaseAdapter, Document, QueryOptions } from '../../types'

let pool: Pool | null = null

export function createPostgresAdapter(connectionString: string): DatabaseAdapter {
    if (!pool) {
        pool = new Pool({ connectionString })
    }

    const buildWhereClause = (where?: Record<string, any>): { clause: string; values: any[] } => {
        if (!where || Object.keys(where).length === 0) {
            return { clause: '', values: [] }
        }

        const conditions: string[] = []
        const values: any[] = []
        let paramIndex = 1

        for (const [field, value] of Object.entries(where)) {
            conditions.push(`"${field}" = $${paramIndex}`)
            values.push(value)
            paramIndex++
        }

        return { clause: `WHERE ${conditions.join(' AND ')}`, values }
    }

    return {
        async create(collection, data) {
            const fields = Object.keys(data)
            const values = Object.values(data)
            const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ')

            const result = await pool!.query(
                `INSERT INTO "${collection}" (${fields.map(f => `"${f}"`).join(', ')}, "created_at") 
                 VALUES (${placeholders}, NOW()) 
                 RETURNING *`,
                values
            )

            return result.rows[0] as Document
        },

        async findById(collection, id) {
            const result = await pool!.query(
                `SELECT * FROM "${collection}" WHERE "id" = $1`,
                [id]
            )

            return result.rows[0] || null
        },

        async findMany(collection, options) {
            const { clause, values } = buildWhereClause(options?.where)
            let query = `SELECT * FROM "${collection}" ${clause}`

            if (options?.orderBy) {
                query += ` ORDER BY "${options.orderBy.field}" ${options.orderBy.direction.toUpperCase()}`
            }

            if (options?.limit) {
                query += ` LIMIT ${options.limit}`
            }

            if (options?.offset) {
                query += ` OFFSET ${options.offset}`
            }

            const result = await pool!.query(query, values)
            return result.rows as Document[]
        },

        async findOne(collection, options) {
            const results = await this.findMany(collection, { ...options, limit: 1 })
            return results[0] || null
        },

        async update(collection, id, data) {
            const fields = Object.keys(data)
            const values = Object.values(data)
            const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ')

            const result = await pool!.query(
                `UPDATE "${collection}" 
                 SET ${setClause}, "updated_at" = NOW() 
                 WHERE "id" = $${fields.length + 1} 
                 RETURNING *`,
                [...values, id]
            )

            return result.rows[0] as Document
        },

        async delete(collection, id) {
            await pool!.query(
                `DELETE FROM "${collection}" WHERE "id" = $1`,
                [id]
            )
            return true
        },

        async count(collection, options) {
            const { clause, values } = buildWhereClause(options?.where)
            const result = await pool!.query(
                `SELECT COUNT(*) FROM "${collection}" ${clause}`,
                values
            )
            return parseInt(result.rows[0].count, 10)
        },

        async createMany(collection, data) {
            const docs: Document[] = []
            for (const item of data) {
                const doc = await this.create(collection, item)
                docs.push(doc)
            }
            return docs
        },

        async raw(query) {
            const result = await pool!.query(query.sql, query.params)
            return result.rows
        }
    }
}
