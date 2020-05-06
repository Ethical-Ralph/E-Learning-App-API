module.exports = (userSchema, mongoose, bcrypt, jwt) => {
    return (
        // static methods
        userSchema.static('hashPass', function (password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync());
        }),

        userSchema.static('registerUser', async function (userData) {
            try {
                const user = await new this(userData)
                return user.save()
            } catch (error) {
                throw error
            }
        }),

        userSchema.static('checkEmail', async function (email) {
            try {
                const exist = await this.exists({ email })
                return exist
            } catch (error) {
                throw new Error(error)
            }
        }),

        userSchema.static('getUserByEmail', async (email, cb) => {
            try {
                const user = await this.findOne({ email })
                return user
            } catch (error) {
                throw error
            }
        }),

        userSchema.static('getUserByUsername', async (username) => {
            try {
                const user = await this.findOne({ username })
                return user
            } catch (error) {
                throw error
            }
        }),

        userSchema.methods.addStudentId = function (id) {
            if (this.studentIds.indexOf(id) !== -1) {
                this.studentIds.push(id)
            }
            return this.save()
        },

        userSchema.methods.compareHash = function (password) {
            return bcrypt.compareSync(password, this.password);
        },

        userSchema.methods.signJWt = function () {
            return jwt.sign({
                id: this._id,
                email: this.email,
                username: this.username,
            }, process.env.JWTSECRET, {
                expiresIn: '24h'
            });
        },

        userSchema.methods.setInstructor = function (instructor) {
            if (!this.isInstructor()) {
                this.instructorId = instructor
            }
            return this.save()
        },

        userSchema.methods.setStudent = function (student) {
            if (!this.isStudent()) {
                this.studentId = student
            }
            return this.save()
        },

        userSchema.methods.isInstructor = function () {
            if (mongoose.Types.ObjectId.isValid(this.instructorId)) {
                return true
            }
            return false
        },

        userSchema.methods.isStudent = function () {
            if (mongoose.Types.ObjectId.isValid(this.studentId)) {
                return true
            }
            return false
        },

        userSchema.methods.authJSON = function () {
            return {
                id: this._id,
                username: this.username,
                token: this.signJWt(),
                email: this.email,
                isAdmin: this.isAdmin,
                instructorid: this.instructorId,
                studentid: this.studentId
            };
        },

        userSchema.methods.toProfileJSON = function () {
            return {
                id: this._id,
                username: this.username,
                email: this.email,
                phone: this.phone,
                country: this.country
            };
        }
    )
}