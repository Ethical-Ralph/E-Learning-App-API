import { classService, instructorService } from "../../database";
import Response from "../../utilities/response";
import { classDataValidation } from "../../utilities/validation";
import isEmpty from "lodash/isEmpty";

class classController {
    static async populateClassFromParams(req, res, next, id) {
        try {
            const query = await classService.findById(id)
            if (!query) throw new Error('Course not found')
            req.class = query
            next()
        } catch (error) {
            next(error)
        }

    }
    static isAuthorForClass(req, res, next) {
        const user = req.user
        const userid = user._id
        const classData = req.class
        const classAuthourId = classData.author._id
        const compare = String(userid) !== String(classAuthourId)
        if (compare) {
            return Response.conflictError(res, "Sorry you are not the author of this class and therefore can't change or delete it data")
        }
        next()


    }
    static async isInstructorForClass(req, res, next) {
        const instructorId = req.user.instructorId
        const course = req.class
        try {
            const instructor = await instructorService.findById(instructorId)
            const isauth = await course.isInstructorForClass(instructor)
            if (!isauth) {
                return Response.conflictError(res, "Sorry you are not an instructor of this course")
            }
            next()
        } catch (error) {
            next(error)
        }
    }
    static newClass(req, res, next) {
        const user = req.user
        const instructor = req.instructor
        const classData = req.body
        classData.instructors = []

        const errors = classDataValidation(classData)
        if (!isEmpty(errors)) return Response.validationError(res, errors)

        classData.author = user._id
        classData.instructors.push(user.instructorId)

        try {

            const cb = (err, data) => {
                if (err) Response.customResponse(res, 500, 'An internal error occured', err)
                Response.customResponse(res, 200, 'Class successfully created', data)
            }
            classService.createClass(classData, instructor, cb)

        } catch (error) {
            next(error)
        }
    }
    static getCourse(req, res, next) {
        const courseid = req.class._id

        const cb = (err, data) => {
            if (err) {
                return Response.customResponse(res, 500, 'An internal error occured', err.message)
            }
            Response.customResponse(res, 200, 'Class data with the id: ' + courseid, data)
        }
        classService.getCourseById(courseid, cb)

    }
    static async fetchClasses(req, res, next) {
        try {
            const data = classService.find({});
            const populatedData = await data
                .populate('author')
                .populate('instructors')
                .populate('students')
                .populate('lessons')
                .where('isDeleted', false)
                .limit(1)
                .exec()
            const classData = populatedData.map(data => {
                return data.fetchDetails()
            })
            return Response.customResponse(res, 200, "Classes data", classData)

        } catch (error) {
            next(error)
        }
    }
    static updateClass(req, res, next) {
        const classData = req.class
        const data = {}
        data[ 'name' ] = req.body.name
        data[ 'category' ] = req.body.category

        const errors = classDataValidation(data)
        if (!isEmpty(errors)) return Response.validationError(res, errors)

        try {
            const cb = (err, data) => {
                if (err) {
                    return Response.customResponse(res, 500, 'An internal error occured', err)
                }
                Response.customResponse(res, 200, 'Class successfully updated', data)
            }
            classData.updateClassData(data, cb)
        } catch (error) {
            next(error)
        }


    }
    static async deleteClass(req, res, next) {
        const classData = req.class
        try {
            const cb = (err, data) => {
                if (err) {
                    return Response.customResponse(res, 500, 'An internal error occured', err)
                }
                return Response.customResponse(res, 200, 'Class successfully deleted')
            }

            classData.delete(cb)

        } catch (error) {
            next(error)
        }
    }
}

export default classController