$text = "Ã°Å¸Â â€º IIM Shillong"
$garbledBytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($text)
$restoredText = [System.Text.Encoding]::UTF8.GetString($garbledBytes)
Write-Output $restoredText
