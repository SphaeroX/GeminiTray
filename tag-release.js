import fs from 'node:fs';
import { execSync } from 'node:child_process';
if (process.platform === 'win32' && !process.env.PATH.includes('Git\\cmd')) {
  process.env.PATH += ';C:\\Program Files\\Git\\cmd';
}

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const version = 'v' + packageJson.version;

console.log(`Creating tag for version ${version}...`);

try {
  const existingTags = execSync('git tag', { encoding: 'utf-8' }).split('\n');
  if (!existingTags.includes(version)) {
    execSync(`git tag ${version}`, { stdio: 'inherit' });
  } else {
    console.log(`Tag ${version} already exists locally.`);
  }
  console.log('Pushing commits and tags to origin...');
  execSync('git push origin main --tags', { stdio: 'inherit' });
  console.log(`Successfully pushed ${version} to GitHub. This should trigger the release action.`);
} catch (error) {
  console.error('Failed to create or push tag:', error.message);
  process.exit(1);
}
