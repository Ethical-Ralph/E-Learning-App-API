import express from 'express'
import User from './api/user'
import Class from './api/classes'
import Student from './api/student'
import Instructor from './api/instuctor'

const router = express.Router()



router.use(User)
router.use(Instructor)
router.use(Student)
router.use(Class)

module.exports = router