/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule QuyuSubQuery.graphql
 * @generated SignedSource<<25db81663da5481fdbb98bf41e0e2dff>>
 * @relayHash e6cc55f33ecb9c669b266e8ded5c33c3
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';

*/

/* eslint-disable comma-dangle, quotes */

/*
query QuyuSubQuery(
  $code: String
  $skip: Boolean!
) {
  viewer {
    id
    ...QuyuSub_viewer
  }
}

fragment QuyuSub_viewer on User {
  id
  subQuyu(code: $code) @skip(if: $skip) {
    id
    name
    code
    isLeaf
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "code",
        "type": "String",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "skip",
        "type": "Boolean!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "QuyuSubQuery",
    "selections": [
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
            "kind": "FragmentSpread",
            "name": "QuyuSub_viewer",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "QuyuSubQuery",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "code",
        "type": "String",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "skip",
        "type": "Boolean!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "QuyuSubQuery",
    "operation": "query",
    "selections": [
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
            "kind": "Condition",
            "passingValue": false,
            "condition": "skip",
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": [
                  {
                    "kind": "Variable",
                    "name": "code",
                    "variableName": "code",
                    "type": "String"
                  }
                ],
                "concreteType": "Quyu",
                "name": "subQuyu",
                "plural": true,
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
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "code",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "isLeaf",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query QuyuSubQuery(\n  $code: String\n  $skip: Boolean!\n) {\n  viewer {\n    id\n    ...QuyuSub_viewer\n  }\n}\n\nfragment QuyuSub_viewer on User {\n  id\n  subQuyu(code: $code) @skip(if: $skip) {\n    id\n    name\n    code\n    isLeaf\n  }\n}\n"
};

module.exports = batch;
