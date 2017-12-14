DROP database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id int(10) AUTO_INCREMENT NOT NULL,
    product_name varchar(255),
    department_name varchar(255),    
    price decimal(10,2),
    stock_quantity int(4),
    PRIMARY KEY (item_id)
    );
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
values("Sage Foundation Fly Rod","fishing",525.00,10),
      ("Sage Bolt Fly Rod","fishing",300.00,20), 
      ("Hardy Shadow Fly rod","fishing",349.99,30), 
      ("Orvis Bamboo 1856 Fly Rod","fishing",2795.00,1), 
      ("G. Loomis NRX Nymph Trout Fly Rod","fishing",785.00,8), 
      ("Stanley Classic Vacuum Stein","camping",26.24,100), 
      ("GoPro Portable Power Pack","camping",49.99,150), 
      ("Black Diamond Ion Headlamp","camping",24.99,500), 
      ("PackTowl Nano Pixel Camp Towel","camping",9.99,750), 
      ("Coleman Rugged Folding Saw","camping",19.99,22);

    
