class Credential {
  /**
   *
   * @param {string} url
   * @param {String} username
   * @param {String} password
   * @param {String} domain
   * @param {String=} version
   * @param {String=} workstation
   */
  constructor(
    url,
    username,
    password,
    domain,
    version = "8.2",
    workstation = ""
  ) {
    if (!url) throw new Error("Url parameter is not valid.");
    if (!username) throw new Error("Username parameter is not valid.");
    if (!password) throw new Error("Password parameter is not valid.");
    if (!domain) throw new Error("Domain parameter is not valid.");
    try {
      this.url = new URL(`${url}/api/data/v${version}`);
    } catch (err) {
      throw new Error("Url parameter is not formatted correctly.");
    }
    this.username = username;
    this.password = password;
    this.domain = domain;
    this.workstation = workstation;
    return this;
  }
}

module.exports = Credential;
