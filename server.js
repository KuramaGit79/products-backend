const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const supabaseUrl = 'https://kwjtarqjswofzxwghvbv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3anRhcnFqc3dvZnp4d2dodmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjQxODAsImV4cCI6MjA5MzY0MDE4MH0.mJAtmaATNtJAqebN4oFzCobkArwcTwUl51chg2EsrG4';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.get('/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.json({ error });
    res.json(data);
});

app.post('/products', async (req, res) => {
    const { name, price } = req.body;
    const { data, error } = await supabase.from('products').insert([{ name, price }]);
    if (error) return res.json({ error });
    res.json({ message: 'Product added!' });
});

app.delete('/products/:id', async (req, res) => {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) return res.json({ error });
    res.json({ message: 'Product deleted!' });
});

app.put('/products/:id', async (req, res) => {
    const { name, price } = req.body;
    const { error } = await supabase.from('products').update({ name, price }).eq('id', req.params.id);
    if (error) return res.json({ error });
    res.json({ message: 'Product updated!' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000!');
});