export function replace(
  template: string,
  data: string[] | Record<string, string> | string
): string {
  let result = template;
  if (Array.isArray(data)) {
    Object.keys(data).forEach((key) => {
      result = result.replace(new RegExp(`<${key}>`, "g"), data[parseInt(key)]);
    });
  } else if (typeof data == "string") {
    result = result.replace(/<0>/g, data);
  } else {
    Object.keys(data).forEach((key) => {
      result = result.replace(new RegExp(`<${key}>`, "g"), data[key]);
    });
  }
  return result;
}
