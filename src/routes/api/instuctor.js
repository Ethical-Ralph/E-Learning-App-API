import express from 'express'
import { required } from '../auth'
import instructorController from "../controllers/instructor";

const router = express.Router()


router.get(
    '/instructor/register',
    required,
    instructorController.beInstructor
)


router.get(
    '/class/:classid/instruct/',
    required,
    instructorController.isRegisteredInstructor,
    instructorController.populateInstructorFromUser,
    instructorController.instructClass

)

router.get(
    '/class/:classid/drop/',
    required,
    instructorController.populateInstructorFromUser,
    instructorController.dropClass

)







export default router
