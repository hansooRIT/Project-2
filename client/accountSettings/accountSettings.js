//Handles request for password changing.
//Fires error if all of the parameters are not filled. Otherwise, send an ajax request.
const handlePasswordChange = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if ($("#user").val() == '' || $("#oldPass").val() == '' || $("#pass1").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required!");
        return false;
    }
    sendAjax('POST', $("#passwordChangeForm").attr("action"), $("#passwordChangeForm").serialize(), redirect);
    return false;
};

//Handles requests for setting an account to premium.
//Requires an email for saving to the database entry.
const handlePremiumUser = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if ($("#email").val() == '') {
        handleError("Email required to be premium user!");
        return false;
    }
    sendAjax('POST', $("#premiumUserForm").attr("action"), $("#premiumUserForm").serialize(), redirect);
    return false;
};

//Form for password changing.
//Takes in username, old password, and 2 instances of new password.
const PasswordChangeWindow = (props) => {
    return (
        <form id="passwordChangeForm" name="passwordChangeForm" onSubmit={handlePasswordChange} action="/passwordChange" method="POST" className="passwordChangeForm">
            <h3>Change your password?</h3>
            <input id="user" type="text" name="username" placeholder="Username"/><br/>
            <input id="oldPass" type="password" name="oldPass" placeholder="Old Password"/><br/>
            <input id="pass" type="password" name="pass1" placeholder="New Password"/><br/>
            <input id="pass2" type="password" name="pass2" placeholder="Re-enter password"/><br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <br/>
            <input className="passwordChangeSubmit" type="submit" value="Change password"/>
            <hr/>
        </form>
    );
};

//Form for setting an account to premium.
//Only takes in email in order to add it to account database entry.
const PremiumUserWindow = (props) => {
    return (
        <form id="premiumUserForm" name="premiumUserForm" onSubmit={handlePremiumUser} action="/premium" method="POST" className="premiumUserForm">
            <h3>Become a premium user?</h3>
            <p>Pay a small fee of $2 per month for additional features!</p>
            <input id="email" type="text" name="email" placeholder="Email"/><br/><br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="premiumUserSubmit" type="submit" value="Become premium"/>
            <hr/>
        </form>
    );
};

const setup = (csrf) => {
    ReactDOM.render(
        <PremiumUserWindow csrf={csrf} />, document.querySelector("#premiumUser")
    );
    
    ReactDOM.render(
        <PasswordChangeWindow csrf={csrf} />, document.querySelector("#passwordChange")
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
