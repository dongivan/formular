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

export function findByClass<
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Object,
  R extends Record<string, unknown> | string
>(t: T, map: Record<string, R | (() => R) | undefined>): R | undefined {
  let cls = t.constructor;
  do {
    const template: R | (() => R) | undefined = map[cls.name];
    if (typeof template == "function") {
      return template();
    } else if (template !== undefined) {
      return template;
    }
    cls = Object.getPrototypeOf(cls);
  } while (cls.name !== "");
  return undefined;
}
