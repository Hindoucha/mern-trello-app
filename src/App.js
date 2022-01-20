import {useState, useEffect} from "react"

const API_BASE = "http://localhost:3001"

function App() {

    const [popupActive, setPopupActive] = useState(false)
    const [tasks, setTasks] = useState([])
    const [todos, setTodos] = useState([])
    const [currents, setCurrents] = useState([])
    const [completes, setcompletes] = useState([])
    
    useEffect(()=>{
        GetTasks()
    },[tasks])

    const GetTasks = () => {
        fetch(API_BASE + "/tasks")
        .then(res => res.json())
        .then(data => {
            setTasks(data)
            setTodos(data.filter(task => task.state === "todo"))
            setCurrents(data.filter(task => task.state === "current"))
            setcompletes(data.filter(task => task.state === "complete"))
        })
}
    
    const nextState = (id) => {
        const requestOptions = {
            method : "PUT",
            headers : {'content-type' : 'application/json'},
            body : JSON.stringify({})
        }
        
        // this update it on the DB
        const data = fetch(API_BASE + "/task/next/" + id, requestOptions)
        .then(res=> res.json())

        // this update it on the state
        switch (data.state) {
            case "todo" : {deleteFromTodos(data._id); AddToCurrents(data);break;}
            /*case "current" : {updateCurrents(data._id);updateCompletes(data._id);break;}*/
            default: break;
        }
    }

    const deleteFromTodos = (id) => {
        setTodos(todos.filter(todo => todo._id !== id))
    }

    const AddToCurrents = (data) => {
        currents.push(data)
    }

    const updateCompletes = (id) => {

    }

    return (
        <div className="App">
            <div className="add-task">
                <div className="button" onClick={()=>setPopupActive(true)}>Add new task !</div>
            </div>
            <div className="tasks">
                <div className="todos">
                    <div className="title">To Do</div>
                    <div className="content">
                        {todos.map(todo => (<>
                                <div className="task todo">
                                    <div className="sign"></div>
                                    <div className="title">{todo.title}</div>
                                    <hr />
                                    <div className="content">{todo.content}</div>
                                    <div className="footer">
                                        <div className="date">
                                            <div>{todo.createdAt.split('T')[0].split('-').reverse().join('/')}</div>
                                        </div>
                                        <div className="button next" onClick={()=>nextState(todo._id)}>Next</div>
                                    </div>
                                </div>
                        </>))}
                    </div>
                </div>

                <div className="currents">
                    <div className="title">Currently Doing</div>
                    <div className="content">
                        {currents.map((current) => <>
                            <div className="task current">
                                <div className="sign"></div>
                                <div className="title">{current.title}</div>
                                <hr />
                                <div className="content">{current.content}</div>
                                <div className="footer">
                                    <div className="date">
                                        <div>{current.createdAt.split('T')[0].split('-').reverse().join('/')}</div>
                                    </div>
                                    <div className="button">
                                        <div className="container">
                                            <div className="previous">Previous</div>
                                            <div className="next" onClick={()=>nextState(current._id)}>Next</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>)}
                    </div>
                </div>

                <div className="completes">
                    <div className="title">Completed</div>
                    <div className="content">
                        {completes.map(complete => <>
                            <div className="task complete">
                                <div className="sign"></div>
                                <div className="title">{complete.title}</div>
                                <hr />
                                <div className="content">{complete.content}</div>
                                <div className="footer">
                                    <div className="date">
                                        <div>{complete.createdAt.split('T')[0].split('-').reverse().join('/')}</div>
                                    </div>
                                    <div className="button previous">Previous</div>
                                </div>
                            </div>
                        </>)}
                    </div>
                </div>
            </div>

        { popupActive ? (
            <div className="popup">
                <div className="close" onClick={()=>setPopupActive(false)}>x</div>
                <div className="add-task-title">Add new task</div>
                <label>Title</label>
                <input type="text" className="title-input" />
                <label> Description</label>
                <textarea className="content-textarea" />
                <div className="button-add">Create task</div>
            </div>
        ) : ''}

        </div>
    );
}

export default App;
