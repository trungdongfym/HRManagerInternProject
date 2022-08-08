import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as express from 'express';
import * as path from 'path';

type apiVersionType = 'v1';

function swaggerConfig(app: express.Express, pathDocs: string, apiVersion: apiVersionType) {
   const filePath = path.join(__dirname, `api_docs_${apiVersion}.yaml`);
   const swaggerDocs = YAML.load(filePath);
   app.use(pathDocs, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   console.log(`Ready api docs at: ${pathDocs}`);
}

export default swaggerConfig;
