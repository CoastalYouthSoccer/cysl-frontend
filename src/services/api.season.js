import { callApi } from './api.service';

export const fetchSeasons = async (token) => {
  const config = {
    url: 'seasons',
    method: "GET",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const createSeason = async (seasonData, token) => {
  const config = {
    url: 'season',
    method: "POST",
    data: seasonData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const updateSeason = async (seasonData, token) => {
  const config = {
    url: 'season',
    method: "PATCH",
    data: seasonData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const deleteSeason = async (seasonId, token) => {
  const config = {
    url: `season/${seasonId}`,
    method: "DELETE",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};
