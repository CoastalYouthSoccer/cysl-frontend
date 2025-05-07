import { callApi } from "./api.service";

export const fetchVenues = async (token, params = {}) => {
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

export const createVenue = async (venueData, token) => {
  const config = {
    url: 'venue',
    method: "POST",
    data: venueData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const updateVenue = async (venueData, token) => {
  const config = {
    url: 'venue',
    method: "PATCH",
    data: venueData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const deleteVenue = async (venueId, token) => {
  const config = {
    url: `venue/${venueId}`,
    method: "DELETE",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};
