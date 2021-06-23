const express = require("express");
const app = express();
const user_router = require("./routes/user_router");
const contact_router = require('./routes/contact_router')
const activity_router = require('./routes/activity_router')
const get_client = require("./middleware/get_conn");
const httpError = require('./middleware/httpError');
const my_hstore = require('./middleware/my_hstore');


app.use(express.json());
app.use(my_hstore);
app.use(get_client);
app.use(logger);
app.use("/auth", user_router);
app.use("/contact", contact_router);
app.use('/activity', activity_router);


app.use(httpError)
app.listen(8000);
