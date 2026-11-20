// npm run release – tags the current version (vX.Y.Z) and pushes commits and the tag.
// GitHub Actions (.github/workflows/release.yml) then builds and publishes the signed installer.
// Only run this when a release is wanted; bump the version in all three files first.
import { execFileSync } from "node:child_process";
import { readVersions } from "./versions.mjs";

const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit" });
const out = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }).trim();

const { version, errors } = readVersions();
if (errors.length) {
  for (const e of errors) console.error(`release: ${e}`);
  process.exit(1);
}
if (out("git", ["status", "--porcelain"])) {
  console.error("release: working tree is not clean – commit first");
  process.exit(1);
}
const branch = out("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") {
  console.error(`release: releases are made from main (current branch: ${branch})`);
  process.exit(1);
}
const tag = `v${version}`;
if (out("git", ["tag", "--list", tag])) {
  console.error(`release: tag ${tag} already exists – bump the version first`);
  process.exit(1);
}
run("git", ["tag", "-a", tag, "-m", `Release ${tag}`]);
run("git", ["push", "origin", "main", "--follow-tags"]);
console.log(`release: pushed ${tag}`);
