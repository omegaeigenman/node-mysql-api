import express from 'express';
const router = express.Router();
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Use process.cwd() to find swagger.yaml from project root
const swaggerDocument = YAML.load(path.join(process.cwd(), 'swagger.yaml'));

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;