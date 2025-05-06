import { useAuth0 } from "@auth0/auth0-vue";
import { callApi } from "./api.service";

export const fetchVenues = async (params = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  const query = new URLSearchParams(params).toString();
  const url = query ? `venues?${query}` : 'venues';

  const config = {
    url,
    method: "GET",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const fetchAssignrVenues = async (token) => {
  const config = {
    url: "assignr-venues",
    method: "GET",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};
