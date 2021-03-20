import { Router } from 'express';
import sessionRoutes from './sessions.routes';
import usersRoutes from './users.routes';

const routes = Router();

routes.use('/sessions', sessionRoutes);
routes.use('/users', usersRoutes);

export default routes;
