//require mysql library
var mysql = require("mysql");

//require inquirer module
var inquirer = require("inquirer");

//global array of products.  Eventually seemed easier. 
var productsToBuy = []; 

//this will be the number of items they can choose from, meaning array length
var numberOfItems; 

//these variables will hold the info on the purchased product
var idOfPurchase; //item_id in mysql table
var productPurchased;//product_name in mysql table
var departmentOfItem;//department_name in mysql table
var itemsInStock;//stock_quantity in mysql table
var purchasePrice;//price in mysql table

//variables to use after items selected
var quantityToBuy; //how many did the customer want?  
var newQuantity = 0;//global variable for how much stock remaning after purchase
var totalSale = 0; //global variable for customer sale total, don't reset


//create the mysql connection to the database
var connection = mysql.createConnection({
  host: "127.0.0.1", 
  port: 3306,
  user: "root",
  password: "holymoly",
  database: "bamazon"
});

//if connected start functioning, or throw error
connection.connect(function(err) {
  if (err) throw err;
  //if no error, invoke the reset variable function.  
  resetVariables(); 
});

//reset any variables to use if shopper wants to continue to shop later.  This is really important 
//if they want to keep shopping.
function resetVariables() {

  productsToBuy = []; 
  numberOfItems; 
  idOfPurchase = null; 
  productPurchased = null;
  departmentOfItem = null;
  itemsInStock = null;
  purchasePrice = null;
  quantityToBuy = null;
  newQuantity = 0;

  //get the selection of items to display
  getSelectionOfItems();
}

//get selection of items if more than 0 in stock
function getSelectionOfItems() {
	connection.query("SELECT * FROM products Where stock_quantity > 0", function(err, res) {
    if (err) throw err;

    //this pushes all the products to my array.  just made it easier, I think
    for (var i =0; i < res.length; i++) { 
    	productsToBuy.push(res[i]);
    }

    //again, number of items in my array
    numberOfItems = res.length; 

    //invoke listItems to show on screen
   listItems(); 
  });
};

//list all of my items on screen as long as we have them in stock.  
function listItems() {

    console.log("\n ******************** Items for sale ********************** \n")

    //for every product in my array with stock quantity > 0, list it out
    for (var i =0; i < productsToBuy.length; i++) {
    	if (productsToBuy[i].stock_quantity > 0) {
        console.log ("Item Id: " + productsToBuy[i].item_id 
   			           + "\t Name: " + productsToBuy[i].product_name 
   			       + "\t\t Price: $" + productsToBuy[i].price);
       }
    };

    //invoke this function to get the ID of the item they want to purchase
    selectIdForPurchase(); 

};//end of list items


//select the ID to purchase.  
function selectIdForPurchase() {

  //ask for item id
  inquirer 
  .prompt([
    {
      type: "input",
      message: "\n Enter Item ID to purchase ",
      name: "saleId"
    }]).then  (function(inqRes) {

      //for ID of selected push all of the table elements to global variables for that item
    	for (var i = 0; i < productsToBuy.length; i++) { 
    		if (inqRes.saleId == productsToBuy[i].item_id) {
      			idOfPurchase = productsToBuy[i].item_id;
            itemsInStock = productsToBuy[i].stock_quantity;
            productPurchased  = productsToBuy[i].product_name
            departmentOfItem  = productsToBuy[i].department_name
            purchasePrice  = productsToBuy[i].price
    		} 
    	}

      //check purchase to see if it's valid         
      checkPurchase(); 
    });
}; //end selection of ID to purchase


//if the id isn't in the list or the items in stock = 0, display error and ask for ID again.
function checkPurchase() {  
  if (idOfPurchase == null || itemsInStock === 0) {
    console.log("\n Item ID not found! \n\n")
    selectIdForPurchase();
  } else {

  //otherwise show how many are in stock
  showQuantity();         
  }
}; //end of checkPurchase


//show quantity in stock
function showQuantity() {
	console.log("\n We have " + itemsInStock  + " in stock.")
  
  //select the quantity to purchase
	 selectQuantityToPurchase();
};


//select quantity to purchase
function selectQuantityToPurchase() {

  //ask how many they want
  inquirer
  .prompt([
    {
      type: "input",
      message: "\n How many do you wish to purchase? ",
      name: "saleQuantity"
    }]).then  (function(inqRes) {

      //if we have some in stock and the request isn't more than in stock, compute the bill and display it
      if (inqRes.saleQuantity > 0 && inqRes.saleQuantity <= itemsInStock) {
        totalSale += (Number(inqRes.saleQuantity) * Number(purchasePrice));
    	  newQuantity += (Number(itemsInStock) - Number(inqRes.saleQuantity));
      	console.log("\n Great! Your current total is $" + totalSale + "\n");

        //then update the Selected item in the mysql database
      	updateSelection();
    } else {

      //otherwise let them know there was a problem with the number to purchase
 	    console.log("\n !!!!!!!!!! Insufficient Quantity !!!!!!!!!! \n")

      //list the items in stock again...
      showQuantity(); 	 
    }
  });
}; //end quantity to purchase

//update the mysql database with new number in stock
function updateSelection() {

  //query for mysql.  update the table products and set the new quantity after purchase for item chosen
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
      	stock_quantity: newQuantity
      },
      {
        item_id: idOfPurchase
      }
    ],
    function(err, res) {

      //ask if they want to shop more
      shopMore();
    }
  );
}; //end of update of selection

//do they want to shop more?
function shopMore() {

  //ask but only yes/no choice
  inquirer
  .prompt([
    {
      type: "list",
      message: "\n Would you like to continue to shop? ",
      choices: ["Yes","No"],
      name: "keepShopping"
    }]).then  (function(inqRes) {
    if (inqRes.keepShopping === "Yes") {

      //if yes, reset variables used in the process and start again
		  resetVariables()
    } else {

      //otherwise, thank and end connection
      console.log("\n\n Thank you for shopping bamazon, drive through please.");
    	connection.end();
    }
  });
}; //end of shop more

