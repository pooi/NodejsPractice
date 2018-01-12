module.exports = function(passport) {
    var conn = require('../../config/mysql/db')();
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var route = require('express').Router();
    route.post(
        '/login',
        passport.authenticate(
            'local', {
                successRedirect: '/welcome',
                failureRedirect: '/auth/login',
                failureFlash: false
            }
        )
    );
    route.get(
        '/facebook',
        passport.authenticate(
            'facebook', { scope: 'email' }
        )
    );
    route.get(
        '/facebook/callback',
        passport.authenticate(
            'facebook', {
                successRedirect: '/welcome',
                failureRedirect: '/auth/login'
            }
        )
    );
    var users = [{
        authId: 'local:egoing',
        username: 'egoing',
        password: 'mTi+/qIi9s5ZFRPDxJLY8yAhlLnWTgYZNXfXlQ32e1u/hZePhlq41NkRfffEV+T92TGTlfxEitFZ98QhzofzFHLneWMWiEekxHD1qMrTH1CWY01NbngaAfgfveJPRivhLxLD1iJajwGmYAXhr69VrN2CWkVD+aS1wKbZd94bcaE=',
        salt: 'O0iC9xqMBUVl3BdO50+JWkpvVcA5g2VNaYTR5Hc45g+/iXy4PzcCI7GJN5h5r3aLxIhgMN8HSh0DhyqwAp8lLw==',
        displayName: 'Egoing'
    }];
    route.post('/register', function(req, res) {
        hasher({ password: req.body.password }, function(err, pass, salt, hash) {
            var user = {
                authId: 'local:' + req.body.username,
                username: req.body.username,
                password: hash,
                salt: salt,
                displayName: req.body.displayName
            };
            var sql = 'INSERT INTO users SET ?';
            conn.query(sql, user, function(err, results) {
                if (err) {
                    console.log(err);
                    res.status(500);
                } else {
                    req.login(user, function(err) {
                        req.session.save(function() {
                            res.redirect('/welcome');
                        });
                    });
                }
            });
        });
    });
    route.get('/register', function(req, res) {
        res.render('auth/register')
    });
    route.get('/login', function(req, res) {
        res.render('auth/login');
    });
    route.get('/logout', function(req, res) {
        req.logout();
        req.session.save(function() {
            res.redirect('/welcome');
        });
    });
    return route;
};