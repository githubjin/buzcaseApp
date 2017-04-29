import { graphql } from "react-relay";

module.exports = {
  name: "MarriageMutation",
  conn: "Filters_marriages",
  m: graphql`
    mutation MarriageMutation($input: MarriageMutationInput!){ 
        MarriageMutation(input: $input) {
            newEdge{
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
`
};
