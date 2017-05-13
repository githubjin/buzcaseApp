/* @flow */

export function convertErrorToMessage(error: string): string {
  console.log("convertErrorToMessage error is : -------- : ", error);
  let obj;
  try {
    obj = JSON.parse(error);
  } catch (error) {
    obj = { code: -1, message: "注册时响应异常" };
  }
  let { code, message } = obj;
  switch (code) {
    case 101:
      text = "用户名或密码错误";
      break;
    case 125:
      text = "邮箱格式错误";
      break;
    case 201:
      text = "密码不能为空！";
      break;
    case 202:
      text = "该用户名已被使用！";
      break;
    case 203:
      text = "该邮箱已被使用！";
      break;
    default:
      text = message;
  }
  return text;
}
