import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

const typesDAC =  () => {
    const getCategories = (autoOrder, callback) =>{
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            if (autoOrder) {
                categoryCollection.find({autoOrder: 'yes'}).toArray(  (err, data) => {
                    callback(data);
                });
            } else {
              categoryCollection.find({}).toArray(  (err, data) => {
                callback(data);
            });
        }
    });
    }
    const createCategory = (category, callback) => {
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            categoryCollection.insert(category,  (err, data) => {
              callback(data);
            });
        });
    }
    const addCategories = (categories, callback) => {
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            // dont want to insert dups
            let nameList = [];
            for (let category of categories) {
                nameList.push(category.name);
            }
            categoryCollection.find({name: {$exists:true, $in:nameList}}).
                toArray ( (err, results) =>{
                    for (let item of results) {
                        let index = nameList.indexOf(item.name);
                        if (index > -1) {
                            nameList.splice(index, 1);
                        }
                    }
                    let insertList = [];
                    for (let item of categories) {
                        if (nameList.indexOf(item.name) > -1) {
                            insertList.push(item);
                        }
                    }
                    if (insertList.length > 0) {
                        categoryCollection.insertMany(insertList,  (err, data) => {
                            callback(data);
                        });
    
                    } else {
                        callback(null);;
                        
                    }
                });
        });
    }
    const deleteCategory = (category, callback) => {
        mongodb.connect(url, (err, db) => { 
            console.log('going to delete');
            console.log(category);
            const categoryCollection = db.collection('categories');
            categoryCollection.remove({name: category.name}, (results) => {
                callback(results);
              }
            );
        });
    }
    const flipAutoOrder = (category, callback) => {
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            categoryCollection.updateOne({name: category.name}, {
                $set:{ "autoOrder": category.autoOrder}},  
                (err, data) => {
//                console.log(data);
              callback(data);
            });
        });
      }
    const deleteCategories = (callback) => {
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            categoryCollection.remove((results) => {
                callback(results);
              }
            );
        });
    }
    const getUnits = (callback) =>
    {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('units');
            collection.find({}).toArray( (err, data) => {
                callback(data);
            });
        });
    }
    const createUnit = (unit, callback) => {
        mongodb.connect(url, (err, db) => { 
            const unitCollection = db.collection('units');
            unitCollection.insert(unit, (err, data) => {
              callback(data);
            });
        });
    }
    const deleteUnits = (callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('units');
            collection.remove({},  (err, results) => { 
                callback(results);
            });
          });
    }
    
    const deleteUnit = (unit, callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('units');
            collection.remove({unit: unit},  (err, results) => { 
                callback(results);
            });
        });
    }
  
    return {
        createCategory : createCategory,
        addCategories : addCategories,
        deleteCategory : deleteCategory,
        flipAutoOrder : flipAutoOrder,
        getCategories : getCategories,
        deleteCategories : deleteCategories,
        getUnits : getUnits, 
        deleteUnits: deleteUnits,
        createUnit: createUnit,
        deleteUnit: deleteUnit
    }
}
module.exports = typesDAC;
