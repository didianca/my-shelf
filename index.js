//list of imported npm packages
const  express = require('express');
const cors = require('cors');
const mysql = require('mysql');

//create the express application
const app = express();

//connect to the DB
const db_config = mysql.createPool({
    connectionLimit : 100,
    host            : '127.0.0.1',
    user            : 'root',
    password        : 'unicorn', //*super ultra secret pass*
    database        : 'products'
});
const connection = mysql.createConnection(db_config);

app.use(cors());

//defining routes
//main page
app.get('/', (req,res)=>{
    res.send('go to /products to see products')
});
//GET all products
app.get('/products',(req,res )=>{
    //query the db for the products
    connection.query('SELECT * FROM PRODUCTS',(e,results)=>{
        if (e) return res.send(e);
        return res.json({
            data:results
        })
    })
});

//start the server on port 4000
//use localhost:4000/routes to visit various routes in the ap
app.listen(4000,()=>{
   console.log('App is listening on PORT 4000')
});