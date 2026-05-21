import db from './_helpers/db';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';

const app = express();
// Trust Vercel's proxy so req.ip and secure cookies work
app.set('trust proxy', 1);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
const allowedOrigins = (
    process.env.CORS_ORIGIN || 'http://localhost:4200'
)
.split(',')
.map(o => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow Postman / server requests
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Wait for DB initialization before handling requests
app.use(async (_req, res, next) => {
    try {
        if (db.ready) await db.ready;
        next();
    } catch (err) {
        console.error('DB not ready:', err);
        res.status(500).json({ message: 'Database not ready' });
    }
});

// Redirect root to Swagger documentation
app.get('/', (_req, res) => {
    res.redirect('/api-docs');
});

// Redirect root to Swagger documentation
app.get('/', (_req, res) => {
    res.redirect('/api-docs');
});

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Node MySQL API is running',
        docs: '/api-docs'
    });
});
app.use('/accounts', accountsController);
app.use('/api-docs', swaggerDocs);
app.use(errorHandler);

// Only call listen() in local dev — Vercel uses the exported app
if (process.env.NODE_ENV !== 'production') {
    const port = 4000;
    app.listen(port, () => console.log('Server listening on port ' + port));
}

export default app;