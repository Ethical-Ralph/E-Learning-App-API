import express from 'express'
import { required, optional } from '../auth'
import instructorController from "../controllers/instructor";
import studentController from "../controllers/student";
import classController from '../controllers/classes'
import lessonController from '../controllers/lesson';

const router = express.Router()

router.param('id', classController.populateClassFromParams)
router.param('lessonid', lessonController.populateLessonFromParams)


router
    .get('/class',
        optional,
        classController.fetchClasses

    )

router
    .get('/class/:id',
        optional,
        classController.getCourse
    )

router
    .post('/class',
        required,
        instructorController.populateInstructorFromUser,
        classController.newClass
    )

router
    .route('/class/:id/lesson/:lessonid?')
    .get(
        required,
        instructorController.isRegisteredInstructor,
        instructorController.populateInstructorFromUser,
        studentController.isRegisteredStudent,
        studentController.populateStudentFromUser,
        lessonController.shouldAccessLesson,
        lessonController.getLesson
    )
    .post(
        required,
        instructorController.isRegisteredInstructor,
        classController.isInstructorForClass,
        lessonController.createLesson
    )
    .put(
        required,
        classController.isInstructorForClass,
        lessonController.updateLesson
    )
router
    .put('/class/:id',
        required,
        classController.isAuthorForClass,
        classController.updateClass
    )

router
    .delete('class/:id',
        required,
        classController.isAuthorForClass,
        classController.deleteClass
    )


export default router
