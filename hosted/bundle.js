"use strict";

//Handles request for creating a new task from the Task form and call another method to re-render the task listing.
var handleTask = function handleTask(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#taskName").val() == '' || $("#taskDesc").val() == '' || $("#taskDueDate").val() == '') {
        handleError("All fields are required!");
        return false;
    }

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
    });

    return false;
};

//Handles request to delete a task, send the Ajax request to the database, and call another method to re-render the task listing.
var handleDeleteNode = function handleDeleteNode(e) {
    e.preventDefault();

    sendAjax('DELETE', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
    });

    return false;
};

//Handles request to change a task to be completed and send that request to the database. Also re-renders task listing.
var handleCompleteNode = function handleCompleteNode(e) {
    e.preventDefault();

    sendAjax('POST', "/completeNode", $("#" + e.target.id).serialize(), function () {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
    });
};

//Handles request to display only tasks that are currently in progress and rerenders the displayed tasks accordingly.
var handleFilterCurrent = function handleFilterCurrent(e) {
    e.preventDefault();

    sendAjax('GET', $("#currentTaskFilterForm").attr("action"), $("#currentTaskFilterForm").serialize(), function () {
        loadCurrentTasksFromServer($("#taskForm").find('input:hidden').val());
        changeFilterText("Currently viewing ongoing tasks");
    });
};

//Handles request to display only tasks that are completed and rerenders the displayed tasks accordingly.
var handleFilterComplete = function handleFilterComplete(e) {
    e.preventDefault();

    sendAjax('GET', $("#completedTaskFilterForm").attr("action"), $("#completedTaskFilterForm").serialize(), function () {
        loadCompletedTasksFromServer($("#taskForm").find('input:hidden').val());
        changeFilterText("Currently viewing completed tasks");
    });
};

//Displays all of the task nodes that the user has and rerenders the tasks to the page.
var handleFilterNone = function handleFilterNone(e) {
    e.preventDefault();

    sendAjax('GET', $("#noTaskFilterForm").attr("action"), $("#noTaskFilterForm").serialize(), function () {
        loadTasksFromServer($("#taskForm").find('input:hidden').val());
        changeFilterText("Currently viewing all task types");
    });
};

//Helper method to change the displayed text that denotes the current filter.
var changeFilterText = function changeFilterText(text) {
    var filterText = document.getElementById("currentFilter");
    filterText.innerHTML = text;
};

//Reach form for making tasks. Takes in a name, description, and a hidden csrf token, and sends an Ajax request to another method upon clicking submit.
var TaskForm = function TaskForm(props) {
    return React.createElement(
        "form",
        { id: "taskForm", onSubmit: handleTask, name: "taskForm", action: "/maker", method: "POST", className: "taskForm" },
        React.createElement(
            "h2",
            null,
            "Make a task!"
        ),
        React.createElement("input", { id: "taskName", type: "text", name: "name", placeholder: "Task Name" }),
        React.createElement("br", null),
        React.createElement("input", { id: "taskDesc", type: "text", name: "description", placeholder: "Task Description" }),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeTaskSubmit", type: "submit", value: "Make Task" })
    );
};

//Form for 3 different submit options for different task filters to display.
//You can store multiple different forms within a single ReactDOM, which is super convenient for this as we can have all of the submit buttons in one location.
var FilterForm = function FilterForm(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            { id: "currentFilter" },
            "Currently viewing all task types."
        ),
        React.createElement(
            "form",
            { id: "currentTaskFilterForm", onSubmit: handleFilterCurrent, name: "currentTaskFilterForm", action: "/getCurrentTasks", method: "GET", className: "currentTaskFilterForm" },
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "currentFilterSubmit", type: "submit", value: "View Current Tasks" })
        ),
        React.createElement(
            "form",
            { id: "completedTaskFilterForm", onSubmit: handleFilterComplete, name: "completedTaskFilterForm", action: "/getCompletedTasks", method: "GET", className: "completedTaskFilterForm" },
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "completedFilterSubmit", type: "submit", value: "View Completed Tasks" })
        ),
        React.createElement(
            "form",
            { id: "noTaskFilterForm", onSubmit: handleFilterNone, name: "noTaskFilterForm", action: "/getTasks", method: "GET", className: "noTaskFilterForm" },
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "noFilterSubmit", type: "submit", value: "View All Tasks" })
        )
    );
};

