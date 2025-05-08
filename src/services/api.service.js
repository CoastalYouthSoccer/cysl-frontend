import axios from "axios";

function getDomainName() {
  let port = 0;
  let domain = location.host;

  if (location.host.includes(":")) {
    const [host, hostPort] = location.host.split(":");
    domain = host;
    port = hostPort;
  }

  if (location.host.includes("localhost")) {
    domain = "http://localhost";
    port = 8000;
  }

  return port === 0 ? `https://${domain}/api` : `${domain}:${port}`;
}

export const callApi = async (options, token = null) => {
  const domainName = getDomainName();

  const headers = {
    "content-type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await axios({
      ...options,
      url: `${domainName}/${options.url}`,
      headers,
    });

    return {
      data: response.data,
      error: { message: null },
    };
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        error.response?.statusText ||
        error.message
      : error.message;

    return {
      data: null,
      error: { message },
    };
  }
};
