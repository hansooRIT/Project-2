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
    });

    //Do this to access the friend's user name and display it.
    var formData = $("#friendSearchForm").serializeArray();

    return React.createElement(
        "div",
        { className: "taskList" },
        React.createElement(
            "h3",
            null,
            "Here are ",
            formData[0].value,
            "'s tasks'"
        ),
        taskNodes
    );
};

//Ajax request to load in the friend's tasks from the database.
var loadFriendTasksFromServer = function loadFriendTasksFromServer(accountData) {
    if (accountData == null) {
        handleError("Couldn't find that account!");
        return false;
    }
    sendAjax('GET', '/getFriendTasks', accountData.user, function (data) {
        ReactDOM.render(React.createElement(TaskList, { tasks: data.tasks }), document.querySelector("#tasks"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(FriendSearchForm, { csrf: csrf }), document.querySelector("#friendSearch"));

    ReactDOM.render(React.createElement(TaskList, { tasks: [] }), document.querySelector("#tasks"));
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
