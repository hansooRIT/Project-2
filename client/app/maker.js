//Handles request for creating a new task from the Task form and call another method to re-render the task listing.
const handleTask = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if ($("#taskName").val() == '' || $("#taskDesc").val() == '' || $("#taskDueDate").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    
    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function() {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
    });
    
    return false;
};

//Handles request to delete a task, send the Ajax request to the database, and call another method to re-render the task listing.
const handleDeleteNode = (e) => {
    e.preventDefault();
    
    sendAjax('DELETE', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function() {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
    });
    
    return false;
};

//Handles request to change a task to be completed and send that request to the database. Also re-renders task listing.
const handleCompleteNode = (e) => {
    e.preventDefault();
    
    sendAjax('POST', "/completeNode", $("#" + e.target.id).serialize(), function() {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
        
    });
};

//Handles request to display only tasks that are currently in progress and rerenders the displayed tasks accordingly.
const handleFilterCurrent = (e) => {
    e.preventDefault();
    
    sendAjax('GET', $("#currentTaskFilterForm").attr("action"), $("#currentTaskFilterForm").serialize(), function() {
        loadCurrentTasksFromServer($("#taskForm").find('input:hidden').val());
        changeFilterText("Currently viewing ongoing tasks");
    });
};

//Handles request to display only tasks that are completed and rerenders the displayed tasks accordingly.
const handleFilterComplete = (e) => {
    e.preventDefault();
    
    sendAjax('GET', $("#completedTaskFilterForm").attr("action"), $("#completedTaskFilterForm").serialize(), function() {
        loadCompletedTasksFromServer($("#taskForm").find('input:hidden').val());
        changeFilterText("Currently viewing completed tasks");
    });
};

//Displays all of the task nodes that the user has and rerenders the tasks to the page.
const handleFilterNone = (e) => {
    e.preventDefault();
    
    sendAjax('GET', $("#noTaskFilterForm").attr("action"), $("#noTaskFilterForm").serialize(), function() {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
        changeFilterText("Currently viewing all task types");
    });
};

//Helper method to change the displayed text that denotes the current filter.
const changeFilterText = (text) => {
    let filterText = document.getElementById("currentFilter");
    filterText.innerHTML = text;
}

//Reach form for making tasks. Takes in a name, description, and a hidden csrf token, and sends an Ajax request to another method upon clicking submit.
const TaskForm = (props) => {
    return (
        <form id="taskForm" onSubmit={handleTask} name="taskForm" action="/maker" method="POST" className="taskForm">
            <h2>Make a task!</h2>
            <input id="taskName" type="text" name="name" placeholder="Task Name"/><br/>
            <input id="taskDesc" type="text" name="description" placeholder="Task Description"/><br/><br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeTaskSubmit" type="submit" value="Make Task"/>
        </form>
    );
};

//Form for 3 different submit options for different task filters to display.
//You can store multiple different forms within a single ReactDOM, which is super convenient for this as we can have all of the submit buttons in one location.
const FilterForm = (props) => {
    return (
        <div>
            <h2 id="currentFilter">Currently viewing all task types.</h2>
            <form id="currentTaskFilterForm" onSubmit={handleFilterCurrent} name="currentTaskFilterForm" action="/getCurrentTasks" method="GET" className="currentTaskFilterForm">
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="currentFilterSubmit" type="submit" value="View Current Tasks"/>
            </form>
            <form id="completedTaskFilterForm" onSubmit={handleFilterComplete} name="completedTaskFilterForm" action="/getCompletedTasks" method="GET" className="completedTaskFilterForm">
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="completedFilterSubmit" type="submit" value="View Completed Tasks"/>
            </form>
            <form id="noTaskFilterForm" onSubmit={handleFilterNone} name="noTaskFilterForm" action="/getTasks" method="GET" className="noTaskFilterForm">
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="noFilterSubmit" type="submit" value="View All Tasks"/>
            </form>
        </div>
    );
}

