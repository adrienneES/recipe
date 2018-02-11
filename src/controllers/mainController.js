import mongo from 'mongodb';
var mongodb = mongo.MongoClient;
var mainController = function (nav) {
    var getData = function (req, res) {
        var url = 'mongodb://localhost:27017/tempDatabase';
        mongodb.connect(url, function (err, db) { 
            var collection = db.collection('week');
            collection.find({}).toArray(function (err, results) {
                res.render('index', {
                    title: 'food planner',
                    week: results,
                    nav: nav});
                 });
            });
    }
    return {
        getData : getData
    }
}
module.exports = mainController;