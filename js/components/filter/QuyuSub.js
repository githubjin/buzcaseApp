// @flow
import React, { PureComponent } from "react";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";

import { environment as RelayEnvironment } from "../../config/Environment";
import QuyuList from "./QuyuList";
import { EmptyListLoading } from "../Loading";

const Container = createFragmentContainer(QuyuList, {
  viewer: graphql`
    fragment QuyuSub_viewer on User {
       id,
       subQuyu(code: $code) @skip(if: $skip){
          id,
          name,
          code,
          isLeaf
        }
    }`
});

export default class ProvinceContainer extends PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    // console.log(this.props.code, nextProps.code);
    return this.props.code !== nextProps.code;
  }
  render() {
    const { code } = this.props;
    // console.log("QuyuSub render", code);
    // if (!code) {
    //   return null;
    // }
    return (
      <QueryRenderer
        environment={RelayEnvironment.current}
        query={graphql`
            query QuyuSubQuery($code: String, $skip: Boolean!) {
                viewer {
                  id,
                    ...QuyuSub_viewer
                }
            }`}
        variables={{
          code,
          skip: !code
        }}
        cacheConfig={{ force: false }}
        render={({ error, props, rest }) => {
          if (props) {
            return <Container {...this.props} viewer={props.viewer} />;
          } else {
            return <EmptyListLoading />;
          }
        }}
      />
    );
  }
}