//Method to display all of the task nodes to the screen.
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
        //Have 2 different types of task forms depending on whether the task is complete or not.
        //Same deal as above with having multiple forms within a single ReactDOM in order to have different buttons do different things for a single task.
        if (!task.isComplete) {
            return React.createElement(
                "div",
                { id: "taskNode" },
                React.createElement(
                    "form",
                    { id: task._id, onSubmit: handleDeleteNode, name: "deleteNodeForm", action: "/deleteNode", method: "DELETE", className: "deleteNodeForm" },
                    React.createElement(
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
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("input", { type: "hidden", name: "_id", value: task._id }),
                        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                        React.createElement("input", { className: "nodeSubmit", type: "submit", value: "Delete Task" })
                    )
                ),
                React.createElement(
                    "form",
                    { id: task._id, onSubmit: handleCompleteNode, name: "completeNodeForm", action: "/completeNode", method: "POST", className: "completeNodeForm" },
                    React.createElement("input", { type: "hidden", name: "_id", value: task._id }),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "nodeSubmit", type: "submit", value: "Complete Task" })
                )
            );
        } else {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "form",
                    { id: task._id, onSubmit: handleDeleteNode, name: "deleteNodeForm", action: "/deleteNode", method: "DELETE", className: "deleteNodeForm" },
                    React.createElement(
                        "div",
                        { key: task._id, className: "task" },
                        React.createElement("img", { src: "/assets/img/complete_symbol.jpg", alt: "domo face", className: "domoFace" }),
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
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("input", { type: "hidden", name: "_id", value: task._id }),
                        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                        React.createElement("input", { className: "nodeSubmit", type: "submit", value: "Delete Task" })
                    )
                )
            );
        }
    });

    //Then, return all of the newly generated task nodes in a single div.
    return React.createElement(
        "div",
        { className: "taskList" },
        taskNodes
    );
};

//3 different methods to display tasks based on the different filters.
//Same general request, but just sending different requests to the router for the controller to do.
var loadTasksFromServer = function loadTasksFromServer(csrf) {
    sendAjax('GET', '/getTasks', $("#taskForm").serialize(), function (data) {
        ReactDOM.render(React.createElement(TaskList, { csrf: csrf, tasks: data.tasks }), document.querySelector("#tasks"));
    });
};

var loadCurrentTasksFromServer = function loadCurrentTasksFromServer(csrf) {
    sendAjax('GET', '/getCurrentTasks', $("#taskForm").serialize(), function (data) {
        ReactDOM.render(React.createElement(TaskList, { csrf: csrf, tasks: data.tasks }), document.querySelector("#tasks"));
    });
};

var loadCompletedTasksFromServer = function loadCompletedTasksFromServer(csrf) {
    sendAjax('GET', '/getCompletedTasks', $("#taskForm").serialize(), function (data) {
        ReactDOM.render(React.createElement(TaskList, { csrf: csrf, tasks: data.tasks }), document.querySelector("#tasks"));
    });
};

//Initial rendering of the ReactDOM elements.
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(TaskForm, { csrf: csrf }), document.querySelector("#makeTask"));

    ReactDOM.render(React.createElement(FilterForm, { csrf: csrf }), document.querySelector("#filterTasks"));

    ReactDOM.render(React.createElement(TaskList, { csrf: csrf, tasks: [] }), document.querySelector("#tasks"));

    loadTasksFromServer(csrf);
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
