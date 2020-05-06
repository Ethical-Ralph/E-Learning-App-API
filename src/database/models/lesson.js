/* eslint-disable semi */
/* eslint-disable indent */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaMethods = require('../methods/lesson')

const lessonSchema = Schema({
    title: {
        type: String
    },
    description: String,
    body: String,
    lessonNumber: {
        type: Number,
    },
    instructorId: {
        type: Schema.Types.ObjectId, ref: 'instructor'
    },
    classId: {
        type: Schema.Types.ObjectId, ref: 'class'
    }
});


schemaMethods(lessonSchema)



module.exports = mongoose.model('lesson', lessonSchema)
