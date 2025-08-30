2025-08-30T18:32:34.949Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:32:34.952Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:32:43.318Z - ERROR (FRONTEND): Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.%s true jsx jsx true jsx 
    at style
    at div
    at AuditLog (http://localhost:3000/static/js/bundle.js:52045:86)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
2025-08-30T18:33:17.330Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:33:17.333Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:33:26.352Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:33:32.122Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:33:32.123Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:33:34.929Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:33:35.284Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:33:59.258Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:34:02.226Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:34:02.227Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:34:02.294Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:02.346Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:09.646Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:34:12.864Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:34:12.865Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:34:12.924Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:12.973Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:14.917Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:34:17.988Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:34:17.989Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:34:18.053Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:18.100Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:21.318Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:34:31.023Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:34:31.024Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:34:31.081Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:31.134Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:34.867Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:34:37.571Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:34:37.572Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:34:37.628Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:34:37.680Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:35:02.380Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:35:05.132Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:35:05.133Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:35:05.198Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:35:05.244Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:35:10.904Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:35:12.518Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:35:12.519Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:35:12.574Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:35:12.628Z - ERROR (FRONTEND): Error loading initial data: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async loadInitialData (http://localhost:3000/static/js/bundle.js:50403:30)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1NTU0OTQsImV4cCI6MTc1NjY0MTg5NH0.BHBY4RGTBh5HITY7IiAJS95H6TeRjHwsKwVXL1Gy1hY"
    },
    "method": "get",
    "url": "/api/advanced/crypto/stats"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T18:35:14.221Z - ERROR (FRONTEND): Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.%s true jsx jsx true jsx 
    at style
    at div
    at AuditLog (http://localhost:3000/static/js/bundle.js:52045:86)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
2025-08-30T18:35:39.055Z - ERROR (FRONTEND): Warning: The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.%s value 
    at value
    at div
    at div
    at div
    at div
    at div
    at BlockchainDashboard (http://localhost:3000/static/js/bundle.js:52906:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
2025-08-30T18:40:04.885Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:40:05.158Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:40:07.721Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:40:15.814Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:40:16.063Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:40:27.949Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:40:30.740Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:40:30.741Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:43:08.195Z - ERROR (FRONTEND): Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.%s true jsx jsx true jsx 
    at style
    at div
    at AuditLog (http://localhost:3000/static/js/bundle.js:52070:86)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
2025-08-30T18:45:02.113Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:45:02.146Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:45:39.661Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:46:22.631Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:46:22.638Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:48:33.594Z - ERROR (FRONTEND): Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.%s true jsx jsx true jsx 
    at style
    at div
    at AuditLog (http://localhost:3000/static/js/bundle.js:52070:86)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
2025-08-30T18:49:29.134Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:49:29.135Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:49:40.645Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:49:44.054Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:49:44.055Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:49:44.887Z - ERROR (FRONTEND): The above error occurred in the <AdvancedFeatures> component:

    at AdvancedFeatures (http://localhost:3000/static/js/bundle.js:50383:84)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
2025-08-30T18:50:00.305Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:50:00.607Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:50:37.954Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:50:37.955Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T18:58:41.311Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T18:58:41.312Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T19:00:37.418Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T19:00:37.630Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T19:03:07.615Z - ERROR (FRONTEND): Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.%s true jsx jsx true jsx 
    at style
    at div
    at LegalFramework (http://localhost:3000/static/js/bundle.js:57122:94)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
2025-08-30T19:04:13.664Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T19:04:13.665Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T19:05:17.325Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T19:05:17.527Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T19:07:26.664Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T19:07:26.665Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T19:07:30.626Z - ERROR (FRONTEND): API call failed: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async handleApiCall (http://localhost:3000/static/js/bundle.js:50437:20)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1ODAzNDQsImV4cCI6MTc1NjY2Njc0NH0.AnC2aeUyQPIUlFcQ63d9r6Or843iEunNeRlRub_J_Cg"
    },
    "baseURL": "/api/advanced",
    "method": "post",
    "url": "/consensus/simulate-partition",
    "data": "{\"percentage\":0.3}"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T19:07:33.774Z - ERROR (FRONTEND): API call failed: {
  "message": "Request failed with status code 403",
  "name": "AxiosError",
  "stack": "AxiosError: Request failed with status code 403\n    at settle (http://localhost:3000/static/js/bundle.js:7109:12)\n    at XMLHttpRequest.onloadend (http://localhost:3000/static/js/bundle.js:5769:66)\n    at Axios.request (http://localhost:3000/static/js/bundle.js:6270:41)\n    at async handleApiCall (http://localhost:3000/static/js/bundle.js:50439:20)",
  "config": {
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    },
    "adapter": [
      "xhr",
      "http"
    ],
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "env": {},
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjMjVjMzRjOWI3Y2RjNjQ3YWViZCIsInJvbGUiOiJhc3NvY2lhdGUiLCJpYXQiOjE3NTY1ODAzNDQsImV4cCI6MTc1NjY2Njc0NH0.AnC2aeUyQPIUlFcQ63d9r6Or843iEunNeRlRub_J_Cg"
    },
    "baseURL": "/api/advanced",
    "method": "get",
    "url": "/privacy/compliance-report"
  },
  "code": "ERR_BAD_REQUEST",
  "status": 403
}
2025-08-30T19:09:55.191Z - ERROR (FRONTEND): API Error: {
  "message": "Access denied. Required role: partner. Your role: associate"
}
2025-08-30T19:09:55.301Z - ERROR (FRONTEND): API call failed: /consensus/simulate-partition 403 {
  "message": "Access denied. Required role: partner. Your role: associate"
}
2025-08-30T19:09:57.836Z - ERROR (FRONTEND): API Error: {
  "message": "Access denied. Required role: partner. Your role: associate"
}
2025-08-30T19:09:57.837Z - ERROR (FRONTEND): API call failed: /consensus/simulate-partition 403 {
  "message": "Access denied. Required role: partner. Your role: associate"
}
2025-08-30T19:10:01.526Z - LOG (FRONTEND): API Success: /demo/integrated-features {
  "demo": {
    "demo": "PangoChain Advanced Features Integration",
    "timestamp": "2025-08-30T19:10:01.114Z",
    "features": {
      "digitalSignatures": {
        "signature": "EVx/Y7XgKXEzLYBUUYa9...",
        "verified": true,
        "algorithm": "RSA-SHA256"
      },
      "consensus": {
        "algorithm": "PBFT",
        "success": true,
        "validators": 4,
        "blockHeight": 1756581000
      },
      "privacy": {
        "anonymizedUser": "anon-2aad4406",
        "privacyLevel": "MODERATE",
        "zkProofGenerated": true,
        "zkProofVerified": true
      }
    },
    "summary": {
      "allFeaturesWorking": true,
      "securityLevel": "Enterprise Grade",
      "privacyCompliant": true,
      "blockchainReady": true
    }
  }
}
2025-08-30T19:10:05.934Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T19:10:06.236Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T19:10:07.830Z - LOG (FRONTEND): API Success: /crypto/sign {
  "signature": {
    "signature": "gSTkSkIGJgfNsNCMOoqorHRRkB4IDNB29PF8HU2TWQnRD9YSmHbvQ88ORAjP5Q112O2VEO8Bsa3tfbBEHvMcAXmb3TZzCglk15sUefmkKO7HdP1Ro4gZ6Zg7S3rIrC16zl2EwgERH3achvRjHvD5APqS1kmxA5eTqxMEAPv730mDuI7Ny73Z7/0zztsRu5IhobJDyPCrGOG6XTdepdmWA+Z1XWiwAmfOJAdByXEhA78elSw8iXOpGO2sT09INn8bHRrJpYkrzMRS/zSZSrOXMhJM6C0lNtHu8T9N9Ecckwk5L5Qw9aiDhswyqj5SnSpI87lKgwAxnfjta8z9x2M9+g==",
    "algorithm": "RSA-SHA256",
    "keyId": "rsa-68b1c25c34c9b7cdc647aebd",
    "timestamp": "2025-08-30T19:10:07.424Z"
  }
}
2025-08-30T19:10:08.840Z - LOG (FRONTEND): API Success: /crypto/certificate {
  "certificate": {
    "certificate": {
      "subject": {
        "commonName": "Zayan",
        "emailAddress": "zayan9111@gmail.com",
        "organizationUnit": "associate",
        "organization": "PangoChain Legal System"
      },
      "issuer": {
        "commonName": "PangoChain Certificate Authority",
        "organization": "PangoChain"
      },
      "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv8BmU8+7QHpgJtvJb2b8\n2AIZ6QIbgFQT8x37I8O6sKUoM757oRYmRLmsdUkwemtq8ZKQ5OIKdgq6PNjvNGJv\nybjW4BJ5Ymn4NgNdA4V+4un/1R79r+b03ypnscIF6V5d0zTj1fbMnhFfujmhSE9e\niN6WsKaGNCdfpMumbl4t9Tkz2PlXMdqT4QynD0FM4qeoirSTyY+OtBLH/MHZyMdj\n1BzUDzhU1Dvc2IeYAzXQM492uwB8SfoE5GirWeueRD9MeWDg725+Trrd/YLE1n5S\nDChaln3za/rOXVueVdqlGNIraeTY03JWiZnOw3dHqtWek/WmfCYzvtbBatdjgkG5\nswIDAQAB\n-----END PUBLIC KEY-----\n",
      "serialNumber": "da9d9d21c8ce2cabb4bf1030919fd4e0",
      "validFrom": "2025-08-30T19:10:08.432Z",
      "validTo": "2026-08-30T19:10:08.432Z",
      "keyUsage": [
        "digitalSignature",
        "keyEncipherment",
        "nonRepudiation"
      ],
      "extendedKeyUsage": [
        "clientAuth",
        "documentSigning"
      ]
    },
    "certificateHash": "1a472eab7ff7c1df5a2e6d22200f5a6009b637c838c387dfa1f899b3f5aea851",
    "pem": "-----BEGIN CERTIFICATE-----\neyJzdWJqZWN0Ijp7ImNvbW1vbk5hbWUiOiJaYXlhbiIsImVtYWlsQWRkcmVzcyI6\nInpheWFuOTExMUBnbWFpbC5jb20iLCJvcmdhbml6YXRpb25Vbml0IjoiYXNzb2Np\nYXRlIiwib3JnYW5pemF0aW9uIjoiUGFuZ29DaGFpbiBMZWdhbCBTeXN0ZW0ifSwi\naXNzdWVyIjp7ImNvbW1vbk5hbWUiOiJQYW5nb0NoYWluIENlcnRpZmljYXRlIEF1\ndGhvcml0eSIsIm9yZ2FuaXphdGlvbiI6IlBhbmdvQ2hhaW4ifSwicHVibGljS2V5\nIjoiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1JSUJJakFOQmdrcWhraUc5\ndzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdjhCbVU4KzdRSHBnSnR2SmIyYjhc\nbjJBSVo2UUliZ0ZRVDh4MzdJOE82c0tVb003NTdvUlltUkxtc2RVa3dlbXRxOFpL\nUTVPSUtkZ3E2UE5qdk5HSnZcbnlialc0Qko1WW1uNE5nTmRBNFYrNHVuLzFSNzly\nK2IwM3lwbnNjSUY2VjVkMHpUajFmYk1uaEZmdWptaFNFOWVcbmlONldzS2FHTkNk\nZnBNdW1ibDR0OVRrejJQbFhNZHFUNFF5bkQwRk00cWVvaXJTVHlZK090QkxIL01I\nWnlNZGpcbjFCelVEemhVMUR2YzJJZVlBelhRTTQ5MnV3QjhTZm9FNUdpcldldWVS\nRDlNZVdEZzcyNStUcnJkL1lMRTFuNVNcbkRDaGFsbjN6YS9yT1hWdWVWZHFsR05J\ncmFlVFkwM0pXaVpuT3czZEhxdFdlay9XbWZDWXp2dGJCYXRkamdrRzVcbnN3SURB\nUUFCXG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1cbiIsInNlcmlhbE51bWJlciI6\nImRhOWQ5ZDIxYzhjZTJjYWJiNGJmMTAzMDkxOWZkNGUwIiwidmFsaWRGcm9tIjoi\nMjAyNS0wOC0zMFQxOToxMDowOC40MzJaIiwidmFsaWRUbyI6IjIwMjYtMDgtMzBU\nMTk6MTA6MDguNDMyWiIsImtleVVzYWdlIjpbImRpZ2l0YWxTaWduYXR1cmUiLCJr\nZXlFbmNpcGhlcm1lbnQiLCJub25SZXB1ZGlhdGlvbiJdLCJleHRlbmRlZEtleVVz\nYWdlIjpbImNsaWVudEF1dGgiLCJkb2N1bWVudFNpZ25pbmciXX0=\n-----END CERTIFICATE-----",
    "status": "generated",
    "generatedAt": "2025-08-30T19:10:08.432Z"
  }
}
2025-08-30T19:10:09.576Z - LOG (FRONTEND): API Success: /crypto/public-key {
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv8BmU8+7QHpgJtvJb2b8\n2AIZ6QIbgFQT8x37I8O6sKUoM757oRYmRLmsdUkwemtq8ZKQ5OIKdgq6PNjvNGJv\nybjW4BJ5Ymn4NgNdA4V+4un/1R79r+b03ypnscIF6V5d0zTj1fbMnhFfujmhSE9e\niN6WsKaGNCdfpMumbl4t9Tkz2PlXMdqT4QynD0FM4qeoirSTyY+OtBLH/MHZyMdj\n1BzUDzhU1Dvc2IeYAzXQM492uwB8SfoE5GirWeueRD9MeWDg725+Trrd/YLE1n5S\nDChaln3za/rOXVueVdqlGNIraeTY03JWiZnOw3dHqtWek/WmfCYzvtbBatdjgkG5\nswIDAQAB\n-----END PUBLIC KEY-----\n"
}
2025-08-30T19:10:11.133Z - LOG (FRONTEND): API Success: /crypto/public-key {
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv8BmU8+7QHpgJtvJb2b8\n2AIZ6QIbgFQT8x37I8O6sKUoM757oRYmRLmsdUkwemtq8ZKQ5OIKdgq6PNjvNGJv\nybjW4BJ5Ymn4NgNdA4V+4un/1R79r+b03ypnscIF6V5d0zTj1fbMnhFfujmhSE9e\niN6WsKaGNCdfpMumbl4t9Tkz2PlXMdqT4QynD0FM4qeoirSTyY+OtBLH/MHZyMdj\n1BzUDzhU1Dvc2IeYAzXQM492uwB8SfoE5GirWeueRD9MeWDg725+Trrd/YLE1n5S\nDChaln3za/rOXVueVdqlGNIraeTY03JWiZnOw3dHqtWek/WmfCYzvtbBatdjgkG5\nswIDAQAB\n-----END PUBLIC KEY-----\n"
}
2025-08-30T19:10:13.064Z - LOG (FRONTEND): API Success: /crypto/public-key {
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv8BmU8+7QHpgJtvJb2b8\n2AIZ6QIbgFQT8x37I8O6sKUoM757oRYmRLmsdUkwemtq8ZKQ5OIKdgq6PNjvNGJv\nybjW4BJ5Ymn4NgNdA4V+4un/1R79r+b03ypnscIF6V5d0zTj1fbMnhFfujmhSE9e\niN6WsKaGNCdfpMumbl4t9Tkz2PlXMdqT4QynD0FM4qeoirSTyY+OtBLH/MHZyMdj\n1BzUDzhU1Dvc2IeYAzXQM492uwB8SfoE5GirWeueRD9MeWDg725+Trrd/YLE1n5S\nDChaln3za/rOXVueVdqlGNIraeTY03JWiZnOw3dHqtWek/WmfCYzvtbBatdjgkG5\nswIDAQAB\n-----END PUBLIC KEY-----\n"
}
2025-08-30T19:10:18.343Z - LOG (FRONTEND): API Success: /crypto/generate-keys {
  "success": true,
  "keyId": "rsa-68b1c25c34c9b7cdc647aebd-1756581017937",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp9piW1gx7UQ8XLzse/Vb\n8mKOkN8Cf1sEeO0FjDct2+kkGVhTC1jzKuVMZU2XRcW62hcxb4OKA4ZVGDhiO/r5\nwn0mMRvMKQ8D67fztOCZs2XqtlQ3p8NIvFmvX2/glG05COnAnE7Gpg77ENkNg3lL\ncNZ2qPR6yXrSzcMBpsYE6BbQ9L1UufV8d/ltJMDxqof0M+gP5ELSQAheGGxwZ6Cn\nYfqeJGraqJdnq2uHhkbOVKV0l2OFNjqq2BkC56MhjuPjwYhwAMyzwzDGaQVyMrpu\nvz5CTgC18hbKvB4JGFwswWPYKTmCTiCepNd91VGBJF0mn3omeBmiUTLh7WBFsnFg\nTwIDAQAB\n-----END PUBLIC KEY-----\n",
  "message": "RSA key pair generated successfully"
}
2025-08-30T19:10:41.758Z - ERROR (FRONTEND): Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.%s true jsx jsx true jsx 
    at style
    at div
    at LegalFramework (http://localhost:3000/static/js/bundle.js:57114:94)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
2025-08-30T19:15:16.942Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
2025-08-30T19:15:16.962Z - WARN (FRONTEND): ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
2025-08-30T19:15:19.213Z - ERROR (FRONTEND): Warning: Received `%s` for a non-boolean attribute `%s`.

If you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.%s true jsx jsx true jsx 
    at style
    at div
    at AuditLog (http://localhost:3000/static/js/bundle.js:52151:86)
    at RenderedRoute (http://localhost:3000/static/js/bundle.js:41243:5)
    at Routes (http://localhost:3000/static/js/bundle.js:41977:5)
    at div
    at div
    at div
    at Router (http://localhost:3000/static/js/bundle.js:41911:15)
    at BrowserRouter (http://localhost:3000/static/js/bundle.js:39812:5)
    at App (http://localhost:3000/static/js/bundle.js:49490:96)
