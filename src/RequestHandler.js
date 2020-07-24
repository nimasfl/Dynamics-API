const http = require("httpntlm");
const { isJson, createMessage } = require("./utility");
/**
 *
 * @returns {Object} Response
 * @returns {Boolean} Response.status
 * @returns {(Object | Object[])} [Response.data]
 * @returns {String} [Response.rawMessage]
 * @returns {Number} [Response.statusCode]
 * @param query {{method: String, url: String, username: String, password: String, domain: String, body: Object, workstation: String}}
 */

const RequestHandler = async (query) => {
  return new Promise((resolve, reject) => {
    try {
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
            else if (isJson(res.body)) data = JSON.parse(res.body).value;
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
