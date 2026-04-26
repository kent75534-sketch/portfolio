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

# 2. Replace the initHologram function
$pattern2 = '(?s)    // ── 3D CINEMATIC HOLOGRAM ──.*?\}\)\(\);'
$js = [System.IO.File]::ReadAllText('humanoid_script.js', $encoding)
$html = [System.Text.RegularExpressions.Regex]::Replace($html, $pattern2, $js)

# 3. Add CSS for HUD Elements
$css = @'
    }

    /* ── HUD ELEMENTS ── */
    .hero-armor-panel {
      position: absolute;
      top: 0;
      right: 0;
      width: 50vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10;
    }

    #hologram-container {
      position: absolute;
      inset: 0;
    }

    .hud-chip {
      position: absolute;
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: .1em;
      padding: 4px 8px;
      background: rgba(0,0,0,0.5);
      border: 1px solid;
      backdrop-filter: blur(4px);
    }
    .hud-chip.blue { color: var(--cyan); border-color: var(--cyan); }
    .hud-chip.red { color: var(--neon-red); border-color: var(--neon-red); }
    .hud-chip.yellow { color: var(--neon-yellow); border-color: var(--neon-yellow); }

    .hud-chip-1 { top: 25%; left: 10%; }
    .hud-chip-2 { top: 35%; left: 15%; }
    .hud-chip-3 { top: 60%; right: 10%; }
    .hud-chip-4 { top: 70%; right: 15%; }

    .hud-corner {
      position: absolute; width: 20px; height: 20px;
      border: 2px solid var(--cyan); opacity: 0.5;
    }
    .hud-corner.tl { top: 15%; left: 5%; border-right: none; border-bottom: none; }
    .hud-corner.tr { top: 15%; right: 5%; border-left: none; border-bottom: none; }
    .hud-corner.bl { bottom: 15%; left: 5%; border-right: none; border-top: none; }
    .hud-corner.br { bottom: 15%; right: 5%; border-left: none; border-top: none; }

    .armor-reticle {
      position: absolute; top: 40%; left: 50%;
      width: 280px; height: 280px;
      transform: translate(-50%, -50%);
      border: 1px dashed rgba(0,217,255,0.15);
      border-radius: 50%;
      animation: spin 20s linear infinite;
    }
    .armor-ring {
      position: absolute; top: 40%; left: 50%;
      width: 320px; height: 320px;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(255,42,42,0.05);
      border-radius: 50%;
      animation: spin 30s linear infinite reverse;
    }
  </style>
'@
$html = $html.Replace("    }`n  </style>", $css)

# 4. Replace specific old text with new
$oldText1 = "<span>///</span> MBA Finance & Analytics · IIM Shillong · 2024–2026"
$oldText2 = "<span>///</span> MBA Finance & Analytics Â· IIM Shillong Â· 2024â€“2026"
$oldText3 = "<span>///</span> MBA Finance &amp; Analytics · IIM Shillong · 2024–2026"

$newText = "<span>///</span> MBA Finance & Analytics · IIM Shillong · 2024–2026"
$html = $html.Replace($oldText2, $newText).Replace($oldText3, $newText)

# Also fix the SR tags in the hero grid (we added them in the previous turn)
$gridOld = '    <div class="hero-grid">
      <div class="hero-grid-item">
        <div class="hg-num" data-target="5" data-suffix="K+ Cr" data-prefix="₹">₹0</div>
        <div class="hg-label">Portfolio Managed</div>
      </div>
      <div class="hero-grid-item">
        <div class="hg-num" data-target="30" data-suffix="+">0</div>
        <div class="hg-label">Financial Models</div>
      </div>
      <div class="hero-grid-item">
        <div class="hg-num" data-target-float="91.5" data-suffix="%">0%</div>
        <div class="hg-label">NISM Score</div>
      </div>
      <div class="hero-grid-item">
        <div class="hg-num" data-target="2">0</div>
        <div class="hg-label">Music Albums</div>
      </div>
    </div>'

$gridNew = '    <div class="hero-grid">
      <div class="hero-grid-item">
        <div class="hg-serial">[SR-001]</div>
        <div class="hg-num" data-target="5" data-suffix="K+ Cr" data-prefix="₹">₹0</div>
        <div class="hg-label">Portfolio Managed</div>
      </div>
      <div class="hero-grid-item">
        <div class="hg-serial">[SR-002]</div>
        <div class="hg-num" data-target="30" data-suffix="+">0</div>
        <div class="hg-label">Financial Models</div>
      </div>
      <div class="hero-grid-item">
        <div class="hg-serial">[SR-003]</div>
        <div class="hg-num" data-target-float="91.5" data-suffix="%">0%</div>
        <div class="hg-label">NISM Score</div>
      </div>
      <div class="hero-grid-item">
        <div class="hg-serial">[SR-004]</div>
        <div class="hg-num" data-target="2">0</div>
        <div class="hg-label">Music Albums</div>
      </div>
    </div>'
    
$html = $html.Replace($gridOld, $gridNew)

[System.IO.File]::WriteAllText($path, $html, $encoding)
Write-Output "Successfully processed index.html with all fixes!"
