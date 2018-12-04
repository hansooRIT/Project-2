"use strict";

//Handles request for password changing.
//Fires error if all of the parameters are not filled. Otherwise, send an ajax request.
var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#oldPass").val() == '' || $("#pass1").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    sendAjax('POST', $("#passwordChangeForm").attr("action"), $("#passwordChangeForm").serialize(), redirect);
    return false;
};

//Handles requests for setting an account to premium.
//Requires an email for saving to the database entry.
var handlePremiumUser = function handlePremiumUser(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#email").val() == '') {
        handleError("Email required to be premium user!");
        return false;
    }
    sendAjax('POST', $("#premiumUserForm").attr("action"), $("#premiumUserForm").serialize(), redirect);
    return false;
};

//Handles requests for setting an account to premium.
//Requires an email for saving to the database entry.
var handleEmail = function handleEmail(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#emailRecipient").val() == '') {
        handleError("Specify email address to send mail to!");
        return false;
    }
    sendAjax('POST', $("#emailForm").attr("action"), $("#emailForm").serialize(), redirect);
    return false;
};

//Form for password changing.
//Takes in username, old password, and 2 instances of new password.
var PasswordChangeWindow = function PasswordChangeWindow(props) {
    return React.createElement(
        "form",
        { id: "passwordChangeForm", name: "passwordChangeForm", onSubmit: handlePasswordChange, action: "/passwordChange", method: "POST", className: "passwordChangeForm" },
        React.createElement(
            "h3",
            null,
            "Change your password?"
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Username" }),
        React.createElement("br", null),
        React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "Old Password" }),
        React.createElement("br", null),
        React.createElement("input", { id: "pass", type: "password", name: "pass1", placeholder: "New Password" }),
        React.createElement("br", null),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "Re-enter password" }),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("br", null),
        React.createElement("input", { className: "passwordChangeSubmit", type: "submit", value: "Change password" }),
        React.createElement("hr", null)
    );
};

//Form for setting an account to premium.
//Only takes in email in order to add it to account database entry.
var PremiumUserWindow = function PremiumUserWindow(props) {
    return React.createElement(
        "form",
        { id: "premiumUserForm", name: "premiumUserForm", onSubmit: handlePremiumUser, action: "/premium", method: "POST", className: "premiumUserForm" },
        React.createElement(
            "h3",
            null,
            "Become a premium user?"
        ),
        React.createElement(
            "p",
            null,
            "Pay a small fee of $2 per month for additional features!"
        ),
        React.createElement("input", { id: "email", type: "text", name: "email", placeholder: "Email" }),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "premiumUserSubmit", type: "submit", value: "Become premium" }),
        React.createElement("hr", null)
    );
};

var EmailWindow = function EmailWindow(props) {
    return React.createElement(
        "form",
        { id: "emailForm", name: "emailForm", onSubmit: handleEmail, action: "/sendEmail", method: "POST", className: "emailForm" },
        React.createElement(
            "h3",
            null,
            "Send Email?"
        ),
        React.createElement("input", { id: "emailRecipient", type: "text", name: "emailRecipient", placeholder: "Email" }),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "emailSubmit", type: "submit", value: "Send" }),
        React.createElement("hr", null)
    );
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PremiumUserWindow, { csrf: csrf }), document.querySelector("#premiumUser"));

    ReactDOM.render(React.createElement(PasswordChangeWindow, { csrf: csrf }), document.querySelector("#passwordChange"));

    ReactDOM.render(React.createElement(EmailWindow, { csrf: csrf }), document.querySelector("#sendEmail"));
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
