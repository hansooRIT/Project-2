const handlePasswordChange = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
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

const PasswordChangeWindow = (props) => {
    return (
        <form id="passwordChangeForm" name="passwordChangeForm" onSubmit={handlePasswordChange} action="/passwordChange" method="POST" className="mainForm">
            <label htmlFor="username">Username: </label>
            <input id="username" type="text" name="username" placeholder="Username"/>
            <label htmlFor="oldPass">Old Password: </label>
            <input id="oldPass" type="password" name="oldPass" placeholder="oldPassword"/>
            <label htmlFor="pass1">New Password: </label>
            <input id="pass1" type="password" name="pass1" placeholder="Password"/>
            <label htmlFor="pass2">Re-enter password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="password2"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Change password"/>
        </form>
    );
};

const setup = (csrf) => {
    ReactDOM.render(
        <PasswordChangeWindow csrf={csrf} />, document.querySelector("#content")
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
