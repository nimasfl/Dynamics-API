const http = require("httpntlm");
const { isJson, createMessage } = require("./utility");
/**
 * @typedef {{status: Boolean, statusCode: Number, data: (Object|Object[]|String), headers: Object, rawMessage: String}} Response
 * @returns {Promise<Response>} Response
 * @param {QueryBuilder} query
 */

const RequestHandler = async (query) => {
  return new Promise((resolve, reject) => {
    try {
      if (process.env.DEBUG && process.env.DEBUG.toLowerCase().includes("dynapi")) {
        console.log(`Url: ${this.query.url}`);
        console.log(`Body: ${JSON.stringify(this.query.body, null, 2)}`);
      }
      let status = null;
      let statusCode = null;
      let rawMessage = null;
      let data = null;
      http[query.method](
        {
          url: query.url.href,
          username: query.username,
          password: query.password,
          body: JSON.stringify(query.body),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "aOData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            Accept: "application/json",
          },
          workstation: query.workstation,
          domain: query.domain,
        },
        (err, res) => {
          if (res && res.statusCode === 200) {
            if (!res.body) data = res;
            else if (isJson(res.body) && JSON.parse(res.body).value)
              data = JSON.parse(res.body).value;
            else if (isJson(res.body)) data = JSON.parse(res.body);
            else data = res.body;
            status = true;
            statusCode = res.statusCode;
          } else if (res && res.statusCode === 204) {
            if (res.headers && res.headers["odata-entityid"])
              data = res.headers["odata-entityid"]
                .split("(")[1]
                .replace(")", "");
            status = true;
            statusCode = res.statusCode;
          } else if (res) {
            if (isJson(res.body) && JSON.parse(res.body).error) {
              rawMessage = JSON.parse(res.body).error.message;
            } else if (isJson(res.body) && JSON.parse(res.body).Message) {
              rawMessage = JSON.parse(res.body).Message;
            } else {
              rawMessage = res.body.toString();
            }
            data = null;
            status = false;
            statusCode = res.statusCode;
          } else if (err) {
            rawMessage = err.message || err.toString();
            data = null;
            status = false;
            statusCode = err.code || rawMessage.split(" ")[0];
          }
          return resolve({
            status,
            statusCode,
            rawMessage,
            data,
            message: createMessage(statusCode),
          });
        }
      );
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = RequestHandler;
