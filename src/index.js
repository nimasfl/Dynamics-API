const Credential = require("./Credential");
const QueryBuilder = require("./QueryBuilder");

const Do = async () => {
  try {
    const credential = new Credential(
      "http://192.168.10.100/finaltest",
      "crmadmin",
      "Crm1234@@",
      "iromart"
    );
    const query = await new QueryBuilder(credential)
      .create("accounts")
      .set({ name: "asd" })
      .send();
    console.log("query: ", query);
  } catch (err) {
    console.log("in catch: ");
    console.log(err);
  }
};
Do();
