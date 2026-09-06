export interface FrameOptions {
  arcText: string;
  arcColor: string;
  textColor: string;
  badgeStyle: 'solid' | 'gradient' | 'outline';
  gradientPreset?: string;
  arcRotation: number; // Start position in degrees (0 to 360, default 180 = 9 o'clock)
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

  // 3. Draw Arc Ribbon / Badge (supports 0° to 360° full circle ring growth!)
  const text = options.arcText.trim();
  if (text) {
    ctx.save();

    const numChars = text.length;

    // Calculate arc span (grows continuously up to full 360° / 2*PI circle)
    // 0.075 rad per char (~4.3 degrees per letter)
    const rawSpan = Math.max(0.35, numChars * 0.078 + 0.15);
    const isFullCircle = rawSpan >= Math.PI * 1.9;
    const arcSpan = isFullCircle ? Math.PI * 2 : rawSpan;

    // Convert start angle from degrees (default 180° = 9 o'clock)
    const startAngle = (options.arcRotation * Math.PI) / 180;
    const endAngle = isFullCircle ? startAngle - Math.PI * 1.999 : startAngle - arcSpan;

    const ribbonThickness = size * 0.11; // Ribbon thickness
    const ribbonRadius = radius - ribbonThickness / 2 + 2;

    // Draw Ribbon Background (Gradient, Solid, or Outline)
    ctx.beginPath();
    if (isFullCircle) {
      ctx.arc(centerX, centerY, ribbonRadius, 0, Math.PI * 2, false);
    } else {
      ctx.arc(centerX, centerY, ribbonRadius, endAngle - 0.04, startAngle + 0.04, false);
    }
    ctx.lineWidth = ribbonThickness;

    if (options.badgeStyle === 'gradient') {
      const gradPreset = GRADIENT_PRESETS.find(g => g.name === options.gradientPreset) || GRADIENT_PRESETS[0];
      const grad = ctx.createLinearGradient(
        centerX - radius, centerY + radius,
        centerX + radius, centerY - radius
      );
      grad.addColorStop(0, gradPreset.colors[0]);
      grad.addColorStop(1, gradPreset.colors[1]);
      ctx.strokeStyle = grad;
    } else if (options.badgeStyle === 'outline') {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    } else {
      ctx.strokeStyle = options.arcColor || '#10B981';
    }

    ctx.lineCap = isFullCircle ? 'butt' : 'round';
    ctx.stroke();

    // Draw Curved Text along arc
    ctx.fillStyle = options.textColor || '#FFFFFF';
    ctx.font = `800 ${size * (isFullCircle ? 0.036 : 0.042)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const angleStep = isFullCircle ? (Math.PI * 2) / numChars : (startAngle - endAngle) / Math.max(numChars - 1, 1);

    for (let i = 0; i < numChars; i++) {
      const char = text[i];
      const angle = isFullCircle ? startAngle - i * angleStep : startAngle - i * angleStep;

      const charX = centerX + ribbonRadius * Math.cos(angle);
      const charY = centerY + ribbonRadius * Math.sin(angle);

      ctx.save();
      ctx.translate(charX, charY);
      // Rotate angle - Math.PI / 2 for clean right-side up text rendering
      ctx.rotate(angle - Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }
}
