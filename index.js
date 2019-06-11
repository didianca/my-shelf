//list of imported npm packages
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
bodyParser.json();

//create the express application
const app = express();
app.use(bodyParser.json());
//connect to the DB
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'unicorn', //*super ultra secret pass*
    database: 'products'
});

app.use(cors());

//defining routes
//GET all products
app.get('/products', (req, res) => {
    //query db for products
    connection.query('SELECT * FROM fruits', (e, results) => {
        if (e) return res.status(400).send(e);
        return res.json({
            data: results
        })
    })
});
//POST new products
app.post('/products', (req, res) => {
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
    //insert new values in the db
    const INSERT_PRODUCTS_QUERY = `INSERT INTO fruits (name,price,count) VALUES ('${name}','${price}','${count}')`;
    connection.query(INSERT_PRODUCTS_QUERY, (e) => {
        if (e) return res.status(400).send(e); //check for any errors
        return  res.send(product)  //return new added product
    });

});
//PUT -update existing products
app.put('/products/:id', (req, res) => {
   //select item in db
   const id = req.params.id;
   //get body of the request to populate values
   const product = {
            name: req.body.name,
            price: req.body.price,
            count: req.body.count
   };
   //get values
    const name = product.name;
    const price = product.price;
    const count = product.count;
    //update in db
    const UPDATE_PRODUCT = `UPDATE fruits SET name = '${name}' , price=${price}, count=${count} WHERE id =${id}`;
    connection.query(UPDATE_PRODUCT, (e,results) => {
        if (e) return res.status(400).send(e);//check for possible errors
        //if no change occurs send 400
        //if resObj.changedRows=1 it means update was successful
        if(!results.changedRows) return res.status(400).send('You did not make any changes');
        return res.json({
            data: results
        })
        })
});
//DEL existing products
app.delete('/products/:id', (req, res) => {
        //select item in db
        const id = req.params.id;
        //delete selected item based on it's id
        const DELETE_ITEM = `DELETE FROM fruits WHERE id=${id}`;
        connection.query(DELETE_ITEM, (e,results) => {
            if (e) return res.status(400).send(e);
            //if item already deleted announce user
            //if responseObj.affectedRows=1 it means deletion was successful
            if(!results.affectedRows) return res.status(400).send('Item already deleted');
            return res.json({
                data: results
            })
        })

});

//start the server on port 4000
//use localhost:4000/routes to visit various routes in the ap
app.listen(4000, () => {
        console.log('App is listening on PORT 4000')
});