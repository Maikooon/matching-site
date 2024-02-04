// サーバーサイドの処理を記述
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// データベースへの接続情報
const mysql_setting = {
    host: 'localhost',
    user: 'root',
    password: '3164maiko',
    port : 3306,
    database: 'test'
};

// データベースに接続
const connection = mysql.createConnection(mysql_setting);

// 接続のエラー処理
connection.connect((err) => {
    if (err) {
        console.log(`Error: ${err.stack}`);
        return;
    }
    console.log(`Success, ${connection.threadId}`);
});

// パスのルーティング
router.get('/', function (req, res, next) {
  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query(
    'SELECT * from test',
    function (error, results, fields) {
      //データベースアクセス完了時の処理
      if (error == null) {
        var data = {
          title: 'Index',
          content: results
        };
        res.render('index', data)
        console.log(results);
      }
    });
  //接続を解除
  connection.end();
});


//新規作成ページへのアクセス
router.get('/add', (req, res, next) => {
    var data = {
        title: 'Add',
        content: '新しいレコードを入力'
    };
    res.render('add', data);
});
//新規作成フォーム送信の処理
router.post('/add', (req, res, next) => {
  //新しく追加するデータをコンポーネント化
  var data = {
    'id': Number(req.body.id),
    'name': req.body.todo,
  };
  // データベースへの追加処理
  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
  // 実際のデータの挿入
  console.log(data);    //デバック用  
  sql ='insert into test set ?';
  connection.query(sql, data, function (error, results, fields) {
    
  });
  //デバック表示用
  connection.query('SELECT * FROM test', function (error, results, fields) {
    if (error) {
        console.error('Error executing SELECT query:', error);
        throw error;
    }
    console.log('Data in the test table after insertion:', results);
    res.redirect('/');
  });
  connection.end();
});


//指定IDのレコードを表示する
router.get('/edit', (req, res, next) => {
  var id = req.query.id;
  //データベースの設定情報
  var connection = mysql.createConnection(mysql_setting);
  //データベースに接続
  connection.connect();
  //データを取り出す
  connection.query('SELECT * from test where id = ?', id, function (error, results, fields) {
    //データベースアクセス完了時の処理
    if (error == null) {
      var data = {
        title: 'Edit',
        content: 'id = ' + id + 'のレコードを更新します。',
        test: results[0]
      }
      res.render('edit', data);
    }
  });
  //接続を解除
  connection.end();
});

//編集フォーム送信の処理
router.post('/edit', (req, res, next) => {
  var id = req.body.id;
  var data = {
    'id': Number(req.body.id),
    'name': req.body.name,
  };
  console.log(data);    //デバック用
  // データベースの編集処理
  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query('update test set ? where id = ?', [data, id], function (error, results, fields) {});
  connection.query('SELECT * FROM test', function (error, results, fields) {
    if (error) {
        console.error('Error executing SELECT query:', error);
        return res.status(500).send('Initial server error');  
    }
    console.log('Data in the test table after insertion:', results);
    res.redirect('/');
  });
  connection.end();
});

//指定レコードの削除
router.get('/delete', (req, res, next) => {
  var id = req.query.id;
  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query('SELECT * from test where id = ?', id, function (error, results, fields) {
    //データベースアクセス完了時の処理
    if (error == null) {
      var data = {
        title: 'Delete',
        content: 'id = ' + id + 'のレコードを削除します。',
        test: results[0]
      }
      res.render('delete', data);
    }
  });
  connection.end();
});

//削除フォームの送信処理
router.post('/delete', (req, res, next) => {
  var id = req.body.id;
  // データバースの接続
  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
  //データを削除する
  sql = 'delete from test where id = ?';
  connection.query(sql, id, function (error, results, fields) {
  });
  //デバック表示用
  connection.query('SELECT * FROM test', function (error, results, fields) {
    if (error) {
        console.error('Error executing SELECT query:', error);
        return res.status(500).send('Initial server error');  
    }
    console.log('Data in the test table after insertion:', results);
    res.redirect('/');
  });

  //接続を解除
  connection.end();
});


module.exports = router;


