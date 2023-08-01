import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Order, OrderLineItem, Product, ProductRestock, Shipment } from "./interfaces";
import { init_catalog, process_restock, process_order, getProducts, getDeferredShipments, addProduct } from "./inventory";

// 
// Setup express server and json parser middleware
// 
const app = express();
app.use(express.json());

// 
// In-memory store for orders submitted by hospitals
// 
let orders: Order[] = [];


//
// API endpoint for initializing the product catalog
// Usage: 
//  POST http://localhost:3000/init_catalog
//  Content-Type: application/json
//  Sample payload: [{"mass_g": 700, "product_name": "RBC A+ Adult", "product_id": 0}, {"mass_g": 700, "product_name": "RBC B+ Adult", "product_id": 1}, {"mass_g": 750, "product_name": "RBC AB+ Adult", "product_id": 2}, {"mass_g": 680, "product_name": "RBC O- Adult", "product_id": 3}, {"mass_g": 350, "product_name": "RBC A+ Child", "product_id": 4}, {"mass_g": 200, "product_name": "RBC AB+ Child", "product_id": 5}, {"mass_g": 120, "product_name": "PLT AB+", "product_id": 6}, {"mass_g": 80, "product_name": "PLT O+", "product_id": 7}, {"mass_g": 40, "product_name": "CRYO A+", "product_id": 8}, {"mass_g": 80, "product_name": "CRYO AB+", "product_id": 9}, {"mass_g": 300, "product_name": "FFP A+", "product_id": 10}, {"mass_g": 300, "product_name": "FFP B+", "product_id": 11}, {"mass_g": 300, "product_name": "FFP AB+", "product_id": 12}]
//  
app.post("/init_catalog", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No products found in request body" });
    }

    init_catalog(req.body);

    res.status(201).json(req.body);
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

    process_restock(req.body);

    // Return the list of products that have been restocked
    res.status(201).send("Products have been restocked");
});

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
    
    process_order(req.body);

    res.status(201).send("Order has been processed");
});


// 
// API endpoint for getting all products
// 
app.get("/products", (req, res) => {
    res.status(200).json(getProducts());
});

// 
// API endpoint for adding a new product
// 
app.post("/products", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No product found in request body" });
    }

    addProduct(req.body);

    res.status(201).send("Product has been added");
});

// 
// API endpoint for getting all deferred shipments
// 
app.get("/deferredshipments", (req, res) => {
    res.status(200).json(getDeferredShipments());
});


// 
// Start the server
// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${ PORT }`);
});
