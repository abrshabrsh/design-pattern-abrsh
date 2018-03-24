
let bootstrapper = function() {

// get the dom elements that will be accessed or manipulated
let main_content = document.getElementById('main-content');
let search_box = document.getElementById('search-box');
let go_button = document.getElementById('go-button');
let word_placeholder = document.getElementById('word-placeholder');
let meaning_placeholder = document.getElementById('meaning-placeholder');
let suggestion_container = document.getElementById('suggestion-container');
let login_button = document.getElementById('btn-login-form');
let register_button = document.getElementById('btn-register-form');
let add_word_button = document.getElementById('btn-add-word');
let edit_meaning_button = document.getElementById('btn-edit-meaning');
let hidden_username = document.getElementById('hidden-current-user');
let token_field = document.getElementById('id_token');
let auth_err_container = document.getElementById('auth-error');

// a callback function for displaying the definition
let display_definition = function() {

    if (this.readyState == XMLHttpRequest.DONE) {

        if (this.status == 200){

            // empty the suggestion container
            suggestion_container.innerHTML = '';
            // put the meaning in the meaning placeholder               
            meaning_placeholder.innerText = this.responseText;

        } else {

            word_placeholder.innerText = '';                
            meaning_placeholder.innerText = '';        

        }

    }
};

// asynchronous ajax search request
let ajax_search = function(event, word){

    let search_key = word || search_box.value;
    // put the search-key in the word place holder
    word_placeholder.innerText = `${ search_key.toUpperCase() } :`; 
    search_box.value = search_key;

    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = display_definition;
    httpRequest.open('GET', '/dictionary?word=' + search_key, true);
    httpRequest.send();

};

// send a search request when go button is clicked
go_button.onclick = function(event) {
    // hide auth-error in case
    auth_err_container.style.display = 'none';
    ajax_search(event);
};

// attach click listeners to the search-key anchors
function attachOnClickListeners() {

    let anchors_list = document.getElementsByClassName("search-anchor");

    for (let i = 0, len = anchors_list.length; i < len; i++){
        anchors_list[i].onclick = function(event) {
            ajax_search(event, this.innerText.trim());
            return false; // prevent redirection to the href value
        };
    }                        

};

// a callback function for displaying the definition
let display_suggestion = function() {

    if (this.readyState == XMLHttpRequest.DONE) {

        if (this.status == 200){

            // update the suggestion container
            suggestion_container.innerHTML = this.responseText;
            attachOnClickListeners();
            
            // empty the word and meaning placeholders
            word_placeholder.innerText = '';                
            meaning_placeholder.innerText = '';      

        } else {

            // display nothing upon request failure
            suggestion_container.innerHTML = '';            
            word_placeholder.innerText = '';                
            meaning_placeholder.innerText = '';        

        }

    }
};

    
// provide suggestion as the user types in
// a search keyword
search_box.oninput = function(){

    // hide auth-error in case
    auth_err_container.style.display = 'none';

    // get the typed in search-key
    let search_key = search_box.value;

    // prepare and send the ajax request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = display_suggestion;    
    httpRequest.open('GET', '/suggestion?word=' + search_key, true);
    httpRequest.send();

};

// function that attaches click listener
// to the registration-form's submit button
let attachClickListenerToRegisterSubmit = function() {

    let msg_container = document.getElementById('msg-register');
    
    // a callback function that displays 
    // success or failure message
    let display_register_message = function() {
    
        if (this.readyState == XMLHttpRequest.DONE) {
            
            if (this.status == 200){                
                msg_container.innerHTML = this.responseText;
            }   
    
        }
    
    };

    let btn_submit_register = document.getElementById('btn-submit-register');
    
    // when form's submit button is clicked,
    // try register user asynchronously
    btn_submit_register.onclick = function() {
    
        // get the username and password values
        let username = document.getElementById('id_username').value;
        let password = document.getElementById('id_password').value;
        let request_body = `username=${ username }&password=${ password }`;
        
        // prepare and send the ajax registration request
        let request = new XMLHttpRequest();
        request.onreadystatechange = display_register_message;
        request.open("POST", "/register");
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        request.send(request_body);    
    
        return false;

    };

    // also attach click listener to the home button
    let btn_home = document.getElementById('btn-home');
    btn_home.onclick = get_home_page;    
    
};

// callback function that displays the registration form
let display_registration_form = function() {
    
    if (this.readyState == XMLHttpRequest.DONE) {
        
        if (this.status == 200){
            main_content.innerHTML = this.responseText;
            attachClickListenerToRegisterSubmit();
        }   

    }

};

// when register button is clicked, 
// serve the registration form
register_button.onclick = function(){
    
    // prepare and send the ajax request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = display_registration_form;    
    httpRequest.open('GET', '/registration-form', true);
    httpRequest.send();
    
};

// function that attaches click listener
// to the login-form's submit button
let attachClickListenerToLoginSubmit = function() {
    
    let msg_container = document.getElementById('msg-login');
    
    // a callback function that displays 
    // success or failure message
    let display_login_message = function() {
    
        if (this.readyState == XMLHttpRequest.DONE) {
            
            if (this.status == 200){       
                let resp_body = JSON.parse(this.responseText);         
                msg_container.innerHTML = resp_body.message;
                hidden_username.value = resp_body.username;
                if(resp_body.token) {
                    token_field.value = resp_body.token;
                }
            }   
    
        }
    
    };

    let btn_submit_login = document.getElementById('btn-submit-login');
    
    // when form's submit button is clicked,
    // try login user asynchronously
    btn_submit_login.onclick = function() {
    
        // get the username and password values
        let username = document.getElementById('id_username').value;
        let password = document.getElementById('id_password').value;
        let request_body = `username=${ username }&password=${ password }`;
        
        // prepare and send the ajax registration request
        let request = new XMLHttpRequest();
        request.onreadystatechange = display_login_message;
        request.open("POST", "/login");
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        request.send(request_body);    
    
        return false;

    };

    // also attach click listener to the home button
    let btn_home = document.getElementById('btn-home');
    btn_home.onclick = get_home_page;    
    
};

// callback function that displays the login form
let display_login_form = function() {
    
    if (this.readyState == XMLHttpRequest.DONE) {
        
        if (this.status == 200){
            main_content.innerHTML = this.responseText;
            attachClickListenerToLoginSubmit();
        }   

    }

};

// when login button is clicked, 
// serve the login form
login_button.onclick = function(){
    
    // prepare and send the ajax request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = display_login_form;    
    httpRequest.open('GET', '/login-form', true);
    httpRequest.send();
    
};

// function that attaches click listener
// to the addword-form's submit button
let attachClickListenerToAddwordSubmit = function() {
            
    // a callback function that displays 
    // success or failure message
    let display_addword_message = function() {
    
        if (this.readyState == XMLHttpRequest.DONE) {
            
            if (this.status == 200){
                let msg_container = document.getElementById('addword-msg-container');
                msg_container.innerHTML = this.responseText;
            }   
    
        }
    
    };
    
    let btn_submit_addword = document.getElementById('btn-submit-addword');

    // when form's submit button is clicked,
    // try to add word asynchronously
    btn_submit_addword.onclick = function() {
    
        // get the word and meaning values
        let word = document.getElementById('id_word').value;
        let meaning = document.getElementById('id_meaning').value;
        let query_string = `/addword?word=${ word }&meaning=${ meaning }`;
        
        // prepare and send the ajax add-word request
        let request = new XMLHttpRequest();
        request.onreadystatechange = display_addword_message;
        request.open("GET", query_string);
        request.send();    
    
        return false;

    };

    // also attach click listener to the home button
    let btn_home = document.getElementById('btn-home');
    btn_home.onclick = get_home_page;

};

// callback function that displays the addword form
let display_addword_form = function() {
    
    if (this.readyState == XMLHttpRequest.DONE) {
        
        if (this.status == 200){
            let resp_body = JSON.parse(this.responseText);
            if(resp_body.error) {
                auth_err_container.style.display = 'block';
                auth_err_container.innerText = resp_body.error;
            } else {
                main_content.innerHTML = resp_body.form;
                attachClickListenerToAddwordSubmit();
            }

        }   

    }

};

// when add-word button is clicked, 
// serve the add word form
add_word_button.onclick = function(){
    
    // prepare and send the ajax request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = display_addword_form;    
    httpRequest.open('GET', `/addword-form?token=${ token_field.value }`, true);
    httpRequest.send();
    
};

// function that attaches click listener
// to the edit-meaning-form's submit button
let attachClickListenersToEditMeaningForm = function() {
          
    let msg_container = document.getElementById('edit-msg-container');
    msg_container.style.display = 'none';
    
    let display_meaning = function() {

        if (this.readyState == XMLHttpRequest.DONE) {
            
            if (this.status == 200){
                msg_container.style.display = 'none';                
                let defn_container = document.getElementById('id_meaning');
                defn_container.value = this.responseText;
            }   
    
        }

    };

    let btn_fetch_meaning = document.getElementById('btn-fetch-meaning');  
      
    btn_fetch_meaning.onclick = function() {
    
        // get search-key
        let search_key = document.getElementById('id_word').value;
        
        // prepare and send the ajax edit-meaning request
        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = display_meaning;
        httpRequest.open('GET', '/dictionary?word=' + search_key, true);
        httpRequest.send();
    
        return false;

    };

    // a callback function that displays 
    // success or failure message
    let display_edit_message = function() {
    
        if (this.readyState == XMLHttpRequest.DONE) {
            
            if (this.status == 200){
                msg_container.style.display = 'block';
                msg_container.innerHTML = this.responseText;
            }   
    
        }
    
    };
    
    let btn_submit_edit = document.getElementById('btn-submit-edit');

    // when form's submit button is clicked,
    // try to add word asynchronously
    btn_submit_edit.onclick = function() {
    
        // get the word and meaning values
        let word = document.getElementById('id_word').value;
        let meaning = document.getElementById('id_meaning').value;
        let query_string = `/edit-meaning?word=${ word }&meaning=${ meaning }`;
        
        // prepare and send the ajax edit-meaning request
        let request = new XMLHttpRequest();
        request.onreadystatechange = display_edit_message;
        request.open("GET", query_string);
        request.send();    
    
        return false;

    };

    // also attach click listener to the home button
    let btn_home = document.getElementById('btn-home');
    btn_home.onclick = get_home_page;

};

// callback function that displays the edit-meaning form
let display_edit_meaning_form = function() {
    
    if (this.readyState == XMLHttpRequest.DONE) {
        
        if (this.status == 200){
            let resp_body = JSON.parse(this.responseText);
            if(resp_body.error) {
                auth_err_container.style.display = 'block';
                auth_err_container.innerText = resp_body.error;
            } else {
                main_content.innerHTML = resp_body.form;
                attachClickListenersToEditMeaningForm();
            }
        }   

    }

};

// when edit-meaning button is clicked, 
// serve the edit-meaning form
edit_meaning_button.onclick = function(){
    
    // prepare and send the ajax request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = display_edit_meaning_form;    
    httpRequest.open('GET', `/edit-meaning-form?token=${ token_field.value }`, true);
    httpRequest.send();
    
};

// function to display the home page asynchronously
let display_home = function() {
    
    if (this.readyState == XMLHttpRequest.DONE) {
        
        if (this.status == 200){
            main_content.innerHTML = this.responseText;
            bootstrapper();
        }   

    }

};

// a function to return to home
let get_home_page = function() {
    // prepare and send the ajax request
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = display_home;    
    httpRequest.open('GET', '/home', true);
    httpRequest.send();    
}

let username_container = document.getElementById('current-user');
username_container.innerText = hidden_username.value;

};

// bootstrap your app
bootstrapper();


