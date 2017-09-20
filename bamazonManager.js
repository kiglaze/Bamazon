const VIEW_PRODUCTS_MENU_OPTION = "View Products for Sale";
const VIEW_LOW_INVENTORY_MENU_OPTION = "View Low Inventory";
const ADD_INVENTORY_MENU_OPTION = "Add to Inventory";
const NEW_PRODUCT_MENU_OPTION = "Add New Product";

const LOW_INVENTORY_THRESHOLD = 5;

var mysql = require("mysql");
var inquirer = require("inquirer");
var creds = require("./creds.js");

var connection = mysql.createConnection(creds);

connection.connect(function(err) {
  if (err) {
  	console.log(err);
  	throw err;
  } 
  start();
});

function start() {
	promptMenuOptions(endConnection);
}

function promptMenuOptions() {
	inquirer
    .prompt({
      name: "menuOptions",
      type: "list",
      message: "What would you like to do?",
      choices: [
        VIEW_PRODUCTS_MENU_OPTION,
        VIEW_LOW_INVENTORY_MENU_OPTION,
        ADD_INVENTORY_MENU_OPTION,
        NEW_PRODUCT_MENU_OPTION
      ]
    })
    .then(function(answer) {
      switch (answer.menuOptions) {
        case VIEW_PRODUCTS_MENU_OPTION:
          queryAllProducts(endConnection);
          break;

        case VIEW_LOW_INVENTORY_MENU_OPTION:
          queryLowInventory(endConnection);
          break;

        case ADD_INVENTORY_MENU_OPTION:
          promptAddProductInventory(endConnection);
          break;

        case NEW_PRODUCT_MENU_OPTION:
          promptAddProductDetails(endConnection);
          break;
      }
    });
}

function queryAllProducts(callback) {
  connection.query("SELECT * FROM products", function(err, res) {
  	if(res.length > 0) {
  		console.log("item_id | product_name | department_name | price | stock_quantity");
  	}
    for (var i = 0; i < res.length; i++) {
      var product = res[i];
      console.log(product.item_id + " | " + product.product_name + " | " + product.department_name + " | " + product.price + " | " + product.stock_quantity);
    }
    console.log("-----------------------------------");
    callback();
  });
}

function queryLowInventory(callback) {
  connection.query("SELECT * FROM products WHERE stock_quantity < ?", [LOW_INVENTORY_THRESHOLD], function(err, res) {
  	if(res.length > 0) {
  		console.log("item_id | product_name | department_name | price | stock_quantity");
  	}
    for (var i = 0; i < res.length; i++) {
      var product = res[i];
      console.log(product.item_id + " | " + product.product_name + " | " + product.department_name + " | " + product.price + " | " + product.stock_quantity);
    }
    console.log("-----------------------------------");
    callback();
  });
}

function promptAddProductDetails(callback) {
	inquirer
    .prompt([
    {
      name: "nameAddProduct",
      type: "input",
      message: "Please enter the name of the new product you would like to create.\n"
    },
    {
      name: "departmentAddProduct",
      type: "input",
      message: "Please enter the department name of the new product you would like to create.\n"
    },
    {
      name: "priceAddProduct",
      type: "input",
      message: "Please enter the price of the new product you would like to create.\n"
    },
    {
      name: "qtyAddProduct",
      type: "input",
      message: "Please enter the quantity of the new product you would like to create.\n"
    }
    ])
    .then(function(answer) {
		var nameAddProduct = answer.nameAddProduct;
		var departmentAddProduct = answer.departmentAddProduct;
		var priceAddProduct = answer.priceAddProduct;
		var qtyAddProduct = answer.qtyAddProduct;
		addProduct(nameAddProduct, departmentAddProduct, priceAddProduct, qtyAddProduct, callback);
    });
}

function addProduct(productName, departmentName, price, stockQty, callback) {
  connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [productName, departmentName, price, stockQty], function(err, res) {
	if(err) {
		console.log(err);
		throw err;
	}
	callback();
  });
}

function addInventoryToProduct(product, qtyToAdd, callback) {
  var productId = product.item_id;
  var updatedStockQty = parseInt(product.stock_quantity) + parseInt(qtyToAdd);
  connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [updatedStockQty, productId], function(err, res) {
	if(err) {
		console.log(err);
		throw err;
	}
	console.log(`Updated the quantity of product with id ${product.item_id} and name ${product.product_name}... `
		+ `Was ${product.stock_quantity}, but now is ${updatedStockQty}`);
	callback();
  });
}

function addInventoryByProductId(id, qtyToAdd, callback) {
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function(err, res) {
  	if(err) {
  		console.log(err);
  		throw err;
  	}
  	if(res.length > 0) {
  		console.log("item_id | product_name | department_name | price | stock_quantity");
  		for (var i = 0; i < res.length; i++) {
	      var product = res[i];
	    }
	    console.log("-----------------------------------");
	    addInventoryToProduct(product, qtyToAdd, callback);
  	} else {
  		console.log(`No such product with id ${id}`);
  		endConnection();
  	}
  });
}

function promptAddProductInventory(callback) {
	inquirer
    .prompt([
    {
      name: "addInvProductId",
      type: "input",
      message: "Please enter the id of the product you would like increase the inventory of.\n"
    },
    {
      name: "addInvProductQty",
      type: "input",
      message: "Please enter the amount by which you would like to increase the inventory of this product.\n"
    }
    ])
    .then(function(answer) {
		var productId = answer.addInvProductId;
		var qtyIncrease = answer.addInvProductQty;
		addInventoryByProductId(productId, qtyIncrease, callback);
    });
}

function endConnection() {
    connection.end();
}
