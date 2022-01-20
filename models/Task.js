const mongoose = require('mongoose')
const schema = mongoose.Schema

const TaskSchema = schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required: true,
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    state : {
        type : String,
        default : "todo"
    }
})

const Task = mongoose.model("Task", TaskSchema)

module.exports = Task