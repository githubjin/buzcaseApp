import { graphql } from "react-relay";

module.exports = {
  name: "EducationMutation",
  conn: "Filters_educations",
  m: graphql`
    mutation EducationMutation($input: EducationMutationInput!){ 
        EducationMutation(input: $input) {
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
`
};
