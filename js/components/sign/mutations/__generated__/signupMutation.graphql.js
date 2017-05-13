/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule signupMutation.graphql
 * @generated SignedSource<<4f7910d00512181b5726cc07c1a1ee39>>
 * @relayHash 3f57562174d84040b24e93488d005d09
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type SignUpInput = {
  username?: ?string;
  email?: ?string;
  password?: ?string;
};

export type signupMutationResponse = {
  error?: ?string;
  viewer?: ?signupMutationResponse_viewer;
};

export type signupMutationResponse_viewer = {
  id: string;
  username?: ?string;
  email?: ?string;
  sessionToken?: ?string;
  emailVerified?: ?boolean;
};
*/

/* eslint-disable comma-dangle, quotes */

/*
mutation signupMutation(
  $input: SignUpInput!
) {
  signUp(input: $input) {
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
        "type": "SignUpInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "signupMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "SignUpInput!"
          }
        ],
        "concreteType": "SignUpPayload",
        "name": "signUp",
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
  "name": "signupMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "SignUpInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "signupMutation",
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
            "type": "SignUpInput!"
          }
        ],
        "concreteType": "SignUpPayload",
        "name": "signUp",
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
  "text": "mutation signupMutation(\n  $input: SignUpInput!\n) {\n  signUp(input: $input) {\n    error\n    viewer {\n      id\n      username\n      email\n      sessionToken\n      emailVerified\n    }\n  }\n}\n"
};

module.exports = batch;