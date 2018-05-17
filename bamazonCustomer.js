// require packages
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {

    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();

});

function start() {

    // display table
    displayTable(askCustomer);

}

function displayTable(callback) {

    console.log("\nLet's view all products on BAMAZON...\n");
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        console.log("-----------------------------------");
        console.log("id | product name | department | price | stock");

        for (var i = 0; i < res.length; i++) {

            console.log(res[i].item_id + " | "
                + res[i].product_name + " | "
                + res[i].department_name + " | $"
                + res[i].price + " | "
                + res[i].stock_quantity);

        }

        console.log("-----------------------------------\n");

        // THEN run this
        callback(res);

    });

}

function askCustomer(res) {

    inquirer
        .prompt([
            {
                name: "idquestion",
                type: "list",
                message: "Select the ID of the product you wish to buy.",
                choices: cycleIDs(res)
            },
            {
                name: "amountquestion",
                type: "input",
                message: "How many do you wish to buy? Enter a number.",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {

            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_name === answer.choice) {
                    chosenItem = results[i];
                }
            }

            connection.end();

        });

}

function cycleIDs(results) {

    var choiceArray = [];

    for (var i = 0; i < results.length; i++) {
        choiceArray.push(results[i].item_id.toString());
    }

    return choiceArray;
}

