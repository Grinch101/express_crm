const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { Pool } = require("pg");
const user_router = require("../routes/user_router");
const contact_router = require("../routes/contact_router");
const activity_router = require("../routes/activity_router");
const httpError = require("../middleware/httpError");
const fs = require("fs");
const { expect } = require("chai");

require("dotenv/config");

chai.should();
chai.use(chaiHttp);

var token;

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

app.use(get_client_middleware);
app.use("/auth", user_router);
app.use("/contact", contact_router);
app.use("/activity", activity_router);
app.use(httpError);

describe("Testing User Handler", () => {
  after(async () => {
    let client = await CP;
    await client.query("ROLLBACK");
    console.log("ROLLING BACK");
    client.release();
  });

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
      let newUser = { inputEmail: "A", inputPassword: "B", clientName: "C" };
      chai
        .request(app)
        .post("/auth/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(406);
          done();
        });
    });

    // it("adding user with incomplete data", (done) => {
    //   let wrongUser = { };
    //   chai
    //     .request(app)
    //     .post("/auth/signup")
    //     .send(wrongUser)
    //     .end((err, res) => {
    //       console.log(res.body);
    //       res.should.have.status(400);
    //       done();
    //     });
    // });
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
          fs.writeFileSync("./test/token.txt", token);
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
      const Q = async function(){
        let client = await CP;
        let q = await client.query('SELECT * FROM users')
        console.log(q.rows[0])
      }
      Q()
      chai
        .request(app)
        .put("/auth/update_user")
        .set("token", token)
        .send("")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    describe("ADD CONTACT", () => {
      it("Adding contacts", (done) => {
        const newCont = {
          firstname: "A",
          lastname: "B",
          email:'C',
          phonenumber:'0'
        };
        token = fs.readFileSync("./test/token.txt", "utf8");
        console.log(token);
        console.log(newCont);
        chai
          .request(app)
          .post("/contact")
          .set("token", token)
          .send(newCont)
          .end((err, res) => {
            // res.should.have.status(201);
            console.log(res.body)
            done();
          });
      });
    });
  });
});
