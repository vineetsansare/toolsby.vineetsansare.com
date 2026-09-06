export interface FrameOptions {
  arcText: string;
  arcColor: string;
  textColor: string;
  badgeStyle: 'solid' | 'gradient' | 'outline';
  gradientPreset?: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  borderWidth: number;
  borderColor: string;
  showOuterRing: boolean;
}

export const PRESET_BADGES = [
  '#OPENTOWORK',
  '#HIRING',
  '#AIENTHUSIAST',
  '#BUILDINGINPUBLIC',
  '#AVAILABLE',
  '#CREATOR',
  '#SOLOPRENEUR',
  '#CASHNEEDED'
];

export const GRADIENT_PRESETS = [
  { name: 'Emerald', colors: ['#10B981', '#059669'] },
  { name: 'LinkedIn Blue', colors: ['#0A66C2', '#004182'] },
  { name: 'Sunset Glow', colors: ['#F59E0B', '#EF4444'] },
  { name: 'Purple Haze', colors: ['#8B5CF6', '#EC4899'] },
  { name: 'Cyber Neon', colors: ['#06B6D4', '#3B82F6'] },
  { name: 'Dark Luxe', colors: ['#1F2937', '#111827'] }
];

/**
 * Draws profile photo with curved arc badge onto HTML5 Canvas context.
 */
export function drawProfileFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  options: FrameOptions,
  size = 800
) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.44;

  ctx.save();

  // 1. Draw Profile Image clipped to circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Background fallback color if no image
  ctx.fillStyle = '#E5E7EB';
  ctx.fill();

  if (img) {
    const scale = options.zoom;
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;

    // Center image + offset
    const dx = centerX - imgWidth / 2 + options.offsetX * (size / 400);
    const dy = centerY - imgHeight / 2 + options.offsetY * (size / 400);

    ctx.drawImage(img, dx, dy, imgWidth, imgHeight);
  } else {
    // Placeholder avatar icon text
    ctx.fillStyle = '#9CA3AF';
    ctx.font = `bold ${size * 0.08}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Upload Photo', centerX, centerY);
  }

  ctx.restore();

  // 2. Draw Outer Border Ring (if enabled)
  if (options.showOuterRing && options.borderWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = options.borderWidth * (size / 400);
    ctx.strokeStyle = options.borderColor || '#10B981';
    ctx.stroke();
    ctx.restore();
  }

  // 3. Draw Arc Ribbon / Badge at the bottom curve if arcText is present
  const text = options.arcText.trim();
  if (text) {
    ctx.save();

    // Dynamic arc span based on string length
    const arcSpan = Math.min(Math.PI * 0.85, Math.max(0.4, text.length * 0.085 + 0.25));

    // To read #OPENTOWORK left-to-right along the bottom arc:
    // Start angle at bottom-left (Math.PI / 2 + arcSpan / 2)
    // End angle at bottom-right (Math.PI / 2 - arcSpan / 2)
    const startAngle = Math.PI / 2 + arcSpan / 2;
    const endAngle = Math.PI / 2 - arcSpan / 2;

    const ribbonThickness = size * 0.11; // Badge thickness
    const ribbonRadius = radius - ribbonThickness / 2 + 2;

    // Draw Ribbon Background (from bottom-left to bottom-right)
    ctx.beginPath();
    ctx.arc(centerX, centerY, ribbonRadius, Math.PI / 2 - arcSpan / 2 - 0.04, Math.PI / 2 + arcSpan / 2 + 0.04, false);
    ctx.lineWidth = ribbonThickness;

    if (options.badgeStyle === 'gradient') {
      const gradPreset = GRADIENT_PRESETS.find(g => g.name === options.gradientPreset) || GRADIENT_PRESETS[0];
      const grad = ctx.createLinearGradient(
        centerX - radius, centerY + radius,
        centerX + radius, centerY + radius
      );
      grad.addColorStop(0, gradPreset.colors[0]);
      grad.addColorStop(1, gradPreset.colors[1]);
      ctx.strokeStyle = grad;
    } else if (options.badgeStyle === 'outline') {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    } else {
      ctx.strokeStyle = options.arcColor || '#10B981';
    }

    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw Curved Text along arc (Left-to-Right: # on left, K on right, right-side up)
    ctx.fillStyle = options.textColor || '#FFFFFF';
    ctx.font = `800 ${size * 0.042}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const numChars = text.length;
    const totalAngle = endAngle - startAngle;
    const angleStep = totalAngle / Math.max(numChars - 1, 1);

    for (let i = 0; i < numChars; i++) {
      const char = text[i];
      const angle = startAngle + i * angleStep;

      const charX = centerX + ribbonRadius * Math.cos(angle);
      const charY = centerY + ribbonRadius * Math.sin(angle);

      ctx.save();
      ctx.translate(charX, charY);
      // Rotate angle - Math.PI / 2 so text is right-side up and reads #OPENTOWORK left-to-right
      ctx.rotate(angle - Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }
}
