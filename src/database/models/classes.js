const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaMethods = require('../methods/class')


const classSchema = Schema({
    name: {
        type: String
    },
    category: String,
    description: String,
    lessons: [ {
        type: Schema.Types.ObjectId, ref: 'lesson',
    }, ],
    author: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    instructors: [ {
        type: Schema.Types.ObjectId, ref: 'instructor'
    } ],
    students: [ {
        type: Schema.Types.ObjectId, ref: 'student'
    } ],
    isDeleted: {
        type: Boolean,
        default: false
    }
});


schemaMethods(classSchema)


module.exports = mongoose.model('classes', classSchema)