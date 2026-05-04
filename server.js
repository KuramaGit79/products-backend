const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const db = new Database('products.db');

app.use(cors());
app.use(express.json());

db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL
    )
`);

app.get('/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
        res.json({ message: 'Product not found!' });
        return;
    }
    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const result = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)').run(name, price);
    res.json({ message: 'Product added!', id: result.lastInsertRowid });
});

app.put('/products/:id', (req, res) => {
    const { name, price } = req.body;
    db.prepare('UPDATE products SET name = ?, price = ? WHERE id = ?').run(name, price, req.params.id);
    res.json({ message: 'Product updated!' });
});

app.delete('/products/:id', (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted!' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000!');
});