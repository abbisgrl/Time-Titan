import axios from "axios";

const callApi = async (
  apiURL: string,
  apiMethod: string,
  apiData: object,
  token: string
) => {
  let headers = {
    Authorization: token,
  };
  return new Promise((resolve, reject) => {
    axios({
      url: apiURL,
      method: apiMethod,
      data: apiData,
      headers,
      responseType: "json",
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        if (!axios.isCancel(err) && err.response) {
          reject(err.response);
        } else if (err && err.message && err.message === "Network Error") {
          if (["feed/posts"].some((route) => apiURL.includes(route))) {
            reject(err.response);
          }
          // as there is no response for metadata 504 error - we send the whole object
          if (["/metadata"].some((route) => apiURL.includes(route))) {
            reject(err);
          }
        }
      });
  });
};

export default callApi;
