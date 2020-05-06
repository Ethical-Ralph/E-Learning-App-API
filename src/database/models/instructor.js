import mongoose from 'mongoose'
import methodsForSchema from '../methods/instructor'
const schema = mongoose.Schema



const instructorSchema = new schema({
    name: {
        type: String,
    },
    userId: {
        type: schema.Types.ObjectId, ref: "user"
    },
    classes: [ { type: schema.Types.ObjectId, ref: 'classes' } ]

});

methodsForSchema(instructorSchema)





export default mongoose.model('instructor', instructorSchema)