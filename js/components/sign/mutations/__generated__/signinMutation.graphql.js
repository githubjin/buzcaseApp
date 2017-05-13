/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule signinMutation.graphql
 * @generated SignedSource<<5269c0c4388933059f0819dfb5995203>>
 * @relayHash 6e9f15becfb975f816ccfc11ff53b9aa
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type SignInInput = {
  username?: ?string;
  password?: ?string;
};

export type signinMutationResponse = {
  error?: ?string;
  viewer?: ?signinMutationResponse_viewer;
};

export type signinMutationResponse_viewer = {
  id: string;
  username?: ?string;
  email?: ?string;
  sessionToken?: ?string;
  emailVerified?: ?boolean;
};
*/

/* eslint-disable comma-dangle, quotes */

/*
mutation signinMutation(
  $input: SignInInput!
) {
  signIn(input: $input) {
    error
    viewer {
      id
      username
      email
      sessionToken
      emailVerified
    }
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "SignInInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "signinMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "SignInInput!"
          }
        ],
        "concreteType": "SignInPayload",
        "name": "signIn",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "error",
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "User",
            "name": "viewer",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "username",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "email",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "sessionToken",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "emailVerified",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "signinMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "SignInInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "signinMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "SignInInput!"
          }
        ],
        "concreteType": "SignInPayload",
        "name": "signIn",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "error",
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "User",
            "name": "viewer",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "username",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "email",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "sessionToken",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "emailVerified",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation signinMutation(\n  $input: SignInInput!\n) {\n  signIn(input: $input) {\n    error\n    viewer {\n      id\n      username\n      email\n      sessionToken\n      emailVerified\n    }\n  }\n}\n"
};

module.exports = batch;