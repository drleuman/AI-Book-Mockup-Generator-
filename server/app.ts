
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mockupRoutes from './routes/mockups.js';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: config.appOrigin,
    credentials: false,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'mockup-bff',
    env: config.nodeEnv,
  });
});

app.use('/api/mockups', mockupRoutes);

app.use(errorHandler);

export default app;
