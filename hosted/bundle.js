"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoNotes").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
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
        loadDomosFromServer();
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm", onSubmit: handleDomo, name: "domoForm", action: "/maker", method: "POST", className: "domoForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement(
            "label",
            { htmlFor: "notes" },
            "Notes: "
        ),
        React.createElement("input", { id: "domoNotes", type: "text", name: "notes", placeholder: "Domo Notes" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
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
        React.createElement("input", { id: "deleteName", type: "text", name: "deleteName", placeholder: "Domo Name" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "deleteDomoSubmit", type: "submit", value: "Delete Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo, csrf) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoNotes" },
                "Notes: ",
                domo.notes,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DeleteForm, { csrf: csrf }), document.querySelector("#deleteDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    loadDomosFromServer();
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
