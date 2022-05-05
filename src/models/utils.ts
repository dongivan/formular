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

export async function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = src;

    const el = document.getElementsByTagName("script")[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    el.parentNode!.insertBefore(script, el);

    script.addEventListener("load", () => {
      resolve();
    });

    script.addEventListener("error", () => {
      reject(new Error(`${src} failed to load.`));
    });
  });
}
