require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  development: {
    url: process.env.DATABASE_URL
  },
  test: {
    url: process.env.DATABASE_URL?.replace(/_development/, '_test')
  }
}