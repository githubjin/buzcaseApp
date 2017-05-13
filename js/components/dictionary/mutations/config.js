// @flow

export function getAddconfigs(type: string, viewerId: string) {
  var prefix = `code("${type}").count(100)`;
  var rangeBehaviors = { "": "ignore" };
  rangeBehaviors[prefix] = "append";
  return [
    {
      type: "RANGE_ADD",
      parentName: "viewer",
      parentID: viewerId,
      connectionName: "dic",
      edgeName: "newEdge",
      rangeBehaviors: (ast: any) => {
        // console.log("astastastastastast", ast);
        if (ast.code === type) {
          return "append";
        } else {
          return "ignore";
        }
      }
    }
  ];
}

export function getSubConfig(viewerId: string) {
  return [
    {
      type: "NODE_DELETE",
      parentName: "viewer",
      parentID: viewerId,
      connectionName: "dic",
      deletedIDFieldName: "distroyedId"
    }
  ];
}

export function getOptimisticResponse(user: Object, { id, name, order }) {
  if (!id) {
    return {
      newEdge: {
        node: {
          name,
          order
        }
      }
    };
  }
  return {
    distroyedId: id
  };
}
