//require mysql library
var mysql = require("mysql");

//require inquirer module
var inquirer = require("inquirer");

//global array of products
var inventoryItems = []; 
var quantityToAdd;

//these variables will hold the info on inventory selected.  
var itemId; //item_id
var itemName;//product_name
var itemDepartment;//department_name
var itemsInStock;//stock_quantity
var itemPrice;//price

//create the msql connection to the database
var connection = mysql.createConnection({
  host: "127.0.0.1", 
  port: 3306,
  user: "root",
  password: "holymoly",
  database: "bamazon"
});

//if connected start doing some work, or throw error
connection.connect(function(err) {
  if (err) throw err;

  //reset global variables. 
  resetVariables(); 
});


//reset the variables if the manager wants to do more work.  More important for later
function resetVariables() {

    inventoryItems = [];
    quantityToAdd = null;//

    itemId = null; //item_id
    itemName = null;//product_name
    itemDepartment = null;//department_name
    itemsInStock = null;//stock_quantity
    itemPrice = null;//price

    getSelectionOfItems();
}


//push the products to the global array to use
function getSelectionOfItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    //show all products
    for (var i =0; i < res.length; i++) {
      inventoryItems.push(res[i]);
    }
    //start the management options menu
    selectManagementOption();
  });
};

//What do you want to manage?
function selectManagementOption() {

  //ask the question in a list
  inquirer
  .prompt([
    {
      type: "list",
      message: "\n\n What would you like to manage? \n\n",
      choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add new Product","Quit Menu"],
      name: "manageData"
    }]).then  (function(inqRes) {

      switch(inqRes.manageData) {

        //if view for sale, invoke that function
        case "View Products for Sale":
        viewProducts();
        break;

        //if view low, invoke that function
        case "View Low Inventory":
        viewLow();
        break;

        //if add to inventory, invoke that function
        case "Add to Inventory":
        addInventory();
        break;

        //if add new product, invoke that function
        case "Add new Product":
        addProduct();
        break;

        //Anything else ends the connection, and program
        default:
        console.log("You are no longer a manager... ")
        connection.end();

      }
   });
}; //end of select option


//view products for sale, at least 1 in stock
function viewProducts() {

    console.log("\n ******************** Items in Inventory with at least 1 in stock ********************** \n")
    for (var i =0; i < inventoryItems.length; i++) {
      if (inventoryItems[i].stock_quantity > 0) {

      console.log ("Item Id: " + inventoryItems[i].item_id 
               + "\t Name: " + inventoryItems[i].product_name 
               + "\t\t In Stock: " + inventoryItems[i].stock_quantity               
               + "\t Price: $" + inventoryItems[i].price);
       }
    };

    //then go back to options selection
  selectManagementOption();
}; //end of viewProducts

//view products for sale that are low on inventory, including zero
function viewLow() {

    console.log("\n ******************** Low Inventory Items ********************** \n")
    for (var i =0; i < inventoryItems.length; i++) {
      if (inventoryItems[i].stock_quantity < 5) {

      console.log ("Item Id: " + inventoryItems[i].item_id 
               + "\t Name: " + inventoryItems[i].product_name 
               + "\t\t In Stock: " + inventoryItems[i].stock_quantity
               + "\t Price: $" + inventoryItems[i].price);
       }
    };
  selectManagementOption();
}; //end of viewProducts


//select an item to add stock to.  
function addInventory() {

    console.log("\n ******************** Add Inventory********************** \n")
    for (var i =0; i < inventoryItems.length; i++) {
      console.log ("Item Id: " + inventoryItems[i].item_id 
               + "\t Name: " + inventoryItems[i].product_name 
               + "\t\t In Stock: " + inventoryItems[i].stock_quantity
               + "\t Price: $" + inventoryItems[i].price);
   };
  selectItem();
}; //end of add inventory


function selectItem() {

  //select the ID to add
  inquirer
  .prompt([
    {
      type: "input",
      message: "\n Enter ID of item to add stock ",
      name: "addId"
    }]).then  (function(inqRes) {

      //if it's a number greater than zero but in the ID range, write to variable and invoke add quantity
      if (inqRes.addId > 0 && inqRes.addId <= inventoryItems.length ) {
      itemId = inqRes.addId;
      howManyToAdd();
    } else {

      //otherwise list out the items again, re-ask
      console.log("\n Invalid ID!  \n")
      addInventory();
    }
  });
};// end of item selection


function howManyToAdd() {

  //how many to add?
  inquirer
  .prompt([
    {
      type: "input",
      message: "\n How many would you like to add? ",
      name: "addCount"
    }]).then  (function(inqRes) {

      //if it's a number greater than zero, write to variable and invoke add quantity
      if (inqRes.addCount > 0) {
        for (var i =0; i < inventoryItems.length; i++) {
          if (itemId == inventoryItems[i].item_id) {
            quantityToAdd = (Number(inqRes.addCount) + Number(inventoryItems[i].stock_quantity));
          } 
        }
        //add it to the db
      addToStockQuantity();
    } else {

      //otherwise ask for a good entry number
      console.log("\n Invalid quantity to add!  \n")
      addInventory();
    }
  });
};// end of how many to add

function addToStockQuantity() {
    //query for mysql.  update the table products and set the new quantity after purchase for item chosen
    var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: quantityToAdd
      },
      {
        item_id: itemId
      }
    ],
    function(err, res) {

      //main menu
      resetVariables();
      }
    );
}//end of add to stock


function addProduct() {

  //get some info on the product to add!
  inquirer
  .prompt([
    {
      type: "input",
      message: "\n What is the name of the product to add? ",
      name: "newProduct"
    },
    {
      type: "input",
      message: "\n What department does this product go in? ",
      name: "toDepartment"
    },

    {
      type: "input",
      message: "\n Number of items in stock? ",
      name: "addQuantity",
      validate: function(val) {
      	//regular expression making certain it's a number
        var reg = /^\d+$/;
        return reg.test(val) || "Number of items should be a number!";
      }
    },
    {
      type: "input",
      message: "\n What is the per item price for this? ",
      name: "newPrice",
      validate: function(val2) {
      	//regular expression making certain it's a valid price	
        var reg2 = /^(?!0+(\.0+)?$)\d{0,5}(.\d{1,2})?$/;
        return reg2.test(val2) || "Enter a valid price!";
      }
    }]).then  (function(inqRes) {

    	//this actually inserts the new product in to the database
        var query = connection.query(
        	"INSERT INTO products SET ?",
        	{
        		product_name: inqRes.newProduct,
                department_name: inqRes.toDepartment,
                stock_quantity: inqRes.addQuantity,
                price: inqRes.newPrice
            },
            function(err, res) {
            	console.log(res.affectedRows + " product inserted!\n");

                // Call updateProduct AFTER the INSERT completes
                resetVariables();
            }
        };
    });
}
