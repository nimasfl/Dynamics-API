# Dynamics Web Api

This is a third party interface for using microsoft dynamics 365 using ntlm authentication.

this package is mainly using [httpntlm](https://www.npmjs.com/package/httpntlm) module to send http request.

## Installation

use bellow command to add dynapi to your dependencies:

`npm install dynapi --save`

## Simple Example
You can use the module like the example below:
```
// Import the required modules
const { Credential, QueryBuilder } = require("rabama-dynapi"");

// Specify credentials to login to dynamics 365 server
const credential = new Credential({
  url: "http://example.com/organization",
  username: "testUsername",
  password: "TestPassword",
  domain: "testDomain",
  version: "8.2",        //Optional
  workstation: "app"     //Optional
});

// Send a query to fetch name of 3 accounts as a result. 
const result = new QueryBuilder(credential)
  .get("accounts")
  .top(3)
  .select("name")
  .send();
```

## API

### Credential:
Create a new credential instance to authenticate through dynamics 365 server then pass
it into the QueryBuilder constructor.
```
const credential = new Credential({
  url: "http://example.com/organization",
  username: "testUsername",
  password: "TestPassword",
  domain: "testDomain",
  version: "8.2",        //Optional
  workstation: "app"    //Optional})
```
### QueryBuilder:
There are 5 types of methods that you can send to the dynamics 365 as Web API Request.

##### .create(entitySetName)

Create new account with the name of test.
You can set any attribute value in the set method.
```
new QueryBuilder(credential)
  .create("accounts")
  .set({
    name: "test"
  })
  .send();

```

##### .update(entitySetName, entityId)

Update an account with the specified id and change its name to test.
You can set any attribute value in the set method.
```
new QueryBuilder(credential)
  .update("accounts", recordId)
  .set({
    name: "test"
  })
  .send();
```

##### .delete(entitySetName, entityId)

Delete an account with the specified Id.
```
new QueryBuilder(credential)
  .delete("accounts", recordId)
  .send();
```

##### .read(entitySetName[, recordId])

Retrieve any account with the specified id.
You can use select method while retrieving a single record to get those attributes only.
```
new QueryBuilder(credential)
  .read("accounts", recordId)
  .select("name", "createdon")
  .send();
```
Or just retrieve all accounts as you desire.
You can use multiple kind of filters while retrieving multiple records.
```
new QueryBuilder(credential)
  .read("accounts")
  .select("name", "createdon")
  .top(10)
  .filter("name eq test")
  .send();
```
It is also possible to append any pathname to the url to get more 
information about a field(for example a lookup field) by passing 
pathname into send method parameter.
```
// The result here would be about the user who created this account.
new QueryBuilder(credential)
  .read("accounts", recordId)
  .select("name", "createdon", "createdby")
  .send("/createdby");
```

##### .execute(actionName, method [, entitySetName, id])
You can execute any kind of action including globals.
```
new QueryBuilder(credential)
  .execute("WhoAmI", "get")
  .send();
```

## Debugging
You can include `dynapi` in the `process.env.DEBUG` to see the 
sent requests for debugging purposes.
