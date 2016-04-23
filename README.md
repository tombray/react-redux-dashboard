Realtime Dashboard with React, Redux, RxJs, Leaflet, D3, and Firebase
=====================================================================
This sample application demonstrates using Redux with [custom middleware](src/middleware/firebase-middleware.js) to support data being pushed from Firebase. The fake cyber security data represents IP addresses that have been compromised by some type of threat. The geo location of each IP is rendered on a Leaflet map and each marker can be clicked to see more details.

Incoming data is buffered using RxJs so that new information can be rendered in batches.

The [stacked bar chart](src/components/StackedBarChart.js) on the right demonstrates using D3 with React.

Take a look at some of [the tests](src/utils/transformers.spec.js) as well.

```
npm install
npm test
npm start
```

Then visit [http://localhost:3000](http://localhost:3000).
