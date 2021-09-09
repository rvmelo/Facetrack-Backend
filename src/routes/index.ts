import { Router } from 'express';
import sessionRoutes from './sessions.routes';
import usersRoutes from './users.routes';
import permissionRoutes from './permissions.routes';

const routes = Router();

routes.use('/sessions', sessionRoutes);
routes.use('/users', usersRoutes);
routes.use('/permissions', permissionRoutes);

export default routes;
