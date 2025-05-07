import { callApi } from "./api.service";

export const fetchAssociations = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `associations?${query}` : 'associations';

  const config = {
    url: url,
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


export const createAssociation = async (associationData, token) => {
  const config = {
    url: 'association',
    method: "POST",
    data: associationData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const updateAssociation = async (associationData, token) => {
  const config = {
    url: 'association',
    method: "PATCH",
    data: associationData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const deleteAssociation = async (associationId, token) => {
  const config = {
    url: `association/${associationId}`,
    method: "DELETE",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};
