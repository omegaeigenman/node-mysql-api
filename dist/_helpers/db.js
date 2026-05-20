"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config.json"));
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
const account_model_1 = __importDefault(require("../accounts/account.model"));
const refresh_token_model_1 = __importDefault(require("../accounts/refresh-token.model"));
const db = {};
exports.default = db;
initialize();
async function initialize() {

    const database = process.env.DB_NAME || config.database.database;
    const user = process.env.DB_USER || config.database.user;
    const password = process.env.DB_PASSWORD || config.database.password;
    const host = process.env.DB_HOST || config.database.host;
    const port = process.env.DB_PORT || config.database.port;

    const sequelize = new Sequelize(
        database,
        user,
        password,
        {
            host,
            port,
            dialect: 'mysql',

            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },

            logging: false
        }
    );

    await sequelize.authenticate();

    db.Account = AccountModel(sequelize);
    db.RefreshToken = RefreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
}
