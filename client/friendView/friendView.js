//Handler for friend searching.
//Errors out if no username is provided. Sends an Ajax request otherwise.
const handleFriendSearch = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if ($("#friendSearchName").val() == '') {
        handleError("Please enter a friend's username!");
        return false;
    }
    
    sendAjax('POST', $("#friendSearchForm").attr("action"), $("#friendSearchForm").serialize(), (data) => {
        loadFriendTasksFromServer(data);
    });
    
    return false;
};

//Form for searching for a friend's tasks.
//Only requires the friend's name as input to find their tasks.
const FriendSearchForm = (props) => {
    return (
        <form id="friendSearchForm" onSubmit={handleFriendSearch} name="friendSearchForm" action="/friendSearch" method="POST" className="friendSearchForm">
            <h2>Look at the task list of a friend!</h2>
            <input id="friendSearchName" type="text" name="friendSearchName" placeholder="Friend Search Name"/><br/><br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="friendSearchSubmit" type="submit" value="Friend Search"/><br/>
        </form>
    );
};

//Creates all of the friend's task nodes in a ReactDOM in order to render it later.
const TaskList = (props) => {
    if (props.tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No tasks entered</h3>
            </div>
        );
    }
    
    const taskNodes = props.tasks.map(function(task) {
        
        return (
            <div key={task._id} className="task">
                <img src="/assets/img/incomplete.png" alt="incomplete" className="domoFace"/>
                <h3 className="taskName">Name: {task.name} </h3>
                <h3 className="taskDesc">Description: {task.description} </h3>
                <input type="hidden" name="taskOverdue" value={task.overdue}/><br/><br/><br/><br/><br/>
            </div>
        );
    });
    
    //Do this to access the friend's user name and display it.
    let formData = $("#friendSearchForm").serializeArray();

    return (
        <div className="taskList">
            <h3>Here are {formData[0].value}'s tasks'</h3>
            {taskNodes}
        </div>
    );
};

//Ajax request to load in the friend's tasks from the database.
const loadFriendTasksFromServer = (accountData) => {
    if (accountData == null) {
        handleError("Couldn't find that account!");
        return false;
    }
    sendAjax('GET', '/getFriendTasks', accountData.user, (data) => {
        ReactDOM.render(
            <TaskList tasks={data.tasks} />, document.querySelector("#tasks")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <FriendSearchForm csrf={csrf}/>, document.querySelector("#friendSearch")
    );

    ReactDOM.render(
        <TaskList tasks={[]}/>, document.querySelector("#tasks")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});