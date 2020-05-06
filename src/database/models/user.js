const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const schemaMethods = require('../methods/user')


const userSchema = new schema({
    name: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: String,
    phone: Number,
    city: String,
    country: String,
    verified: {
        type: Boolean,
        default: false
    },
    studentId: {
        type: schema.Types.ObjectId, ref: "student",
    },
    instructorId: {
        type: schema.Types.ObjectId, ref: "instructor",
    },
    isAdmin: {
        type: String,
        default: false
    }

});

schemaMethods(userSchema, mongoose, bcrypt, jwt)

const usermodel = mongoose.model('user', userSchema);
export default usermodel