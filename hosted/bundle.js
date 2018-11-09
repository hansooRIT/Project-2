"use strict";

var handleTask = function handleTask(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#taskName").val() == '' || $("#taskDesc").val() == '' || $("#taskDueDate").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
        loadTasksFromServer();
    });

    return false;
};

var handleDelete = function handleDelete(e) {
    e.preventDefault();

    if ($("#deleteName").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('DELETE', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), function () {
        loadTasksFromServer();
    });

    return false;
};

var TaskForm = function TaskForm(props) {
    return React.createElement(
        "form",
        { id: "taskForm", onSubmit: handleTask, name: "taskForm", action: "/maker", method: "POST", className: "taskForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "taskName", type: "text", name: "name", placeholder: "Task Name" }),
        React.createElement(
            "label",
            { htmlFor: "description" },
            "Description: "
        ),
        React.createElement("input", { id: "taskDesc", type: "text", name: "description", placeholder: "Task Description" }),
        React.createElement(
            "label",
            { htmlFor: "dueDate" },
            "Due Date: "
        ),
        React.createElement("input", { id: "taskDueDate", type: "date", name: "dueDate", placeholder: "Task Due Date" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeTaskSubmit", type: "submit", value: "Make Task" })
    );
};

var DeleteForm = function DeleteForm(props) {
    return React.createElement(
        "form",
        { id: "deleteForm", onSubmit: handleDelete, name: "deleteForm", action: "/delete", method: "DELETE", className: "deleteForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "deleteName", type: "text", name: "deleteName", placeholder: "Task Name" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "deleteTaskSubmit", type: "submit", value: "Delete Task" })
    );
};

var TaskList = function TaskList(props) {
    if (props.tasks.length === 0) {
        return React.createElement(
            "div",
            { className: "taskList" },
            React.createElement(
                "h3",
                { className: "emptyTask" },
                "No Tasks yet"
            )
        );
    }

    console.log(props.tasks);

    var taskNodes = props.tasks.map(function (task) {

        return React.createElement(
            "div",
            { key: task._id, className: "task" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
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
            React.createElement(
                "h3",
                { className: "taskDueDate" },
                "Due Date: ",
                task.dueDate,
                " "
            ),
            React.createElement("input", { type: "hidden", name: "taskOverdue", value: task.overdue })
        );
    });

    return React.createElement(
        "div",
        { className: "taskList" },
        taskNodes
    );
};

var loadTasksFromServer = function loadTasksFromServer() {
    sendAjax('GET', '/getTasks', null, function (data) {
        ReactDOM.render(React.createElement(TaskList, { tasks: data.tasks }), document.querySelector("#tasks"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(TaskForm, { csrf: csrf }), document.querySelector("#makeTask"));

    ReactDOM.render(React.createElement(DeleteForm, { csrf: csrf }), document.querySelector("#deleteTask"));

    ReactDOM.render(React.createElement(TaskList, { tasks: [] }), document.querySelector("#tasks"));

    loadTasksFromServer();
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
