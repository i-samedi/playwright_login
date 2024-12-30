const express = require('express');
const cors = require('cors');
const pool = require('./db.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password }); // Para debugging

        const query = {
            text: 'SELECT * FROM MOCK_DATA WHERE email = $1 AND password = $2',
            values: [email, password],
        };
        
        const result = await pool.query(query);
        console.log('Query result:', result.rows); // Para debugging
        
        if (result.rows.length > 0) {
            res.json({ 
                success: true, 
                user: {
                    id: result.rows[0].id,
                    name: result.rows[0].first_name,
                    email: result.rows[0].email
                }
            });
        } else {
            res.json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
}); 