### Test Inventory and Order Processing Challenge  
  
#### Summary    
+ This is an API project that uses NodeJs, Express, Typescript, and Mocha/Chai. 

+ Viewing these messages via the console while the server is running will probably be the easiest way to view changing data and logic. 
  
+ "init_catalog" loads the product catalog JSON provided in the assignment and is located in src/data/catalog.ts.

+ The catalog, inventory, and deferred orders (or partial orders) are stored in-memory (defined on src/inventory.ts).
 
  
#### Project Structure  
- API server routes:            src/app.ts
- Object interfaces/types:      src/interfaces.ts
- Inventory business logic:     src/inventory.ts
- Emmited Typescript files:     dist
- Tests                         tests/**.test.ts  
 
#### Running the Project  
##### Install dependencies (package.json)
```npm install```

##### Start the server
```npm start```
  
##### Tests
```npm run test```
  
##### API endpoints  
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
  
#### Test cases  
##### Happy path
1. Submit an order that contains quantities of products that the inventory can support
2. Submit an order that contains quantities of products that the inventory can only partially support
3. Submit an order that contains no quantities of products that the inventory can support (inventory is out/empty)
4. Submit an order prior to populating the inventory
5. Restock the inventory
6. Restock the insufficient inventory when deferred orders exist

##### Edge cases
1. Submit an order that contains a product with weight larger than the max 1.8kg
2. Submit an order with no requested products

#### Improvements (for production)
- Security: Lockdown the API endpoints using JWT or OAuth etc
- Add/Configure CORS: cors npm package
- Improve upon unit testing, add many tests to get to a decent code coverage
- Practice TDD
- Create a more consistent reporting system. For example, report back useful information to the API callers.
- Improve error handling, perhaps using try/catch blocks where data validation is challenging (for example, incoming request body that is suppose to map to a type).
- Replace console.logs with server-side logging that can be ingested by various tools for monitoring
- Adhere to javascript naming conventions for the property names within the interfaces.
- Look for an opportunity to combine the products store with the inventory store via the interfaces/extensibility/inheritance
- Rewrite the createShipments logic to try using the least number of shipments for an Order by distributing the products within each shipment by the weights that add up as close to 1.8kg as possible first. I think this would be a greedy algorithm.
- Introduce a design-first module that allows us to maintain an OpenAPI spec and generate code from it.
- Add support for Swagger API docs
- Use a database instead of in-memory stores
- Separate some of the tasks into their own functions. For example, possibly use events to know when to try sending deferred orders after a restock. There are too many things happening in one function right now.
