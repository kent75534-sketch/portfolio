$path = 'index.html'
$garbledText = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$originalBytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($garbledText)
$fixedText = [System.Text.Encoding]::UTF8.GetString($originalBytes)
[System.IO.File]::WriteAllText('index_fixed.html', $fixedText, [System.Text.Encoding]::UTF8)
Write-Output "Successfully ran reversal."
