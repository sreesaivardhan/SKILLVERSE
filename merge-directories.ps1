# PowerShell script to merge frontend/src and src directories
# This script will:
# 1. Compare files in both directories
# 2. Merge functionality where duplicated
# 3. Create backups before making changes

# Set paths
$mainSrcPath = "D:\SKILLVERSE\src"
$frontendSrcPath = "D:\SKILLVERSE\frontend\src"
$backupPath = "D:\SKILLVERSE\backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Create backup directory
New-Item -Path $backupPath -ItemType Directory -Force | Out-Null
Write-Host "Created backup directory: $backupPath" -ForegroundColor Cyan

# Backup both directories
Write-Host "Backing up main src directory..." -ForegroundColor Cyan
Copy-Item -Path $mainSrcPath -Destination "$backupPath\src" -Recurse -Force

Write-Host "Backing up frontend src directory..." -ForegroundColor Cyan
Copy-Item -Path $frontendSrcPath -Destination "$backupPath\frontend_src" -Recurse -Force

# Function to get all files in a directory recursively
function Get-AllFiles {
    param (
        [string]$directory
    )
    
    return Get-ChildItem -Path $directory -Recurse -File | Select-Object -ExpandProperty FullName
}

# Get all files from both directories
$mainFiles = Get-AllFiles -directory $mainSrcPath
$frontendFiles = Get-AllFiles -directory $frontendSrcPath

