import { callApi } from "./api.service";

export const fetchVenues = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `venues?${query}` : 'venues';

  const config = {
    url,
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
