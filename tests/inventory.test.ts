import chai, { expect } from "chai";
import { ProductRestock, Order } from "../src/interfaces";
import { initCatalog, processRestock, processOrder, inventory, catalog } from "../src/inventory";
import catalogData from "../src/data/catalog";

describe('initCatalog function', () => {
    it('should load the product catalog', () => {
        
        initCatalog(catalogData);
        
        expect(catalog.length).to.be.greaterThan(0);
    });
});

describe('processRestock function', () => {
    it('should add 5 units to the quantity for product_id 0', () => {
        
        const restocks: ProductRestock[] = [
            {
                "product_id": 0,
                "quantity": 5
            }
        ];

        const startingQuantity = inventory && inventory["0"] ? inventory["0"] : 0;
        processRestock(restocks);
        
        expect(inventory["0"]).to.equal(5 + startingQuantity);
    });
});

describe('processOrder function', () => {
    it('should process an order and decrement the inventory on hand', () => {
    
        const order: Order = {
            "order_id": 123, 
            "requested": [
                {
                    "product_id": 0, 
                    "quantity": 2
                }, 
                {
                    "product_id": 10, 
                    "quantity": 2
                }
            ]
        };

        const startingQuantityProduct0 = inventory && inventory["0"] ? inventory["0"] : 0;
        processOrder(order);
        
        expect(inventory["0"]).to.equal(startingQuantityProduct0 - 2);
    });
});