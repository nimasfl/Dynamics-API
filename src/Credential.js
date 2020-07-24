class Credential {
  /**
   *
   * @typedef {{url: URL, discoveryUrl: URL, username: String, password: String, domain: String, version: String, workstation: String}} Credential
   * @param {string} url
   * @param {String} username
   * @param {String} password
   * @param {String} domain
   * @param {String=} version
   * @param {String=} workstation
   * @returns Credential
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
      this.discoveryUrl = new URL(
        `${this.url.origin}/api/discovery/v${version}/Instances`
      );
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
