## dev setup checklist

- setup mongodb and place connection string in src/config.js
- create master record in db

Master record example:
```js
    {
        _id: 'test',
        userId: 0, // or telegram user id (only prod)
        telegramToken: '', // telegram bot api token (only prod)
        expiringDate: any date, // not used
        address: 'some address', // address where the service is provided
        successImageUrl: '', // image that will be sent to telegram after recording
        shedulleStep: '', // determines the number of slots in a day
    }
```

- run front project with api url from config + '/api'
- open page and add '?masterId=<_id from db>' to url ('test' from record example)
