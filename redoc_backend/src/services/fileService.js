const fs = require('fs');
const path = require('path');
const { cloudinary, isConfigured } = require('../config/cloudinary');
const logger = require('../utils/logger');

const uploadFile = async (file) => {
  if (isConfigured) {
    return uploadToCloudinary(file);
  }
  return uploadLocal(file);
};

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'edu-platform',
      resource_type: 'auto',
    });

    // Eliminar archivo temporal local
    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    logger.error('Error subiendo a Cloudinary:', err.message);
    throw err;
  }
};

const uploadLocal = (file) => {
  // El archivo ya fue guardado por multer
  const relativePath = `/uploads/${file.filename}`;
  return {
    url: relativePath,
    publicId: null,
  };
};

const deleteFile = async (fileUrl) => {
  try {
    if (isConfigured && fileUrl.includes('cloudinary')) {
      // Extraer publicId de la URL de cloudinary
      const parts = fileUrl.split('/');
      const filename = parts[parts.length - 1];
      const publicId = `edu-platform/${filename.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    } else {
      // Eliminar archivo local
      const filePath = path.resolve(__dirname, '../..', fileUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    logger.error('Error eliminando archivo:', err.message);
  }
};

module.exports = { uploadFile, deleteFile };