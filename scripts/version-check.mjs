// npm run version:check – fails when the three version fields disagree.
import { readVersions } from "./versions.mjs";

const { version, errors } = readVersions();
if (errors.length) {
  for (const e of errors) console.error(`version-check: ${e}`);
  process.exit(1);
}
console.log(`version-check: ${version} ✓`);
