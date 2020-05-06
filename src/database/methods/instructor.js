module.exports = (instructorSchema) => {
    return (
        instructorSchema.methods.isInstructorForClass = function (klass) {
            const classid = klass._id
            const instructorid = this._id
            if (klass.isAnInstructor(instructorid) && this.amTakingClass(classid)) {
                return true
            }
            return false
        },
        instructorSchema.methods.instructClass = async function (klass, cb) {
            try {
                const classData = await klass.addInstructor(this._id)
                await this.addClass(klass._id)

                const isInstructorForClass = this.isInstructorForClass(klass)

                if (isInstructorForClass) {
                    cb(null, classData)
                }
            } catch (error) {
                cb(error, null)
            }
        },
        instructorSchema.methods.dropClass = async function (klass, cb) {
            try {
                const classData = await klass.removeInstructor(this._id)

                await this.removeClass(klass._id)

                const isInstructorForClass = this.isInstructorForClass(klass)

                if (!isInstructorForClass) {
                    cb(null, classData)
                }
            } catch (error) {
                cb(error, null)
            }
        },
        instructorSchema.methods.amTakingClass = function (id) {
            if (this.classes.indexOf(id) !== -1) {
                return true
            }
            return false
        },
        instructorSchema.methods.addClass = function (id) {
            this.classes.push(id)

            return this.save()
        },
        instructorSchema.methods.removeClass = function (id) {
            const klass = this.classes
            const filteredClass = klass.filter(data =>
                String(data) !== String(id))
            this.classes = filteredClass
            return this.save()
        },

        instructorSchema.static('makeUserInstructor', async function (user, cb) {
            try {
                const instructor = new this()
                instructor.userId = user.id
                instructor.name = user.username
                await user.setInstructor(instructor._id)
                await instructor.save((err, data) => {
                    if (err) cb(err, null)
                    cb(null, data)
                })
            } catch (err) {
                cb(err, null)
            }
        }),

        instructorSchema.methods.toProfileJSON = function () {
            return {
                name: this.name,
                classes: this.classes
            }

        },


        instructorSchema.methods.toJSONfor = function () {
            return {
                name: this.name,
            }

        }
    )
}