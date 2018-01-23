var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
    res.render('users', {'users':users, 'title':'Users'});
});

var users = [];

var User = function(fname, lname, phone) {
    this.FirstName = fname;
    this.LastName = lname;
    this.Phone = phone;
};

function initUsers() {
    var player = new User ('Joe', 'Walsh',   'abc-def-ghij');
    users.push(player);
    users.push(new User('Keith', 'Richards', '801-AC5-2030'));
    users.push(new User('Joe',   'Cocker',   '801-FR3-7789'));
    users.push(new User('B.B.',  'King',     ''));
}

initUsers();

module.exports = router;
