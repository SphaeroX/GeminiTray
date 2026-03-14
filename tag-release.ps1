# tag-release.ps1
$packageJson = Get-Content -Raw package.json | ConvertFrom-Json
$version = "v" + $packageJson.version

Write-Host "Creating tag for version $version..." -ForegroundColor Cyan

# Create the tag
git tag $version

if ($LASTEXITCODE -eq 0) {
    Write-Host "Pushing commits and tags to origin..." -ForegroundColor Cyan
    git push origin main --tags
    Write-Host "Successfully pushed $version to GitHub. This should trigger the release action." -ForegroundColor Green
} else {
    Write-Host "Failed to create tag. It might already exist." -ForegroundColor Red
}
