param(
    [string]$BaseUrl = $env:BASE_URL
)

if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
    $BaseUrl = "http://localhost:5272"
}

$BaseUrl = $BaseUrl.TrimEnd("/")
$defaultPassword = "SmokeTest!2026"
$email = $env:SMOKE_EMAIL
$password = $env:SMOKE_PASSWORD
$usingProvidedUser = -not [string]::IsNullOrWhiteSpace($email)

if ([string]::IsNullOrWhiteSpace($email)) {
    $stamp = Get-Date -Format "yyyyMMddHHmmss"
    $email = "deskboost.smoke.$stamp@example.test"
}

if ([string]::IsNullOrWhiteSpace($password)) {
    $password = $defaultPassword
}

$results = New-Object System.Collections.Generic.List[object]
$accessToken = $null
$createdPlantId = $null
$createdReminderId = $null

function ConvertTo-JsonBody {
    param([object]$Body)

    if ($null -eq $Body) {
        return $null
    }

    return ($Body | ConvertTo-Json -Depth 20)
}

function Read-ErrorBody {
    param([object]$Exception)

    try {
        $response = $Exception.Response
        if ($null -eq $response) {
            return $Exception.Message
        }

        $stream = $response.GetResponseStream()
        if ($null -eq $stream) {
            return $Exception.Message
        }

        $reader = New-Object System.IO.StreamReader($stream)
        return $reader.ReadToEnd()
    }
    catch {
        return $Exception.Message
    }
}

function Add-Result {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [int]$Status,
        [bool]$Passed,
        [string]$Note
    )

    $script:results.Add([pscustomobject]@{
        Name = $Name
        Method = $Method
        Path = $Path
        Status = $Status
        Passed = $Passed
        Note = $Note
    }) | Out-Null
}

function Invoke-SmokeRequest {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [object]$Body = $null,
        [string]$Token = $null,
        [int[]]$ExpectedStatus = @(200),
        [string]$Accept = "application/json"
    )

    $uri = "$script:BaseUrl$Path"
    $headers = @{ Accept = $Accept }
    if (-not [string]::IsNullOrWhiteSpace($Token)) {
        $headers.Authorization = "Bearer $Token"
    }

    $json = ConvertTo-JsonBody $Body
    try {
        if ($null -ne $json) {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -ContentType "application/json" -Body $json -UseBasicParsing
        }
        else {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -UseBasicParsing
        }

        $status = [int]$response.StatusCode
        $passed = $ExpectedStatus -contains $status
        $note = if ($passed) { "OK" } else { "Unexpected status" }
        Add-Result -Name $Name -Method $Method -Path $Path -Status $status -Passed $passed -Note $note

        $parsed = $null
        if (-not [string]::IsNullOrWhiteSpace($response.Content) -and ($response.Headers["Content-Type"] -like "*json*")) {
            $parsed = $response.Content | ConvertFrom-Json
        }

        return [pscustomobject]@{
            Ok = $passed
            Status = $status
            Body = $parsed
            Raw = $response.Content
            Headers = $response.Headers
        }
    }
    catch {
        $status = 0
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $status = [int]$_.Exception.Response.StatusCode
        }

        $passed = $ExpectedStatus -contains $status
        $body = Read-ErrorBody $_.Exception
        $note = if ($passed) { "Expected failure" } else { $body }
        Add-Result -Name $Name -Method $Method -Path $Path -Status $status -Passed $passed -Note $note

        return [pscustomobject]@{
            Ok = $passed
            Status = $status
            Body = $null
            Raw = $body
            Headers = $null
        }
    }
}

Write-Host "DeskBoost API smoke test"
Write-Host "BASE_URL=$BaseUrl"
Write-Host "SMOKE_EMAIL=$email"

$swagger = Invoke-SmokeRequest -Name "Swagger JSON" -Method "GET" -Path "/swagger/v1/swagger.json" -ExpectedStatus @(200)

