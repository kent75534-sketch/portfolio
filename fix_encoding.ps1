$path = 'index.html'
$encoding = new-object System.Text.UTF8Encoding $false
$html = [System.IO.File]::ReadAllText($path, $encoding)

$html = $html.Replace('Ã¢â‚¬â€ ', '—')
$html = $html.Replace('Ã¢â€šÂ¹', '₹')
$html = $html.Replace('Ã©', 'é')
$html = $html.Replace('Â·', '·')
$html = $html.Replace('Ã¢â‚¬â„¢', "'")
$html = $html.Replace('Ã¢â‚¬Å“', '"')
$html = $html.Replace('Ã¢â‚¬Â ', '"')

[System.IO.File]::WriteAllText($path, $html, $encoding)
Write-Output "Successfully fixed encoding glitches in index.html"
