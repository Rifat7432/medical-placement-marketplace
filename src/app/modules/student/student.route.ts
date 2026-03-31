import express from 'express';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/', StudentController.getStudents);
router.post('/', validateRequest(StudentValidation.createStudentZodSchema), StudentController.createStudent);

router.get('/profile',auth(USER_ROLES.STUDENT), StudentController.getStudentProfile);
router.get('/:id', StudentController.getStudent);
router.patch('/:id', validateRequest(StudentValidation.updateStudentZodSchema), StudentController.updateStudent);
router.delete('/:id', StudentController.deleteStudent);

export const StudentRouter = router;