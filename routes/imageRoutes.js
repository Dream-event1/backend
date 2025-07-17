const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createImageSet, getAllImageSets, updateImageSet } = require('../controllers/imageControllers');

router.post('/', upload.array('images', 8), createImageSet);
router.get('/', getAllImageSets);
router.post('/id',
    (req, res) => res.status(400).send('ID parameter is required') // Placeholder for handling missing ID
);
router.put('/id/:id', upload.array('images', 8), updateImageSet);

module.exports = router;
