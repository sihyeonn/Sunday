const express = require('express');
const router = express.Router(); // return router instance
const { pool, sqlErr } = require('../modules/mysql2-conn');
const dbTable = "board";

/*
  HTML only supports get and post method

  REST(Representational State Transfer)
  -- make methods clear
  get:    Read/SELECT
  post:   Create/INSERT
  put:    Update/UPDATE
  delete: Delete/DELETE
*/
router.get(["/get", "/get/:id"], async (req, res) => {
  let sql = `SELECT * FROM ${dbTable} `;
  const values = { title: "API Board" };
  if (req.params.id) sql += `WHERE id=${req.params.id}`;
  else sql += `ORDER BY id DESC`;
  const connect = await pool.getConnection();
  const result = await connect.query(sql);
  connect.release();
  values.data = result[0];
  res.json(values);
});

router.post("/post", async (req, res) => { // request from ajax
  let sql = `INSERT INTO ${dbTable} SET title=?, writer=?, content=?, wDate=?`;
  let sqlVal = [req.body.title, req.body.writer, req.body.content, new Date()];
  const connect = await pool.getConnection();
  const result = await connect.query(sql, sqlVal);
  connect.release();
  res.json(result[0]);
});

router.put("/put", async (req, res) => { // request from ajax
  let sql = `UPDATE ${dbTable} SET title=?, writer=?, content=?, wDate=? WHERE id=?`;
  let sqlVal = [req.body.title, req.body.writer, req.body.content, new Date(), req.body.id];
  const connect = await pool.getConnection();
  const result = await connect.query(sql, sqlVal);
  connect.release();
  res.json(result[0]);
});

router.delete("/delete", async (req, res) => {
  let sql = `DELETE FROM ${dbTable} WHERE id=${req.body.id}`;
  const connect = await pool.getConnection();
  const result = await connect.query(sql);
  connect.release();
  res.json(result[0]);
});

module.exports = router;
