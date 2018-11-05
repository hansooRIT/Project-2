const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoNotes").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const handleDelete = (e) => {
    e.preventDefault();
    
    if ($("#deleteName").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('DELETE', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="notes">Notes: </label>
            <input id="domoNotes" type="text" name="notes" placeholder="Domo Notes"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};


const DeleteForm = (props) => {
    return (
        <form id="deleteForm" onSubmit={handleDelete} name="deleteForm" action="/delete" method="DELETE" className="deleteForm">
            <label htmlFor="name">Name: </label>
            <input id="deleteName" type="text" name="deleteName" placeholder="Domo Name"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="deleteDomoSubmit" type="submit" value="Delete Domo"/>
        </form>
    );
};

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo, csrf) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age} </h3>
                <h3 className="domoNotes">Notes: {domo.notes} </h3>
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DeleteForm csrf={csrf}/>, document.querySelector("#deleteDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]}/>, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});