// @flow

const {
  Environment,
  Network,
  RecordSource,
  Store,
  ConnectionHandler,
  ViewerHandler
} = require("relay-runtime");
import { createNetworkLayer } from "./NetWorkLayer";

export const environment = {
  reset: (token: string) => {
    // console.log("token", token);
    var source = new RecordSource();
    var store = new Store(source);
    var network = createNetworkLayer(token);
    // var handlerProvider = null;
    var _environment = new Environment({
      handlerProvider,
      network,
      store
    });
    environment.current = _environment;
    environment.token = token;
  },
  current: null,
  token: null
};

function handlerProvider(handle) {
  // console.log("handlerProvider", handle);
  switch (handle) {
    case "connection":
      return ConnectionHandler;
    case "viewer":
      return ViewerHandler;
  }
  throw new Error(`handlerProvider: No handler provided for ${handle}`);
}
