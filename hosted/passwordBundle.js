"use strict";

var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#oldPass").val() == '' || $("#pass1").val() == '' || $("#pass2").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    console.log($("#pass1").val());
    console.log($("#pass2").val());

    sendAjax('POST', $("#passwordChangeForm").attr("action"), $("#passwordChangeForm").serialize(), redirect);

    return false;
};

var PasswordChangeWindow = function PasswordChangeWindow(props) {
    return React.createElement(
        "form",
        { id: "passwordChangeForm", name: "passwordChangeForm", onSubmit: handlePasswordChange, action: "/passwordChange", method: "POST", className: "mainForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "username", type: "text", name: "username", placeholder: "Username" }),
        React.createElement(
            "label",
            { htmlFor: "oldPass" },
            "Old Password: "
        ),
        React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "oldPassword" }),
        React.createElement(
            "label",
            { htmlFor: "pass1" },
            "New Password: "
        ),
        React.createElement("input", { id: "pass1", type: "password", name: "pass1", placeholder: "Password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Re-enter password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "password2" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Change password" })
    );
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PasswordChangeWindow, { csrf: csrf }), document.querySelector("#content"));
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
