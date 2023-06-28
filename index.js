const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Upload an image
app.post('/images', upload.single('image'), (req, res) => {
  // Process the uploaded image and save it
  // Generate a unique identifier for the image
  const imageId = generateUniqueId();
  res.json({ id: imageId });
});

// Resize an image
app.post('/images/:imageId/resize', upload.single('image'), (req, res) => {
  const { imageId } = req.params;
  const { width, height } = req.body;

  // Load the image using the imageId
  const image = sharp(`uploads/${imageId}.jpg`);
  image.resize(Number(width), Number(height));
  image.toFile(`uploads/${imageId}_resized.jpg`);
  res.sendFile(`uploads/${imageId}_resized.jpg`);
});

// Crop an image
app.post('/images/:imageId/crop', upload.single('image'), (req, res) => {
  const { imageId } = req.params;
  const { x, y, width, height } = req.body;

  const image = sharp(`uploads/${imageId}.jpg`);

  // Crop the image to the specified dimensions
  image.extract({ left: Number(x), top: Number(y), width: Number(width), height: Number(height) });
  image.toFile(`uploads/${imageId}_cropped.jpg`);
  res.sendFile(`uploads/${imageId}_cropped.jpg`);
});

// Retrieve a specific image by its ID
app.get('/images/:imageId', (req, res) => {
  const { imageId } = req.params;
  res.sendFile(`uploads/${imageId}.jpg`);
});

// Helper function to generate a unique identifier for an image
function generateUniqueId() {
  return Math.floor(Math.random() * 1000000).toString();
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});