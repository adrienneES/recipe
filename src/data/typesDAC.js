import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

const typesDAC =  () => {
    const getCategories = (callback) =>{
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            categoryCollection.find({}).toArray(  (err, data) => {
              callback(data);
            });
        });
    }
    const createCategory = (categoryName, callback) => {
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            categoryCollection.insert(categoryName,  (err, data) => {
              callback(data);
            });
        });
    }
    const deleteCategory = (category, callback) => {
        mongodb.connect(url, (err, db) => { 
            const categoryCollection = db.collection('categories');
            categoryCollection.remove({name: category}, (results) => {
                callback(results);
              }
            );
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
        deleteCategory : deleteCategory,
        getCategories : getCategories,
        deleteCategories : deleteCategories,
        getUnits : getUnits, 
        deleteUnits: deleteUnits,
        createUnit: createUnit,
        deleteUnit: deleteUnit
    }
}
module.exports = typesDAC;
