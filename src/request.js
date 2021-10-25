const {
  axios,
  flexFetch: { flexF, responseLookup },
} = require("./common");

module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = responseLookup(
        await flexF(axios)({
          method: "get",
          requestConfig: {
            responseType: "json",
          },
          url: url,
        })
      );
      const result = response("status") === 200 ? response("data") : null;
      resolve(result);
    } catch (error) {
      const e = new Error(error);
      reject(e);
    }
  });
};
