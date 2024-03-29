import express from "express";
import { initCatalog, processRestock, processOrder } from "./inventory";
import catalogData from "./data/catalog";

// 
// Setup express server and json parser middleware
// 
const app = express();
app.use(express.json());

//
// API endpoint for processing an incoming order
// Usage: 
//  POST http://localhost:3000/process_order
//  Content-Type: application/json
//  Sample payload: {"order_id": 123, "requested": [{"product_id": 0, "quantity": 2}, {"product_id": 10, "quantity": 4}]}
//  
app.post("/process_order", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No order found in request body" });
    }
    
    processOrder(req.body);

    res.status(201).send("Process Order was successfully called. Check Console for messaging.");
});

//
// API endpoint for restocking products
// Usage: 
//  POST http://localhost:3000/process_restock
//  Content-Type: application/json
//  Sample payload: [{"product_id": 0, "quantity": 30}, {"product_id": 1, "quantity": 25}, {"product_id": 2, "quantity": 25}, {"product_id": 3, "quantity": 12}, {"product_id": 4, "quantity": 15}, {"product_id": 5, "quantity": 10}, {"product_id": 6, "quantity": 8}, {"product_id": 7, "quantity": 8}, {"product_id": 8, "quantity": 20}, {"product_id": 9, "quantity": 10}, {"product_id": 10, "quantity": 5}, {"product_id": 11, "quantity": 5}, {"product_id": 12, "quantity": 5}]
// 
app.post("/process_restock", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No product restocks found in request body" });
    }

    processRestock(req.body);

    res.status(201).send("Process Restock was successfully called. Check Console for messaging.");
});

// 
// Initialize catalog and inventory
// 
initCatalog(catalogData);

// 
// Start the server
// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${ PORT }`);
});

// 
// Exporting for tests
// 
export default app;