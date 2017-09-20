CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF exists products;
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(265) NULL,
  department_name VARCHAR(265) NULL,
  price decimal(12,2) DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  PRIMARY KEY (item_id)
);

-- 'C:\\Users\\KristinIris\\Desktop\\code\\06-12-2017-RAL-Class-Repository-FSF\\FSF-Content\\01-Class-Content\\12-mysql\\02-Homework\\bamazon_products.csv' --
LOAD DATA LOCAL INFILE 'C:\\Users\\KristinIris\\Desktop\\code\\06-12-2017-RAL-Class-Repository-FSF\\FSF-Content\\01-Class-Content\\12-mysql\\02-Homework\\bamazon_products.csv'
INTO TABLE products    
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(item_id,product_name,department_name,price,stock_quantity);

SELECT * FROM products;