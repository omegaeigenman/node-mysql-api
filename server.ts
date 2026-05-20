import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/accounts.controller';
import swaggerDocs from './_helpers/swagger';

const app = express();

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

app.use('/accounts', accountsController);
app.use('/api-docs', swaggerDocs);
app.use(errorHandler);

// Only call listen() in local dev — Vercel uses the exported app
if (process.env.NODE_ENV !== 'production') {
    const port = 4000;
    app.listen(port, () => console.log('Server listening on port ' + port));
}

export default app;