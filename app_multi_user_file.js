var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var app = express();

app.use(session({
    secret: '123IH2@OH%K2k32j4@#LBK2b5k24n',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/count', function(req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});

app.get('/auth/logout', function(req, res) {
    delete req.session.displayName;
    res.redirect('/welcome');
});

app.get('/welcome', function(req, res) {
    if (req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">logout</a>
        `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
        `);
    }
});

var users = [{
    username: 'egoing',
    password: 'cqPimNz9A9vMsXgEq1SkcHw3FegIJvBncIek1fc4ZzLM71iUaC7A2YYjvlUsxXpnIOcqDyRKVnIt1ODe/Uc0ZgFiyLtNdvwNppVZelQ8iwWMAqLTmkLZgBBRbDM8YeP5UUKaIqsffwhIqqEmwpUSk3NlCbnwDYKEAskrhBOxc1w=',
    salt: 'VwymOm1CpCqNjrOIsF/W/LhL51FjVztZhfszyuwkVHETJh7gEJJxFhVqKkRt5jXai/Tfwcx3+ZQmx2VhF3Wbtw==',
    displayName: 'Egoing'
}]
var salt = '@$*&@*%@$ainwhibfanwaf234';
app.post('/auth/login', function(req, res) {
    var user = {
        username: 'egoing',
        password: 'cqPimNz9A9vMsXgEq1SkcHw3FegIJvBncIek1fc4ZzLM71iUaC7A2YYjvlUsxXpnIOcqDyRKVnIt1ODe/Uc0ZgFiyLtNdvwNppVZelQ8iwWMAqLTmkLZgBBRbDM8YeP5UUKaIqsffwhIqqEmwpUSk3NlCbnwDYKEAskrhBOxc1w=',
        salt: 'VwymOm1CpCqNjrOIsF/W/LhL51FjVztZhfszyuwkVHETJh7gEJJxFhVqKkRt5jXai/Tfwcx3+ZQmx2VhF3Wbtw==',
        displayName: 'Egoing'
    };
    var uname = req.body.username;
    var pwd = req.body.password;
    if (uname === user.username) {
        return hasher({ password: pwd, salt: user.salt }, function(err, pass, salt, hash) {
            if (hash === user.password) {
                req.session.displayName = user.displayName;
                req.session.save(function() {
                    res.redirect('/welcome');
                });
            } else {
                res.send('Who are you? <a href="/auth/login">login</a>');
            }
        });
    }
    res.send('Who are you? <a href="/auth/login">login</a>');
    // if (uname === user.username && sha256(pwd + user.salt) === user.password) {
    //     req.session.displayName = user.displayName;
    //     res.redirect('/welcome');
    // } else {
    //     res.send('Who are you? <a href="/auth/login">login</a>');
    // }
});

app.get('/tmp', function(req, res) {
    res.send(`<form method="post" enctype="multipart/form-data" action="/upload">
    <input type="file" name="file">
    <input type="submit" value="Submit">
</form>`);
});

app.get('/auth/login', function(req, res) {
    var output = `
        <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
    `;
    res.send(output);
});

app.listen(3003, function() {
    console.log('Connected 3003 port.');
});