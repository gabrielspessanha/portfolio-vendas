param(
  [Parameter(Mandatory=$true)][string]$InRoot,
  [Parameter(Mandatory=$true)][string]$OutRoot,
  [int]$MaxEdge = 1400,
  [int]$Quality = 80,
  [string[]]$Only = @()   # se preenchido, processa apenas estes nomes (basename)
)

Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

$files = Get-ChildItem -Path $InRoot -Recurse -File -Include *.jpg,*.jpeg
if ($Only.Count -gt 0) { $files = $files | Where-Object { $Only -contains $_.Name } }

$inTotal = 0L; $outTotal = 0L; $n = 0
foreach ($f in $files) {
  $rel = $f.FullName.Substring((Resolve-Path $InRoot).Path.Length).TrimStart('\','/')
  $dest = Join-Path $OutRoot $rel
  $destDir = Split-Path $dest -Parent
  if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }

  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $w = $img.Width; $h = $img.Height
  $scale = [Math]::Min(1.0, $MaxEdge / [Math]::Max($w, $h))
  $nw = [int][Math]::Round($w * $scale)
  $nh = [int][Math]::Round($h * $scale)

  $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $nw, $nh)

  $bmp.Save($dest, $jpegCodec, $encParams)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()

  $inSz = $f.Length; $outSz = (Get-Item $dest).Length
  $inTotal += $inSz; $outTotal += $outSz; $n++
  "{0,7:N0}KB -> {1,6:N0}KB  {2,4}x{3,-4} -> {4}x{5}  {6}" -f `
    ($inSz/1KB), ($outSz/1KB), $w, $h, $nw, $nh, $rel
}
""
"=== {0} arquivos | {1:N1} MB -> {2:N1} MB ({3:P0} do original) ===" -f `
  $n, ($inTotal/1MB), ($outTotal/1MB), ($outTotal/$inTotal)
