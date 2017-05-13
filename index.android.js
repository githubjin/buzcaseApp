/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
(function(PolyfillSet) {
  if (!PolyfillSet) {
    return;
  }
  var testSet = new PolyfillSet();
  if (testSet.size === undefined) {
    if (testSet._c.size === 0) {
      Object.defineProperty(PolyfillSet.prototype, "size", {
        get: function() {
          return this._c.size;
        }
      });
    }
  }
})(require("babel-runtime/core-js/set").default);

import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";

import App from "./js/setup";

AppRegistry.registerComponent("mobileClient", () => App);
