import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client(
  {
    username: 'postgres',
    password: 'sinanash123',
    database: 'permalist',
    host: 'localhost',
    port: 5432
  }
);

db.connect();


app.get("/", async (req, res) => {
const items = [];
const result = await db.query(
  'SELECT * FROM items'
);
result.rows.forEach(x=> {
  items.push(x);
});


  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  db.query('INSERT INTO items (title) VALUES ($1)', [item]);
  res.redirect("/");
});



app.post("/edit", (req, res) => {
  const id = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;
  db.query('UPDATE items SET title = $1 WHERE id = $2', [itemTitle, id]);
  res.redirect('/');
});

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;
  db.query('DELETE FROM items WHERE id = $1', [id]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

