const {
  Environment,
  Network,
  createOperationSelector
} = require("relay-runtime");
import { API_URI } from "../constants";
import { environment } from "./Environment";

// token starts with 'Bearer '
export function createNetworkLayer(token: string) {
  // Define a function that fetches the results of an operation (query/mutation/etc)
  // and returns its results as a Promise:
  function fetchQuery(operation, variables, cacheConfig, uploadables) {
    // console.log("cacheConfigcacheConfig : " + JSON.stringify(cacheConfig));
    // console.log("operation", operation);
    // console.log("request variables : ", JSON.stringify(variables));
    // if (cacheConfig && !cacheConfig.force) {
    //   let selector = createOperationSelector(operation, variables);
    //   console.log("selector : " + JSON.stringify(selector));
    //   let check = environment.current.check(selector);
    //   console.log("check : " + JSON.stringify(check));
    //   if (check) {
    //     let cacheData = environment.current.lookup(selector);
    //     conosle.log("cacheDatacacheData : " + JSON.stringify(cacheData));
    //   }
    // }
    return fetch(API_URI, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json"
        // authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        operationName: operation.name,
        query: operation.text, // GraphQL text from input
        variables
      })
    })
      .then(response => {
        var result = response.json();
        // result.then(data => {
        //   console.log("response data are" + JSON.stringify(data));
        // });
        return result;
      })
      .catch(error => {
        console.log("fetch error : ", error);
      });
  }
  // Create a network layer from the fetch function
  const network = Network.create(fetchQuery);
  return network;
}
