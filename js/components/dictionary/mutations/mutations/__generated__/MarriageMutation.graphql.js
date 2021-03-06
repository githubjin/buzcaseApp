/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule MarriageMutation.graphql
 * @generated SignedSource<<9e10fdd4f7d4d1d1a308e7cfab44c206>>
 * @relayHash 56037cd4b604c3dee0712d9290c44422
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type MarriageMutationInput = {
  name?: ?string;
  order?: ?number;
  id?: ?string;
};

export type MarriageMutationResponse = {
  newEdge?: ?MarriageMutationResponse_newEdge;
  distroyedId?: ?string;
  viewer?: ?MarriageMutationResponse_viewer;
  error?: ?string;
};

export type MarriageMutationResponse_newEdge_node = {
  id: string;
  name?: ?string;
  order?: ?number;
};

export type MarriageMutationResponse_newEdge = {
  cursor: string;
  node?: ?MarriageMutationResponse_newEdge_node;
};

export type MarriageMutationResponse_viewer = {
  id: string;
};
*/

/* eslint-disable comma-dangle, quotes */

/*
mutation MarriageMutation(
  $input: MarriageMutationInput!
) {
  MarriageMutation(input: $input) {
    newEdge {
      cursor
      node {
        id
        name
        order
      }
    }
    distroyedId
    viewer {
      id
    }
    error
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "MarriageMutationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "MarriageMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "MarriageMutationInput!"
          }
        ],
        "concreteType": "MarriageMutationPayload",
        "name": "MarriageMutation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "DictionaryEdge",
            "name": "newEdge",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "cursor",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Dictionary",
                "name": "node",
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
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "order",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "distroyedId",
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
              }
            ],
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "error",
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
  "name": "MarriageMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "MarriageMutationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "MarriageMutation",
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
            "type": "MarriageMutationInput!"
          }
        ],
        "concreteType": "MarriageMutationPayload",
        "name": "MarriageMutation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "DictionaryEdge",
            "name": "newEdge",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "cursor",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Dictionary",
                "name": "node",
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
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "order",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "distroyedId",
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
              }
            ],
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "error",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation MarriageMutation(\n  $input: MarriageMutationInput!\n) {\n  MarriageMutation(input: $input) {\n    newEdge {\n      cursor\n      node {\n        id\n        name\n        order\n      }\n    }\n    distroyedId\n    viewer {\n      id\n    }\n    error\n  }\n}\n"
};

module.exports = batch;
