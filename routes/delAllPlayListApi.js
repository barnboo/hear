/**
 * Created by Administrator on 2017/4/30.
 */
var express = require('express');
var router = express.Router();
var url = require('url');

router.post('/delAllPlayListApi', function (req, res) {
    console.log("清空播放列表");
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
    var db = new mongodb.Db('heardatabase', server, {safe: true});
    function deleteData(targetCollection, targetData, callback) {
        db.open(function (err, db) {
            if (!err) {
                console.log('打开数据库成功！');
                db.collection(targetCollection, function (err, collection) {
                    if (err) {
                        throw err;
                        console.log("连接数据集合出错");
                    } else {
                        console.log("成功连接数据集合");
                        //remove
                        collection.remove(targetData, function (err, res) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("成功删除" + JSON.parse(res).n + "条数据");
                                collection.find({}).toArray(function (err, docs) {
                                    if (err)
                                        throw err;
                                    else
                                        callback(docs);
                                    db.close();
                                });
                            }
                        });
                    }
                });
            }
            else {
                console.log('打开数据库失败！');
                console.log(err);
            }
        });
    }

    deleteData('playList', {userId:req.body.userId}, function (docs) {
        res.send({
            state: 200
        });
    });
});

module.exports = router;
