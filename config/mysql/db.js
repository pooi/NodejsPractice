module.exports = function() {
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: '123456',
        database: 'o2'
    });
    conn.connect();
    return conn;
}