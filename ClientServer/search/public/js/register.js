let btn_submit_register = document.getElementById('btn-submit-register');
let main_content = document.getElementById('main-content');

// a callback function that displays 
// success message and a login form,
// or an error-message and a signup form
let display_login_form = function() {

    if (this.readyState == XMLHttpRequest.DONE) {
        
        if (this.status == 200){
            main_content.innerHTML = this.responseText;
        }   

    }

};

// when form's submit button is clicked,
// try register user asynchronously
btn_submit_register.onclick = function() {

    // get the form element where the data is located
    let form_element = document.querySelector("#register-form");

    alert(form_element);
    
    // prepare and send the ajax registration request
    let request = new XMLHttpRequest();
    request.onreadystatechange = display_login_form;
    request.open("POST", "/register");
    request.send(new FormData(form_element));    

    return false;

};