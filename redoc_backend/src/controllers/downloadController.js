const asyncHandler = require('../utils/asyncHandler');
const { paginated } = require('../utils/apiResponse');
const downloadService = require('../services/downloadService');

const getMyDownloads = asyncHandler(async (req, res) => {
  const result = await downloadService.getMyDownloads(req.user.id, req.query);
  return paginated(res, result.downloads, result.pagination);
});

module.exports = { getMyDownloads };
