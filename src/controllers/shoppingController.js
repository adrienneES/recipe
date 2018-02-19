import express from 'express';
const recipeDAC = require('../data/recipeDAC')();
const shoppingDAC = require('../data/shoppingDAC')();
const ingredientDAC = require('../data/ingredientDAC')();
const typesDAC = require('../data/typesDAC')();
const utility = require('../utilities/utilities')();

const shoppingController = function(nav) {

    let shoppingList = [];
    let ingredientList = [];
    
    const render = function (res, data) {
        res.render(data.view, {
            title: data.title,
            message: data.message,
            shoppingList: data.shoppingList,
            ingredients: data.ingredients,
            nav: data.nav
        });
    }

    const getList = function (req, res) {
        const ingredientController = require('../controllers/ingredientController')(nav);
        ingredientDAC.getIngredients(function (data) {
            ingredientList = data;
            shoppingDAC.getShoppingList( (results) => {
                shoppingList = results || [];
                const message = utility.getMessage(req);
                render(res, {view:'shopping', title:'shopping list',ingredients:ingredientList, 
                message:message, shoppingList: shoppingList, nav:nav})
            })
        });
    }
    const insertItemInShoppingList = function (req, res) {
        const insertedItem = req.body.ingredientsSelect;
        let queryArray = insertedItem.split('.');
        const item = {ingredient: queryArray[0], category : queryArray[1]};
        // if its in the collection don't add
        shoppingDAC.findItemInShoppingList(item, (results) => {
            if (results) {
                console.log(`found ${insertedItem} not inserting'`);
                render(res, {view:'shopping', title:'shopping list',ingredients:ingredientList, 
                message:{type:'error', message: 'already there'}, shoppingList: shoppingList, nav:nav})
            } else {
                shoppingDAC.insertItemInShoppingList(item, (results) => {
                    // get update shopping list
                    shoppingDAC.getShoppingList((results) => {
                        shoppingList = results || [];
                        render(res, {view:'shopping', title:'shopping list',ingredients:ingredientList, 
                            message:{type:'success', message: 'inserted successfuly'}, shoppingList: shoppingList, nav:nav})
                        });
                })
            }
        })
    }
    const deleteItemFromShoppingList = function (req, res) {
        const deletedItem = req.body.ingredientsSelect;
        const item = {ingredient: deletedItem}
        // if its in the collection don't add
        shoppingDAC.deleteItemFromShoppingList(item, (results) => {
            shoppingList = results;
            render(res, {view:'shopping', title:'shopping list',ingredients:ingredientList, 
            message:{type:'success', message: 'item deleted successfully'}, shoppingList: shoppingList, nav:nav})
        })
    }
    const addToList = function (req, res) {
        const recipeName = req.query.name;
        console.log(recipeName);
        const recipeController = require('../controllers/recipeController')(nav);
        recipeDAC.getRecipeIngredients(recipeName, function (results) {
            let ingredientArray = [];
            for(let recipeIngredient of results) {
                ingredientArray.push(recipeIngredient.ingredient);
            }
            ingredientDAC.getIngredientsForRecipe(ingredientArray, (ingredients) => {
                // get categories that are on autoOrder
                typesDAC.getCategories('yes', (categories) =>{
                    let autoList = [];
                    for (let category of categories) {
                        autoList.push(category.name);
                    }
                    let categoryList = [];
                    let orderList = [];
                    for (let currentIngredient of ingredients) {
                        if (autoList.indexOf(currentIngredient.category) != -1) {
                            orderList.push({ingredient: currentIngredient.name, category:currentIngredient.category});
                        } 
                    }
                    shoppingDAC.insertItemsInShoppingList(orderList, (results) => {
                        req.query.succes = 'items added to shopping list';
                        getList(req, res);
                    })
                } );                
            })
        });
    }

    return {
        getList:getList,
        insertItemInShoppingList:insertItemInShoppingList,
        deleteItemFromShoppingList : deleteItemFromShoppingList,
        addToList : addToList
    }
};

module.exports = shoppingController;