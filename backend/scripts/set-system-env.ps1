# Must be run as Administrator
param(
    [string]$Environment = "development"
)

function Set-EnvironmentVariable {
    param(
        [string]$Name,
        [string]$Value
    )
    [System.Environment]::SetEnvironmentVariable($Name, $Value, 'Machine')
    Write-Host "Set $Name environment variable"
}

# Load the appropriate .env file
$envFile = ".env"
if ($Environment -eq "test") {
    $envFile = ".env.test"
} elseif ($Environment -eq "production") {
    $envFile = ".env.production"
}

# Read environment variables from file
$envContent = Get-Content (Join-Path $PSScriptRoot ".." $envFile)

# Set each environment variable
foreach ($line in $envContent) {
    if ($line -and !$line.StartsWith("#")) {
        $parts = $line.Split('=', 2)
        if ($parts.Length -eq 2) {
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            Set-EnvironmentVariable -Name $name -Value $value
        }
    }
}

Write-Host "`nEnvironment variables set for $Environment environment"
Write-Host "Please restart any applications that need to use these variables"
