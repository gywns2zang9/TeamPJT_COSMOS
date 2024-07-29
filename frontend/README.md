## Start

```
npm start
```

## 프론트엔드 서버 실행시 빨간색 문구 오류가 뜬다면!!
아래의 경로로 들어가줍니다.
```
node_modules
ㄴreact-scripts
  ㄴconfig
    ㄴwebpackDevServer.config.js
```

아래의 내용을 찾아서

```
// `proxy` is run between `before` and `after` `webpack-dev-server` hooks
proxy,
onBeforeSetupMiddleware(devServer) {
    // Keep `evalSourceMapMiddleware`
    // middlewares before `redirectServedPath` otherwise will not have any effect
    // This lets us fetch source contents from webpack for the error overlay
    devServer.app.use(evalSourceMapMiddleware(devServer));

    if (fs.existsSync(paths.proxySetup)) {
    // This registers user provided middleware for proxy reasons
    require(paths.proxySetup)(devServer.app);
    }
},
onAfterSetupMiddleware(devServer) {
    // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
    devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

    // This service worker file is effectively a 'no-op' that will reset any
    // previous service worker registered for the same host:port combination.
    // We do this in development to avoid hitting the production cache if
    // it used the same host and port.
    // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
    devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
},
```

다음과 같이 바꿉니다.

```
// `proxy` is run between `before` and `after` `webpack-dev-server` hooks
proxy,
setupMiddlewares: (middlewares, devServer) => {
    if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
    }

    if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app)
    }

    middlewares.push(
        evalSourceMapMiddleware(devServer),
        redirectServedPath(paths.publicUrlOrPath),
        noopServiceWorkerMiddleware(paths.publicUrlOrPath)
    )

    return middlewares;
},
```