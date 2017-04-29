// @flow
import genderMutation from "./Gender";
import categoryMutation from "./Category";
import educationMutation from "./Education";
import marriageMutation from "./Marriage";
import jobMutation from "./Job";

export function getMutation(type: string) {
  switch (type) {
    case "Gender":
      return genderMutation;
    case "Category":
      return categoryMutation;
    case "Education":
      return educationMutation;
    case "Marriage":
      return marriageMutation;
    case "Job":
      return jobMutation;
    default:
      return null;
  }
}
