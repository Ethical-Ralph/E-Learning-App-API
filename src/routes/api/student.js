import express from 'express'
import { required, optional } from '../auth'
import studentController from "../controllers/student";

const router = express.Router()


router.get(
    '/student/register',
    required,
    studentController.beStudent
)


router.get(
    '/class/:classid/register',
    required,
    studentController.isRegisteredStudent,
    studentController.populateStudentFromUser,
    studentController.registerClass

)

router.get(
    '/class/:classid/unregister/',
    required,
    studentController.populateStudentFromUser,
    studentController.dropClass

)







export default router
