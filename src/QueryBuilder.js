const RequestHandler = require("./RequestHandler");

/**
 * @namespace
 * @property {URL}  url                   - The default values for parties.
 * @property {String}  username           - The default number of players.
 * @property {String}  password           - The default level for the party.
 * @property {String}  domain             - The default treasure.
 * @property {String}  method             - How much gold the party starts with.
 * @property {Boolean}  isSpecific        - How much gold the party starts with.
 * @property {Object}  body               - How much gold the party starts with.
 */
class QueryBuilder {
  /**
   * @param credentials {Credential}
   * @returns {QueryBuilder}
   */
  constructor(credentials) {
    const { url, username, password, domain } = credentials;
    this.url = new URL(url);
    this.username = username;
    this.password = password;
    this.domain = domain;
    this.method = null; // [create || update || read || delete]
    this.isSpecific = true;
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
      throw new Error("Can not define more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be defined on create request.");
    this.url = new URL(entitySetName, this.url);
    this.method = "create";
    return this;
  }
  /**
   *
   * @param entitySetName {String}
   * @returns {QueryBuilder}
   */
  update(entitySetName) {
    if (this.method)
      throw new Error("Can not define more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be defined on update request.");
    this.url = new URL(entitySetName, this.url);
    this.method = "update";
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
      throw new Error("Can not define more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be defined on delete request.");
    if (!id) throw new Error("Id must be specified for delete operation.");
    this.url = new URL(`${entitySetName}(${id})`, this.url);
    this.method = "delete";
    return this;
  }
  /**
   *
   * @param entitySetName {String}
   * @param id {String=}
   * @returns {QueryBuilder}
   */
  read(entitySetName, id) {
    if (this.method)
      throw new Error("Can not define more than one operation on each query.");
    if (!entitySetName)
      throw new Error("Entity name must be defined on read request.");
    if (id) {
      this.url = new URL(`${entitySetName}(${id})`, this.url);
    } else {
      this.url = new URL(entitySetName, this.url);
      this.isSpecific = false;
    }
    this.method = "read";
    return this;
  }

  /**
   *
   * @param actionName {String}
   * @param entitySetName {String=}
   * @param id {String=}
   * @returns {QueryBuilder}
   */
  execute(actionName, entitySetName, id) {
    if (this.method)
      throw new Error("Can not define more than one operation on each query.");
    if (entitySetName) {
      if (!id)
        throw new Error(
          "Record id must be specified when setting entitySetName value."
        );
      this.url = new URL(`${entitySetName}(${id})`, this.url);
      this.url = new URL(actionName, this.url);
    } else {
      this.url = new URL(actionName, this.url);
      this.isSpecific = false;
    }
    this.method = "action";
    return this;
  }

  /**
   *
   * @param fields {String}
   * @returns {QueryBuilder}
   */
  select(...fields) {
    if (this.isSpecific)
      throw new Error("Select is only usable on not specific queries.");
    if (this.method !== "read")
      throw new Error("Select is only usable on read method.");
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
    if (this.method !== "read")
      throw new Error("Top is only usable on read method.");
    this.url.searchParams.append("$top", count.toString());
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
    if (this.method !== "read")
      throw new Error("Filter is only usable on read method.");
    this.url.searchParams.append("$filter", filterExpression);
    return this;
  }

  order(orderExpression, isDesc) {
    const desc = isDesc ? "desc" : "";
    if (this.isSpecific)
      throw new Error("Order is only usable on not specific queries.");
    if (this.method !== "read")
      throw new Error("Order is only usable on read method.");
    this.url.searchParams.append("$orderby", `${orderExpression} ${desc}`);
  }

  /**
   *
   * @param data {Object}
   * @returns {QueryBuilder}
   */
  setBody(data) {
    if (!["update", "create"].includes(this.method))
      throw new Error(
        "setBody method is only usable on create and update methods."
      );
    this.body(data);
    return this;
  }

  /**
   *
   * @returns {Promise<(Object)>}
   */
  async send() {
    if (!this.method)
      throw new Error("Cannot send request when method is not defined.");
    if (
      ["update", "create"].includes(this.method) &&
      Object.keys(this.body).length === 0
    )
      throw new Error("Body of create and update methods cannot be empty.");
    return await RequestHandler(this);
  }
}

module.exports = QueryBuilder;
