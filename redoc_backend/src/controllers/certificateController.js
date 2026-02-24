const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const certificateService = require('../services/certificateService');

const generate = asyncHandler(async (req, res) => {
  const result = await certificateService.generateCertificate(req.user.id, req.params.courseId);
  if (result.error) return error(res, result.error, 400);
  return success(res, { certificate: result }, 'Certificado generado', 201);
});

const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await certificateService.getMyCertificates(req.user.id);
  return success(res, { certificates });
});

const verify = asyncHandler(async (req, res) => {
  const certificate = await certificateService.verifyCertificate(req.params.code);
  if (!certificate) return error(res, 'Certificado no encontrado', 404);
  return success(res, { certificate, valid: true });
});

module.exports = { generate, getMyCertificates, verify };
