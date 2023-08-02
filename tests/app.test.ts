import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("API Server endpoints", () => {
    describe("POST /process_restock", () => {
        it("should successfully call the process_restock API endpoint", (done) => {
             chai.request(app)
                 .post("/process_restock")
                 .send([
                    {
                        "product_id": 0,
                        "quantity": 3
                    },
                    {
                        "product_id": 1,
                        "quantity": 21
                    }
                ])
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe("POST /process_order", () => {
        it("should successfully call the process_order API endpoint", (done) => {
            chai.request(app)
                .post("/process_order")
                .send({
                    "order_id": 123, 
                    "requested": [
                        {
                            "product_id": 0, 
                            "quantity": 2
                        }, 
                        {
                            "product_id": 10, 
                            "quantity": 4
                        }
                    ]
                })
               .end((err, res) => {
                   res.should.have.status(201);
                   res.body.should.be.a('object');
                   done();
               });
       });
    });
});