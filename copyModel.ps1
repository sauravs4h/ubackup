# Get the current directory as the root directory
$rootDirectory = Get-Location

# Define the models directory
$modelsDirectory = Join-Path -Path $rootDirectory -ChildPath "models"

# Define the user payment service directory
$userPaymentServiceDirectory = Join-Path -Path $rootDirectory -ChildPath "user-payment-service"

# Get all subdirectories in the root directory
$subDirectories = Get-ChildItem -Path $rootDirectory -Directory | Where-Object { $_.FullName -ne $modelsDirectory -and $_.FullName -ne $userPaymentServiceDirectory }

# Loop through each subdirectory
foreach ($subDirectory in $subDirectories) {
    # Define the path to the models directory in the current subdirectory
    $subModelsDirectory = Join-Path -Path $subDirectory.FullName -ChildPath "models"

    # Check if the models directory exists in the current subdirectory
    if (Test-Path -Path $subModelsDirectory) {
        # Delete the existing models directory
        Remove-Item -Path $subModelsDirectory -Recurse -Force
    }

    # Copy the models directory from the root directory to the current subdirectory
    Copy-Item -Path $modelsDirectory -Destination $subModelsDirectory -Recurse
}