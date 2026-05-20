"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config.json"));
const sequelize_1 = require("sequelize");
const account_model_1 = __importDefault(require("../accounts/account.model"));
const refresh_token_model_1 = __importDefault(require("../accounts/refresh-token.model"));

const db = {};
exports.default = db;
initialize();

async function initialize() {
    const database = process.env.DB_NAME || config_json_1.default.database.database;
    const user     = process.env.DB_USER || config_json_1.default.database.user;
    const password = process.env.DB_PASSWORD || config_json_1.default.database.password;
    const host     = process.env.DB_HOST || config_json_1.default.database.host;
    const port     = parseInt(process.env.DB_PORT || config_json_1.default.database.port);

    const sequelize = new sequelize_1.Sequelize(database, user, password, {
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
    });

    await sequelize.authenticate();

    db.Account = (0, account_model_1.default)(sequelize);
    db.RefreshToken = (0, refresh_token_model_1.default)(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
}