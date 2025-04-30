import { callApi } from "./api.service";

export const fetchSeasons = async () => {
  const config = {
    url: 'seasons',
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
