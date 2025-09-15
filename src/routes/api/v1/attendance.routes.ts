import { Router } from 'express';
import attendanceController from '../../controllers/attendance.controller';
import attendanceValidation from '../../validations/attendance.validation';
import auth from '../../middlewares/auth.middleware';
import apiKeyAuth from '../../middlewares/apiKey.middleware';
import validate from '../../middlewares/validate';

const router = Router();

// Machine-to-machine routes protected by API Key
router.post(
  '/check-in',
  apiKeyAuth(),
  validate(attendanceValidation.checkIn),
  attendanceController.checkIn
);

router.post(
  '/check-out',
  apiKeyAuth(),
  validate(attendanceValidation.checkOut),
  attendanceController.checkOut
);

// User-facing route protected by JWT
router.get(
  '/me',
  auth(),
  attendanceController.getMyAttendance
);

export default router;
