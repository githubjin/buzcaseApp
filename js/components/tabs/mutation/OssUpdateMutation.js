/**
 * aliyun oss sts update
 */
import { commitMutation, graphql } from "react-relay";
import { saveOssStsToLocalstorage } from "../../utils";

export function updateOssSts(
  environment: Object,
  onComplete: (response: Object) => void = () => {}
): void {
  return commitMutation(environment, {
    mutation: graphql`
            mutation OssUpdateMutation($input: ossStsUpdateInput!) {
                ossStsUpdate(input: $input) {
                    ossToken {
                        dir
                        Expiration
                        AccessKeySecret
                        SecurityToken
                        AccessKeyId
                    }
                }
            }
        `,
    variables: {
      input: {}
    },
    onCompleted: response => {
      if (response.ossStsUpdate && response.ossStsUpdate.ossToken) {
        if (response.ossStsUpdate.ossToken.dir) {
          saveOssStsToLocalstorage(response.ossStsUpdate.ossToken);
          return onComplete(response.ossStsUpdate.ossToken);
        }
      }
      onComplete(null);
    }
  });
}
