$res = Invoke-WebRequest -UseBasicParsing -Uri "https://deskboost.onrender.com/api/auth/me" -Method OPTIONS -Headers @{ "Origin" = "https://www.deskboost.io.vn"; "Access-Control-Request-Method" = "GET" }
$res.Headers | Format-List
