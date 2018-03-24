// import all the relevant modules here
let express = require("express");
let bodyParser = require("body-parser");
let fs = require('fs');

// instantiate the app
let app = express();

// disable caching to avoid 304 responses
app.disable('etag');

// register the body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

// register the middleware for serving static pages
app.use(express.static('public'));

// serve the dictionary search-form at the 
// request for the index page
app.get('/', function(request, response) {

    response.header('Content-Type', 'text/html');
    
    // read the base html file
    let base_html = fs.readFileSync(
        './views/base.html', 'utf-8');   
    // read the form-component file
    let home = fs.readFileSync(
        './views/home.html');     
    // insert the search form into the base html
    let place_holder = '{main-content}';
    let resp = base_html.replace(place_holder, home);
    // send the combined html to the user
    response.send(resp);

});

// serve the addowrd form
app.get('/home/', function(request, response) {
    
    response.header('Content-Type', 'text/html');

    // read the form-component file
    let home = fs.readFileSync(
        './views/home.html', 'utf-8');  
        
    // send the combined html to the user
    response.send(home);
    
});

// do a dictionary search
app.get('/dictionary/', function(request, response) {
    
    response.header('Content-Type', 'text/plain');

    let word = request.query['word'].trim().toUpperCase();    

    let dictionary_text = fs.readFileSync('./json/words.json', 'utf-8');

    let dictionary = JSON.parse(dictionary_text);

    let resp; // response container

    let result = dictionary[word];

    if(result) {
        resp = result;
    } else {
        resp = 'Word not found!';          
    }

    response.send(resp);
    
})

// provide max of 5 suggestion words, for
// a word that a user has typed in
app.get('/suggestion/', function(request, response) {
    
        response.header('Content-Type', 'text/plain');

        let key = request.query['word'].trim().toUpperCase();    

        // if word is empty string, give no suggestion
        if(key === '') {
            response.send('');
            return;
        }

        let dictionary_text = fs.readFileSync(
            './json/words.json', 'utf-8');

        let dictionary = JSON.parse(dictionary_text);

        let words_list = '';

        let num_suggestions = 0;

        for (word in dictionary) {
            // limit num suggestions to 5
            if (num_suggestions > 5) {
                break;
            }
            if (word.startsWith(key)) {
                words_list += `<li> <a class='search-anchor'
                 href='#'> ${ word.toLowerCase() } </a></li>`
                num_suggestions += 1;
            }
        }

        let resp = `<ul>${ words_list }</ul>`;

        response.send(resp);
    
})

// token-authenticate middleware
let authenticateWithToken = function(request, response, next) {
    // extract token from request
    let token = request.query.token;
    const tokens_data_path = './json/tokens.json';
    let tokens_json = fs.readFileSync(tokens_data_path, 'utf-8');        
    let tokens = JSON.parse(tokens_json);  
    if (tokens[token]) {
        next();
    } else {
        response.header('Content-Type', 'application/json');
        response.send({
            "error" : "You need to login first!"
        });
    }   
};

// serve the addowrd form
app.get('/addword-form/', authenticateWithToken,  function(request, response) {
    
    response.header('Content-Type', 'application/json');

    // read the form-component file
    let addowrd_form = fs.readFileSync(
        './views/addword.html', 'utf-8');  
        
    // send the html to the user
    response.send({
        "form" : addowrd_form
    });
    
});

// serve the addowrd form
app.get('/edit-meaning-form/', authenticateWithToken,  function(request, response) {
    
    response.header('Content-Type', 'application/json');

    // read the form-component file
    let edit_meaning_form = fs.readFileSync(
        './views/edit_meaning.html', 'utf-8');  
        
    // send the html to the user
    response.send({
        "form" : edit_meaning_form
    });    
});

app.get('/addword/', function(request, response) {
    
    response.header('Content-Type', 'text/plain');

    const dictionary_data_path = './json/words.json';
    
    //= read the dictionary json
    let dictionary_json = fs.readFileSync(dictionary_data_path, 'utf-8');        
    //= convert dictionary_json to dictionary_object
    let dictionary = JSON.parse(dictionary_json);  
       
    //= extract the new word and meaning from the query
    let word = request.query.word.trim().toUpperCase();
    let meaning = request.query.meaning;   

    //= if word is not new, send a not new message
    let message = 'Word Successfully Added!';
    if (dictionary[word]) {
        message = 'The word is already in dictionary.';
    } else {
        //= if word is new, add to dictionary
        dictionary[word] = meaning;
        fs.writeFileSync(dictionary_data_path, JSON.stringify(dictionary));
    }

    response.send(message);
    
})

