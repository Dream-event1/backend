const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/images', imageRoutes);
app.get('/for-cons', (req, res) => {
  res.status(200).send('For consumers');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
