const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/mern-trello-app", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(console.log("connection to DB"))
.catch(err => console.log("Error in connection to DB : ", err))

const Task = require('./models/Task')

// Get
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find()

    res.json(tasks)
})

// Create
app.post('/task/new', (req, res) => {
    const task = new Task({
        title : req.body.title,
        content : req.body.content
    })

    task.save()

    res.json(task)
})

// Delete
app.delete('/task/delete/:id', async (req, res) => {
    const result = await Task.findByIdAndDelete(req.params.id)

    res.json(result)
})

// Update to next state
app.put('/task/next/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)

    switch (task.state) {
        case "todo" : {task.state = "current"; break;}
        case "current" : {task.state = "complete"; break;}
        default : break;
    }

    task.save()

    res.json(task)
})

app.put('/task/previous/:id', async (req, res) => {
    const task = await Task.findById(req.params.id)

    switch (task.state) {
        case "complete" : {task.state = "current"; break;}
        case "current" : {task.state = "todo"; break;}
        default: break;
    }

    task.save()

    res.json(task)
})

app.listen(3001, ()=> {
    console.log("Server started on port 3001")
})