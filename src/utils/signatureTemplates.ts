export interface SignatureData {
  fullName: string;
  jobTitle: string;
  department: string;
  companyName: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  address: string;

  avatarUrl: string;
  avatarShape: 'circle' | 'square' | 'rounded';
  avatarSize: number;
  logoUrl: string;
  logoWidth: number;

  linkedin: string;
  twitter: string;
  github: string;
  instagram: string;
  facebook: string;
  youtube: string;

  templateId: 'corporate' | 'creative' | 'executive' | 'developer';
  themeColor: string;
  textColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'normal' | 'large';

  ctaText: string;
  ctaUrl: string;
  disclaimer: string;
}

export const DEFAULT_SIGNATURE_DATA: SignatureData = {
  fullName: 'Vineet Sansare',
  jobTitle: 'Senior Product Engineer & Creator',
  department: 'Product Development',
  companyName: 'Tools by Vineet',
  phone: '+1 (555) 019-2834',
  mobile: '+1 (555) 019-5821',
  email: 'vineet@vineetsansare.com',
  website: 'https://toolsby.vineetsansare.com',
  address: 'San Francisco, CA',

  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  avatarShape: 'circle',
  avatarSize: 90,
  logoUrl: '',
  logoWidth: 120,

  linkedin: 'https://linkedin.com/in/vineetsansare',
  twitter: 'https://x.com/vineetsansare',
  github: 'https://github.com/vineetsansare',
  instagram: '',
  facebook: '',
  youtube: '',

  templateId: 'corporate',
  themeColor: '#6366F1',
  textColor: '#1E293B',
  secondaryColor: '#64748B',
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 'normal',

  ctaText: '📅 Schedule a Meeting',
  ctaUrl: 'https://toolsby.vineetsansare.com',
  disclaimer: 'The content of this email is confidential and intended solely for the recipient.'
};

export const TEMPLATE_PRESETS = [
  {
    id: 'corporate',
    name: 'Modern Corporate',
    description: 'Clean layout with photo on left, vertical divider line, and branded contact details.'
  },
  {
    id: 'creative',
    name: 'Creative Startup',
    description: 'Vibrant card layout with rounded avatar, gradient accent bar, and social badges.'
  },
  {
    id: 'executive',
    name: 'Executive & Legal',
    description: 'Classic formal structure with company branding, contact grid, and confidentiality note.'
  },
  {
    id: 'developer',
    name: 'Tech & Developer',
    description: 'Minimalist, high-density layout featuring GitHub, X, and LinkedIn badges.'
  }
] as const;

export const FONT_OPTIONS = [
  { name: 'Arial (Recommended)', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Helvetica', value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' }
];

export const THEME_COLOR_SWATCHES = [
  '#6366F1', // Indigo
  '#0A66C2', // LinkedIn Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#0F172A'  // Dark Navy
];

/**
 * Generates 100% email-client-compliant HTML tables with inline CSS (Gmail, Outlook, Apple Mail).
 */
