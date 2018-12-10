"use strict";

//Handler for friend searching.
//Errors out if no username is provided. Sends an Ajax request otherwise.
var handleFriendSearch = function handleFriendSearch(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#friendSearchName").val() == '') {
        handleError("Please enter a friend's username!");
        return false;
    }

    sendAjax('POST', $("#friendSearchForm").attr("action"), $("#friendSearchForm").serialize(), function (data) {
        loadFriendTasksFromServer(data);
    });

    return false;
};

//Handler for adding friend to friend list
//Errors out if no username is provided. Sends an Ajax request otherwise.
var handleAddFriend = function handleAddFriend(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#addFriendName").val() == '') {
        handleError("Please enter a friend's username!");
        return false;
    }

    sendAjax('POST', $("#addFriendForm").attr("action"), $("#addFriendForm").serialize(), function (data) {
        loadFriendListFromServer($("#addFriendForm").find('input:hidden').val());
    });

    return false;
};

//Handles request to delete a task, send the Ajax request to the database, and call another method to re-render the task listing.
var handleListedFriendSearch = function handleListedFriendSearch(e) {
    e.preventDefault();

    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function (data) {
        loadFriendTasksFromServer(data);
    });

    return false;
};

//Form for searching for a friend's tasks.
//Only requires the friend's name as input to find their tasks.
var FriendSearchForm = function FriendSearchForm(props) {
    return React.createElement(
        "form",
        { id: "friendSearchForm", onSubmit: handleFriendSearch, name: "friendSearchForm", action: "/friendSearch", method: "POST", className: "friendSearchForm" },
        React.createElement(
            "h2",
            null,
            "Look at the task list of a friend!"
        ),
        React.createElement("input", { id: "friendSearchName", type: "text", name: "friendSearchName", placeholder: "Friend Search Name" }),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "friendSearchSubmit", type: "submit", value: "Friend Search" }),
        React.createElement("br", null)
    );
};

//Form for adding a friend to the friends list.
//Searches via username.
var AddFriendForm = function AddFriendForm(props) {
    return React.createElement(
        "form",
        { id: "addFriendForm", onSubmit: handleAddFriend, name: "addFriendForm", action: "/addFriend", method: "POST", className: "addFriendForm" },
        React.createElement(
            "h2",
            null,
            "Add friend to friends list"
        ),
        React.createElement("input", { id: "addFriendName", type: "text", name: "addFriendName", placeholder: "Add Friend Name" }),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "addFriendSubmit", type: "submit", value: "Add Friend" }),
        React.createElement("br", null)
    );
};

//Creates all of the friend's task nodes in a ReactDOM in order to render it later.
var TaskList = function TaskList(props) {
    if (props.tasks.length === 0) {
        return React.createElement(
            "div",
            { className: "taskList" },
            React.createElement(
                "h3",
                { className: "emptyTask" },
                "No tasks entered"
            )
        );
    }

    var taskNodes = props.tasks.map(function (task) {
        if (task.isComplete) {
            return React.createElement(
                "div",
                { key: task._id, className: "task" },
                React.createElement("img", { src: "/assets/img/complete_symbol.jpg", alt: "complete", className: "domoFace" }),
                React.createElement(
                    "h3",
                    { className: "taskName" },
                    "Name: ",
                    task.name,
                    " "
                ),
                React.createElement(
                    "h3",
                    { className: "taskDesc" },
                    "Description: ",
                    task.description,
                    " "
                ),
                React.createElement("input", { type: "hidden", name: "taskOverdue", value: task.overdue }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null)
            );
        } else {
            return React.createElement(
                "div",
                { key: task._id, className: "task" },
                React.createElement("img", { src: "/assets/img/incomplete.png", alt: "incomplete", className: "domoFace" }),
                React.createElement(
                    "h3",
                    { className: "taskName" },
                    "Name: ",
                    task.name,
                    " "
                ),
                React.createElement(
                    "h3",
                    { className: "taskDesc" },
                    "Description: ",
                    task.description,
                    " "
                ),
                React.createElement("input", { type: "hidden", name: "taskOverdue", value: task.overdue }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null)
            );
        }
    });

    return React.createElement(
        "div",
        { className: "taskList" },
        taskNodes
    );
};

//Creates all of the nodes for the friends list, then populates a ReactDOM to render it.
var FriendList = function FriendList(props) {
    if (props.friends.length === 0) {
        return React.createElement(
            "div",
            { className: "friendList" },
            React.createElement(
                "h3",
                { className: "emptyFriendList" },
                "No current friends"
            )
        );
    }

    var friendNodes = props.friends.map(function (friend) {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "form",
                { id: friend._id, onSubmit: handleListedFriendSearch, name: "listedFriendForm", action: "/friendSearch", method: "POST", className: "listedFriendForm" },
                React.createElement(
                    "h3",
                    { id: "friendSearchName", className: "friendName" },
                    friend.username,
                    " "
                ),
                React.createElement("input", { type: "hidden", name: "friendSearchName", value: friend.username }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { className: "listedFriendSearchSubmit", type: "submit", value: "View Friend's Tasks" }),
                React.createElement("hr", null)
            )
        );
    });

    //Then, return all of the newly generated task nodes in a single div.
    return React.createElement(
        "div",
        { className: "friendList" },
        friendNodes
    );
};

//Ajax request to load in the friend's tasks from the database.
var loadFriendTasksFromServer = function loadFriendTasksFromServer(accountData) {
    if (accountData == null) {
        handleError("Couldn't find that account!");
        return false;
    }
    sendAjax('GET', '/getFriendTasks', accountData.user, function (data) {
        ReactDOM.render(React.createElement(TaskList, { tasks: data.tasks }), document.querySelector("#friendTasks"));
    });
};

var loadFriendListFromServer = function loadFriendListFromServer(csrf) {
    sendAjax('GET', '/getFriendsList', $("#friendSearchForm").serialize(), function (data) {
        ReactDOM.render(React.createElement(FriendList, { csrf: csrf, friends: data.friends }), document.querySelector("#friendList"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(FriendSearchForm, { csrf: csrf }), document.querySelector("#friendSearch"));

    ReactDOM.render(React.createElement(AddFriendForm, { csrf: csrf }), document.querySelector("#addFriends"));

    ReactDOM.render(React.createElement(FriendList, { csrf: csrf, friends: [] }), document.querySelector("#friendList"));

    ReactDOM.render(React.createElement(TaskList, { tasks: [] }), document.querySelector("#friendTasks"));

    loadFriendListFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
