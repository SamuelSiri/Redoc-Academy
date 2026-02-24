const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const { success, error, paginated } = require('../utils/apiResponse');
const resourceService = require('../services/resourceService');
const fileService = require('../services/fileService');
const downloadService = require('../services/downloadService');

const getAll = asyncHandler(async (req, res) => {
  const result = await resourceService.getAllResources(req.query);
  return paginated(res, result.resources, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const resource = await resourceService.getResourceById(req.params.id);
  if (!resource) {
    return error(res, 'Recurso no encontrado', 404);
  }
  return success(res, { resource });
});

const upload = asyncHandler(async (req, res) => {
  if (!req.file) {
    return error(res, 'Archivo requerido', 400);
  }

  const uploaded = await fileService.uploadFile(req.file);

  const resource = await resourceService.createResource(
    { ...req.body, fileUrl: uploaded.url },
    req.file,
    req.user.id
  );

  const full = await resourceService.getResourceById(resource.id);
  return success(res, { resource: full }, 'Recurso subido', 201);
});

const update = asyncHandler(async (req, res) => {
  const resource = await resourceService.updateResource(
    req.params.id,
    req.body,
    req.user.id
  );

  if (!resource) {
    return error(res, 'Recurso no encontrado o no tienes permisos', 404);
  }

  const full = await resourceService.getResourceById(resource.id);
  return success(res, { resource: full }, 'Recurso actualizado');
});

const remove = asyncHandler(async (req, res) => {
  const fileUrl = await resourceService.deleteResource(req.params.id, req.user.id);

  if (!fileUrl) {
    return error(res, 'Recurso no encontrado o no tienes permisos', 404);
  }

  await fileService.deleteFile(fileUrl);
  return success(res, null, 'Recurso eliminado');
});

const download = asyncHandler(async (req, res) => {
  const resource = await resourceService.incrementDownload(req.params.id);

  if (!resource) {
    return error(res, 'Recurso no encontrado', 404);
  }

  // Record download for the user
  if (req.user) {
    await downloadService.recordDownload(req.user.id, req.params.id);
  }

  if (resource.fileUrl.startsWith('http')) {
    return res.redirect(resource.fileUrl);
  }

  const filePath = path.resolve(__dirname, '../..', resource.fileUrl.replace(/^\//, ''));
  return res.download(filePath, resource.originalName);
});

const myUploads = asyncHandler(async (req, res) => {
  const result = await resourceService.getResourcesByTeacher(req.user.id, req.query);
  return paginated(res, result.resources, result.pagination);
});

module.exports = { getAll, getById, upload, update, remove, download, myUploads };
