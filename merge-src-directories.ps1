# PowerShell script to merge frontend/src into the main src directory
# This script will:
# 1. Compare files in both directories
# 2. Copy any unique files from frontend/src to src
# 3. Create a backup of the frontend/src directory

# Set paths
$mainSrcPath = "D:\SKILLVERSE\src"
$frontendSrcPath = "D:\SKILLVERSE\frontend\src"
$backupPath = "D:\SKILLVERSE\frontend\src_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Create backup of frontend/src
Write-Host "Creating backup of frontend/src to $backupPath..." -ForegroundColor Cyan
Copy-Item -Path $frontendSrcPath -Destination $backupPath -Recurse -Force

# Function to compare and merge directories
function Merge-Directories {
    param (
        [string]$sourcePath,
        [string]$targetPath,
        [string]$relativePath = ""
    )

    # Get all items in source directory
    $sourceItems = Get-ChildItem -Path "$sourcePath\$relativePath" -ErrorAction SilentlyContinue

    foreach ($item in $sourceItems) {
        $relPath = if ($relativePath -eq "") { $item.Name } else { "$relativePath\$($item.Name)" }
        $targetItem = "$targetPath\$relPath"
        
        if ($item.PSIsContainer) {
            # If it's a directory, create it if it doesn't exist and recurse
            if (-not (Test-Path $targetItem)) {
                Write-Host "Creating directory: $targetItem" -ForegroundColor Green
                New-Item -Path $targetItem -ItemType Directory -Force | Out-Null
            }
            
            # Recurse into subdirectory
            Merge-Directories -sourcePath $sourcePath -targetPath $targetPath -relativePath $relPath
        }
        else {
            # If it's a file, check if it exists in target
            if (-not (Test-Path $targetItem)) {
                # File doesn't exist in target, copy it
                Write-Host "Copying new file: $relPath" -ForegroundColor Green
                Copy-Item -Path $item.FullName -Destination $targetItem -Force
            }
            else {
                # File exists in both directories, compare modification dates
                $sourceFile = Get-Item $item.FullName
                $targetFile = Get-Item $targetItem
                
                if ($sourceFile.LastWriteTime -gt $targetFile.LastWriteTime) {
                    # Source file is newer, ask user what to do
                    Write-Host "File exists in both directories: $relPath" -ForegroundColor Yellow
                    Write-Host "Source last modified: $($sourceFile.LastWriteTime)" -ForegroundColor Yellow
                    Write-Host "Target last modified: $($targetFile.LastWriteTime)" -ForegroundColor Yellow
                    
                    $choice = Read-Host "Do you want to (K)eep target file, (R)eplace with source file, or (S)kip? [K/R/S]"
                    
                    if ($choice -eq "R") {
                        Write-Host "Replacing file: $relPath" -ForegroundColor Magenta
                        Copy-Item -Path $item.FullName -Destination $targetItem -Force
                    }
                    elseif ($choice -eq "S") {
                        Write-Host "Skipping file: $relPath" -ForegroundColor Gray
                    }
                    else {
                        Write-Host "Keeping target file: $relPath" -ForegroundColor Blue
                    }
                }
                else {
                    Write-Host "Target file is newer or same age, keeping: $relPath" -ForegroundColor Gray
                }
            }
        }
    }
}

# Start the merge process
Write-Host "Starting merge process..." -ForegroundColor Cyan
Merge-Directories -sourcePath $frontendSrcPath -targetPath $mainSrcPath

Write-Host "Merge completed successfully!" -ForegroundColor Green
Write-Host "A backup of the frontend/src directory was created at: $backupPath" -ForegroundColor Green
Write-Host "You can now safely remove the frontend/src directory if desired." -ForegroundColor Yellow
