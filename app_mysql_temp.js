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
app.set('views', './views_temp');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }))

function convertResult(results) {
    for (i = 0; i < results.length; i++) {
        var result = results[i];
        var subImage = new String(result.subImage);
        var images = subImage.split(",");
        result.mainImage = images[1];
        // console.log(images);
    }
    // console.log(results[0])
    // for (var result in results.RowDataPacket) {
    //     // console.log(result);
    //     var subImage = new String(result.subImage);
    //     var images = subImage.split(",");
    //     result.mainImage = images[1];
    // }
    return results
}

app.get('/', function(req, res) {
    // res.render('temp');
    // var page = 0;
    // var sql = 'SELECT * FROM attractionsTbl limit ?, 30';
    // conn.query(sql, [page], function(err, results, fields) {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send("Internal Server Error");
    //     }
    //     res.render('temp', { items: results, page: page });
    // });
    res.render('view');
});
app.get('/find', function(req, res) {
    // res.render('temp');
    var page = 0;
    var sql = 'SELECT * FROM attractionsTbl limit ?, 30';
    conn.query(sql, [page], function(err, results, fields) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
        res.render('find', { items: convertResult(results), page: page });
    });
});
app.post('/find', function(req, res) {
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
        res.render('find', { items: convertResult(results), page: page });
    });
})
app.get('/find/:page', function(req, res) {
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
        res.render('find', { items: convertResult(results), page: page });
    });
})

app.get('/test', function(req, res) {
    res.render('test');
});

app.listen(3000, function() {
    console.log('Connected, 3000 port!')
});