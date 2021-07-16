const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { Pool } = require("pg");
const user_router = require("../routes/user_router");
const contact_router = require("../routes/contact_router");
const activity_router = require("../routes/activity_router");
const httpError = require("../middleware/httpError");

require("dotenv/config");

chai.should();
chai.use(chaiHttp);

var token;
var contact_id_1;
var contact_id_2;
var activity_id_1;

const getClient = async function () {
  const pool = new Pool({
    user: "grinch",
    host: "localhost",
    database: "express_crm_test",
    port: 5432,
    password: "1",
  });
  let client = await pool.connect();
  await client.query("BEGIN");
  console.log("*** TRANSACTION BEGIN *** on ", process.env.NODE_ENV);
  return client;
};

const CP = getClient();

async function get_client_middleware(req, res, next) {
  let client = await CP;
  req.client = client;
  next();
}
// module.exports = {get_client_middleware,CP}

app.use(get_client_middleware);
app.use("/auth", user_router);
app.use("/contact", contact_router);
app.use("/activity", activity_router);
app.use(httpError);

describe("TESTING BODY", () => {
  after(async () => {
    let client = await CP;
    await client.query("ROLLBACK");
    console.log("*** ROLLING BACK ***");
    client.release();
  });

  describe("TESTING USER HANDLER", () => {
    describe("TESTING SIGNUP", () => {
      it("Adding user", (done) => {
        let newUser = { inputEmail: "A", inputPassword: "A", clientName: "A" };
        chai
          .request(app)
          .post("/auth/signup")
          .send(newUser)
          .end((err, response) => {
            response.should.have.status(201);
            done();
          });
      });

      it("Adding user with repetitive Email", (done) => {
        let newUser = { inputEmail: "A", inputPassword: "A", clientName: "A" };
        chai
          .request(app)
          .post("/auth/signup")
          .send(newUser)
          .end((err, res) => {
            res.should.have.status(406);
            done();
          });
      });

      it("adding user with incomplete data", (done) => {
        let wrongUser = {};
        chai
          .request(app)
          .post("/auth/signup")
          .send(wrongUser)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    describe("TESTING LOGIN", () => {
      it("Logging in", (done) => {
        let userAuth = { inputEmail: "A", inputPassword: "A" };
        chai
          .request(app)
          .post("/auth/login")
          .send(userAuth)
          .end((err, res) => {
            token = res.body.data;
            res.should.have.status(200);
            done();
          });
      });

      it("Logging in with incorrect password", (done) => {
        let userAuth = { inputEmail: "A", inputPassword: "B" };
        chai
          .request(app)
          .post("/auth/login")
          .send(userAuth)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it("Logging in with incorrect Email", (done) => {
        let userAuth = { inputEmail: "B", inputPassword: "B" };
        chai
          .request(app)
          .post("/auth/login")
          .send(userAuth)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    describe("GET CURRENT USER", () => {
      it("getting current user with token", (done) => {
        chai
          .request(app)
          .get("/auth/current_user")
          .set("token", token)
          .send("")
          .end((err, res) => {
            // expect(res.body.data.email).to.be('A')
            res.should.have.status(200);
            done();
          });
      });

      it("getting current user with invalid token", (done) => {
        chai
          .request(app)
          .get("/auth/current_user")
          .set("token", "A")
          .send("")
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it("getting current user with no token", (done) => {
        chai
          .request(app)
          .get("/auth/current_user")
          .send("")
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    describe("UPDATE USER", () => {
      it("update user with valid token", (done) => {
        let newVals = { inputEmail: "updated" };
        chai
          .request(app)
          .put("/auth/update_user")
          .set("token", token)
          .send(newVals)
          .end((err, res) => {
            // res.body.should.have.info('UPDATED')
            // expect(res.body.info).to.be('UPDATED')
            res.should.have.status(200);
            done();
          });
      });

      it("test the updated user", (done) => {
        chai
          .request(app)
          .get("/auth/current_user")
          .set("token", token)
          .send("")
          .end((err, res) => {
            res.should.have.status(200);

            // expect(res.body.data).to.have.property('email')
            // expect(res.body.data.email).to.be('updated')
            done();
          });
      });

      it("update user with invalid token", (done) => {
        let newVals = { inputEmail: "updated" };
        chai
          .request(app)
          .put("/auth/update_user")
          .set("token", "A")
          .send(newVals)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it("update user with valid token and empty request body", (done) => {
        let emptyT = {};
        chai
          .request(app)
          .put("/auth/update_user")
          .set("token", token)
          .send(emptyT)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
  });

  describe("TESTING CONTACT HANDLER", () => {
    describe("ADD CONTACT", () => {
      it("Adding contacts", (done) => {
        const newCont = {
          firstname: "A",
          lastname: "B",
          email: "C",
          phonenumber: "0",
        };
        chai
          .request(app)
          .post("/contact")
          .set("token", token)
          .send(newCont)
          .end((err, res) => {
            res.should.have.status(201);
            done();
          });
      });

      it("Adding contacts with incomplete data", (done) => {
        const newCont = {
          firstname: "A",
        };
        // token = fs.readFileSync("./test/token.txt", "utf8");
        chai
          .request(app)
          .post("/contact")
          .set("token", token)
          .send(newCont)
          .end((err, res) => {
            res.should.have.status(400);
          });
        done();
      });

      it("Adding contacts with invalid token", (done) => {
        const newCont = {
          firstname: "A",
          lastname: "B",
          email: "C",
          phonenumber: "0",
        };
        chai
          .request(app)
          .post("/contact")
          .set("token", "invalidtokenB")
          .send(newCont)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    describe("RETRIVE CONTACTS", () => {
      it("gettin all contacts with valid token", (done) => {
        // let token = fs.readFileSync("./test/token.txt", "utf8");
        chai
          .request(app)
          .get("/contact/all")
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            contact_id_1 = res.body.data[0].id;
            done();
          });
      });
      it("gettin all contacts with invalid tokenB", (done) => {
        // let token = fs.readFileSync("./test/token.txt", "utf8");
        chai
          .request(app)
          .get("/contact/all")
          .set("token", "invalidtokenB")
          .send()
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    describe("DELETE CONTACTS", () => {
      it("Delete Contact", (done) => {
        // let token = fs.readFileSync("./test/token.txt", "utf8");
        chai
          .request(app)
          .delete(`/contact/delete/${contact_id_1}`)
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });

      it("Adding contacts", (done) => {
        const newCont = {
          firstname: "A",
          lastname: "B",
          email: "C",
          phonenumber: "0",
        };
        chai
          .request(app)
          .post("/contact")
          .set("token", token)
          .send(newCont)
          .end((err, res) => {
            res.should.have.status(201);
            contact_id_2 = res.body.data[0].id;
            done();
          });
      });

      it("Delete Contact with invalid id", (done) => {
        chai
          .request(app)
          .delete(`/contact/delete/${99999}`)
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe("UPDATE CONTACTS", () => {
      it("update Contact", (done) => {
        let newInfo = {
          firstname: "new",
          lastname: "new",
          email: "new",
          phonenumber: 11,
        };
        chai
          .request(app)
          .put(`/contact/update/${contact_id_2}`)
          .set("token", token)
          .send(newInfo)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
      it("update Contact with invalid ID (deleted id)", (done) => {
        // let token = fs.readFileSync("./test/token.txt", "utf8");
        let newInfo = {
          firstname: "new",
          lastname: "new",
          email: "new",
          phonenumber: 11,
        };
        chai
          .request(app)
          .put(`/contact/update/${contact_id_1}`)
          .set("token", token)
          .send(newInfo)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });

  describe("TESTING ACTIVITY HANDLER", () => {
    describe("ADDING ACTIVITY", () => {
      it("add activity", (done) => {
        let newAct = {
          action: "B",
          description: "B",
          date: "1988-09-21",
          time: "12:12",
        };
        chai
          .request(app)
          .post(`/activity/${contact_id_2}`)
          .set("token", token)
          .send(newAct)
          .end((err, res) => {
            res.should.have.status(201);
            done();
          });
      });
      it("add activity with incomplete data", (done) => {
        let newAct = {
          // action: "B",
          // description: "B",
          date: "1988-09-21",
          // time: '12:12'
        };
        let id_to_add_activity = contact_id_2;
        chai
          .request(app)
          .post(`/activity/${id_to_add_activity}`)
          .set("token", token)
          .send(newAct)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
      it("add activity with Invalida token", (done) => {
        let newAct = {
          action: "B",
          description: "B",
          date: "1988-09-21",
          time: "12:12",
        };
        let id_to_add_activity = contact_id_2;
        chai
          .request(app)
          .post(`/activity/${id_to_add_activity}`)
          .set("token", "InvalidToken")
          .send(newAct)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("add activity with empty request body", (done) => {
        let newAct = {};
        let id_to_add_activity = contact_id_2;
        chai
          .request(app)
          .post(`/activity/${id_to_add_activity}`)
          .set("token", token)
          .send(newAct)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });
    describe("GETTING ACTIVITIES", () => {
      it("getting activity list", (done) => {
        chai
          .request(app)
          .get(`/activity/${contact_id_2}`)
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            activity_id_1 = res.body.data[0].id;
            done();
          });
      });
      it("getting activity list with invalid token", (done) => {
        chai
          .request(app)
          .get(`/activity/${contact_id_2}`)
          .set("token", "invalidToken")
          .send()
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("getting activity list with invalid user id", (done) => {
        chai
          .request(app)
          .get(`/activity/${9999999}`)
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe("UPDATE ACTIVITY", () => {
      it("update the activity", (done) => {
        chai
          .request(app)
          .put(`/activity/${contact_id_2}/update/${activity_id_1}`)
          .set("token", token)
          .send({ date: "2000-01-01" })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
      it("update the activity with invalid activity_id", (done) => {
        chai
          .request(app)
          .put(`/activity/${contact_id_2}/update/${999999}`)
          .set("token", token)
          .send({ date: "2000-01-01" })
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });

      it("update the activity with invalid contact_id", (done) => {
        chai
          .request(app)
          .put(`/activity/${9999999}/update/${activity_id_1}`)
          .set("token", token)
          .send({ date: "2000-01-01" })
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });

      it("update the activity with invalid token", (done) => {
        chai
          .request(app)
          .put(`/activity/${contact_id_2}/update/${activity_id_1}`)
          .set("token", "invalidToken")
          .send({ date: "2000-01-01" })
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    describe("DELETING ACTIVITY", () => {
      it("delete activity", (done) => {
        chai
          .request(app)
          .delete(`/activity/${contact_id_2}/delete/${activity_id_1}`)
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });

      it("delete activity with invalid token", (done) => {
        chai
          .request(app)
          .delete(`/activity/${contact_id_2}/delete/${activity_id_1}`)
          .set("token", "invalidToken")
          .send()
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it("delete activity with invalid activity_id", (done) => {
        chai
          .request(app)
          .delete(`/activity/${contact_id_2}/delete/${9999999}`)
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });

      it("delete activity with invalid contact_id", (done) => {
        chai
          .request(app)
          .delete(`/activity/${99999}/delete/${activity_id_1}`)
          .set("token", token)
          .send()
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });
});
