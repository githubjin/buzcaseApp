import { graphql } from "react-relay";

module.exports = {
  name: "JobMutation",
  conn: "Filters_jobs",
  m: graphql`
    mutation JobMutation($input: JobMutationInput!){ 
        JobMutation(input: $input) {
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
