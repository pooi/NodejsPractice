var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: '123456',
    database: 'o2'
});
conn.connect();

// connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

// var sql = 'SELECT * FROM topic';
// conn.query(sql, function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//     } else {
//         for (var i = 0; i < rows.length; i++) {
//             console.log(rows[i].title);
//         }
//     }
// });

// var sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)';
// var params = ['Supervisor', 'Watcher', 'graphittie'];
// conn.query(sql, params, function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(rows.insertId);
//     }
// });

// var sql = 'UPDATE topic SET title=? WHERE id=?';
// var params = ['npm', 3];
// conn.query(sql, params, function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(rows);
//     }
// });

var sql = 'DELETE FROM topic WHERE id=?';
var params = [6];
conn.query(sql, params, function(err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});

conn.end();