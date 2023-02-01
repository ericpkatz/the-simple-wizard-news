const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/wizard_news_db');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', async(req, res, next)=> {
  try {
    res.send((await client.query('SELECT * FROM users')).rows);
  }
  catch(ex){
    next(ex);
  }
});
app.listen(port, async()=> {
  try {
    console.log(`listening on port ${port}`);
    await client.connect();
    const SQL = `
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50)
      );
      CREATE TABLE posts(
        id SERIAL PRIMARY KEY,
        title VARCHAR(50),
        "userId" INTEGER REFERENCES users(id)
      );
      INSERT INTO users(name) VALUES('moe');
      INSERT INTO users(name) VALUES('lucy');
      INSERT INTO posts(title, "userId") VALUES('Hello', (
        SELECT id
        FROM users
        WHERE name = 'lucy'
      ));
    `;
    await client.query(SQL);
  }
  catch(ex){
    console.log(ex);
  }
});