//Method to display all of the task nodes to the screen.
const TaskList = (props) => {
    if (props.tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No tasks entered</h3>
            </div>
        );
    }
    
    const taskNodes = props.tasks.map(function(task) {
        //Have 2 different types of task forms depending on whether the task is complete or not.
        //Same deal as above with having multiple forms within a single ReactDOM in order to have different buttons do different things for a single task.
        if (!task.isComplete) {
            return (
                <div id="taskNode">
                    <form id={task._id} onSubmit={handleDeleteNode} name="deleteNodeForm" action="/deleteNode" method="DELETE" className="deleteNodeForm">
                        <div key={task._id} className="task">
                            <img src="/assets/img/incomplete.png" alt="incomplete" className="domoFace"/>
                            <h3 className="taskName">Name: {task.name} </h3>
                            <h3 className="taskDesc">Description: {task.description} </h3><br/><br/><br/><br/><br/>
                            <input type="hidden" name="_id" value={task._id}/>
                            <input type="hidden" name="_csrf" value={props.csrf}/>
                            <input className="nodeSubmit" type="submit" value="Delete Task"/>
                        </div>
                    </form>
                    <form id={task._id} onSubmit={handleCompleteNode} name="completeNodeForm" action="/completeNode" method="POST" className="completeNodeForm">
                        <input type="hidden" name="_id" value={task._id}/>
                        <input type="hidden" name="_csrf" value={props.csrf}/>
                        <input className="nodeSubmit" type="submit" value="Complete Task"/>
                    </form>
                </div>
            );
        }
        else {
            return (
                <div>
                    <form id={task._id} onSubmit={handleDeleteNode} name="deleteNodeForm" action="/deleteNode" method="DELETE" className="deleteNodeForm">
                        <div key={task._id} className="task">
                            <img src="/assets/img/complete_symbol.jpg" alt="domo face" className="domoFace"/>
                            <h3 className="taskName">Name: {task.name} </h3>
                            <h3 className="taskDesc">Description: {task.description} </h3><br/><br/><br/><br/><br/>
                            <input type="hidden" name="_id" value={task._id}/>
                            <input type="hidden" name="_csrf" value={props.csrf}/>
                            <input className="nodeSubmit" type="submit" value="Delete Task"/>
                        </div>
                    </form>
                </div>
            );
        }
    });
    
    //Then, return all of the newly generated task nodes in a single div.
    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
};

//3 different methods to display tasks based on the different filters.
//Same general request, but just sending different requests to the router for the controller to do.
const loadTasksFromServer = (csrf) => {
    sendAjax('GET', '/getTasks', $("#taskForm").serialize(), (data) => {
        ReactDOM.render(
            <TaskList csrf={csrf} tasks={data.tasks} />, document.querySelector("#tasks")
        );
    });
};

const loadCurrentTasksFromServer = (csrf) => {
    sendAjax('GET', '/getCurrentTasks', $("#taskForm").serialize(), (data) => {
        ReactDOM.render(
            <TaskList csrf={csrf} tasks={data.tasks} />, document.querySelector("#tasks")
        );
    });
};

const loadCompletedTasksFromServer = (csrf) => {
    sendAjax('GET', '/getCompletedTasks', $("#taskForm").serialize(), (data) => {
        ReactDOM.render(
            <TaskList csrf={csrf} tasks={data.tasks} />, document.querySelector("#tasks")
        );
    });
};

//Initial rendering of the ReactDOM elements.
const setup = (csrf) => {
    ReactDOM.render(
        <TaskForm csrf={csrf}/>, document.querySelector("#makeTask")
    );
    
    ReactDOM.render(
        <FilterForm csrf={csrf}/>, document.querySelector("#filterTasks")
    );
    
    ReactDOM.render(
        <TaskList csrf={csrf} tasks={[]}/>, document.querySelector("#tasks")
    );
    
    loadTasksFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});