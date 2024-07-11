import { callApi } from "./api.service";

export const fetchVenues = async () => {
  const config = {
    url: 'cysl/venues',
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
