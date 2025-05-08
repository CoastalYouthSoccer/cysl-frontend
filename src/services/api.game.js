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

export const fetchAssignrGames = async (accessparams) => {
  const config = {
    url: 'assignr-games',
    method: "GET",
    params: params
  };

  const { data, error } = await callApi(config);
  return {
    data: data || null,
    error,
  };
};
