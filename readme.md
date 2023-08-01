### Zipline Inventory and Order Processing Challenge  
  
#### Summary    
+ This is an API project that uses NodeJs, Express, Typescript, and Jest. 

+ I've added many console.log statements to track changing inventory, shipments, and deferred order processing. Viewing these messages via the console will probably be the easiest way to view changing data and logic.

#### Expectations/Assumptions
1. init_catalog is called with the provided JSON on src/app.ts prior to starting the express server.

2. The catalog, inventory, and deferred orders (or partial orders) are stored in-memory (src/inventory.ts).
  
#### Project Structure  
- API server routes:            src/app.ts
- Object interfaces/types:      src/interfaces.ts
- Inventory business logic:     src/inventory.ts
- Emmited Typescript files:     dist
- Jest tests                    tests/app.test.ts
 
### Running the project  
#### Startup
To start the server, run ```npm start```
  
#### API endpoints  
POST http://localhost:3000/process_order  
Content-Type: application/json  
  
```json
{"order_id": 123, "requested": [{"product_id": 0, "quantity": 2}, {"product_id": 10, "quantity": 4}]}
```  
  
POST http://localhost:3000/process_restock  
Content-Type: application/json  

```json
[{"product_id": 0, "quantity": 30}, {"product_id": 1, "quantity": 25}, {"product_id": 2, "quantity": 25}, {"product_id": 3, "quantity": 12}, {"product_id": 4, "quantity": 15}, {"product_id": 5, "quantity": 10}, {"product_id": 6, "quantity": 8}, {"product_id": 7, "quantity": 8}, {"product_id": 8, "quantity": 20}, {"product_id": 9, "quantity": 10}, {"product_id": 10, "quantity": 5}, {"product_id": 11, "quantity": 5}, {"product_id": 12, "quantity": 5}]
```  
  
### Test cases  
#### Happy path
1. Submit an order that contains quantities of products that the inventory can support
2. Submit an order that contains quantities of products that the inventory can only partially support
3. Submit an order that contains no quantities of products that the inventory can support (inventory is out/empty)
4. Submit an order prior to populating the inventory
5. Restock the inventory
6. Restock the insifficient inventory after trying to submit an order (deferred orders should go out)

#### Edge cases
1. Attempt to order a product that has a weight larger than the max of 1.8kg
2. Attempt to submit an order with no products
3.  

### Improvements (for production)  
Javascript naming conventions for function and variable/property names
OpenAPI - Swagger docs
Package disbursement algorithm (greedy algorithm) to use the least number of packages for an Order by splitting the items into packages that weigh as close to 1.8kg as possible.
Error handling
Logging
Database
Tests - Practice using TDD
JWT or OAuth security, CORS, input validation (zero-ZOD), file uploads, API browser, OpenAPI spec generator, prettier, eslint, typescript lint
OpenAPI Design-first approach

Add security: JWT or OAuth etc
Add CORS Support: cors npm package
Better project organization: Create a seperate file for each endpoint, organized by domain

Advantages/Disadvantages of using Express? Typescript? NodeJs/Python?

Study coding conventions for NodeJs APIs



