import Response from "../../utilities/response";
import { lessonService } from '../../database'
import { lessonDataValidation } from "../../utilities/validation";
import isEmpty from "lodash/isEmpty";

class lessonController {
    static async populateLessonFromParams(req, res, next, id) {
        const lessonid = id
        try {
            const data = await lessonService.findById(lessonid)
            if (!data) throw new Error('Lesson not found')
            req.lesson = data
            next()
        } catch (error) {
            next(error)
        }
    }
    static async getLesson(req, res, next) {

        try {
            const classId = req.class._id;
            const query = await lessonService.find({
                classId
            });
            Response.customResponse(res, 200, 'course lessons with the id:' + classId, query)
        } catch (error) {
            next(error)
        }
    }
    static async createLesson(req, res, next) {
        const lessonData = req.body

        const error = lessonDataValidation(lessonData)
        if (!isEmpty(error)) {
            return Response.validationError(res, error)
        }

        try {
            lessonData.lessonNumber = await lessonService.determineLessonNumber(req.class._id)
            lessonData.instructorId = req.user.instructorId
            lessonData.classId = req.class._id
            const lesson = await lessonService.createLesson(lessonData)
            return Response.customResponse(res, 200, 'Lesson created successfully', lesson)
        } catch (error) {
            next(error)
        }
    }
    static async updateLesson(req, res, next) {
        const lesson = req.lesson
        const lessonData = req.body


        const error = lessonDataValidation(lessonData)
        if (!isEmpty(error)) {
            return Response.validationError(res, error)
        }

        try {

            if (!lesson) throw new Error('Lesson id is required')

            const updatedLesson = await lesson.updateData(lessonData)
            return Response.customResponse(
                res,
                200,
                'Lesson data updated successfully',
                updatedLesson
            )
        } catch (error) {
            next(error)
        }


    }
    static async shouldAccessLesson(req, res, next) {
        const course = req.class
        const ins = req.instructor
        const stu = req.student
        try {
            const insAccess = await course.isInstructorForClass(ins)
            const stuAccess = await course.isStudentForClass(stu)
            if (insAccess || stuAccess) return next()
            throw new Error('You are not registered to take or instruct this course')
        } catch (error) {
            next(error)
        }
    }
}

export default lessonController