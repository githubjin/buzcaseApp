import { graphql } from "react-relay";

module.exports = {
  name: "CategoryMutation",
  conn: "Filters_categories",
  m: graphql`
    mutation CategoryMutation($input: CategoryMutationInput!){ 
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
`
};
