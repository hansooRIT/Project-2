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

const handleAddFriend = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if ($("#addFriendName").val() == '') {
        handleError("Please enter a friend's username!");
        return false;
    }
    
    sendAjax('POST', $("#addFriendForm").attr("action"), $("#addFriendForm").serialize(), (data) => {
        loadFriendListFromServer($("#addFriendForm").find('input:hidden').val());
    });
    
    return false;
};

//Handles request to delete a task, send the Ajax request to the database, and call another method to re-render the task listing.
const handleListedFriendSearch = (e) => {
    e.preventDefault();
    
    console.log($("#" + e.target.id).serialize());
    
    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), (data) => {
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

const AddFriendForm = (props) => {
    return (
        <form id="addFriendForm" onSubmit={handleAddFriend} name="addFriendForm" action="/addFriend" method="POST" className="addFriendForm">
            <h2>Add friend to friends list</h2>
            <input id="addFriendName" type="text" name="addFriendName" placeholder="Add Friend Name"/><br/><br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="addFriendSubmit" type="submit" value="Add Friend"/><br/>
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

    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
};

const FriendList = (props) => {
    if (props.friends.length === 0) {
        return (
            <div className="friendList">
                <h3 className="emptyFriendList">No current friends</h3>
            </div>
        );
    }
    
    const friendNodes = props.friends.map(function(friend) { 
        return (
            <div>
                <form id={friend._id} onSubmit={handleListedFriendSearch} name="listedFriendForm" action="/friendSearch" method="POST" className="listedFriendForm">
                    <h3 id="friendSearchName" className="friendName">{friend.username} </h3>
                    <input type="hidden" name="friendSearchName" value={friend.username}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="listedFriendSearchSubmit" type="submit" value="View Friend's Tasks"/>
                </form>
            </div>
        );
    });
    
        //Then, return all of the newly generated task nodes in a single div.
    return (
        <div className="friendList">
            {friendNodes}
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

const loadFriendListFromServer = (csrf) => {
    sendAjax('GET', '/getFriendsList', $("#friendSearchForm").serialize(), (data) => {
        ReactDOM.render(
            <FriendList csrf={csrf} friends={data.friends} />, document.querySelector("#friendList")
        );
    });
}

const setup = (csrf) => {
    ReactDOM.render(
        <FriendSearchForm csrf={csrf}/>, document.querySelector("#friendSearch")
    );

    ReactDOM.render(
        <AddFriendForm csrf={csrf}/>, document.querySelector("#addFriends")
    );
    
    ReactDOM.render(
        <FriendList csrf={csrf} friends={[]}/>, document.querySelector("#friendList")
    );
    
    ReactDOM.render(
        <TaskList tasks={[]}/>, document.querySelector("#tasks")
    );
    
    loadFriendListFromServer(csrf);
    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});