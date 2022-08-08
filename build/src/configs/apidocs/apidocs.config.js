"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
function swaggerConfig(app, pathDocs, apiVersion) {
    const filePath = path.join(__dirname, `api_docs_${apiVersion}.yaml`);
    const swaggerDocs = YAML.load(filePath);
    app.use(pathDocs, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    console.log(`Ready api docs at: ${pathDocs}`);
}
exports.default = swaggerConfig;
