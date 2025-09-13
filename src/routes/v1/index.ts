import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import workoutRoutes from './workout.routes';
import dietRoutes from './diet.routes';
import subscriptionRoutes from './subscription.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/workouts', route: workoutRoutes },
  { path: '/diets', route: dietRoutes },
  { path: '/subscriptions', route: subscriptionRoutes },
  { path: '/products', route: productRoutes },
  { path: '/cart', route: cartRoutes },
  { path: '/orders', route: orderRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
