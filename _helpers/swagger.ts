import express from 'express';
const router = express.Router();
import YAML from 'yamljs';
import path from 'path';

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Load Swagger UI assets from CDN instead of the swagger-ui-dist package,
// because @vercel/node's file tracer doesn't reliably include those static
// files in the serverless bundle, causing a blank page in production.
const SWAGGER_CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Node MySQL API - Documentation</title>
  <link rel="stylesheet" href="${SWAGGER_CDN}/swagger-ui.css">
  <link rel="icon" type="image/png" href="${SWAGGER_CDN}/favicon-32x32.png" sizes="32x32">
  <style>html{box-sizing:border-box;overflow:-moz-scrollbars-vertical;overflow-y:scroll}*,*:before,*:after{box-sizing:inherit}body{margin:0;background:#fafafa}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_CDN}/swagger-ui-bundle.js" charset="UTF-8"></script>
  <script src="${SWAGGER_CDN}/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerDocument)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;

router.get('/', (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});

// Raw OpenAPI spec endpoint (useful for Postman, Insomnia, etc.)
router.get('/swagger.json', (_req, res) => {
    res.json(swaggerDocument);
});

export default router;
