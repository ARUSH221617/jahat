import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionString = process.env.DB_DATABASE_URL || `file:${path.join(process.cwd(), 'db', 'dev.db')}`

const adapter = new PrismaLibSql({ url: connectionString })

/**
 * The Prisma Client instance for database interactions.
 * In non-production environments, it reuses the existing connection to prevent multiple instances.
 */
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
