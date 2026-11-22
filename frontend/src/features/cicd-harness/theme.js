// Shared palette + type tokens for the CI/CD harness study module.
// Mirrors the app's existing dark aesthetic (see components/Layout.tsx and
// the sibling finops-ai and kag-study modules).
export const C = {
  bg: '#0b0d12',
  panel: '#13161f',
  panel2: '#171b26',
  line: '#1f2330',
  text: '#e6e7eb',
  muted: '#8a8f9c',
  faint: '#5b606e',
  accent: '#e8b75d',   // amber — headings / brand
  blue: '#5b8def',     // pipeline / inform
  green: '#4bbf87',    // passing checks
  red: '#e06666',      // failures / gaps
  violet: '#a988e0',   // the harness core
  cyan: '#4bc4c4',     // config / code
};

export const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace";
export const SANS = "'Manrope', system-ui, -apple-system, sans-serif";
export const SERIF = "'Fraunces', 'IBM Plex Serif', Georgia, serif";
