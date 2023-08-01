import { Inventory, Product, ProductRestock, Shipment, Order } from "./interfaces";

//
// Maximum weight of a single package that can be shipped
//
const PACKAGE_WEIGHT_MAXIMUM_G = 1800; // 1.8kg

// 
// In-memory store for product catalog
// 
let catalog: Product[] = [];

// 
// In-memory map for product inventory
//  key: product_id
//  value: quantity
// 
let inventory: Inventory = {};

// 
// In-memory store for unfulfilled orders
// 
let deferredOrders: Order[] = [];


// 
// Catalog initialization function
// - Initialize catalog store
// - Initialize inventory store
// 
export const initCatalog = (productInfo: string) => {
    
    const products: Product[] = productInfo ? JSON.parse(productInfo.trim()) : [];

    catalog.push(...products);
    catalog.forEach((product) => {
        inventory[product.product_id] = 0; // Initialize quantities to 0
    });

    console.log(`CATALOG: ${JSON.stringify(products)}`);
    console.log(`INVENTORY: ${JSON.stringify(inventory)}`);
};

// 
// Restocks the inventory
// - Updates quantities on hand
// - Retries shipping pending orders/shipments
// 
export const processRestock = (restocks: ProductRestock[]) => {
    
    // For each restocked product...
    restocks.forEach((productRestock) => {
        let { product_id, quantity } = productRestock;

        // Update the quantity of each product in the restock
        if (inventory[product_id] !== undefined) {
            inventory[product_id] += quantity;
        } else {
            inventory[product_id] = quantity;
        }
    });

    console.log(`INVENTORY RESTOCK: ${JSON.stringify(inventory)}`);

    // Retry shipping any pending orders/shipments
    if (deferredOrders.length > 0) {
        deferredOrders.forEach((order) => {
            createShipments(order);
        });
    }
};

// 
// Process an order
// 
export const processOrder = (order: Order) => {
    if (order && order.requested && order.requested.length) {
        createShipments(order);
    } else {
        console.log("Order object is undefined or missing requested products.");
    }
};

// 
// Ship a single package/shipment
// 
const shipPackage = (shipment: Shipment) => {
    if (shipment) {
        console.log(`A package has shipped: ${JSON.stringify(shipment)}`);
    } else {
        console.log("No shipment was supplied to this call.");
    }
};

// 
// Create package/shipment for an order
// 
const createShipments = (order: Order) => {
    let lineItems = [];             // list of line items (product_id + quantity) for a single shipment
    let currentWeight = 0;          // cumulative weight of products for a single shipment
    
    let deferredOrder: Order = {    // a new order object that may be used to hold products 
        order_id: order.order_id,   // or quantity subsets that can not currently be shipped.
        requested: []               // this order will attempt to ship after the next restock.
    };
  
    console.log(`INVENTORY: ${JSON.stringify(inventory)}`);
    console.log(`INCOMING ORDER: ${JSON.stringify(order)}.`);

    // for each line item in this order...
    for (const lineitem of order.requested) {

        const { product_id, quantity } = lineitem;          // destructure the props out of the line item into (for better readability)
        const weight = catalog[product_id].mass_g;          // get the weight of the product from the catalog
        const quantityInStock = inventory[product_id] || 0; // get the quantity in stock

        // determine how many units of the requested quantity are in stock for this product
        let shippableQuantity = (quantityInStock > 0) ? Math.min(quantity, quantityInStock) : 0;
        
        // determine how many units of the requested quantity are not in stock
        const unshippableQuantity = (quantity - quantityInStock);

        // for each unit in the shippable quantity amount
        while (shippableQuantity > 0) {

            // determine if the current cumulative weight of the shipment + the weight of this single product 
            // is within range of the max weight of a shipment
            if ((currentWeight + weight) <= PACKAGE_WEIGHT_MAXIMUM_G) {

                // determine the quantity that we can add to this shipment
                // - determine how many of these products could fit in the shipment (rounded down)
                // - take the minimum quantity that can fit in the shipment
                const roomLeftInShipment = Math.floor((PACKAGE_WEIGHT_MAXIMUM_G - currentWeight) / weight);
                const quantityToAdd = Math.min(shippableQuantity, roomLeftInShipment);
                
                // add this quantity of products to the shipment
                lineItems.push({ product_id, quantity: quantityToAdd });
                
                // update the current weight of the shipment
                currentWeight += weight * quantityToAdd;

                // decrement the shipable quantity
                shippableQuantity -= quantityToAdd;

                // update the inventory
                inventory[product_id] -= quantityToAdd;

            } else {
                // the cumulative weight with this product added would exceed the max weight of a shipment
                // ship the current package
                const shipment: Shipment = {
                    order_id: order.order_id,
                    shipped: [...lineItems]
                };

                shipPackage(shipment);

                // clear the line items and curent cumulative weight
                lineItems = [];
                currentWeight = 0;
            }
        }

        // if there are not enough units of this product in stock, add them to the deferred order to process later
        if (unshippableQuantity > 0) {
            deferredOrder.requested.push({product_id, quantity: unshippableQuantity});
        }
    }

    // Last shipment in order
    if (lineItems.length > 0) {
        const shipment: Shipment = {
            order_id: order.order_id,
            shipped: [...lineItems]
        };

        shipPackage(shipment);
    }

    if (deferredOrder.requested.length > 0) {
        deferredOrders.push(deferredOrder);

        console.log(`ORDER HAS PENDING SHIPMENTS: ${JSON.stringify(deferredOrder)}.`);
    }

    console.log(`INVENTORY: ${JSON.stringify(inventory)}`);
};
