// prisma.config.js
module.exports = {
  schema: 'db/schema.prisma',
  datasource: {
    url: process.env.DB_DATABASE_URL || process.env.DATABASE_URL,
  },
};
