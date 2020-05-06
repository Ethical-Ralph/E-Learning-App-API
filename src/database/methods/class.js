module.exports = (classSchema) => {
    return (
        classSchema.static('createClass', async function (data, instructor, cb) {
            try {
                const newClass = new this(data)
                instructor.addClass(newClass._id)
                newClass.save((err, data) => {
                    if (err) cb(err, null)
                    cb(null, data)
                })
            } catch (error) {
                cb(error, null)
            }

        }),
        classSchema.methods.updateClassData = function (data, cb) {
            try {
                this.name = data.name
                this.category = data.category
                this.save((err, data) => {
                    if (err) cb(err, null)
                    cb(null, data)
                })
            } catch (error) {
                cb(error, null)
            }
        },
        classSchema.static('getCourseById', async function (id, cb) {
            try {
                const query = await this.findById(id)
                    .populate('author')
                    .populate('instructors')
                    .populate('students')
                    .populate('lessons')
                    .exec()

                const course = query.fetchDetails()

                cb(null, course)

            } catch (error) {
                cb(error, null)
            }
        }),
        classSchema.methods.deleteClass = function (data, cb) {
            try {
                this.isDeleted = true
                this.save((err, data) => {
                    if (err) cb(err, null);
                    cb(null, data)
                })
            } catch (error) {
                cb(err, null)
            }
        },
        classSchema.methods.isAnInstructor = function (id) {
            if (this.instructors.indexOf(id) !== -1) {
                return true
            }
            return false
        },
        classSchema.methods.isStudent = function (id) {
            if (this.students.indexOf(id) !== -1) {
                return true
            }
            return false
        },
        classSchema.methods.addInstructor = async function (id) {
            try {
                await this.instructors.push(id)
            } catch (error) {
                throw error
            }

            return this.save()
        },
        classSchema.methods.addStudent = async function (id) {
            try {
                await this.students.push(id)
            } catch (error) {
                throw error
            }

            return this.save()
        },
        classSchema.methods.register = function (studentId) {
            if (this.students.indexOf(studentId) === -1) {
                this.students.push(studentId)
            }
            return this.save()
        },

        classSchema.methods.isRegistered = function (studentId) {
            return this.students.includes(studentId)
        },

        classSchema.methods.unregister = function (studentId) {
            const oldstudent = this.students
            if (this.students.includes(studentId)) {

                const newstudent = oldstudent.filter(data => {
                    return String(data) !== String(studentId)
                })
                this.students = newstudent
            }
            return this.save()
        },
        classSchema.methods.removeInstructor = function (instructorId) {
            const instructors = this.instructors
            const filteredInstructor = instructors.filter(data =>
                String(data) !== String(instructorId)
            )
            this.instructors = filteredInstructor

            return this.save()
        },
        classSchema.methods.removeStudent = function (studentId) {
            const students = this.students

            const filteredStudent = students.filter(data =>
                String(data) !== String(studentId)
            )
            this.students = filteredStudent

            return this.save()
        },
        classSchema.methods.isStudentForClass = function (stu) {
            const classid = this._id
            const studentId = stu._id
            if (this.isStudent(studentId) && stu.amTakingClass(classid)) {
                return true
            }
            return false
        },
        classSchema.methods.isInstructorForClass = function (ins) {
            const classid = this._id
            const instructorid = ins._id
            if (this.isAnInstructor(instructorid) && ins.amTakingClass(classid)) {
                return true
            }
            return false
        },
        classSchema.methods.saveLesson = function (id) {
            this.lessons.push(id)
            return this.save()
        },

        classSchema.methods.fetchDetails = function () {
            return {
                id: this._id,
                name: this.name,
                category: this.category,
                author: this.author.toProfileJSON(),
                lessons: this.lessons.map(lessonsdata => {
                    return lessonsdata.lessonsForClass()
                }),
                students: this.students.map(studentsdata => {
                    return studentsdata
                }),
                instructors: this.instructors.map(instructorsdata => {
                    return instructorsdata
                })
            };
        }


    )
}