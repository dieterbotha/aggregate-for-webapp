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
