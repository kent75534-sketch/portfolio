$path = 'index.html'
$encoding = new-object System.Text.UTF8Encoding $false
$html = [System.IO.File]::ReadAllText($path, $encoding)

# 1. Replace the base64 armor image block
$pattern1 = '(?s)    <!-- RIGHT: cinematic armor panel -->.*?  </section>'
$replacement1 = @'
    </div>
    
    <!-- RIGHT: Cinematic Humanoid Panel -->
    <div id="humanoid-container" class="hero-armor-panel">
      <div id="hologram-container"></div>
      
      <!-- Interactive HUD Overlays -->
      <div class="hud-corner tl"></div>
      <div class="hud-corner tr"></div>
      <div class="hud-corner bl"></div>
      <div class="hud-corner br"></div>

      <!-- Contextual data chips that will react to interaction -->
      <div class="hud-chip blue hud-chip-1" id="hud-status">SYS.ONLINE</div>
      <div class="hud-chip red hud-chip-2" id="hud-target">AWAITING_INPUT</div>
      <div class="hud-chip yellow hud-chip-3" id="hud-sync">SYNC: 100%</div>
      <div class="hud-chip blue hud-chip-4" id="hud-energy">ENERGY: STABLE</div>
      
      <!-- Targeting reticle -->
      <div class="armor-reticle" id="main-reticle"></div>
      <div class="armor-ring" id="outer-ring"></div>
    </div>
  </section>
'@
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $pattern1, $replacement1)

# 2. Replace the initHologram function using a wildcard for the dashed line characters
$pattern2 = '(?s)    // .{1,10} 3D CINEMATIC HOLOGRAM .{1,10}\r?\n.*?\}\)\(\);'
$js = [System.IO.File]::ReadAllText('humanoid_script.js', $encoding)
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $pattern2, $js)

[System.IO.File]::WriteAllText($path, $html, $encoding)
Write-Output "Successfully processed index.html ASCII only!"
