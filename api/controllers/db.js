var crypto = require('crypto');
_ = require("lodash");
require("underscore-query")(_);

var db = {
};

module.exports = {
  initCollection: initCollection,
  getObject: getObject,
  getObjects: getObjects,
  createObject: createObject,
  updateObject: updateObject,
  deleteObject: deleteObject,
  initStores: initStores,
  findStore: findStore,
  getStore: getStore,
  getStores: getStores,
  initUsers: initUsers,
  loginUser: loginUser,
  logoutUser: logoutUser,
  createUser: createUser,
  getBalance: getBalance,
  isAuthenticated: isAuthenticated,
  getUserId: getUserId,
  getItems: getItems,
  updateItem: updateItem,
  deleteItem: deleteItem,
  getItem: getItem,
  updateBalance: updateBalance
};

function getRandomId() {
  return crypto.randomBytes(4).toString('hex');
}

function initCollection(collection_name) {
  db[collection_name] = [];
}

function findObject(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  if(!obj) throw new Error('Object not found in collection: ' + collection_name);
  else return obj;
}

function getObject(collection_name, filter) {
  return findObject(collection_name, filter);
}

function getObjects(collection_name, filter) {
  var obj = _.query(db[collection_name], filter);
  if(!obj.length) throw new Error('Object not found in collection: ' + collection_name);
  else return obj;
}

function createObject(collection_name, new_object) {
  var obj = {
    _id: getRandomId()
  };
  db[collection_name].push(Object.assign(obj, new_object));
  return {
    _id: obj._id
  };
}

function updateObject(collection_name, filter, update_object) {
  var obj = findObject(collection_name, filter);
  var index = db[collection_name].indexOf(obj);
  db[collection_name][index] = Object.assign(obj, update_object);
  return {
    _id: obj._id
  };
}

function deleteObject(collection_name, filter) {
  var obj = findObject(collection_name, filter);
  db[collection_name].splice(db[collection_name].indexOf(obj), 1);
  return {
    _id: obj._id
  };
}

//__________________________STORE DB FUNCTIONS____________________________________________-
function initStores(collection_name) {
  db[collection_name] = [];
  db['items'] = [];

  for(var i=0; i<5; i++){
    var obj = {
      id: getRandomId(),
      title: "exampleStore" + i
    };
    db[collection_name].push(obj);
    var itemobj = {
      id: obj['id'],
      itemid: getRandomId(),
      itemtitle: 'exampleTitle'+i,
      price: Math.floor(Math.random() * 5000)  
    };
    db['items'].push(itemobj);
  }
}

function findStore(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  if(!obj) throw new Error('Store not found in collection: ' + collection_name);
  else return obj;
}

function getStore(collection_name, filter) {
  return findStore(collection_name, filter);
}

function getStores(collection_name, filter) {
  var obj = _.query(db[collection_name], filter);
  if(!obj.length) throw new Error('Store not found in collection: ' + collection_name);
  else return obj;
}

function getItems(collection_name, filter) {
  var obj = _.query(db[collection_name], filter);
  if(!obj.length) throw new Error('Store not found in collection: ' + collection_name);
  else return obj;
}

function getItem(collection_name, filter) {
  return findObject(collection_name, filter);
}

function updateItem(collection_name, filter, update_object) {
  var obj = findObject(collection_name, filter);
  var index = db[collection_name].indexOf(obj);
  db[collection_name][index] = Object.assign(obj, update_object);
  return {
    id: obj.id
  };
}

function deleteItem(collection_name, filter) {
  var obj = findObject(collection_name, filter);
  db[collection_name].splice(db[collection_name].indexOf(obj), 1);
  return {
    id: obj._id
  };
}

//------------------------ USER DB FUNCTIONS----------------------------------

function initUsers(collection_name) {
  db[collection_name] = [];
  db['cards'] = []
  for(var i=0; i<5; i++){
    var obj = {
      id: 'admin',
      password: 'admin',
      username: "exampleUser" + i,
      sessionId: null
      //sessionId: null
    };
    db[collection_name].push(obj);
    var cardobj = {
      id: obj['id'],
      cardId: getRandomId(),
      balance: 10000
    };
    db['cards'].push(cardobj);
  }
  
}

function createUser(collection_name, new_object) {
  var obj = {
    id: getRandomId(),
    username: new_object['username'],
    password: new_object['password'],
    sessionId: null
  };
  db[collection_name].push(obj);

  var cardobj = {
    id: obj.id,
    cardId: new_object['cardnumber'],
    balance: 10000
  }
  db['cards'].push(cardobj);
  return obj.id;
}

function loginUser(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  obj.sessionId = getRandomId()
  if(!obj) throw new Error('User not found.');
  else return obj;
}

function logoutUser(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  if(!obj) return false;
  else {
    obj['sessionId']=null;
    return true;
  }
}
function isAuthenticated(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  if(!obj) return false;
  else {
    return true;
  }
}

function getBalance(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  if(!obj) throw new Error('Nemjo');
  else return obj.balance;
}

function findUser(collection_name, filter) {
  var obj = _.query(db[collection_name], filter)[0];
  if(!obj) throw new Error('UserId not found in collection: ' + collection_name);
  else return obj.id;
}

function updateBalance(collection_name, filter, update_object) {
  var obj = findObject(collection_name, filter);
  var index = db[collection_name].indexOf(obj);
  db[collection_name][index] = Object.assign(obj, update_object);
  return {
    id: obj.id
  };
}

function getUserId(collection_name, filter) {
  return findUser(collection_name, filter);
}

//--------------------------------------