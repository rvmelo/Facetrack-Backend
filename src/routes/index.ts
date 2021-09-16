import { Router } from 'express';
import sessionRoutes from './sessions.routes';
import usersRoutes from './users.routes';
import permissionRoutes from './permissions.routes';
import evaluationRoutes from './evaluation.routes';

const routes = Router();

routes.use('/sessions', sessionRoutes);
routes.use('/users', usersRoutes);
routes.use('/permissions', permissionRoutes);
routes.use('/evaluation', evaluationRoutes);

export default routes;