app.get('/edit-meaning/', function(request, response) {
    
    response.header('Content-Type', 'text/plain');

    const dictionary_data_path = './json/words.json';
    
    //= read the dictionary json
    let dictionary_json = fs.readFileSync(dictionary_data_path, 'utf-8');        
    //= convert dictionary_json to dictionary_object
    let dictionary = JSON.parse(dictionary_json);  
       
    //= extract the new word and meaning from the query
    let word = request.query.word.trim().toUpperCase();
    let meaning = request.query.meaning;   

    //= if word is not new, send a not new message
    let message = 'Defnition Successfully Updated!';
    if (!dictionary[word]) {
        message = 'No such word in dictionary!';
    } else {
        //= if word is new, add to dictionary
        dictionary[word] = meaning;
        fs.writeFileSync(dictionary_data_path, JSON.stringify(dictionary));
    }

    response.send(message);
    
})

// AUTHENTICATION stuff
app.get('/registration-form/', function(request, response) {

    response.header('Content-Type', 'text/html');

    // read the form-component file
    let registration_form = fs.readFileSync(
        './views/register.html', 'utf-8');  
        
    // send the combined html to the user
    response.send(registration_form);

});

app.post('/register/', function(request, response) {
    
    response.header('Content-Type', 'text/plain');

    const users_data_path = './json/users.json';
    const register_form_path = './views/register.html';
    //= read the users json
    let users_json = fs.readFileSync(users_data_path, 'utf-8');        
    //= convert users_json to users_object
    let users_object = JSON.parse(users_json);        
    //= update the users_object
    let username = request.body.username;
    let password = request.body.password;
    
    // update json_object and overwrite json_file
    // if valid username is provided
    let message = "Invalid username and password";
    let form_to_send = fs.readFileSync(register_form_path, 'utf-8');  ;

    if (!users_object[username]) {

        message = "Successfully Registerd!";
        users_object[username] = password;
        fs.writeFileSync(users_data_path, JSON.stringify(users_object));
              
    }

    response.send(message);
    
})

app.get('/login-form/', function(request, response) {
    
    response.header('Content-Type', 'text/html');

    // read the form-component file
    let login_form = fs.readFileSync(
        './views/login.html', 'utf-8');  
        
    response.send(login_form);

});
    
app.post('/login/', function(request, response) {
    
    response.header('Content-Type', 'application/json');

    const users_data_path = './json/users.json';
    const login_form_path = './views/login.html';
    //= read the users json
    let users_json = fs.readFileSync(users_data_path, 'utf-8');        
    //= convert users_json to users_object
    let users_object = JSON.parse(users_json);        
    //= update the users_object
    let username = request.body.username.trim();
    let password = request.body.password.trim();
    
    // check for password matching
    let resp = {
        "username" : "Guest",
         "message" : "Invalid username and password"
    };
    let form_to_send = fs.readFileSync(login_form_path, 'utf-8');  ;

    if (users_object[username] === password) {
        resp.message = "Successfully Logged In!";    
        // generate bearer token
        let token = '';
        for(let i = 0; i < username.length; i++) {
            for(let j = 0; j < i; j++) {
                if(j % 3 == 0) {
                    token += (username[i]+username[j])
                } else {
                    token += (username[j]+username[i])                    
                }
            }
        }     
        // save token
        const tokens_data_path = './json/tokens.json';
        let tokens_json = fs.readFileSync(tokens_data_path, 'utf-8');        
        let tokens = JSON.parse(tokens_json);   
        console.log('TOKEN IS: ', token);
        tokens[token] = {
            "username" : username,
            "created" : Date.now().toString()
        };
        fs.writeFileSync(tokens_data_path, JSON.stringify(tokens));
        // add token to resp
        resp.token = token;
        resp.username = username;
    }

    response.send(resp);
    
})

// tell express to listen to the specified port
app.listen(8000);
