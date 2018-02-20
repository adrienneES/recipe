import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

var shoppingDAC =  function() {

    const getShoppingList = function (callback) {
        mongodb.connect(url, function (err, db) {
            const collection = db.collection('shoppingList');
            collection.find({}).sort({ingredient:1}).toArray(function (err, results) {
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

    const insertItemsInShoppingList = (orderList, callback) => {
        console.log(`orderList`);
        console.log(orderList);
        mongodb.connect(url, function (err, db) {
            const collection = db.collection('shoppingList');
           const nameList = [];
            for (let item of orderList) {
                nameList.push(item.ingredient);
            }
            collection.find({ingredient: {$exists:true, $in:nameList}}).toArray((err, results) => {
//                for (let name of nameList) {
                    for (let item of results) {
                        let index = nameList.indexOf(item.ingredient);
                        if (index > -1) {
                            nameList.splice(index, 1);
                        }
                    }
  //              }
                let insertList = [];
                for (let item of orderList) {
                    if (nameList.indexOf(item.ingredient) > -1) {
                        insertList.push(item);
                    }
                }
                if (insertList.length > 0) {
                    console.log(`inserting ${insertList.length} ingredients`); 
                    console.log(insertList);
                    collection.insertMany(insertList, () => {
                        callback(insertList);
                    });
                } else {
                    callback(insertList);
            }
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
            collection.remove(item, (err) => {
                if (err) {
                    callback(err);
                    return;
                }
                getShoppingList((results) => {
                    callback(results);
                })
            });
        });
    }
    return {
        getShoppingList : getShoppingList,
        deleteShoppingList : deleteShoppingList,
        insertItemInShoppingList : insertItemInShoppingList,
        insertItemsInShoppingList : insertItemsInShoppingList,
        findItemInShoppingList : findItemInShoppingList,
        deleteItemFromShoppingList : deleteItemFromShoppingList
    };
}
module.exports = shoppingDAC;