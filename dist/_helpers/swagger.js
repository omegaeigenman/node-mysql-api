"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });

const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const YAML = __importDefault(require("yamljs"));
const path = __importDefault(require("path"));
const express_1 = require("express");

const swaggerDocument = YAML.default.load(
    path.default.join(__dirname, "../swagger.yaml")
);

const router = (0, express_1.Router)();

router.use("/", swagger_ui_express_1.default.serve);

router.get(
    "/",
    swagger_ui_express_1.default.setup(swaggerDocument)
);

exports.default = router;