/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule EditInit_article.graphql
 * @generated SignedSource<<b3e8c9f659b94c46f43fcf4df869887f>>
 * @flow
 * @nogrep
 */

'use strict';

/*::
import type {ConcreteFragment} from 'relay-runtime';
export type EditInit_article = {
  id: string;
  attachments?: ?Array<?string>;
  title?: ?string;
  categories?: ?Array<?string>;
  name?: ?string;
  education?: ?string;
  gender?: ?string;
  birthday?: ?number;
  homePlace?: ?EditInit_article_homePlace;
  jobs?: ?Array<?string>;
  marriage?: ?string;
  children?: ?string;
  events?: ?EditInit_article_events;
  knowledge?: ?string;
  notes?: ?EditInit_article_notes;
  createdAt?: ?any;
};

export type EditInit_article_homePlace = {
  province?: ?string;
  city?: ?string;
  area?: ?string;
};

export type EditInit_article_events_edges_node = {
  id: string;
  text?: ?string;
  createdAt?: ?any;
};

export type EditInit_article_events_edges = {
  node?: ?EditInit_article_events_edges_node;
};

export type EditInit_article_events = {
  edges?: ?Array<?EditInit_article_events_edges>;
};

export type EditInit_article_notes_edges_node = {
  id: string;
  text?: ?string;
  createdAt?: ?any;
};

export type EditInit_article_notes_edges = {
  node?: ?EditInit_article_notes_edges_node;
};

export type EditInit_article_notes = {
  edges?: ?Array<?EditInit_article_notes_edges>;
};
*/

/* eslint-disable comma-dangle, quotes */

const fragment /*: ConcreteFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "events"
        ]
      },
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "notes"
        ]
      }
    ]
  },
  "name": "EditInit_article",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "args": null,
      "concreteType": "HomePlace",
      "name": "homePlace",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "args": null,
          "name": "province",
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "args": null,
          "name": "city",
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "args": null,
          "name": "area",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
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
      "name": "title",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "categories",
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
      "name": "education",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "gender",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "birthday",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "attachments",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "jobs",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "marriage",
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "args": null,
      "name": "children",
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "events",
      "args": null,
      "concreteType": "EventConnection",
      "name": "__article_events_connection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "EventEdge",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "Event",
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
                  "name": "text",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "createdAt",
                  "storageKey": null
                }
              ],
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
      "name": "knowledge",
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "notes",
      "args": null,
      "concreteType": "NoteConnection",
      "name": "__article_notes_connection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "args": null,
          "concreteType": "NoteEdge",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "args": null,
              "concreteType": "Note",
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
                  "name": "text",
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "args": null,
                  "name": "createdAt",
                  "storageKey": null
                }
              ],
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
      "name": "createdAt",
      "storageKey": null
    }
  ],
  "type": "Article"
};

module.exports = fragment;