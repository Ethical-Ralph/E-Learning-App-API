import userService from './models/user'
import instructorService from './models/instructor'
import studentService from './models/student'
import classService from './models/classes'
import lessonService from './models/lesson'

const db = {
    studentService,
    classService,
    lessonService,
    userService,
    instructorService
}

module.exports = db

