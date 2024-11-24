import axios from "axios";
import Cookies from "js-cookie";

const callApi = async (
  apiURL: string,
  apiMethod: string,
  apiData: object = {}
) => {
  const token: string | undefined = Cookies.get("token");

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
          // as there is no response for metadata 504 error - we send the whole object
          if (["/metadata"].some((route) => apiURL.includes(route))) {
            reject(err);
          }
        }
      });
  });
};

export default callApi;
