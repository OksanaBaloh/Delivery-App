// Create express app
let express = require("express");
let cors = require('cors');
const path = require('path');
let bodyParser = require('body-parser');

let app = express();
// Data Bases
let db = require("./database.js");
let db_order = require("./db_order.js")
// Cors and json parsing
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Server port
let HTTP_PORT = process.env.PORT || 8080;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Request all res
app.get("/all/", (req, res, next) => {
    console.log('Request `all`');
    let sql = "SELECT name FROM sqlite_master WHERE type = 'table';"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          console.log('Request `all` error: ' + err.message);
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
        console.log('Request `all` done');
      });
}
);

app.post('/post/', (req, res) => {
    console.log('Request `add order`');
    let data = req.body;
    if (data.position === "" || data.picture === "" || data.price === "")
    {
        res.status(400);
        res.sendStatus(400);
        console.log('Request `add order` error: empty value');
        return;
    }
    let params = [];
    let sql_update = "UPDATE OR IGNORE delivery SET amount = amount + 1 WHERE picture = '" + data.picture + "' "
    let sql_insert = "INSERT OR IGNORE INTO delivery (position, picture, price, amount) VALUES('"
                      + data.position + "','" +  data.picture + "'," + data.price + "," + 1 + ");";
    db_order.all(sql_update, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            console.log('Request `restaurant` error: ' + err.message);
            return;
        }
        res.status(200);
    });
    db_order.all(sql_insert, params, (err, rows) => {
      if (err) {
          res.status(400).json({"error":err.message});
          console.log('Request `restaurant` error: ' + err.message);
          return;
    }
    res.status(200);
    console.log('Request `add order` done');
  });
}
);

app.post("/update/", (req, res) => {
  console.log('Request `update position`');
  let data = req.body;
  
  if (data.picName === "" || data.amount === "")
  {
      res.status(400);
      res.sendStatus(400);
      console.log('Request `update position` error: empty value');
      return;
  }
  let sql = "UPDATE delivery SET amount = " + data.amount + " WHERE picture = '" + data.picName + "' ;";
  let params = []
  db_order.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log('Request `update position` error: ' + err.message);
        return;
      }
      res.status(200);
      console.log('Request `update position` done');
    });
}
);

app.post("/del/", (req, res) => {
  console.log('Request `remove position`');
  let data = req.body;
  
  if (data.picName === "")
  {
      res.status(400);
      res.sendStatus(400);
      console.log('Request `remove position` error: empty value');
      return;
  }
  let sql = "DELETE FROM delivery WHERE picture = '" + data.picName + "' ;";
  let params = []
  db_order.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        console.log('Request `remove position` error: ' + err.message);
        return;
      }
      res.status(200);
      console.log('Request `remove position` done');
    });
}
);

app.get("/order_full/", (req, res) => {
  console.log('Request `add delivery`');
  let data = req.query;
  
  if (data.name === "" || data.phone === "" || data.email === "" || data.address === "")
  {
      res.status(400);
      res.sendStatus(400);
      console.log('Request `add delivery` error: empty value');
      return;
  }

  let sql_get = "SELECT * from delivery;";
  let params = []
  db_order.all(sql_get, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
    }

    let order = "";
    let sum = 0;
    for(let i = 0; i < rows.length; i++) {
        let piece = rows[i];
        
        sum += piece.amount * piece.price;
        order += piece.position + " " + piece.amount + "; ";
    }
    let sql = "INSERT INTO delivery_order (name, phone, email, address, summary, orders) VALUES( '"
    + data.name + "','" +  data.phone + "','" + data.email + "','" + data.address + "','" + sum + "','" + order + "' ) ;";
    
    db_order.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          console.log('Request `add delivery` error: ' + err.message);
        }
        res.sendFile(path.join(__dirname, '/index.html'));
        console.log('Request `add delivery` done');

        let sql_del = "DELETE FROM delivery;";
        db_order.all(sql_del, params, (err, rows) => {
          if (err) {
            console.log('Request `add delivery` error by deleting order');
          }
        });
      });
  });
}
);

app.post("/res/", (req, res) => {
    console.log('Request `restaurant`');
    let data = req.body;
    
    if (data.name === "")
    {
        res.status(400);
        res.sendStatus(400);
        console.log('Request `restaurant` error: empty value');
        return;
    }
    let sql = "SELECT * FROM '" + data.name + "';"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          // res.status(400).json({"error":err.message});
          console.log('Request `restaurant` error: ' + err.message);
          return;
        }
        else{
          res.json({
            "message":"success",
            "data":rows
        });
        }

        console.log('Request `restaurant` done');
      });
}
);

app.get("/order/", (req, res) => {
    console.log('Request `get order`');
    let sql = "SELECT * FROM delivery;"
    let params = []
    db_order.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          console.log('Request `get order` error: ' + err.message);
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
        console.log('Request `get order` done');
      });
}
);

// Insert here other API endpoints

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});