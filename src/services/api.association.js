import { callApi } from "./api.service";

export const fetchAssociations = async () => {
  const config = {
    url: 'associations',
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
