import { Router } from 'express';
import workoutController from '../../../controllers/workout.controller';
import workoutValidation from '../../../validations/workout.validation';
import auth from '../../../middlewares/auth.middleware';
import hasPermission from '../../../middlewares/permission.middleware';
import validate from '../../../middlewares/validate';

const router = Router();

// Routes for trainers/admins to manage plans
router.post(
  '/plans',
  auth(),
  hasPermission('workouts:create'), // Example permission
  validate({ body: workoutValidation.createWorkoutPlan.body }),
  workoutController.createWorkoutPlan
);

router.post(
  '/plans/assign',
  auth(),
  hasPermission('workouts:assign'), // Example permission
  validate({ body: workoutValidation.assignPlanToUser.body }),
  workoutController.assignPlanToUser
);

// Routes for users to view their plans
router.get(
  '/sessions/my-plan',
  auth(),
  workoutController.getMyActivePlan
);

// A placeholder for the completion route
router.post(
  '/sessions/complete',
  auth(),
  workoutController.completeDay
);


export default router;
