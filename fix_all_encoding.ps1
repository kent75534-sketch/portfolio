$file = "c:\Users\adity\Downloads\New folder\index.html"
$bytes = [System.IO.File]::ReadAllBytes($file)
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

# === HTML entity replacements for text content ===
$text = $text.Replace([string][char]0x00B7, '&middot;')
$text = $text.Replace([string][char]0x2013, '&ndash;')
$text = $text.Replace([string][char]0x2014, '&mdash;')
$text = $text.Replace([string][char]0x20B9, '&#8377;')
$text = $text.Replace([string][char]0x00A9, '&copy;')

# === CSS content property replacements ===
$text = $text.Replace("content: '$([char]0x25B8)'", "content: '\25B8'")
$text = $text.Replace("content: '$([char]0x25C6)'", "content: '\25C6'")

# === Replace remaining geometric/symbol chars in HTML ===
$text = $text.Replace([string][char]0x25B2, '&#9650;')
$text = $text.Replace([string][char]0x25B6, '&#9654;')
$text = $text.Replace([string][char]0x25B8, '&#9656;')
$text = $text.Replace([string][char]0x25C6, '&#9670;')
$text = $text.Replace([string][char]0x25C8, '&#9672;')
$text = $text.Replace([string][char]0x2B21, '&#11041;')
$text = $text.Replace([string][char]0x2500, '-')

# === Remove variation selectors ===
$text = $text.Replace([string][char]0xFE0F, '')

# === Emoji replacements (surrogate pairs to HTML entities) ===
function Replace-Emoji($t, $hi, $lo, $cp) {
    $surr = [string][char]$hi + [string][char]$lo
    return $t.Replace($surr, "&#$cp;")
}

$text = Replace-Emoji $text 0xD83C 0xDFDB 127963
$text = Replace-Emoji $text 0xD83D 0xDCCA 128202
$text = Replace-Emoji $text 0xD83C 0xDFB5 127925
$text = Replace-Emoji $text 0xD83E 0xDD16 129302
$text = Replace-Emoji $text 0xD83C 0xDFE6 127974
$text = Replace-Emoji $text 0xD83C 0xDF10 127760
$text = Replace-Emoji $text 0xD83D 0xDCCD 128205
$text = Replace-Emoji $text 0xD83C 0xDFC6 127942
$text = Replace-Emoji $text 0xD83D 0xDCC8 128200
$text = Replace-Emoji $text 0xD83D 0xDCDC 128220
$text = Replace-Emoji $text 0xD83D 0xDDC4 128452
$text = Replace-Emoji $text 0xD83D 0xDC0D 128013
$text = Replace-Emoji $text 0xD83D 0xDCB0 128176
$text = Replace-Emoji $text 0xD83C 0xDF0F 127759
$text = Replace-Emoji $text 0xD83D 0xDCF0 128240

# Save as UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($file, $text, $utf8NoBom)

Write-Host "Done! All non-ASCII characters replaced with HTML entities."
$newBytes = [System.IO.File]::ReadAllBytes($file)
$newText = [System.Text.Encoding]::UTF8.GetString($newBytes)
$remaining = [regex]::Matches($newText, '[^\x00-\x7F]')
Write-Host "Remaining non-ASCII chars: $($remaining.Count)"
