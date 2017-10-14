# Rxjs Playground

## Transactions

The test is wrapping multiple async operations in a transaction context. On error the tx is rolled back. IO is separated from the transaction logic, to make it testable.

### Prepare

The code has been tested on node v8.7.0.

```
npm install
npm run compile
```

### Test

```
npm test
```

### Run

```
node dist/index.js
connect
start tx
insert 1,2
insert 3
end tx
connect
start tx
insert 1,2
insert 3,2
insert 1
abort tx
/Users/mkulke/Development/rxjs-playground/node_modules/rxjs/Observable.js:164
                throw sink.syncErrorValue;
                ^

Error: fail!
```
