const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

module.exports = {
  dialect: 'mysql',
  host: DB_HOST,
  username: 'root',
  password: DB_PASS,
  database: 'meetup',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
