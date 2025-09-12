import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import workoutRoutes from './workout.routes';
import dietRoutes from './diet.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/workouts',
    route: workoutRoutes,
  },
  {
    path: '/diets',
    route: dietRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
