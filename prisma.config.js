// prisma.config.js
module.exports = {
  schema: 'db/schema.prisma',
  datasource: {
    url: process.env.DB_DATABASE_URL || 'file:./db/dev.db',
  },
  migrations: {
    seed: 'tsx db/seed.ts',
  },
};
