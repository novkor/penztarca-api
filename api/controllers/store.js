'use strict';
var db = require('./db');

db.initStores('stores');


module.exports = {
  getStores: getStores,
  getStoreItems: getStoreItems,
  updateStoreItem: updateStoreItem,
  deleteStoreItem: deleteStoreItem,
  buyStoreItem: buyStoreItem
};

function getStores(req,res){
    try{
        return res.send(200, 
            db.getStores('stores')
        );
    }catch (error){
        return res.send(404,{
            message: error.message
        });
    }
}

function getStoreItems(req,res){
    try{
        //var results = db.getStores('stores', {});
        //return res.json(results);
        return res.send(200, 
            db.getItems('items',{id:req.swagger.params['storeId'].value})
        );
    }catch (error){
        return res.send(404,{
            message: error.message
        });
    }
}
function updateStoreItem(req,res){
    try{
        var filter = {
            id: req.swagger.params['storeId'].value,
            itemid: req.body.itemId
        };
        var update_object = {
            itemtitle: req.body.title,
            price: req.body.price
        };
        var result = db.updateItem('items', filter, update_object)
        return res.send(200,{ 
           message: "Succesfull update."
        });
    }catch (error){
        return res.send(404,{
            message: error.message
        });
    }
}
function deleteStoreItem(req,res){
    try{
        var id = req.swagger.params['storeId'].value;
        var itemid =  req.body.replace(/[^A-Za-z0-9\.]+/g, "");
        console.log(id);
        console.log(itemid);
        db.deleteItem('items',{id: id, itemid: itemid});
        return res.send(200, {
            message: 'Succesfull delete.'
        });
    }catch (error){
        return res.send(404,{
            message: error.message
        });
    }
}

function buyStoreItem(req,res){
    try{
        var ApiKey = req.get('X-session-ID');
        var userid = db.getUserId('user', {sessionId: ApiKey})
        var getBalance = db.getBalance('cards',{id: userid});
        var itemPrice = db.getItem('items', {itemid: req.swagger.params['itemId'].value})['price']
        if(!db.isAuthenticated('user',{sessionId:ApiKey})) {
            return res.send(401,{
                message: error.message
            });
        }else if(getBalance-itemPrice < 0) {
            return res.send(403, {
                message: 'You do not have enough money'
            });
        }else {
            db.updateBalance('cards',{id: userid},{balance: getBalance-itemPrice})
            return res.send(200, {
                message: 'You bought an item succesfully.'
            });
        }
    }catch (error){
        return res.send(404,{
            message: error.message
        });
    }
}