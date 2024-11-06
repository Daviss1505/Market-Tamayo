const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Array to store products
let products = [
    // Productos iniciales
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/products', upload.single('image'), (req, res) => {
    const product = {
        id: products.length + 1,
        category: req.body.category,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imgSrc: `/uploads/${req.file.filename}` // URL de la imagen subida
    };
    products.push(product);
    res.status(201).json(product);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
