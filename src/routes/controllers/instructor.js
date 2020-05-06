import Response from "../../utilities/response"
import { instructorService, classService } from "../../database";

class instructorController {
    static isRegisteredInstructor(req, res, next) {
        const user = req.user
        if (!user.isInstructor()) {
            Response.conflictError(res, 'sorry, you are not registered to be an instructor')
        }
        next()

    }
    static populateInstructorFromUser(req, res, next) {
        const instructorID = req.user.instructorId
        const query = instructorService.findById(instructorID)
        const promise = query.exec()

        promise.then(instructor => {
            if (!instructor) {
                return Response.notFoundError(res, 'Instructor data not found')
            }
            req.instructor = instructor
            next()
        }).catch(next)
    }
    static beInstructor(req, res, next) {
        const user = req.user
        if (user.isInstructor()) {
            return Response.conflictError(res, 'you are already an instructor')
        }
        const cb = (err, info) => {
            if (err) next(err)
            return Response.customResponse(res, 201, "you have successfully registered as an instructor", info)
        }
        instructorService.makeUserInstructor(user, cb)
    }


    static instructClass(req, res, next) {
        /** should  {req} check if user is a student or instructor */
        const classId = req.params.classid
        const instructor = req.instructor

        const cb = (err, data) => {
            if (err) return Response.serverError(res, err)
            const message = `You are now registered to instruct ${ data.name }`
            return Response.customResponse(res, 200, message, data)
        }

        const query = classService.findById(classId)
        const promise = query.exec()
        promise
            .then((klass) => {
                if (instructor.isInstructorForClass(klass)) {
                    return Response.conflictError(res, 'You are already registered to instruct this class')
                }
                instructor.instructClass(klass, cb)
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return Response.notFoundError(res, `Sorry, we counldn't find a class with this ID ${ classId }`)
                }
                next(err)
            })
    }
    static dropClass(req, res, next) {
        const classId = req.params.classid
        const instructor = req.instructor
        const cb = (err, data) => {
            if (err) return Response.serverError(res, err)
            const message = `You have now opt-out to instruct ${ data.name }`
            return Response.customResponse(res, 200, message, data)
        }

        const query = classService.findById(classId)
        const promise = query.exec()
        promise
            .then((klass) => {
                if (!instructor.isInstructorForClass(klass)) {
                    return Response.conflictError(res, 'Sorry you are not registered to instruct this class')
                }
                instructor.dropClass(klass, cb)
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return Response.notFoundError(res, `Sorry, we counldn't find a class with this ID ${ classId }`)
                }
                next(err)
            })
    }
}

export default instructorController