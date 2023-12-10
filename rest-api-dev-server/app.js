const express = require('express');
const app = express();
const cors = require('cors');
const HttpStatusCode = require('http-status-codes').StatusCodes;

const accounts = {
    101: 1001.00,
    202: 2002.00,
    303: 3003.00
};

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.get('/account/:id/balance', function (request, response) {
    const accountId = request.params.id.toString();

    if (accountId === '999') {
        const payload = 'Service unavailable';

        response
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .end(JSON.stringify(payload));
    }
    else if (accountId in accounts) {
        const balance = accounts[accountId];
        const payload = { balance: balance };

        console.log(`Servicing balance request for accounts id ${accountId}...`);
        response
            .status(HttpStatusCode.OK)
            .end(JSON.stringify(payload));
    }
    else {
        const payload = `Account ${accountId} not found`;

        response
            .status(HttpStatusCode.NOT_FOUND)
            .end(JSON.stringify(payload));
    }
});

const server = app.listen(9980, function () {
    const serverAddress = server.address();
    const host = serverAddress.address;
    const port = serverAddress.port;

    console.log(`Accounts REST API server listening at http://${host}:${port}`);
});
