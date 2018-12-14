# node-bamazon

A little Amazon-esque Node application that takes the user's purchase and depletes the store's supply accordingly (by updating the MySQL database).

Item names taken from World of Warcraft.

## Instructions

* Write `node bamazonCustomer.js` to run the application.
* Exit with CTRL+C when you're done.

## Screenshots

* Application starts. Current table data is displayed and first question is asked: https://i.imgur.com/lZWabrR.png
* First question is answered and second question is asked: https://i.imgur.com/bXpBtAW.png
* Fail scenario: User tries to purchase amount greater than current stock for product: https://i.imgur.com/BpH2P8D.png
* Success scenario: User purchases amount less than or equal to current stock for product: https://i.imgur.com/jlAP88Y.png
