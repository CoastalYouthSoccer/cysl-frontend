import { callApi } from "./api.service";
const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;

export const fetchGames = async (accessToken, params) => {
  const config = {
    url: `${apiServerUrl}/games`,
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