if ($usingProvidedUser) {
    $login = Invoke-SmokeRequest -Name "Auth login" -Method "POST" -Path "/api/auth/login" -Body @{
        email = $email
        password = $password
    } -ExpectedStatus @(200)
}
else {
    $register = Invoke-SmokeRequest -Name "Auth register" -Method "POST" -Path "/api/auth/register" -Body @{
        email = $email
        password = $password
        confirmPassword = $password
        fullName = "DeskBoost Smoke Tester"
    } -ExpectedStatus @(201)

    if ($register.Body -and $register.Body.accessToken) {
        $login = $register
    }
    else {
        $login = Invoke-SmokeRequest -Name "Auth login after register" -Method "POST" -Path "/api/auth/login" -Body @{
            email = $email
            password = $password
        } -ExpectedStatus @(200)
    }
}

if ($login.Body -and $login.Body.accessToken) {
    $accessToken = $login.Body.accessToken
}

if ([string]::IsNullOrWhiteSpace($accessToken)) {
    Write-Host "Khong lay duoc accessToken, dung smoke test protected endpoints."
}
else {
    Invoke-SmokeRequest -Name "Auth me" -Method "GET" -Path "/api/auth/me" -Token $accessToken -ExpectedStatus @(200) | Out-Null
    Invoke-SmokeRequest -Name "Users me" -Method "GET" -Path "/api/users/me" -Token $accessToken -ExpectedStatus @(200) | Out-Null
}

$marketplace = Invoke-SmokeRequest -Name "Marketplace list" -Method "GET" -Path "/api/marketplace-plants?page=1&limit=12" -ExpectedStatus @(200)
if ($marketplace.Body -and $marketplace.Body.items -and $marketplace.Body.items.Count -gt 0) {
    $marketplaceId = $marketplace.Body.items[0].id
    Invoke-SmokeRequest -Name "Marketplace detail" -Method "GET" -Path "/api/marketplace-plants/$marketplaceId" -ExpectedStatus @(200) | Out-Null
}

