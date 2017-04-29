/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule CategoryMutation.graphql
 * @generated SignedSource<<d1e7b70bea4d10f8b4593d4e20a569de>>
 * @relayHash 04a0e65e1285413a500c400d9ef4bc87
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type CategoryMutationInput = {
  name?: ?string;
  order?: ?number;
  id?: ?string;
};

export type CategoryMutationResponse = {
  newEdge?: ?CategoryMutationResponse_newEdge;
  distroyedId?: ?string;
  error?: ?string;
};

export type CategoryMutationResponse_newEdge_node = {
  id: string;
  name?: ?string;
  order?: ?number;
};

export type CategoryMutationResponse_newEdge = {
  cursor: string;
  node?: ?CategoryMutationResponse_newEdge_node;
};
*/

/* eslint-disable comma-dangle, quotes */

/*
mutation CategoryMutation(
  $input: CategoryMutationInput!
) {
  CategoryMutation(input: $input) {
    newEdge {
      cursor
      node {
        id
        name
        order
      }
    }
    distroyedId
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
        "type": "CategoryMutationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CategoryMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "CategoryMutationInput!"
          }
        ],
        "concreteType": "CategoryMutationPayload",
        "name": "CategoryMutation",
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
  "name": "CategoryMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "CategoryMutationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "CategoryMutation",
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
            "type": "CategoryMutationInput!"
          }
        ],
        "concreteType": "CategoryMutationPayload",
        "name": "CategoryMutation",
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
  "text": "mutation CategoryMutation(\n  $input: CategoryMutationInput!\n) {\n  CategoryMutation(input: $input) {\n    newEdge {\n      cursor\n      node {\n        id\n        name\n        order\n      }\n    }\n    distroyedId\n    error\n  }\n}\n"
};

module.exports = batch;
