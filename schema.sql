/* 
Created by - Kiran Kesari
Created on - 01/09/2020
File description: 
This is a schema file that creates a new database bamazon, and creates 2 tables products and departments under the 
bamazon database, each table having its own primary key.
*/
/* Schema for SQL database/table. */
DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

/* ------------------------- Create Products Table -------------------------------------------*/
/* Create new table called products with a primary key item_id that auto-increments */
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(300) NOT NULL,
  department_name VARCHAR(300) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (item_id)
);

/* ------------------------- Create Departments Table -------------------------------------------*/
/* Create new table called products with a primary key department_id that auto-increments */

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(300) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (department_id)
);