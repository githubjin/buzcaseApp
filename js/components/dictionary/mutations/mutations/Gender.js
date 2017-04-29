import { graphql } from "react-relay";

module.exports = {
  name: "GenderMutation",
  conn: "Filters_genders",
  m: graphql`
    mutation GenderMutation($input: GenderMutationInput!){ 
        GenderMutation(input: $input) {
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
