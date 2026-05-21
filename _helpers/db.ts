import 'mysql2';
import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

initialize();

async function initialize() {
    // Prefer env vars (production / Vercel); fall back to config.json (local dev)
    const host     = process.env.DB_HOST     || config.database.host;
    const port     = parseInt(process.env.DB_PORT || String(config.database.port), 10);
    const user     = process.env.DB_USER     || config.database.user;
    const password = process.env.DB_PASSWORD || config.database.password;
    const database = process.env.DB_NAME     || config.database.database;
    const useSSL   = (process.env.DB_SSL || '').toLowerCase() === 'true';

    // Auto-create database only on local. Managed providers (Aiven, PlanetScale, etc.)
    // already have the database, and the user often lacks CREATE DATABASE privilege.
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
    ? {
        ssl: { require: true, rejectUnauthorized: false },
        connectTimeout: 8000  // fail fast instead of hanging
    }
    : { connectTimeout: 8000 },

    });

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();

}