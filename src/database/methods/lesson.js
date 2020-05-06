module.exports = (lessonSchema) => {
    return (
        lessonSchema.static('createLesson', async function (data) {
            try {
                const newLesson = new this(data)
                return newLesson.save()
            } catch (error) {
                throw error
            }

        }),
        lessonSchema.methods.updateData = async function (data) {
            const { title, description, body } = data;
            try {
                this.title = title
                this.description = description
                this.body = body
                return this.save()
            } catch (error) {
                throw error
            }

        },
        lessonSchema.static('determineLessonNumber', async function (id) {
            const query = await this.find({
                classId: id
            })
            const arrayLength = query.length + 1
            return arrayLength
        }),


        lessonSchema.methods.lessonsForClass = function () {
            return {
                lessonNumber: this.lessonNumber,
                title: this.title,
                instuctorId: this.instructorId

            };
        }
    )
}