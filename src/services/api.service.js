import axios from "axios";

function getDomainName() {
  let port = 0
  let domain = `${location.host}`;

  if (location.host.includes(':')) {
    const domainArray = location.host.split(':');
    domain = domainArray[0];
    port = domainArray[1];
  }

  if (location.host.includes('localhost')) {
    domain = "http://localhost";
    port = 8000;
  }

  if (port === 0) {
    return `https://${domain}/api`;
  } else {
    return domain.concat(':', port);
  }
}

export const callApi = async (options) => {
  try {
// replace the provided endpoint name with the domain name/end point.
    const domainName = getDomainName();
    options.url = `${domainName}/${options.url}`

    const response = await axios(options);
    const { data } = response;

    return {
      data,
      error: {
        message: null
      },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error;

      const { response } = axiosError;

      let message = "http request failed";

      if (response?.statusText) {
        message = response.statusText;
      }

      if (axiosError.message) {
        message = axiosError.message;
      }

      if (response?.data && response?.data.message) {
        message = response.data.message;
      }

      console.log(message);
      return {
        data: null,
        error: {
          message,
        },
      };
    }

    return {
      data: null,
      error: {
        message: error.message,
      },
    };
  }
};
