import { callApi } from "./api.service";

export const fetchUsers = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `users?${query}` : 'users';

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

export const updateUser = async (userData, token) => {
  const config = {
    url: 'user',
    method: "PATCH",
    data: userData
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const deleteUser = async (userId, token) => {
  const config = {
    url: `user/${userId}`,
    method: "DELETE",
  };

  const { data, error } = await callApi(config, token);
  return {
    data: data || null,
    error,
  };
};

export const fetchRoles = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `roles?${query}` : 'roles';

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
