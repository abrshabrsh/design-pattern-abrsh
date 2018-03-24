let btn_submit_login = document.getElementById('btn-submit-login');
let login_message_container = document.getElementById('login-message');

// a callback function that displays 
// success message and a login form,
// or an error-message and a signup form
let display_login_message = function() {

    if (this.readyState == XMLHttpRequest.DONE) {
        
        if (this.status == 200){
            login_message_container.innerHTML = this.responseText;
        }   

    }

};

// when login form's submit button is clicked,
// try authenticate user asynchronously
btn_submit_login.onclick = function() {

    // get the form element where the data is located
    let form_element = document.querySelector("form");

    // prepare and send the ajax registration request
    let request = new XMLHttpRequest();
    request.onreadystatechange = display_login_form;
    request.open("POST", "/login");
    request.send(new FormData(form_element));    

};