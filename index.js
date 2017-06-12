// Send aggregate information to SPA Client

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');



    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.log('Error getting User Aggregation details')
        context.res = {
            status: 400,
            body: "Error getting user aggregation details"
        };
    }
    context.done();
};


module.exports = function (context, req, inputDocument) {
    context.log('JavaScript HTTP trigger function processed a request.');

// context.log(req.body.akunaCustomer);
// context.log(req.body.yodleeAccounts[3].accountName);
// context.log(inputDocument.length);
// context.log(inputDocument[0].akunaDOB);
// context.log(inputDocument[0].id);
// context.log(typeof(inputDocument[0]));

// context.log('-------');
// outputDocument = inputDocument[0];
// context.log(typeof(outputDocument));
// context.log(outputDocument);
// inputDocument[0].akunaMiddleName = "Nettie!";
// context.log('-------');
// context.log(inputDocument[0].akunaMiddleName);
// HEAD STUFF ABOVE IS TESTING

akunaDocument = inputDocument[0];

if (!Array.isArray(akunaDocument.aggregate)) { akunaDocument.aggregate = [] };
context.log(`Is the Aggregate property defined as an Array: ${(Array.isArray(akunaDocument.aggregate))}`);

function itterateYodlee(item, index) {
  akunaEntry = {
    providerAccountId : item.providerAccountId,
    id : item.id,
    accountName : item.accountName,
    accountNumber : item.accountNumber,
    lastUpdated : item.lastUpdated,
    accountStatus : item.accountStatus,
    includeInNetWorth : item.includeInNetWorth,
    container : item.CONTAINER,
    providerName : item.providerName,
    accountType : item.accountType
  };
  akunaFinancialAppend = {
    extractedDate: item.lastUpdated,
    balance : item.balance.amount,
    currency : item.balance.currency
  };

    if (req.body.yodleeAccounts[index].hasOwnProperty("availableBalance")) {
        akunaFinancialAppend.availableBalance = req.body.yodleeAccounts[index].availableBalance.amount;
    };

    if (req.body.yodleeAccounts[index].hasOwnProperty("currentBalance")) {
       akunaFinancialAppend.currentBalance = req.body.yodleeAccounts[index].currentBalance.amount;
    };

// Check if account exists in Akuna Structure (update if yes, else create new)
  akunaIndex = akunaDocument.aggregate.findIndex(x => (x.providerAccountId == item.providerAccountId && x.id == item.id));
  if (akunaIndex === -1) {
      var newAkunaEntry = akunaDocument.aggregate.push(akunaEntry);
      console.log((newAkunaEntry - 1));
      akunaDocument.aggregate[(newAkunaEntry - 1)].financial = [];
      akunaDocument.aggregate[(newAkunaEntry - 1)].financial.push(akunaFinancialAppend);
  } else {
      akunaDocument.aggregate[akunaIndex].lastUpdated = item.lastUpdated;
      akunaDocument.aggregate[akunaIndex].financial.push(akunaFinancialAppend);
  };

};

req.body.yodleeAccounts.forEach(itterateYodlee);



// ------------ WRITE UPDATED DOCUMENT
context.bindings.outputDocument = akunaDocument;

    context.done();
};
