const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const categories = require('../config/categories');

const createImageSet = async (req, res) => {
  try {
    const { category } = req.body;
    const files = req.files;

    if (!category || !files || files.length === 0) {
      return res.status(400).json({ message: 'Category and at least one image are required' });
    }

    const categoryConfig = categories.find(cat => cat.category === category);
    if (!categoryConfig) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const uploadPromises = files.map(file => 
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'event_decor' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      })
    );

    const imageUrls = await Promise.all(uploadPromises);

    let imageSet = await Image.findOne({ category });
    if (imageSet) {
      // Append new image URLs to existing document
      imageSet.imageUrls = [...imageSet.imageUrls, ...imageUrls];
      await imageSet.save();
    } else {
      // Create new document if category doesn't exist
      imageSet = new Image({
        category,
        imageUrls,
      });
      await imageSet.save();
    }

    const enrichedImageSet = {
      ...imageSet._doc,
      title: categoryConfig.title,
      description: categoryConfig.description,
      icon: categoryConfig.icon,
    };

    res.status(201).json(enrichedImageSet);
  } catch (error) {
    console.error('Error creating image set:', error);
    res.status(500).json({ message: 'Error creating image set', error: error.message });
  }
};

const getAllImageSets = async (req, res) => {
  try {
    const imageSets = await Image.find();
    const enrichedImageSets = imageSets.map(set => {
      const categoryConfig = categories.find(cat => cat.category === set.category);
      return {
        ...set._doc,
        title: categoryConfig ? categoryConfig.title : set.category,
        description: categoryConfig ? categoryConfig.description : '',
        icon: categoryConfig ? categoryConfig.icon : '',
      };
    });
    res.json(enrichedImageSets);
  } catch (error) {
    console.error('Error fetching image sets:', error);
    res.status(500).json({ message: 'Error fetching image sets', error: error.message });
  }
};

const updateImageSet = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const files = req.files;

    if (!category || !files || files.length === 0) {
      return res.status(400).json({ message: 'Category and at least one image are required' });
    }

    const categoryConfig = categories.find(cat => cat.category === category);
    if (!categoryConfig) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const uploadPromises = files.map(file => 
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'event_decor' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      })
    );

    const imageUrls = await Promise.all(uploadPromises);

    const imageSet = await Image.findById(id);
    if (!imageSet) {
      return res.status(404).json({ message: 'Image set not found' });
    }

    imageSet.category = category;
    imageSet.imageUrls = [...imageSet.imageUrls, ...imageUrls];
    await imageSet.save();

    const enrichedImageSet = {
      ...imageSet._doc,
      title: categoryConfig.title,
      description: categoryConfig.description,
      icon: categoryConfig.icon,
    };

    res.json(enrichedImageSet);
  } catch (error) {
    console.error('Error updating image set:', error);
    res.status(500).json({ message: 'Error updating image set', error: error.message });
  }
};

module.exports = { createImageSet, getAllImageSets, updateImageSet };