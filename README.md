**OVERVIEW** 

** INSTRUCTIONS FOR CUSTOMER **

bamazonCustomer.js - A *Node.js* & *MySQL* command line Amazon-like storefront app that takes in a customers' order and depletes stock from the store Inventory. 

The database is called 'bamazon' with a Table called 'products'. MySQL WorkBench file create_bamazon_database.sql included.

Running the Node application called 'bamazonCustomer.js' will first display all of the items available for sale. Include the ids, names, prices and quantities of products for sale.

Bamazon then prompts users with two messages: 

	* The first asks the user the ID of the product they would like to buy. 
	* The second message asks how many units of the product they would like to buy.

Once an order has been placed the application checks to see if the store has enough of the product to meet the user's request. *If not*, the app logs the insufficient stock message and asks the item ID again.

However, if the store *does* have enough of the product, it will fulfill the user’s order showing the total price of the order as well as updating the MySQL database to reflect the new quantity. Any additional requests will show new stock quantites to the user.  If there are zero items left in stock, that item will not be available for purchase.  

The app will then ask the user if they would like to continue shopping, repeating the process above if "yes".  If the customer is asked if they would like to continue shopping and selects "no", the app will exit.

** INSTRUCTIONS FOR MANAGER **

bamazonManager.js - A *Node.js* & *MySQL* command line manager app that allows viewing, adding stock to, and creating
new inventory.

This uses the same database as the *CUSTOMER* app, bamazon with the same table, products.

Running the Node application called 'bamazonManager.js' application will first display a selection menu of what the manager can do.

	* View products for sale - only those in stock
	* View low inventory - those items with less than 5 in stock
	* Add to inventory - add stock to any item
	* Add new product - insert a new product in to the bamazon database
	* Quit Menu

*View producs for sale* simply lists all product available where at least 1 is in stock.

*View low inventory* will show any item with less than 5 in stock, including 0 in stock.

*Add to inventory* allows manager to add stock to any item, including those with 0 in stock. 

*Add new product* allows manager to insert a new item with relevant info.

Once the manager is done managing, the Quit Menu option is selected to exit the app.  

**FUNCTIONALITY**  
[View video of working app here](https://drive.google.com/open?id=1WOMIorGrY2K_oJvV3Gy14qM28iOfeF5Y)