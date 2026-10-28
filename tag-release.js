import fs from 'node:fs';
import { execSync } from 'node:child_process';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const version = 'v' + packageJson.version;

console.log(`Creating tag for version ${version}...`);

try {
  execSync(`git tag ${version}`, { stdio: 'inherit' });
  console.log('Pushing commits and tags to origin...');
  execSync('git push origin main --tags', { stdio: 'inherit' });
  console.log(`Successfully pushed ${version} to GitHub. This should trigger the release action.`);
} catch (error) {
  console.error('Failed to create or push tag:', error.message);
  process.exit(1);
}
