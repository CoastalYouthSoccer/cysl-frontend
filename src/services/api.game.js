import { callApi } from "./api.service";

export const fetchGames = async (accessToken, params) => {
  const config = {
    url: 'games',
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    params: params
  };

  const { data, error } = await callApi(config);
  return {
    data: data || null,
    error,
  };
};

export const fetchAssignrGames = async (token, params) => {
  const config = {
    url: 'assignr-games',
    method: "GET",
    params: params
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const createGame = async (gameData, token) => {
  const config = {
    url: 'game',
    method: "POST",
    data: gameData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const updateGame = async (gameData, token) => {
  const config = {
    url: 'game',
    method: "PATCH",
    data: gameData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const deleteGame = async (gameId, token) => {
  const config = {
    url: `game/${gameId}`,
    method: "DELETE",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};
