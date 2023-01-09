import packageJson from "../package.json";
import { readFile } from "node:fs/promises";
import { walk } from "./utils/walker";
import { parse, join } from "path";
import licenses from "./licenses.json";
import { asTree } from "treeify";
const [, , ...options] = process.argv;

if (options.length) {
  console.log(`ohno version ${packageJson.version}

Usage:
  npx ohno

Bugs:
  ${packageJson.bugs.url}`);
  process.exit(0);
}

(async () => {
  let packages = [];

  for await (const path of walk(join(process.cwd(), "node_modules"))) {
    const parsedPath = parse(path);
    if (parsedPath.name + parsedPath.ext === "package.json") {
      const projectPackageJson = JSON.parse(await readFile(path, "utf-8"));
      packages.push(projectPackageJson);
    }
  }

  packages = packages.map((x) => {
    const returns = {license: "UNKNOWN"};
    const license = licenses.find((y) => x.license === y["spdx-id"]);
    if (license) returns.license = license["spdx-id"];
    return [x.name + "@" + x.version, returns];
  });

  console.log(asTree(Object.fromEntries(packages), true, true));
})();
