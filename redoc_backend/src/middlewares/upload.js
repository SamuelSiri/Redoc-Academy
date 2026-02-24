const upload = require('../config/multer');
const { error } = require('../utils/apiResponse');

const uploadFile = (fieldName = 'file') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return error(res, 'El archivo excede el tamaño máximo permitido (50MB)', 413);
        }
        return error(res, err.message || 'Error al subir archivo', 400);
      }
      next();
    });
  };
};

module.exports = uploadFile;