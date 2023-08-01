import { Inventory, Product, ProductRestock, Shipment, Order, OrderLineItem } from "./interfaces";

//
// Maximum weight of a single package that can be shipped
//
const PACKAGE_WEIGHT_MAXIMUM_G = 1800; // 1.8kg

// 
// In-memory store for product catalog
// 
let catalog: Product[] = [];

// 
// In-memory hashtable for product inventory
// 
let inventory: Inventory = {};

// 
// In-memory store for unfulfilled shipments
// 
let deferredShipments: Shipment[] = [];

// 
// Catalog initialization function
// - Initializes the products store
// - Initializes the inventory hashtable (all quantities initialized to 0)
// 
export const init_catalog = (products: Product[]) => {
    catalog.push(...products);
    catalog.forEach((product) => {
        inventory[product.product_id] = 0; // Load the inventory hashtable, initializing all quantities to 0
    });
};

// 
// Restock a list of products
// - Updates the quantities on hand
// - Retries shipping any pending orders/shipments
// 
export const process_restock = (restocks: ProductRestock[]) => {
    
    // For each restocked product...
    restocks.forEach((productRestock) => {
        let { product_id, quantity } = productRestock;

        // Update the quantity of each product in the restock
        if (inventory[product_id] !== undefined) {
            inventory[product_id] += quantity;
        } else {
            inventory[product_id] = quantity;
        }

        // // Process any pending orders/shipments that can be processed
        // const pendingShipmentIndex = pendingShipments.findIndex((shipment) => shipment.product_id === product_id);
        // if (pendingShipmentIndex !== -1) {
        //     const availableStock = inventory[product_id];
        //     const shipment = pendingShipments[pendingShipmentIndex];
    
        //     if (availableStock >= shipment.quantity) {
        //         shipment.quantity = 0;
        //         inventory[product_id] -= shipment.quantity;
        //     } else {
        //         shipment.quantity -= availableStock;
        //         inventory[product_id] = 0;
        //     }
    
        //     if (shipment.quantity === 0) {
        //         pendingShipments.splice(pendingShipmentIndex, 1);
        //     }
    
        //     shipPackage({ order_id: shipment.order_id, shipped: [{ product_id, quantity: shipment.quantity }] });
        // }
    });
  };

// 
// Process an order
// - Determine if each product in the order is in stock
// - Determine if the quantity of each requested product is in stock
// - Create packages for the products in stock
// - Verify that each package weight does not exceed the max weight
// - Store any unfulfilled shipments
// 
export const process_order = (order: Order) => {
    let deferredShipments: Shipment[] = [];
    let currentShipments: Shipment[] = [];
    let currentShipment: Shipment = {
        order_id: order.order_id,
        products: []
    };
    let currentShipmentWeight = 0;

    // For each requested line item (product) in the order...
    for (let lineItem of order.requested) {
        
        const quantityInStock = inventory[lineItem.product_id] || 0;

        // Determine if the desired quantity of this product is in stock
        if (quantityInStock >= lineItem.quantity) {

            let productWeight = catalog[lineItem.product_id].mass_g;
            let shippableQuantity = 0;
            let deferredQuantity = 0;

            // Create shipment(s) for the product(s)
            for (let i = 0; i < lineItem.quantity; i++) {
                // If the weight of this product does not exceed the maximum allowed package weight nor
                // the remaining weight of the shipment, add it to the shipment
                if ((PACKAGE_WEIGHT_MAXIMUM_G - currentShipmentWeight) >= productWeight) {
                    shippableQuantity++;
                    currentShipmentWeight += productWeight;
                } else {
                    deferredQuantity++;

                    // The weight of this product exceeds the remaining weight of the shipment, 
                    // ship the current package and create a new shipment
                    shipPackage(currentShipment); 

                    currentShipment = {
                        order_id: order.order_id,
                        products: []
                    };
                    currentShipmentWeight = 0;
                }   
            }
        
            // If the weight of this product does not exceed the maximum allowed package weight nor
            // the remaining weight of the shipment, add it to the shipment
            if (shippableQuantity > 0) {
                lineItem.quantity = shippableQuantity;
                currentShipment.products.push(lineItem); // Add one unit of this product to the shipment
            } 
            
            if (deferredQuantity > 0) {
                // The weight of this product exceeds the remaining weight of the shipment, 
                // ship the current package and create a new shipment
                lineItem.quantity = deferredQuantity;
                
                deferredShipments.push({
                    order_id: order.order_id,
                    products: [{
                        product_id: lineItem.product_id,
                        quantity: deferredQuantity
                    }]
                });
    
            }
        //}

            // Update the inventory quantity
            inventory[lineItem.product_id] -= lineItem.quantity;

        // Only part of the desired quantity of this product is in stock
        } else if (quantityInStock > 0 && lineItem.quantity > quantityInStock) {
            
            // Create shipment(s) for the quantity of products in stock
            for (let i = 0; i < quantityInStock; i++) {
                let productWeight = catalog[lineItem.product_id].mass_g;

                // If the weight of this product does not exceed the maximum allowed package weight nor
                // the remaining weight of the shipment, add it to the shipment
                if ((PACKAGE_WEIGHT_MAXIMUM_G - currentShipmentWeight) >= productWeight) {
                    currentShipment.products.push(lineItem); // Add this product to the shipment
                    currentShipmentWeight += productWeight;
                } else {
                    // The weight of this product exceeds the remaining weight of the shipment, 
                    // ship the current package and create a new shipment
                    shipPackage(currentShipment); 
                    
                    currentShipment = {
                        order_id: order.order_id,
                        products: []
                    };
                    currentShipmentWeight = 0;
                }
            }

            // Add the remaining quantity of products to the deferred shipments store
            const remainingQuantity = lineItem.quantity - quantityInStock;        
            deferredShipments.push({
                order_id: order.order_id,
                products: [{
                    product_id: lineItem.product_id,
                    quantity: remainingQuantity
                }]
            });

            // Update the inventory quantity to 0
            inventory[lineItem.product_id] = 0;      

        } else {

            // This product is out of stock, queue up for the next restock
            // Add the remaining quantity of products to the deferred shipments store
            deferredShipments.push({
                order_id: order.order_id,
                products: [{
                    product_id: lineItem.product_id,
                    quantity: lineItem.quantity
                }]
            });
        }
    });

    if (deferredShipments.length > 0) {
        console.log(`Order ID ${order.order_id}, Additional shipments are pending restock: ${JSON.stringify(deferredShipments)}.`);
    }
};

// 
// Stub function for shipping a package
// 
export const shipPackage = (shipment: Shipment) => {
    const { order_id, products } = shipment;
    console.log(`Order ${shipment.order_id} has shipped a package containing: ${products}`);
};

// 
// Returns the list of products in the catalog
// 
export const getProducts = () => {
    return catalog;
};

// 
// Adds a product to the catalog
// 
export const addProduct = (product: Product) => {

    product.product_id = getUniqueProductId();

    catalog.push(product);
};

// 
// Determines the next unique and available product id in the catalog
// 
const getUniqueProductId = () => {
    const productIds = catalog.map(product => product.product_id).sort();
    const newProductId = productIds[productIds.length - 1] + 1;
    return newProductId;
};

// 
// Returns the list of deferred shipments
// 
export const getDeferredShipments = () => {
    return deferredShipments;
};
