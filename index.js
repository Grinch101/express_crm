const express = require("express");
const app = express();
const user_router = require("./routes/user_router");
const get_client = require("./middleware/get_conn");
const httpError = require('./middleware/httpError')

app.use(express.json());
app.use(get_client);
app.use("/auth", user_router);
// app.use('/contact', contact_router);
// app.use('/activity', activity_router);

app.use(httpError)
app.listen(8000);
