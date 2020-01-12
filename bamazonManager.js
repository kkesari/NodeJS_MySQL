var mysql = require("mysql");
var inquirer = require("inquirer");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // run the start function after the connection is made to prompt the user
  start();

});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "selectOptions",
      type: "list",
      message: "Choose from the list of available options...",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "View most expensive Inventory"]
    })
    .then(function (answer) {

      // get the user choice and route to appropriate function.
      switch (answer.selectOptions) {
        case "View Products for Sale":
          listAllProducts();
          break;

        case "View Low Inventory":
          listLowInventory();
          break;

        case "Add to Inventory":
          addToInventory();
          break;

        case "Add New Product":
          addNewItemToInventory();
          break;

        case "View most expensive Inventory":
          listExpensiveItems();
          break;
      }

      //

    });
}

//  function to provide a choice to return to main menu
function repeat() {
  inquirer
    .prompt({
      name: "gotoMainMenu",
      type: "list",
      message: "Do you want to go back to main menu ?",
      choices: ["Yes", "No"]
    })
    .then(function (choice) {
      if (choice.gotoMainMenu === "Yes") {
        start();
      }
      else {
        connection.end();
      }
    });
}

// function to list the inventory of all the items that has stock quantity less than 5 in store
function listLowInventory() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      console.log(
        "Item ID: " +
        res[i].item_id +
        "  || Product Name: " +
        res[i].product_name +
        " || Price: " +
        res[i].price +
        " || Available units in stock : " +
        res[i].stock_quantity
      );
    }
    // provide a choice to return to main menu if the manager wants to view additional options
    repeat();

  });

}

// function to add a new item to store
function addNewItemToInventory() {
  inquirer
    .prompt({
      name: "whichItem",
      type: "input",
      message: "Provide the Product Name "
    })
    .then(function (product) {
      inquirer
        .prompt({
          name: "whatDept",
          type: "input",
          message: "Which department the Product is to be added to "
        })
        .then(function (dept) {
          inquirer
            .prompt({
              name: "whatPrice",
              type: "input",
              message: "Provide the Product price per unit "
            })
            .then(function (price) {

              inquirer
                .prompt({
                  name: "howManytoStock",
                  type: "input",
                  message: "Provide number of units you would like to stock "
                })
                .then(function (stock) {
                  // based on all the above inputs, add this new item to the store
                  connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)", [product.whichItem, dept.whatDept, parseFloat(price.whatPrice), parseFloat(stock.howManytoStock)], function (err, res) {
                    if (err) throw err;
                    // Log all results of the SELECT statement
                    console.log("Successfully inserted a new product ");
                    listAllProducts();
                  });
                });
            });
        });
    });

}

// function to add more inventory of existing items
function addToInventory() {
  //
  inquirer
    .prompt({
      name: "addMore",
      type: "list",
      message: "Which product would you like to add more to inventory ? Choose Item ID from the list.",
      choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    })
    .then(function (answer) {

      // get the quantity customer would like to purchase
      inquirer
        .prompt({
          name: "howMany",
          type: "input",
          message: "How much more is being stocked ? "
        })
        .then(function (quantity) {

          // based on the customer item selection, quantity to purchase, price is calculated and inventory will be updated upon purchase.
          connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id= ?", [parseFloat(quantity.howMany), answer.addMore], function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            listUpdProducts(answer.addMore);
          });

        });

      //

    });

  //

}

// Function that lists the most expensive item in store calculated by price * stock_quantity 
function listExpensiveItems() {
  connection.query("SELECT max(price*stock_quantity) max_price from products", function (err, maximum_price) {
    if (err) throw err;

    // Log all products of the SELECT statement
    console.log("Inside List Expensive - "+maximum_price[0].max_price);
    connection.query("select product_name, sum(price * stock_quantity) stockPrice  from products group by product_name having sum(price * stock_quantity) >= ?", [parseFloat(maximum_price[0].max_price)], function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(
          "  Product Name: " +
          res[i].product_name +
          " || price * stock_quantity: $" +
          res[i].stockPrice 
        );
      }
      console.log("==========================================================================")
      repeat();
    });
  });
}


function listAllProducts() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products ", function (err, res) {
    if (err) throw err;

    // Log all products of the SELECT statement
    // console.log(res);

    for (var i = 0; i < res.length; i++) {
      console.log(
        "Item ID: " +
        res[i].item_id +
        "  || Product Name: " +
        res[i].product_name +
        " || Price: " +
        res[i].price +
        " || Available units in stock : " +
        res[i].stock_quantity
      );
    }
    console.log("==========================================================================")
    repeat();

  });
}

function listUpdProducts(item_to_buy) {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = ?", [item_to_buy], function (err, res) {
    if (err) throw err;

    // Log all products of the SELECT statement
    // console.log(res);
    console.log("Inventory after the update ")
    console.log("==========================================================================")
    for (var i = 0; i < res.length; i++) {
      console.log(
        "Item ID: " +
        res[i].item_id +
        " || Product Name: " +
        res[i].product_name +
        " || Price: " +
        res[i].price +
        " || Available units in stock : " +
        res[i].stock_quantity
      );
    }
    console.log("==========================================================================")
    repeat();
  });
}