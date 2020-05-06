const mongoose = require('mongoose');
const schema = mongoose.Schema
const SchemaMethod = require('../methods/student')


const studentSchema = new schema({
    name: {
        type: String,
    },
    userId: {
        type: schema.Types.ObjectId, ref: "user"
    },
    classes: [ { type: [ schema.Types.ObjectId ], ref: 'classes' } ]

})


SchemaMethod(studentSchema)

module.exports = mongoose.model('student', studentSchema)