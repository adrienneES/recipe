import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

var shoppingDAC =  function() {

    const getShoppingList = function (callback) {
        mongodb.connect(url, function (err, db) {
            const collection = db.collection('shoppingList');
            collection.find({}).toArray(function (err, results) {
              callback(results);
          } );
        });
    }

    const deleteShoppingList = function (callback) {
        mongodb.connect(url, function (err, db) {
            const collection = db.collection('shoppingList');
            collection.remove({}, function(err, results) {
                callback(results);
            } );
        });
    }
    const insertItemInShoppingList = (item, callback) => {
        mongodb.connect(url, function (err, db) {
            const collection = db.collection('shoppingList');
            collection.insert(item, (err, results) => {
                callback(results);
            })
        });
    }

    const findItemInShoppingList = (item, callback) => {
        mongodb.connect(url, function (err, db) { 
            const collection = db.collection('shoppingList');
            collection.findOne(item, (err, results)=> { 
                callback(results);
            });
        });
    }
    const deleteItemFromShoppingList = (item, callback) => {
        mongodb.connect(url,function(err, db) { 
            const collection = db.collection('shoppingList');
            collection.remove(item, (err, data) => {
                collection.find({}).toArray(function (err, results) {
                    callback(results);
                })
            });
        });
    }
    return {
        getShoppingList : getShoppingList,
        deleteShoppingList : deleteShoppingList,
        insertItemInShoppingList : insertItemInShoppingList,
        findItemInShoppingList : findItemInShoppingList,
        deleteItemFromShoppingList : deleteItemFromShoppingList
    };
}
module.exports = shoppingDAC;