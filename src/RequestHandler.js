/**
 *
 * @returns {Object} Response
 * @returns {Boolean} Response.status
 * @returns {(Object | Object[])} [Response.data]
 * @returns {String} [Response.message]
 * @returns {Number} [Response.statusCode]
 * @param request
 */

const RequestHandler = async (request) => {
  let status = null;
  let statusCode = null;
  let message = null;
  let data = null;
  let method;

  switch (request.method) {
    case "read":
      method = "get";
      break;
    case "create":
      method = "post";
      break;
    case "update":
      method = "patch";
      break;
    case "delete":
      method = "delete";
      break;
    default:
      method = null;
  }

  return {
    status,
    statusCode,
    message,
    data,
  };
};

module.exports = RequestHandler;
