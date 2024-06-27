import { callApi } from "./api.service";

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;

export const fetchVenues = async () => {
  const config = {
    url: `${apiServerUrl}/venues`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = await callApi(config);
  return {
    data: data || null,
    error,
  };
};
