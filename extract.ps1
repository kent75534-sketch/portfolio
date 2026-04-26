$text = [System.IO.File]::ReadAllText('index_fixed.html', [System.Text.Encoding]::UTF8)
$match = [System.Text.RegularExpressions.Regex]::Match($text, '(?s)    // ── 3D CINEMATIC HOLOGRAM ──.*?\}\)\(\);')
if ($match.Success) {
    [System.IO.File]::WriteAllText('humanoid_script.js', $match.Value, [System.Text.Encoding]::UTF8)
    Write-Output "Extracted!"
}
