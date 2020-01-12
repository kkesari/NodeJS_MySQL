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
  // listProducts();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "buy",
      type: "list",
      message: "Which product would you like to buy? Choose Item ID from the list.",
      choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    })
    .then(function (answer) {

      // get the quantity customer would like to purchase
      inquirer
        .prompt({
          name: "howMany",
          type: "input",
          message: "How many items would you like to buy ? "
        })
        .then(function (quantity) {

          // based on the customer item selection, quantity to purchase, price is calculated and inventory will be updated upon purchase.
          calculatePrice(answer.buy, quantity.howMany);
          //listProducts();

        });

      //

    });
}

function calculatePrice(item_to_buy, quantity_to_buy) {
  console.log("You Ordered Item ID - " + item_to_buy + " Quantity - " + quantity_to_buy);
  connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: item_to_buy }, function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log("Total available quantity in store for the Item ID " + item_to_buy + " is " + res[0].stock_quantity);

    // Check to see if the item customer selected is available in store comparing item stock quantity to the quantity customer needs 
    if (res[0].stock_quantity >= parseFloat(quantity_to_buy)) {
      console.log("Calculating the order total...");
      connection.query("SELECT price FROM products WHERE ?", { item_id: item_to_buy }, function (err, price) {
        if (err) throw err;
        var totalOrderPrice = price[0].price * parseFloat(quantity_to_buy);
        console.log("Your order total of purchasing Item ID " + item_to_buy + ", Quantity " + quantity_to_buy + " is $" + totalOrderPrice);
        console.log("==========================================================================")
        console.log("Updating the Inventory...");
        updateInventory(item_to_buy, quantity_to_buy);
      });

    }
    else {
      console.log("We currently do not have the quantity you would like to purchase! Insufficient quantity!");
      connection.end();
    }

  });

}

function updateInventory(item_to_buy, quantity_to_buy) {
  connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id= ?", [parseFloat(quantity_to_buy), item_to_buy], function (err, res) {
    if (err) throw err;

    // Log all results of the SELECT statement
    // console.log("Number of records updated - "+ res[0].changedRows);
    listUpdProducts(item_to_buy);
  });
}

function listUpdProducts(item_to_buy) {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = ?", [item_to_buy], function (err, res) {
    if (err) throw err;

    // Log all products of the SELECT statement
    // console.log(res);

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
    connection.end();
  });
}
