import React from "react";
const { graphql, QueryRenderer } = require("react-relay");
import { environment as RelayEnvironment } from "../../config/Environment";
import Container from "./Drafts";
import { EmptyListLoading } from "../Loading";

export default _props => {
  return (
    <QueryRenderer
      query={graphql`
        query DraftsPageQuery($count:Int, $cursor: String, $conditions: ArticleFilters, $sorters: [QuerySorter]) {
          viewer {
              ...Drafts_viewer
          }
        }
      `}
      variables={{
        count: 10,
        conditions: {
          submit: false
        },
        sorters: [
          {
            order: "createdAt",
            dir: "DESC"
          }
        ]
      }}
      environment={RelayEnvironment.current}
      render={({ error, props, rest }) => {
        if (props) {
          return <Container {..._props} viewer={props.viewer} />;
        } else {
          return <EmptyListLoading style={{ height: "100%" }} />;
        }
      }}
    />
  );
};
