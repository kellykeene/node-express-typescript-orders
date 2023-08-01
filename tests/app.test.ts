import request from "supertest";
import app from "../src/app";

describe ('abc', () => {
    it ('cbd', () => {
        expect(1).toBe(1);
    }); 
});

// Tests for the /process_restock endpoint
describe("POST /process_restock", () => {
    it("should return 201 Created", (done) => {
        request(app).post("/process_restock")
            .send([
                {
                    "product_id": 0,
                    "quantity": 30
                },
                {
                    "product_id": 1,
                    "quantity": 25
                }
            ])
            .expect(201, done);
    });
});


// describe("GET /products", () => {
//     it("should return 200 OK", (done) => {
//         request(app).get("/products")
//             .expect(200, done);
//     });
// });

// describe("POST /products", () => {
//     it("should return false from assert when no message is found", (done) => {
//         request(app).post("/products")
//             .field("name", "John Doe")
//             .field("email", "john@me.com")
//             .end(function(err, res) {
//                 expect(res.error).to.be.false;
//                 done();
//             })
//             .expect(302);

//     });
// });