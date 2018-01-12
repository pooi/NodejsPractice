module.exports = function(app) {
    var conn = require('./db')();
    var bkfd2Password = require("pbkdf2-password");
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var hasher = bkfd2Password();

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('serializeUser', user);
        done(null, user.authId);
    });
    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser', id);
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [id], function(err, results) {
            if (err) {
                console.log(err);
                done('There is no user.');
            } else {
                done(null, results[0]);
            }
        });
        // for (var i = 0; i < users.length; i++) {
        //     var user = users[i];
        //     if (user.authId === id) {
        //         return done(null, user);
        //     }
        // }
        // done('There is no user.');
    });
    passport.use(new LocalStrategy(
        function(username, password, done) {
            var uname = username;
            var pwd = password;
            var sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, ['local:' + uname], function(err, results) {
                console.log(results);
                if (err) {
                    return done('There is no user.');
                }
                var user = results[0];
                return hasher({ password: pwd, salt: user.salt }, function(err, pass, salt, hash) {
                    if (hash === user.password) {
                        console.log('LocalStrategy', user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                });
            });
        }
    ));
    passport.use(new FacebookStrategy({
            clientID: '1602353993419626',
            clientSecret: '232bc1d3aca2199e6a27eb983e602e0b',
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            var authId = 'facebook:' + profile.id;
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.authId === authId) {
                    return done(null, user);
                }
            }
            var newuser = {
                'authId': authId,
                'displayName': profile.displayName,
                'email': profile.emails[0].value
            };
            users.push(newuser);
            done(null, newuser);
        }
    ));
    return passport;
}