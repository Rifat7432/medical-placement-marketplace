import express from 'express';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.route('/').get(StudentController.getStudents).post(validateRequest(StudentValidation.createStudentZodSchema), StudentController.createStudent);

router.route('/:id').get(StudentController.getStudent).patch(validateRequest(StudentValidation.updateStudentZodSchema), StudentController.updateStudent).delete(StudentController.deleteStudent);

export const StudentRouter = router;