export function generateSignatureHtml(data: SignatureData): string {
  const font = data.fontFamily || 'Arial, Helvetica, sans-serif';
  const theme = data.themeColor || '#6366F1';
  const text = data.textColor || '#1E293B';
  const secondary = data.secondaryColor || '#64748B';

  const fontSizes = {
    small: { name: '14px', body: '12px', small: '10px' },
    normal: { name: '16px', body: '13px', small: '11px' },
    large: { name: '18px', body: '14px', small: '12px' }
  }[data.fontSize] || { name: '16px', body: '13px', small: '11px' };

  // Avatar border radius
  const borderRadius = data.avatarShape === 'circle' ? '50%' : data.avatarShape === 'rounded' ? '12px' : '0px';

  // Build Social Links HTML
  const socialLinks: string[] = [];
  if (data.linkedin) {
    socialLinks.push(`<a href="${data.linkedin}" target="_blank" style="color: ${theme}; text-decoration: none; font-weight: bold; margin-right: 8px;">LinkedIn</a>`);
  }
  if (data.twitter) {
    socialLinks.push(`<a href="${data.twitter}" target="_blank" style="color: ${theme}; text-decoration: none; font-weight: bold; margin-right: 8px;">X (Twitter)</a>`);
  }
  if (data.github) {
    socialLinks.push(`<a href="${data.github}" target="_blank" style="color: ${theme}; text-decoration: none; font-weight: bold; margin-right: 8px;">GitHub</a>`);
  }
  if (data.instagram) {
    socialLinks.push(`<a href="${data.instagram}" target="_blank" style="color: ${theme}; text-decoration: none; font-weight: bold; margin-right: 8px;">Instagram</a>`);
  }

  const socialHtml = socialLinks.length > 0 
    ? `<div style="margin-top: 8px; font-size: ${fontSizes.small};">${socialLinks.join(' <span style="color: ' + secondary + ';">•</span> ')}</div>` 
    : '';

  // CTA Button HTML
  const ctaHtml = data.ctaText.trim()
    ? `<div style="margin-top: 12px;"><a href="${data.ctaUrl || '#'}" target="_blank" style="background-color: ${theme}; color: #FFFFFF; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: ${fontSizes.small}; display: inline-block;">${data.ctaText}</a></div>`
    : '';

  // Disclaimer HTML
  const disclaimerHtml = data.disclaimer.trim()
    ? `<div style="margin-top: 14px; padding-top: 8px; border-top: 1px solid #E2E8F0; font-size: 10px; color: ${secondary}; line-height: 1.4;">${data.disclaimer}</div>`
    : '';

  // --------------------------------------------------------------------------
  // TEMPLATE 1: Modern Corporate (Photo left, vertical divider line)
  // --------------------------------------------------------------------------
  if (data.templateId === 'corporate') {
    return `
<table cellPadding="0" cellSpacing="0" border="0" style="font-family: ${font}; color: ${text}; line-height: 1.4; font-size: ${fontSizes.body}; border-collapse: collapse;">
  <tr>
    ${data.avatarUrl ? `
    <td style="padding-right: 16px; vertical-align: top;">
      <img src="${data.avatarUrl}" alt="${data.fullName}" width="${data.avatarSize}" height="${data.avatarSize}" style="border-radius: ${borderRadius}; display: block; object-fit: cover;" />
    </td>
    ` : ''}
    <td style="border-left: 2px solid ${theme}; padding-left: 16px; vertical-align: top;">
      <div style="font-size: ${fontSizes.name}; font-weight: 800; color: ${text}; margin-bottom: 2px;">${data.fullName}</div>
      <div style="font-size: ${fontSizes.body}; font-weight: 600; color: ${theme}; margin-bottom: 6px;">${data.jobTitle}${data.companyName ? ' at ' + data.companyName : ''}</div>
      
      <div style="font-size: ${fontSizes.body}; color: ${secondary};">
        ${data.email ? `<div><span style="color: ${theme}; font-weight: bold;">E:</span> <a href="mailto:${data.email}" style="color: ${secondary}; text-decoration: none;">${data.email}</a></div>` : ''}
        ${data.phone ? `<div><span style="color: ${theme}; font-weight: bold;">P:</span> <a href="tel:${data.phone}" style="color: ${secondary}; text-decoration: none;">${data.phone}</a></div>` : ''}
        ${data.website ? `<div><span style="color: ${theme}; font-weight: bold;">W:</span> <a href="${data.website}" target="_blank" style="color: ${secondary}; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a></div>` : ''}
        ${data.address ? `<div><span style="color: ${theme}; font-weight: bold;">A:</span> ${data.address}</div>` : ''}
      </div>

      ${socialHtml}
      ${ctaHtml}
    </td>
  </tr>
</table>
${disclaimerHtml}
`.trim();
  }

  // --------------------------------------------------------------------------
  // TEMPLATE 2: Creative Startup (Card layout with top banner accent)
  // --------------------------------------------------------------------------
  if (data.templateId === 'creative') {
    return `
<table cellPadding="0" cellSpacing="0" border="0" style="font-family: ${font}; color: ${text}; line-height: 1.4; font-size: ${fontSizes.body}; border-collapse: collapse; background-color: #F8FAFC; padding: 14px; border-radius: 10px; border: 1px solid #E2E8F0;">
  <tr>
    ${data.avatarUrl ? `
    <td style="padding-right: 14px; vertical-align: middle;">
      <img src="${data.avatarUrl}" alt="${data.fullName}" width="${data.avatarSize}" height="${data.avatarSize}" style="border-radius: ${borderRadius}; display: block; object-fit: cover;" />
    </td>
    ` : ''}
    <td style="vertical-align: middle;">
      <div style="font-size: ${fontSizes.name}; font-weight: 800; color: ${theme};">${data.fullName}</div>
      <div style="font-size: ${fontSizes.body}; color: ${text}; font-weight: 600;">${data.jobTitle}</div>
      <div style="font-size: ${fontSizes.small}; color: ${secondary}; margin-top: 4px;">
        ${data.email ? `<a href="mailto:${data.email}" style="color: ${secondary}; text-decoration: none;">${data.email}</a>` : ''}
        ${data.phone ? ` • <a href="tel:${data.phone}" style="color: ${secondary}; text-decoration: none;">${data.phone}</a>` : ''}
        ${data.website ? ` • <a href="${data.website}" target="_blank" style="color: ${theme}; text-decoration: none; font-weight: bold;">${data.website.replace(/^https?:\/\//, '')}</a>` : ''}
      </div>
      ${socialHtml}
      ${ctaHtml}
    </td>
  </tr>
</table>
${disclaimerHtml}
`.trim();
  }

  // --------------------------------------------------------------------------
  // TEMPLATE 3: Executive & Legal (Classic formal header & logo)
  // --------------------------------------------------------------------------
  if (data.templateId === 'executive') {
    return `
<table cellPadding="0" cellSpacing="0" border="0" style="font-family: ${font}; color: ${text}; line-height: 1.45; font-size: ${fontSizes.body}; border-collapse: collapse;">
  <tr>
    <td style="padding-bottom: 6px;">
      <span style="font-size: ${fontSizes.name}; font-weight: 800; color: ${text}; text-transform: uppercase; letter-spacing: 0.05em;">${data.fullName}</span>
      <span style="color: ${theme}; font-weight: bold;"> | </span>
      <span style="font-size: ${fontSizes.body}; color: ${secondary}; font-weight: 600;">${data.jobTitle}</span>
    </td>
  </tr>
  <tr>
    <td style="padding-bottom: 8px; font-weight: bold; color: ${theme}; font-size: ${fontSizes.body};">
      ${data.companyName}
    </td>
  </tr>
  <tr>
    <td style="border-top: 1px solid #CBD5E1; paddingTop: 8px; font-size: ${fontSizes.small}; color: ${secondary};">
      ${data.phone ? `Phone: ${data.phone} &nbsp;|&nbsp; ` : ''}
      ${data.email ? `Email: <a href="mailto:${data.email}" style="color: ${text}; text-decoration: none;">${data.email}</a> &nbsp;|&nbsp; ` : ''}
      ${data.website ? `Web: <a href="${data.website}" target="_blank" style="color: ${theme}; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a>` : ''}
    </td>
  </tr>
  ${socialHtml ? `<tr><td>${socialHtml}</td></tr>` : ''}
  ${ctaHtml ? `<tr><td>${ctaHtml}</td></tr>` : ''}
</table>
${disclaimerHtml}
`.trim();
  }

  // --------------------------------------------------------------------------
  // TEMPLATE 4: Tech & Developer (Minimalist typography & tech badges)
  // --------------------------------------------------------------------------
  return `
<table cellPadding="0" cellSpacing="0" border="0" style="font-family: ${font}; color: ${text}; line-height: 1.4; font-size: ${fontSizes.body}; border-collapse: collapse;">
  <tr>
    ${data.avatarUrl ? `
    <td style="padding-right: 14px; vertical-align: top;">
      <img src="${data.avatarUrl}" alt="${data.fullName}" width="${data.avatarSize}" height="${data.avatarSize}" style="border-radius: ${borderRadius}; display: block; object-fit: cover;" />
    </td>
    ` : ''}
    <td style="vertical-align: top;">
      <div style="font-size: ${fontSizes.name}; font-weight: 800; color: ${text};">${data.fullName}</div>
      <div style="font-size: ${fontSizes.body}; color: ${theme}; font-weight: 600;">${data.jobTitle}</div>
      <div style="font-size: ${fontSizes.small}; color: ${secondary}; margin-top: 4px;">
        ${data.email ? `<a href="mailto:${data.email}" style="color: ${secondary}; text-decoration: none;">${data.email}</a>` : ''}
        ${data.website ? ` &nbsp;•&nbsp; <a href="${data.website}" target="_blank" style="color: ${theme}; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a>` : ''}
      </div>
      ${socialHtml}
      ${ctaHtml}
    </td>
  </tr>
</table>
${disclaimerHtml}
`.trim();
}