# Convert to relative paths for comparison
$mainRelativeFiles = $mainFiles | ForEach-Object { $_.Replace("$mainSrcPath\", "") }
$frontendRelativeFiles = $frontendFiles | ForEach-Object { $_.Replace("$frontendSrcPath\", "") }

# Find files that exist in both directories
$commonFiles = $mainRelativeFiles | Where-Object { $frontendRelativeFiles -contains $_ }
Write-Host "Found $($commonFiles.Count) files that exist in both directories" -ForegroundColor Yellow

# Find files unique to frontend/src
$uniqueToFrontend = $frontendRelativeFiles | Where-Object { $mainRelativeFiles -notcontains $_ }
Write-Host "Found $($uniqueToFrontend.Count) files unique to frontend/src" -ForegroundColor Green

# Find files unique to main src
$uniqueToMain = $mainRelativeFiles | Where-Object { $frontendRelativeFiles -notcontains $_ }
Write-Host "Found $($uniqueToMain.Count) files unique to main src" -ForegroundColor Green

# Function to merge Redux slices
function Merge-ReduxSlices {
    param (
        [string]$mainFile,
        [string]$frontendFile,
        [string]$outputFile
    )
    
    Write-Host "Merging Redux slice: $outputFile" -ForegroundColor Magenta
    
    # Read both files
    $mainContent = Get-Content -Path $mainFile -Raw
    $frontendContent = Get-Content -Path $frontendFile -Raw
    
    # For Redux slices, we'll keep the main src version but ensure imports are correct
    $mergedContent = $mainContent
    
    # Check if frontend uses axiosInstance and main uses axios
    if ($frontendContent -match "import axiosInstance from" -and $mainContent -match "import axios from") {
        $mergedContent = $mergedContent -replace "import axios from '([^']+)';", "import axiosInstance from '@/lib/api/axios';"
        $mergedContent = $mergedContent -replace "await axios\.", "await axiosInstance."
    }
    
    # Write the merged content
    Set-Content -Path $outputFile -Value $mergedContent
}

# Function to merge component files
function Merge-ComponentFiles {
    param (
        [string]$mainFile,
        [string]$frontendFile,
        [string]$outputFile
    )
    
    Write-Host "Merging component: $outputFile" -ForegroundColor Magenta
    
    # Read both files
    $mainContent = Get-Content -Path $mainFile -Raw
    $frontendContent = Get-Content -Path $frontendFile -Raw
    
    # For components, we'll keep the enhanced version from main src
    # But we'll check if there are any unique imports or functions in the frontend version
    
    # Extract imports from both files
    $mainImports = [regex]::Matches($mainContent, "import .+ from '([^']+)';") | ForEach-Object { $_.Value }
    $frontendImports = [regex]::Matches($frontendContent, "import .+ from '([^']+)';") | ForEach-Object { $_.Value }
    
    # Find unique imports in frontend
    $uniqueImports = $frontendImports | Where-Object { $mainImports -notcontains $_ }
    
    if ($uniqueImports.Count -gt 0) {
        # Add unique imports to the main content
        $importSection = [regex]::Match($mainContent, "(import .+;(\r?\n|)+)+").Value
        $newImportSection = $importSection
        
        foreach ($import in $uniqueImports) {
            if (-not $newImportSection.Contains($import)) {
                $newImportSection += "`n$import"
            }
        }
        
        $mergedContent = $mainContent.Replace($importSection, $newImportSection)
    } else {
        $mergedContent = $mainContent
    }
    
    # Write the merged content
    Set-Content -Path $outputFile -Value $mergedContent
}

# Function to merge utility files
function Merge-UtilityFiles {
    param (
        [string]$mainFile,
        [string]$frontendFile,
        [string]$outputFile
    )
    
    Write-Host "Merging utility file: $outputFile" -ForegroundColor Magenta
    
    # Read both files
    $mainContent = Get-Content -Path $mainFile -Raw
    $frontendContent = Get-Content -Path $frontendFile -Raw
    
    # For utility files, we'll combine functions from both files
    
    # Extract function declarations from both files
    $mainFunctions = [regex]::Matches($mainContent, "export (const|function) ([a-zA-Z0-9_]+)") | ForEach-Object { $_.Groups[2].Value }
    $frontendFunctions = [regex]::Matches($frontendContent, "export (const|function) ([a-zA-Z0-9_]+)") | ForEach-Object { $_.Groups[2].Value }
    
    # Find unique functions in frontend
    $uniqueFunctions = $frontendFunctions | Where-Object { $mainFunctions -notcontains $_ }
    
    if ($uniqueFunctions.Count -gt 0) {
        $mergedContent = $mainContent
        
        foreach ($function in $uniqueFunctions) {
            # Extract the function definition from frontend
            $functionMatch = [regex]::Match($frontendContent, "(export (const|function) $function\s*=\s*[^;]+;)|(export (const|function) $function\s*\([^\)]*\)\s*{[^}]*})")
            
            if ($functionMatch.Success) {
                $functionDefinition = $functionMatch.Value
                $mergedContent += "`n`n$functionDefinition"
            }
        }
    } else {
        $mergedContent = $mainContent
    }
    
    # Write the merged content
    Set-Content -Path $outputFile -Value $mergedContent
}

# Process common files
foreach ($file in $commonFiles) {
    $mainFilePath = Join-Path -Path $mainSrcPath -ChildPath $file
    $frontendFilePath = Join-Path -Path $frontendSrcPath -ChildPath $file
    
    # Skip if files are identical
    $mainHash = Get-FileHash -Path $mainFilePath -Algorithm MD5
    $frontendHash = Get-FileHash -Path $frontendFilePath -Algorithm MD5
    
    if ($mainHash.Hash -eq $frontendHash.Hash) {
        Write-Host "Files are identical: $file" -ForegroundColor Gray
        continue
    }
    
    Write-Host "Processing file: $file" -ForegroundColor Yellow
    
    # Determine file type and merge accordingly
    if ($file -match "redux/slices/") {
        Merge-ReduxSlices -mainFile $mainFilePath -frontendFile $frontendFilePath -outputFile $mainFilePath
    }
    elseif ($file -match "components/") {
        Merge-ComponentFiles -mainFile $mainFilePath -frontendFile $frontendFilePath -outputFile $mainFilePath
    }
    elseif ($file -match "lib/") {
        Merge-UtilityFiles -mainFile $mainFilePath -frontendFile $frontendFilePath -outputFile $mainFilePath
    }
    else {
        # For other files, prompt the user
        Write-Host "Found different versions of: $file" -ForegroundColor Yellow
        Write-Host "1. Keep main src version" -ForegroundColor Cyan
        Write-Host "2. Use frontend src version" -ForegroundColor Cyan
        Write-Host "3. Skip this file" -ForegroundColor Cyan
        
        $choice = Read-Host "Enter your choice (1/2/3)"
        
        switch ($choice) {
            "1" { 
                Write-Host "Keeping main src version" -ForegroundColor Green
            }
            "2" { 
                Write-Host "Using frontend src version" -ForegroundColor Green
                Copy-Item -Path $frontendFilePath -Destination $mainFilePath -Force
            }
            "3" { 
                Write-Host "Skipping file" -ForegroundColor Gray
            }
            default {
                Write-Host "Invalid choice, keeping main src version" -ForegroundColor Yellow
            }
        }
    }
}

# Copy unique frontend files to main src
foreach ($file in $uniqueToFrontend) {
    $sourcePath = Join-Path -Path $frontendSrcPath -ChildPath $file
    $destinationPath = Join-Path -Path $mainSrcPath -ChildPath $file
    
    # Create directory if it doesn't exist
    $directory = Split-Path -Path $destinationPath -Parent
    if (-not (Test-Path -Path $directory)) {
        New-Item -Path $directory -ItemType Directory -Force | Out-Null
    }
    
    Write-Host "Copying unique file from frontend: $file" -ForegroundColor Green
    Copy-Item -Path $sourcePath -Destination $destinationPath -Force
}

Write-Host "Merge completed successfully!" -ForegroundColor Green
Write-Host "A backup of both directories was created at: $backupPath" -ForegroundColor Green
Write-Host "You can now safely remove the frontend/src directory if desired." -ForegroundColor Yellow
