const asyncHandler = require('../utils/asyncHandler');
const { success, error, paginated } = require('../utils/apiResponse');
const favoriteService = require('../services/favoriteService');

const add = asyncHandler(async (req, res) => {
  const favorite = await favoriteService.addFavorite(req.user.id, req.params.resourceId);
  return success(res, { favorite }, 'Agregado a favoritos', 201);
});

const remove = asyncHandler(async (req, res) => {
  const result = await favoriteService.removeFavorite(req.user.id, req.params.resourceId);
  if (!result) return error(res, 'Favorito no encontrado', 404);
  return success(res, null, 'Eliminado de favoritos');
});

const getMyFavorites = asyncHandler(async (req, res) => {
  const result = await favoriteService.getMyFavorites(req.user.id, req.query);
  return paginated(res, result.favorites, result.pagination);
});

const check = asyncHandler(async (req, res) => {
  const isFavorite = await favoriteService.checkFavorite(req.user.id, req.params.resourceId);
  return success(res, { isFavorite });
});

module.exports = { add, remove, getMyFavorites, check };
