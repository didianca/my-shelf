//list of imported npm packages
const  express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
bodyParser.json();

//create the express application
const app = express();
app.use(bodyParser.json());
//connect to the DB
const connection = mysql.createConnection({
    host            : '127.0.0.1',
    user            : 'root',
    password        : 'unicorn', //*super ultra secret pass*
    database        : 'products'
});

app.use(cors());

//defining routes
//main page
app.get('/', (req,res)=>{
    res.send('go to /products to see products')
});
//GET all products
app.get('/products',(req,res )=>{
    //query db for products
    connection.query('SELECT * FROM fruits',(e,results)=>{
        if (e) return res.send(e);
        return res.json({
            data:results
        })
    })
});
//POST new products
app.post('/products',(req,res)=>{
   //get body of request
    const product = {
        name: req.body.name,
        price: req.body.price,
        count: req.body.count
    };
    //get needed values
   const name = product.name;
   const price = product.price;
   const count = product['count'];
   //check db for duplication->avoid false 200
   const CHECK_DB = `SELECT * FROM fruits WHERE name = '${name}'`;
   connection.query(CHECK_DB,(e)=>{
           if(e) return res.status(400).send('The item already exists, try updating it instead.')
   });
    //insert new values in the db
   const INSERT_PRODUCTS_QUERY = `INSERT INTO fruits (name,price,count) VALUES ('${name}','${price}','${count}')`;
   connection.query(INSERT_PRODUCTS_QUERY,(e)=>{
       if(e) return res.send(e);
       return res.send(`successfully added ${JSON.stringify(product)}`);
   })
});


//start the server on port 4000
//use localhost:4000/routes to visit various routes in the ap
app.listen(4000,()=>{
   console.log('App is listening on PORT 4000')
});