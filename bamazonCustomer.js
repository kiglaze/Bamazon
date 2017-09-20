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
	queryAllProducts(promptPurchaseProduct);
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

function promptPurchaseProduct() {
	inquirer
    .prompt({
      name: "productToBuyId",
      type: "input",
      message: "Please enter the ID of the product you would like to buy.\n",
      validate: function(str) {
      	if(isNaN(parseInt(str)) || !Number.isInteger(parseInt(str)) || parseInt(str) <= 0) {
      		return false;
      	}
      	return true;
      }
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
      message: "Please enter the QUANTITY of the product you would like to buy.\n",
      validate: function(str) {
      	if(isNaN(parseInt(str)) || !Number.isInteger(parseInt(str)) || parseInt(str) <= 0) {
      		return false;
      	}
      	return true;
      }
    })
    .then(function(answer) {
		var productToBuyQty = answer.productToBuyQty;
		purchaseProduct(product, productToBuyQty);
    });
}

function purchaseProduct(product, qtyToPurchase) {
	if(!Number.isInteger(parseInt(qtyToPurchase)) || qtyToPurchase <= 0) {
		console.log("Please purchase a positive number of this product.");
		endConnection();
	} else if(qtyToPurchase > product.stock_quantity) {
		console.log("Insufficient quantity.");
		endConnection();
	} else {
		var updatedQty = product.stock_quantity - qtyToPurchase;
		updateProductQty(product, updatedQty, printAmountSpent);
	}
}

function updateProductQty(product, updatedQty, callback) {
  var productId = product.item_id;
  connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [updatedQty, productId], function(err, res) {
  	if(err) {
  		console.log(err);
  		throw err;
  	}
  	callback(product, updatedQty);
  });
}

function printAmountSpent(product, updatedQty) {
	var oldQty = product.stock_quantity;
	if(updatedQty < oldQty) {
		var qtyPurchased = oldQty - updatedQty;
		var productPrice = product.price;
		var amountSpent = qtyPurchased * productPrice;
		console.log(`Spent $${roundNumber(amountSpent, 2)}`);
	}
	endConnection();
}

function roundNumber(numberToRound, digitsAfterDecimal) {
	return parseFloat(Math.round(numberToRound * 100) / 100).toFixed(digitsAfterDecimal);
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

