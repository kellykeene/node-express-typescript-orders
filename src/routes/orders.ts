import express from "express";
import { processOrder } from "../inventory";

const orderRouter = express.Router();

//
// API endpoint for processing an incoming order
// Usage: 
//  POST http://localhost:3000/process_order
//  Content-Type: application/json
//  Sample payload: {"order_id": 123, "requested": [{"product_id": 0, "quantity": 2}, {"product_id": 10, "quantity": 4}]}
//  
orderRouter.post("/process_order", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No order found in request body" });
    }
    
    processOrder(req.body);

    res.status(201).send("Process Order was successfully called. Check Console for messaging.");
});

export default orderRouter;