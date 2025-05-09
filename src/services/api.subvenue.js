import { callApi } from "./api.service";

export const fetchSubVenues = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `sub-venues?${query}` : 'sub-venues';

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

export const createSubVenue = async (subVenueData, token) => {
  const config = {
    url: 'sub-venue',
    method: "POST",
    data: subVenueData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const updateSubVenue = async (subVenueData, token) => {
  const config = {
    url: 'sub-venue',
    method: "PATCH",
    data: subVenueData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const deleteSubVenue = async (subVenueId, token) => {
  const config = {
    url: `sub-venue/${subVenueId}`,
    method: "DELETE",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};
