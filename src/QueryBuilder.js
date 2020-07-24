const RequestHandler = require("./RequestHandler");
/**
 * @namespace
 * @private {URL}  url                   - The url of the end point.
 * @private {String}  username           - The username to authenticate.
 * @private {String}  password           - The password to authenticate.
 * @private {String}  domain             - The domain to authenticate.
 * @private {String}  method             - The method to send the request
 * @private {Boolean} isSpecific         - If the request returns a specific record or not.
 * @private {Object}  body               - The body of the request.
 */
class QueryBuilder {
  /**
   * @param credentials {Credential}
   * @returns {QueryBuilder}
   */
  constructor(credentials) {
    const { url, username, password, domain, workstation } = credentials;
    this.url = new URL(url);
    this.username = username;
    this.password = password;
    this.domain = domain;
    this.workstation = workstation;
    this.method = null; // [get|post|patch|delete]
    this.isSpecific = true;
    this.fetchXml = false;
    this.hasParameters = false;
    this.body = {};
    return this;
  }

  /**
   *
   * @param entitySetName {String}
   * @returns {QueryBuilder}
   */
  create(entitySetName) {
    if (this.method)
      throw new Error("Can not specify more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be specified on create request.");
    this.url.pathname += "/" + entitySetName;
    this.method = "post";
    return this;
  }
  /**
   *
   * @param entitySetName {String}
   * @param id {String}
   * @returns {QueryBuilder}
   */
  update(entitySetName, id) {
    if (this.method)
      throw new Error("Can not specify more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be specified on update request.");
    if (!id) throw new Error("Entity id must be specified on update request");
    this.url.pathname += `/${entitySetName}(${id})`;
    this.method = "patch";
    return this;
  }
  /**
   *
   * @param entitySetName {String}
   * @param id {String}
   * @returns {QueryBuilder}
   */
  delete(entitySetName, id) {
    if (this.method)
      throw new Error("Can not specify more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be specified on delete request.");
    if (!id)
      throw new Error("Entity id must be specified for delete operation.");
    this.url.pathname += `/${entitySetName}(${id})`;
    this.method = "delete";
    return this;
  }
  /**
   *
   * @param entitySetName {String}
   * @param id {String=}
   * @returns {QueryBuilder}
   */
  get(entitySetName, id) {
    if (this.method)
      throw new Error("Can not specify more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be specified on get request.");
    if (id) {
      this.url.pathname += `/${entitySetName}(${id})`;
    } else {
      this.url.pathname += "/" + entitySetName;
      this.isSpecific = false;
    }
    this.method = "get";
    return this;
  }

  /**
   *
   * @param actionName {String}
   * @param method {"post"|"get"}
   * @param entitySetName {String=}
   * @param id {String=}
   * @returns {QueryBuilder}
   */
  execute(actionName, method, entitySetName, id) {
    if (this.method)
      throw new Error("Can not specify more than one operation on each query.");
    if (entitySetName) {
      if (!id)
        throw new Error(
          "Record id must be specified when setting entitySetName value."
        );
      this.url.pathname += `/${entitySetName}(${id})`;
      this.url.pathname += "/" + actionName;
    } else {
      this.url.pathname += "/" + actionName;
      this.isSpecific = false;
    }
    this.method = method;
    return this;
  }

  /**
   * @param fields {String}
   * @returns {QueryBuilder}
   */
  select(...fields) {
    if (this.isSpecific)
      throw new Error("Select is only usable on not specific queries.");
    if (this.method !== "get")
      throw new Error("Select is only usable on get method.");
    if (this.fetchXml === true)
      throw new Error("select cannot be combined with fetchXml parameter.");
    this.hasParameters = true;
    this.url.searchParams.append("$select", fields.toString());
    return this;
  }

  /**
   *
   * @param count {Number}
   * @returns {QueryBuilder}
   */
  top(count) {
    if (this.isSpecific)
      throw new Error("Top is only usable on not specific queries.");
    if (this.method !== "get")
      throw new Error("Top is only usable on get method.");
    if (this.fetchXml === true)
      throw new Error("top cannot be combined with fetchXml parameter.");
    this.hasParameters = true;
    this.url.searchParams.append("$top", count.toString());
    return this;
  }

  /**
   *
   * @param number {Number}
   * @returns {QueryBuilder}
   */
  count(number) {
    if (this.isSpecific)
      throw new Error("Top is only usable on not specific queries.");
    if (this.method !== "get")
      throw new Error("Top is only usable on get method.");
    if (this.fetchXml === true)
      throw new Error("count cannot be combined with fetchXml parameter.");
    this.hasParameters = true;
    this.url.searchParams.append("$count", number.toString());
    return this;
  }

  /**
   *
   * @param filterExpression {String}
   * @returns {QueryBuilder}
   */
  filter(filterExpression) {
    if (this.isSpecific)
      throw new Error("Filter is only usable on not specific queries.");
    if (this.method !== "get")
      throw new Error("Filter is only usable on get method.");
    if (this.fetchXml === true)
      throw new Error("filter cannot be combined with fetchXml parameter.");
    this.hasParameters = true;
    this.url.searchParams.append("$filter", filterExpression);
    return this;
  }

  /**
   *
   * @param orderExpression {String}
   * @param isDesc {Boolean=}
   * @returns {QueryBuilder}
   */
  order(orderExpression, isDesc = true) {
    const desc = isDesc ? "desc" : "";
    if (this.isSpecific)
      throw new Error("Order is only usable on not specific queries.");
    if (this.method !== "get")
      throw new Error("Order is only usable on get method.");
    if (this.fetchXml === true)
      throw new Error("order cannot be combined with fetchXml parameter.");
    this.hasParameters = true;
    this.url.searchParams.append("$orderby", `${orderExpression} ${desc}`);
    return this;
  }

  /**
   *
   * @param xml {String}
   * @returns {QueryBuilder}
   */
  fetch(xml) {
    if (this.isSpecific)
      throw new Error("FetchXml is only usable on not specific queries.");
    if (this.method !== "get")
      throw new Error("FetchXml is only usable on get method.");
    if (this.hasParameters === true)
      throw new Error("FetchXml cannot be combined with other parameters.");
    this.fetchXml = true;
    this.url.searchParams.append("fetchXml", xml);
    return this;
  }
  /**
   *
   * @param {Object} data
   * @returns {QueryBuilder}
   */
  set(data) {
    if (!["patch", "post"].includes(this.method))
      throw new Error(
        "set method is only usable on create and update methods."
      );
    this.body = data;
    return this;
  }

  /**
   *
   * @returns {Promise<Response>}
   * @param {String=} subPath
   */
  async send(subPath) {
    if (!this.method)
      throw new Error("Cannot send request when method is not defined.");
    if (
      ["update", "create"].includes(this.method) &&
      Object.keys(this.body).length === 0
    )
      throw new Error("Body of create and update methods cannot be empty.");
    if (subPath) this.url.pathname += subPath;
    return await RequestHandler(this);
  }
}

module.exports = QueryBuilder;
