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
            categoryCollection.insertMany(categories,  (err, data) => {
              callback(data);
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
