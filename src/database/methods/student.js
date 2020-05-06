module.exports = (studentSchema) => {
    return (
        studentSchema.methods.registerForClass = async function (klass, cb) {
            try {
                const classData = await klass.addStudent(this._id)
                await this.addClass(klass._id)
                if (this.isStudentForClass(klass)) {
                    cb(null, classData)
                }
            } catch (error) {
                cb(error, null)
            }
        },
        studentSchema.methods.addClass = function (id) {
            this.classes.push(id)

            return this.save()
        },
        studentSchema.methods.dropClass = async function (klass, cb) {
            try {
                const classData = await klass.removeStudent(this._id)

                const aa = await this.removeClass(klass._id)
                console.log(aa)
                const isStudent = this.isStudentForClass(klass)

                if (!isStudent) {
                    cb(null, classData)
                }
            } catch (error) {
                cb(error, null)
            }
        },
        studentSchema.methods.removeClass = function (id) {
            const klass = this.classes
            const filteredClass = klass.filter(data =>
                String(data) !== String(id))
            this.classes = filteredClass
            return this.save()
        },
        studentSchema.methods.isStudentForClass = function (klass) {
            const classid = klass._id
            const studentId = this._id
            if (klass.isStudent(studentId) && this.amTakingClass(classid)) {
                return true
            }
            return false
        },
        studentSchema.methods.amTakingClass = function (id) {
            if (this.classes.indexOf(id) !== -1) {
                return true
            }
            return false
        },
        studentSchema.static('makeUserStudent', async function (user, cb) {
            try {
                const student = await new this()
                student.userId = user.id
                student.name = user.username
                await user.setStudent(student._id)
                await student.save((err, data) => {
                    if (err) cb(err, null)
                    cb(null, data)
                })
            } catch (err) {
                cb(err, null)
            }
        }),
        studentSchema.methods.myClasses = function () {
            return {
                classes: this.classes.map(data => {
                    data.fetchDetails()
                })
            }
        },


        studentSchema.methods.addClass = function (classId) {
            if (!this.classes.includes(classId))
                this.classes.push(classId)

            return this.save()
        },



        studentSchema.methods.toProfileJSON = function () {
            return {
                username: this.name,
                classes: this.classes
            }

        }
    )
}