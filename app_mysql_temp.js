var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: '123456',
    database: 'o2'
});
conn.connect();

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
    // res.render('temp');
    var page = 0;
    var sql = 'SELECT * FROM attractionsTbl limit ?, 30';
    conn.query(sql, [page], function(err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        res.render('temp', { items: results, page: page });
    });
});
app.post('/', function(req, res) {
    var page = req.body.page;
    if (page) {
        page = parseInt(page);
    } else {
        page = 0;
    }
    var page2 = page * 30;
    var sql = 'SELECT * FROM attractionsTbl limit ?, 30';
    conn.query(sql, [page2], function(err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        res.render('temp', { items: results, page: page });
    });
})
app.get('/:page', function(req, res) {
    var page = req.params.page;
    if (page) {
        page = parseInt(page);
    } else {
        page = 0;
    }
    var page2 = page * 30;
    var sql = 'SELECT * FROM attractionsTbl limit ?, 30';
    conn.query(sql, [page2], function(err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        res.render('temp', { items: results, page: page });
    });
})

app.get('/test', function(req, res) {
    res.render('test');
});

app.listen(3000, function() {
    console.log('Connected, 3000 port!')
});