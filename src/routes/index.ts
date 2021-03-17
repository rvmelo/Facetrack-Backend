import { Router } from 'express';
import sessionRoutes from './sessions.routes';

const routes = Router();

routes.use('/sessions', sessionRoutes);

export default routes;
