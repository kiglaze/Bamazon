var mysql = require("mysql");
var inquirer = require("inquirer");
var creds = require("./creds.js");

var connection = mysql.createConnection(creds);

connection.connect(function(err) {
  if (err) {
  	console.log(err);
  	throw err;
  } 
  console.log("connected......");
  start(connection);
});

function start(connection) {
	queryAllProducts(connection, promptPurchaseProduct);
}

function queryAllProducts(connection, callback) {
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

function promptPurchaseProduct() {
	inquirer
    .prompt({
      name: "productToBuyId",
      type: "input",
      message: "Please enter the ID of the product you would like to buy.\n"
    })
    .then(function(answer) {
		var productToBuyId = answer.productToBuyId;
		getProductById(productToBuyId, promptQtyProduct);
    });
}

function promptQtyProduct(product) {
	inquirer
    .prompt({
      name: "productToBuyQty",
      type: "input",
      message: "Please enter the QUANTITY of the product you would like to buy.\n"
    })
    .then(function(answer) {
		var productToBuyQty = answer.productToBuyQty;
		purchaseProduct(product, productToBuyQty);
    });
}

function purchaseProduct(product, qtyToPurchase) {
	console.log(`BUY ${qtyToPurchase} of the product with id ${product.item_id}`);
	if(qtyToPurchase > product.stock_quantity) {
		console.log("Insufficient quantity.");
		endConnection();
	} else {
		console.log("Buying...");
		// TODO implement product buying code requirements here...
	}
}

function getProductById(id, callback) {
  connection.query("SELECT * FROM products WHERE item_id=?", [id], function(err, res) {
  	if(err) {
  		console.log(err);
  		throw err;
  	}
  	if(res.length > 0) {
  		console.log("item_id | product_name | department_name | price | stock_quantity");
  		for (var i = 0; i < res.length; i++) {
	      var product = res[i];
	      console.log(product.item_id + " | " + product.product_name + " | " + product.department_name + " | " + product.price + " | " + product.stock_quantity);
	    }
	    console.log("-----------------------------------");
	    callback(product);
  	} else {
  		console.log(`No such product with id ${id}`);
  		endConnection();
  	}
  });
}

function endConnection() {
    connection.end();
}

