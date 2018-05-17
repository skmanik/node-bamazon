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
    console.log("\nLet's view all products on BAMAZON...\n");

    // display table
    displayTable(askCustomer);
}

function displayTable(callback) {
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
        if (callback) callback(res);
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
            var idNumber = parseInt(answer.idquestion);
            var amountNumber = parseInt(answer.amountquestion);

            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === idNumber) {
                    chosenItem = res[i];
                }
            }

            if (chosenItem.stock_quantity >= amountNumber) {
                console.log("\nYou want " + amountNumber + " and we have " + chosenItem.stock_quantity + ".");
                console.log("There's enough!\n");

                updateDB(chosenItem, idNumber, amountNumber);
            } else {
                console.log("\nYou want " + amountNumber + " and we have " + chosenItem.stock_quantity + ".");
                console.log("We don't have enough. Try again!");

                start();
            }
        });

}

function cycleIDs(res) {
    var choiceArray = [];

    for (var i = 0; i < res.length; i++) {
        choiceArray.push(res[i].item_id.toString());
    }

    return choiceArray;
}

function updateDB(item, id, amount) {
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: item.stock_quantity - amount
            },
            {
                item_id: id
            }
        ],
        function (error) {
            if (error) throw error;

            var totalCost = amount * item.price
            console.log("Your total cost is: $" + totalCost + ". Here's what our stock looks like now!\n");
            displayTable();
        }
    );
}
