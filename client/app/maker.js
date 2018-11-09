const handleTask = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if ($("#taskName").val() == '' || $("#taskDesc").val() == '' || $("#taskDueDate").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function() {
        loadTasksFromServer();
    });
    
    return false;
};

const handleDelete = (e) => {
    e.preventDefault();
    
    if ($("#deleteName").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('DELETE', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), function() {
        loadTasksFromServer();
    });
    
    return false;
}

const TaskForm = (props) => {
    return (
        <form id="taskForm" onSubmit={handleTask} name="taskForm" action="/maker" method="POST" className="taskForm">
            <label htmlFor="name">Name: </label>
            <input id="taskName" type="text" name="name" placeholder="Task Name"/>
            <label htmlFor="description">Description: </label>
            <input id="taskDesc" type="text" name="description" placeholder="Task Description"/>
            <label htmlFor="dueDate">Due Date: </label>
            <input id="taskDueDate" type="date" name="dueDate" placeholder="Task Due Date"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeTaskSubmit" type="submit" value="Make Task"/>
        </form>
    );
};


const DeleteForm = (props) => {
    return (
        <form id="deleteForm" onSubmit={handleDelete} name="deleteForm" action="/delete" method="DELETE" className="deleteForm">
            <label htmlFor="name">Name: </label>
            <input id="deleteName" type="text" name="deleteName" placeholder="Task Name"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="deleteTaskSubmit" type="submit" value="Delete Task"/>
        </form>
    );
};

const TaskList = (props) => {
    if (props.tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No Tasks yet</h3>
            </div>
        );
    }
    
    console.log(props.tasks);
    
    const taskNodes = props.tasks.map(function(task) {
        
        return (
            <div key={task._id} className="task">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="taskName">Name: {task.name} </h3>
                <h3 className="taskDesc">Description: {task.description} </h3>
                <h3 className="taskDueDate">Due Date: {task.dueDate} </h3>
                <input type="hidden" name="taskOverdue" value={task.overdue}/>
            </div>
        );
    });
    
    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
};

const loadTasksFromServer = () => {
    sendAjax('GET', '/getTasks', null, (data) => {
        ReactDOM.render(
            <TaskList tasks={data.tasks} />, document.querySelector("#tasks")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <TaskForm csrf={csrf}/>, document.querySelector("#makeTask")
    );
    
    ReactDOM.render(
        <DeleteForm csrf={csrf}/>, document.querySelector("#deleteTask")
    );
    
    ReactDOM.render(
        <TaskList tasks={[]}/>, document.querySelector("#tasks")
    );
    
    loadTasksFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});