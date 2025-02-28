import adminAPIRoutes from './admin-api';

const routes = {
  admin: {
    type: "admin",
    routes: adminAPIRoutes,
  },
};

export default routes;
