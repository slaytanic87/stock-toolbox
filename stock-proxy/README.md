# stock-proxy

BFF/Gateway for all microservices

## Project setup
```
npm install
```

## create credentials

create a file named apiToken.json with following content:

```
{
  "alphavantage": "",
}
```

### start backend
```
npm run serve
```

or

```
node ./index.js
```
### to prepare backend + ui for production

```
npm run build
```

copy the build dist folder from ui

```
cp -r /stock-dashboard/dist /stock-proxy/
```

start application

```
npm run serve
```

open http://localhost:9090