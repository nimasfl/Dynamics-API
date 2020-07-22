class Credential {
  /**
   *
   * @param {URL} url
   * @param {String} username
   * @param {String} password
   * @param {String} domain
   */
  constructor(url, username, password, domain) {
    if (!url) throw new Error("Url parameter is not valid.");
    if (!username) throw new Error("Username parameter is not valid.");
    if (!password) throw new Error("Password parameter is not valid.");
    if (!domain) throw new Error("Domain parameter is not valid.");
    this.url = new URL(url);
    this.username = username;
    this.password = password;
    this.domain = domain;
    return this;
  }
}

module.exports = Credential;
