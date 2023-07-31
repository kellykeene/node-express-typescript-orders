import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Order, OrderLineItem, Product, Restock, Shipment } from "./interfaces";

// 
// Setup express server and json middleware
// 
const app = express();
app.use(express.json());

//
// Maximum weight of a single package that can be shipped
//
const PACKAGE_WEIGHT_MAXIMUM = 1.8;

// 
// In-memory store for product catalog
// 
const products: Product[] = [];

// 
// In-memory store for product inventory
// 
const inventory: Restock[] = [];

// 
// In-memory store for orders submitted by hospitals
// 
const orders: Order[] = [];


//
// Initialize the inventory catalog
//
const init_catalog = (product_info: string) => {
    const catalogPayload: Product[] = JSON.parse(product_info);
    products.push(...catalogPayload);
}

//
// API endpoint for processing an incoming order from a hospital
// Example json: {"order_id": 123, "requested": [{"product_id": 0, "quantity": 2}, {"product_id": 10, "quantity": 4}]}
//  
app.post("/process_order", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ error: "No order found in request body" });
    }

    const orderPayload = req.body;
    const order: Order = {
        order_id: uuidv4(),
        ...orderPayload
    };

    // Add order to store
    orders.push(order);

    // Gather the products within the order that are in stock and out of stock
    const requestedProductsInStock: Restock[] = [];
    const requestedProductsOutOfStock: Restock[] = [];

    order.requested.forEach((requestedProduct) => {
        
        // Determine if the requested product is in stock
        const productInInventory = inventory.find(product => product.product_id === requestedProduct.product_id);
        
        if (productInInventory) {
            // Quantity in stock is sufficient
            if (productInInventory.quantity >= requestedProduct.quantity) {
                requestedProductsInStock.push(requestedProduct);
                
            // Quantity in stock is partially sufficient
            } else if (productInInventory.quantity > 0 && productInInventory.quantity < requestedProduct.quantity) {
                // A subset of the total ordered products is in stock
                const partialRequestedProduct: OrderLineItem = {
                    product_id: requestedProduct.product_id,
                    quantity: productInInventory.quantity
                };
                requestedProductsInStock.push(partialRequestedProduct);

                const remainingRequestedProduct: OrderLineItem = {
                    product_id: requestedProduct.product_id,
                    quantity: requestedProduct.quantity - productInInventory.quantity
                };
                requestedProductsOutOfStock.push(remainingRequestedProduct);

            // Quantity in stock is insufficient (restock object exists with qunatity set to 0)
            } else {
                requestedProductsOutOfStock.push(requestedProduct);
            }
        // Product is not in stock or does not exist in inventory
        } else {
            requestedProductsOutOfStock.push(requestedProduct);
        }
    });

    // 2. Determine how to package the products based on maximum weight
    
    

    // 3. Decrement inventory product quantities
    // restockDecrement

    // 4. Ship package(s)
    // ship_package(shipment)

    res.status(201).json(order);
});

//
// API endpoint for restocking products
//  
app.post("/process_restock", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ error: "No restock found in request body" });
    }

    const restockPayload = req.body;
    const restock: Restock = {
        ...restockPayload
    };

});

// 
// Stub API for shipping a package
// 
app.post("/ship_package", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ error: "No shipment found in request body" });
    }

    const shipmentPayload = req.body;
    const shipment: Shipment = {
        ...shipmentPayload
    };

    res.status(201).json(shipment);
});

// 
// API endpoint for getting all products
// 
app.get("/products", (req, res) => {
    res.json(products);
});

// 
// API endpoint for adding a new product
// 
app.post("/products", (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ error: "No product found in request body" });
    }

    const productPayload = req.body;
    const product: Product = {
        product_id: getUniqueProductId(),
        ...productPayload
    };

    products.push(product);

    res.status(201).json(product);
});

// 
// API endpoint for getting all orders
// 
app.get("/orders", (req, res) => {
    res.json(orders);
});

const getUniqueProductId = () => {
    const productIds = products.map(product => product.product_id);
    let newProductId = 0;

    while (productIds.includes(newProductId)) {
        newProductId++;
    }

    return newProductId;
};



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

    // Initialiaze the inventory catalog
    init_catalog('[{"mass_g": 700, "product_name": "RBC A+ Adult", "product_id": 0}, {"mass_g": 700, "product_name": "RBC B+ Adult", "product_id": 1}, {"mass_g": 750, "product_name": "RBC AB+ Adult", "product_id": 2}, {"mass_g": 680, "product_name": "RBC O- Adult", "product_id": 3}, {"mass_g": 350, "product_name": "RBC A+ Child", "product_id": 4}, {"mass_g": 200, "product_name": "RBC AB+ Child", "product_id": 5}, {"mass_g": 120, "product_name": "PLT AB+", "product_id": 6}, {"mass_g": 80, "product_name": "PLT O+", "product_id": 7}, {"mass_g": 40, "product_name": "CRYO A+", "product_id": 8}, {"mass_g": 80, "product_name": "CRYO AB+", "product_id": 9}, {"mass_g": 300, "product_name": "FFP A+", "product_id": 10}, {"mass_g": 300, "product_name": "FFP B+", "product_id": 11}, {"mass_g": 300, "product_name": "FFP AB+", "product_id": 12}]');

    console.log(`Server is listening on port ${ PORT }`);
});
