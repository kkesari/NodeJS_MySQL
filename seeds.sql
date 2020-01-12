/* 
Created by - Kiran Kesari
Created on - 01/09/2020
File description: 
This is a seeds file that uses bamazon database, and inserts records into the 2 tables - products and departments.
*/

USE bamazon;
-- CREATE TABLE products (
--   item_id INT NOT NULL AUTO_INCREMENT,
--   product_name VARCHAR(300) NOT NULL,
--   department_name VARCHAR(300) NOT NULL,
--   price DECIMAL(10,2) NOT NULL,
--   stock_quantity DECIMAL(10,2) NOT NULL,
--   PRIMARY KEY (item_id)
-- );

/* Insert 3 Rows into your new table */
INSERT INTO products VALUES (1, "Colgate Tooth Paste", "Personal Care", 4.50, 10 );
INSERT INTO products VALUES (item_id, "Kellogs Waffles", "Frozen Foods", 5.70, 5 );
INSERT INTO products VALUES (item_id, "General Mills Fruit Loops", "Dry_Baking Goods", 4.00, 3 );
INSERT INTO products VALUES (item_id, "Starbucks Coffe Ice cream", "Frozen Foods", 6.75, 4 );
INSERT INTO products VALUES (item_id, "Horizon Organic Whole Milk", "Dairy", 5.50, 2 );
INSERT INTO products VALUES (item_id, "Vital Farms Organic Brown Eggs", "Dairy", 6.50, 10 );
INSERT INTO products VALUES (item_id, "Lipton Lemon Ice Tea", "Beverages", 2.50, 5 );
INSERT INTO products VALUES (item_id, "Head and Shoulders anti-dandruff shampoo", "Personal Care", 7.00, 2 );
INSERT INTO products VALUES (item_id, "Local Produce Spinach", "Produce", 3.00, 7 );
INSERT INTO products VALUES (item_id, "Canned Organic Black Beans", "Dry_Baking Goods", 6.50, 10 );

select * from products;

select product_name, sum(price * stock_quantity)  from products group by product_name
having sum(price * stock_quantity) > 50;
