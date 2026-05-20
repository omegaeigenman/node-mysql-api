"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateRequest;
function validateRequest(req, next, schema) {
    const options = {
        abortEarly: false, // show all errors
        allowUnknown: true, // ignore unknown fields
        stripUnknown: true // remove unknown fields
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Validation error: ${error.details.map((x) => x.message).join(', ')}`);
    }
    else {
        req.body = value;
        next();
    }
}
