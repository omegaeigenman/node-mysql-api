import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { Router } from 'express';

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

const router = Router();
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;