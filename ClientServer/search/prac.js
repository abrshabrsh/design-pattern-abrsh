let fs = require('fs');

(function() {
    let users_object = {"whatever":"she says", "so": "what"};
    fs.writeFileSync('./json/users.json', JSON.stringify(users_object));
})();