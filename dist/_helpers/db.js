const config = require('../config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // Prefer env vars (production); fall back to config.json (local dev)
    const host     = process.env.DB_HOST     || config.database.host;
    const port     = parseInt(process.env.DB_PORT || config.database.port, 10);
    const user     = process.env.DB_USER     || config.database.user;
    const password = process.env.DB_PASSWORD || config.database.password;
    const database = process.env.DB_NAME     || config.database.database;
    const useSSL   = (process.env.DB_SSL || '').toLowerCase() === 'true';

    // Auto-create DB only on local (managed DBs already have the database)
    if (!useSSL) {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
    }

    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        dialectOptions: useSSL
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {},
        pool: { max: 2, min: 0, idle: 10000 } // small pool — Vercel is serverless
    });

    // Models — adjust to match your existing model files
    const Account      = require('../accounts/account.model')(sequelize);
    const RefreshToken = require('../accounts/refresh-token.model')(sequelize);

    Account.hasMany(RefreshToken, { onDelete: 'CASCADE' });
    RefreshToken.belongsTo(Account);

    db.Account = Account;
    db.RefreshToken = RefreshToken;

    await sequelize.sync({ alter: true });
}
