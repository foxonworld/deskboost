$WEB_URL = "https://www.deskboost.io.vn"
$API_URL = "https://deskboost.onrender.com/api"
$API_ORIGIN = "https://deskboost.onrender.com"

function Invoke-Smoke {
  param(
    [string]$Name,
    [string]$Uri,
    [string]$Method = "GET",
    [hashtable]$Headers = @{}
  )

  try {
    $res = Invoke-WebRequest -UseBasicParsing -Uri $Uri -Method $Method -Headers $Headers -MaximumRedirection 5 -ErrorAction Stop

    [pscustomobject]@{
      Name = $Name
      Uri = $Uri
      StatusCode = [int]$res.StatusCode
      ContentLength = if ($res.Content) { $res.Content.Length } else { 0 }
      Result = "OK"
    }
  } catch {
    $statusCode = $null
    $res = "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
      $statusCode = [int]$_.Exception.Response.StatusCode
      $res = "HTTP " + $statusCode
    }

    [pscustomobject]@{
      Name = $Name
      Uri = $Uri
      StatusCode = $statusCode
      ContentLength = 0
      Result = $res
    }
  }
}

$results = @()

$results += Invoke-Smoke -Name "FE home" -Uri $WEB_URL
$results += Invoke-Smoke -Name "FE privacy" -Uri "$WEB_URL/privacy"
$results += Invoke-Smoke -Name "FE account deletion" -Uri "$WEB_URL/account-deletion"
$results += Invoke-Smoke -Name "FE login" -Uri "$WEB_URL/login"
$results += Invoke-Smoke -Name "FE register" -Uri "$WEB_URL/register"

$results += Invoke-Smoke -Name "API auth me unauth" -Uri "$API_URL/auth/me"
$results += Invoke-Smoke -Name "Swagger root" -Uri "$API_ORIGIN/swagger"
$results += Invoke-Smoke -Name "Swagger index" -Uri "$API_ORIGIN/swagger/index.html"
$results += Invoke-Smoke -Name "Debug Gemini removed" -Uri "$API_URL/test-gemini"
$results += Invoke-Smoke -Name "Debug PlantId removed" -Uri "$API_URL/test-plantid"

try {
  $cors = Invoke-WebRequest -UseBasicParsing -Uri "$API_URL/auth/me" -Method OPTIONS -Headers @{ "Origin" = $WEB_URL; "Access-Control-Request-Method" = "GET" } -ErrorAction Stop

  $results += [pscustomobject]@{
    Name = "CORS preflight auth/me"
    StatusCode = [int]$cors.StatusCode
    ContentLength = 0
    Result = "AllowOrigin: " + $cors.Headers["Access-Control-Allow-Origin"] + " | Methods: " + $cors.Headers["Access-Control-Allow-Methods"]
  }
} catch {
  $statusCode = $null
  $allowOrigin = ""
  $allowMethods = ""
  $resStr = "ERROR: $($_.Exception.Message)"
  
  if ($_.Exception.Response) {
    $statusCode = [int]$_.Exception.Response.StatusCode
    $resStr = "HTTP " + $statusCode
    $headers = $_.Exception.Response.Headers
    $allowOrigin = $headers["Access-Control-Allow-Origin"]
    $allowMethods = $headers["Access-Control-Allow-Methods"]
    if ($allowOrigin) {
        $resStr += " | AllowOrigin: $allowOrigin | AllowMethods: $allowMethods"
    }
  }

  $results += [pscustomobject]@{
    Name = "CORS preflight auth/me"
    StatusCode = $statusCode
    ContentLength = 0
    Result = $resStr
  }
}

$results | Format-Table -AutoSize
