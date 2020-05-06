import Response from "../../utilities/response"
import { studentService, classService } from "../../database";

class instructorController {
    static isRegisteredStudent(req, res, next) {
        const user = req.user
        if (typeof user.studentId === 'undefined') {
            Response.conflictError(res, 'sorry, you are not regstered to be a student')
        }
        next()

    }
    static populateStudentFromUser(req, res, next) {
        const studentId = req.user.studentId
        const query = studentService.findById(studentId)
        const promise = query.exec()

        promise.then(student => {
            if (!student) {
                return Response.notFoundError(res, 'Student data not found')
            }
            req.student = student
            next()
        }).catch(next)
    }
    static beStudent(req, res, next) {
        const user = req.user
        if (user.isStudent()) {
            return Response.conflictError(res, 'you are already a student')
        }
        const cb = (err, info) => {
            if (err) next(err)
            return Response.customResponse(res, 201, "you have successfully registered as a student", info)
        }
        studentService.makeUserStudent(user, cb)
    }


    static registerClass(req, res, next) {
        /** should  {req} check if user is a student or instructor */
        const classId = req.params.classid
        const student = req.student

        const cb = (err, data) => {
            if (err) return Response.serverError(res, err)
            const message = `You are now a student of this class ${ data.name }`
            return Response.customResponse(res, 201, message, data)
        }

        const query = classService.findById(classId)
        const promise = query.exec()
        promise
            .then((klass) => {
                if (student.isStudentForClass(klass)) {
                    return Response.conflictError(res, 'You are already a student of this class')
                }
                student.registerForClass(klass, cb)
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
        const student = req.student
        const cb = (err, data) => {
            if (err) return Response.serverError(res, err)
            const message = `You have successfully leave this class ${ data.name }`
            return Response.customResponse(res, 201, message, data)
        }

        const query = classService.findById(classId)
        const promise = query.exec()
        promise
            .then((klass) => {
                if (!student.isStudentForClass(klass)) {
                    return Response.conflictError(res, 'Sorry you are not a student of this class')
                }
                student.dropClass(klass, cb)
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