if (-not [string]::IsNullOrWhiteSpace($accessToken)) {
    Invoke-SmokeRequest -Name "My plants list before" -Method "GET" -Path "/api/my-plants" -Token $accessToken -ExpectedStatus @(200) | Out-Null

    $plant = Invoke-SmokeRequest -Name "My plants create" -Method "POST" -Path "/api/my-plants" -Token $accessToken -Body @{
        name = "Smoke Pothos"
        species = "Epipremnum aureum"
        location = "Desk"
        imageUrl = $null
        notes = "Created by API smoke test"
    } -ExpectedStatus @(201)

    if ($plant.Body -and $plant.Body.id) {
        $createdPlantId = $plant.Body.id
        Invoke-SmokeRequest -Name "My plants detail" -Method "GET" -Path "/api/my-plants/$createdPlantId" -Token $accessToken -ExpectedStatus @(200) | Out-Null
        Invoke-SmokeRequest -Name "My plants update" -Method "PUT" -Path "/api/my-plants/$createdPlantId" -Token $accessToken -Body @{
            name = "Smoke Pothos Updated"
            species = "Epipremnum aureum"
            location = "Window"
            imageUrl = $null
            status = "healthy"
            notes = "Updated by API smoke test"
        } -ExpectedStatus @(200) | Out-Null
    }

    if ($createdPlantId) {
        $dueAt = (Get-Date).ToUniversalTime().AddDays(1).ToString("o")
        $reminder = Invoke-SmokeRequest -Name "Reminder create" -Method "POST" -Path "/api/reminders" -Token $accessToken -Body @{
            plantId = $createdPlantId
            title = "Water smoke plant"
            careType = "watering"
            dueAt = $dueAt
            repeatRule = "weekly"
            notes = "Created by API smoke test"
        } -ExpectedStatus @(201)

        if ($reminder.Body -and $reminder.Body.id) {
            $createdReminderId = $reminder.Body.id
            Invoke-SmokeRequest -Name "Reminders list" -Method "GET" -Path "/api/reminders" -Token $accessToken -ExpectedStatus @(200) | Out-Null
            Invoke-SmokeRequest -Name "Reminder update" -Method "PUT" -Path "/api/reminders/$createdReminderId" -Token $accessToken -Body @{
                title = "Water smoke plant updated"
                careType = "watering"
                dueAt = (Get-Date).ToUniversalTime().AddDays(2).ToString("o")
                repeatRule = "weekly"
                notes = "Updated by API smoke test"
            } -ExpectedStatus @(200) | Out-Null
            Invoke-SmokeRequest -Name "Reminder mark done" -Method "PUT" -Path "/api/reminders/$createdReminderId/done" -Token $accessToken -ExpectedStatus @(200) | Out-Null
            Invoke-SmokeRequest -Name "Reminder calendar json" -Method "GET" -Path "/api/reminders/$createdReminderId/calendar" -Token $accessToken -ExpectedStatus @(200) | Out-Null
            $ics = Invoke-SmokeRequest -Name "Reminder calendar ics" -Method "GET" -Path "/api/reminders/$createdReminderId/calendar?format=ics" -Token $accessToken -ExpectedStatus @(200) -Accept "text/calendar"
            if ($ics.Ok -and $ics.Raw -notlike "*BEGIN:VCALENDAR*") {
                Add-Result -Name "Reminder calendar ics content" -Method "GET" -Path "/api/reminders/$createdReminderId/calendar?format=ics" -Status $ics.Status -Passed $false -Note "Missing BEGIN:VCALENDAR"
            }
        }
    }

    Invoke-SmokeRequest -Name "Feedback create" -Method "POST" -Path "/api/feedback" -Token $accessToken -Body @{
        message = "Smoke test feedback"
        rating = 5
    } -ExpectedStatus @(201) | Out-Null

    Invoke-SmokeRequest -Name "Admin summary with user token" -Method "GET" -Path "/api/admin/summary" -Token $accessToken -ExpectedStatus @(401, 403) | Out-Null

    if (-not [string]::IsNullOrWhiteSpace($env:ADMIN_ACCESS_TOKEN)) {
        Invoke-SmokeRequest -Name "Admin summary with admin token" -Method "GET" -Path "/api/admin/summary" -Token $env:ADMIN_ACCESS_TOKEN -ExpectedStatus @(200) | Out-Null
        Invoke-SmokeRequest -Name "Admin users with admin token" -Method "GET" -Path "/api/admin/users" -Token $env:ADMIN_ACCESS_TOKEN -ExpectedStatus @(200) | Out-Null
        Invoke-SmokeRequest -Name "Admin ai config with admin token" -Method "GET" -Path "/api/admin/ai-config/status" -Token $env:ADMIN_ACCESS_TOKEN -ExpectedStatus @(200) | Out-Null
    }

    if ($createdReminderId) {
        Invoke-SmokeRequest -Name "Reminder cleanup delete" -Method "DELETE" -Path "/api/reminders/$createdReminderId" -Token $accessToken -ExpectedStatus @(204, 404) | Out-Null
    }

    if ($createdPlantId) {
        Invoke-SmokeRequest -Name "My plants cleanup delete" -Method "DELETE" -Path "/api/my-plants/$createdPlantId" -Token $accessToken -ExpectedStatus @(204, 404) | Out-Null
    }
}

$pass = @($results | Where-Object { $_.Passed }).Count
$fail = @($results | Where-Object { -not $_.Passed }).Count

Write-Host ""
Write-Host "Summary: PASS=$pass FAIL=$fail"
foreach ($result in $results) {
    $label = if ($result.Passed) { "PASS" } else { "FAIL" }
    Write-Host ("[{0}] {1} {2} -> {3} {4}" -f $label, $result.Method, $result.Path, $result.Status, $result.Note)
}

if ($fail -gt 0) {
    exit 1
}
