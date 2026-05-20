"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_handler_1 = __importDefault(require("./_middleware/error-handler"));
const accounts_controller_1 = __importDefault(require("./accounts/accounts.controller"));
const swagger_1 = __importDefault(require("./_helpers/swagger"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}));
app.use('/accounts', accounts_controller_1.default);
app.use('/api-docs', swagger_1.default);
app.use(error_handler_1.default);
// Only call listen() in local dev — Vercel uses the exported app
if (process.env.NODE_ENV !== 'production') {
    const port = 4000;
    app.listen(port, () => console.log('Server listening on port ' + port));
}
exports.default = app;
