import { Router } from 'express';
import dietController from '../../controllers/diet.controller';
import dietValidation from '../../validations/diet.validation';
import auth from '../../middlewares/auth.middleware';
import hasPermission from '../../middlewares/permission.middleware';
import validate from '../../middlewares/validate';

const router = Router();

// Routes for trainers/admins to manage diet plans
router.post(
  '/plans',
  auth(),
  hasPermission('diets:create'),
  validate({ body: dietValidation.createDietPlan.body }),
  dietController.createDietPlan
);

router.post(
  '/plans/assign',
  auth(),
  hasPermission('diets:assign'),
  validate({ body: dietValidation.assignPlanToUser.body }),
  dietController.assignPlanToUser
);

// Routes for users to manage their adherence
router.post(
  '/sessions/adherence',
  auth(),
  validate({ body: dietValidation.logAdherence.body }),
  dietController.logAdherence
);

export default router;
