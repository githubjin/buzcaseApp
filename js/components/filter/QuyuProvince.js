// @flow
import React, { PureComponent } from "react";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";

import { environment as RelayEnvironment } from "../../config/Environment";
import QuyuList from "./QuyuList";
import { EmptyListLoading } from "../Loading";

const Container = createFragmentContainer(QuyuList, {
  viewer: graphql`
    fragment QuyuProvince_viewer on User {
        id,
        provinces(first: 50) {
            edges {
                node {
                    id,
                    name,
                    code,
                    isLeaf
                }
            }
        }
    }`
});

export default class ProvinceContainer extends PureComponent {
  props: {
    selected?: string
  };
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.selected !== nextProps.selected;
    // return false;
  }
  render() {
    // console.log("render", "-=-12301=-23=12-301=-301=-203=1-230");
    return (
      <QueryRenderer
        environment={RelayEnvironment.current}
        query={graphql`
            query QuyuProvinceQuery {
                viewer {
                  id,
                    ...QuyuProvince_viewer
                }
            }`}
        render={({ error, props, rest }) => {
          if (props) {
            return <Container {...this.props} viewer={props.viewer} />;
          } else {
            return <EmptyListLoading style={{ height: "100%" }} />;
          }
        }}
      />
    );
  }
}
