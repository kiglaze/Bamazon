#Setting up data with SQL.
Look at the SQL in bamazon_sql.sql.
Change the filepath listed in line 16 (after "LOAD DATA LOCAL INFILE") to where you have the csv file bamazon_products.csv
CSV file saved.
Run the SQL in bamazon_sql.sql.
If you wish, you can run all the SQL before "LOAD DATA LOCAL INFILE", and import the CSV file data using the MySQL workbench instead.

#SQL database credentials file.
Create a file called "creds.js" in the same directory as the files bamazonCustomer.js and bamazonManager.js.
Make it look like this:

```
module.exports = {
  host: "localhost",
  port: 3306,

  // Your username
  user: "your_username_here",

  // Your password
  password: "your_password_here",
  database: "bamazon"
};
```

Edit it to have the username and password info corresponding to your MySQL connection.

#NPM
Run "npm install" in the directory you are working in (the same directory as the files bamazonCustomer.js and bamazonManager.js).

#Running the Node JS applications.
You can run both CLI applications in the terminal like so:

```
node bamazonCustomer.js
node bamazonManager.js
```

The prompts will explain what to do.

#Video code demo walkthrough.
You can watch a demo of my code working if you play the video file: code_demo_walkthrough.mp4
