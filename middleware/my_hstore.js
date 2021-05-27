
const hstore = require('node-postgres-hstore');

my_hstore = function (req, res, next) {
    let e = req.body.email
    let p = req.body.phonenumber
    if (p){
        req.body.email = hstore.stringify(e)
        req.body.phonenumber = hstore.stringify(p)
        console.log(p, 'Parsed to Hstore',req.body.phonenumber)
        console.log(e, 'Parsed to Hstore',req.body.email)
    }
  next();
};

module.exports = my_hstore;
