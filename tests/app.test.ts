//import request from "supertest";
//import app from "../src/app";

describe ('abc', () => {
    it ('cbd', () => {
        expect(1).toBe(1);
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