const Credential = require("./Credential");
const QueryBuilder = require("./QueryBuilder");
const credential = new Credential(
  "http://192.168.10.100/iromart",
  "crmadmin",
  "Crm1234@@",
  "iromart"
);
const Do = async () => {
  const res = await new QueryBuilder(credential)
    .execute("WhoAmI", "get")
    .send();
  // const res = await new QueryBuilder(credential).get("accounts").top(1).send();
  console.log(res);
};

module.exports = { Credential, QueryBuilder };
Do();
