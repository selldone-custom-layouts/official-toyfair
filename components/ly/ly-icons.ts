/*
 * The mockup's line icons (design/src/shell.js IC, one
 * stroke, 24 × 24; "tag" added in the same hand) and its hand-drawn pastry
 * line art (src/art.js LY_ART, 120 × 120, strokes only: faint behind
 * sections, inside the photo slots' fallbacks and as the feature icons).
 */
export const ICONS: Record<string, string> = {
  bag: "<path d=\"M5.5 8h13l-1 12.2a1 1 0 0 1-1 .8H7.5a1 1 0 0 1-1-.8z\"/><path d=\"M9 10V6.8a3 3 0 0 1 6 0V10\"/>",
  search: "<circle cx=\"11\" cy=\"11\" r=\"6.5\"/><path d=\"m20 20-4.2-4.2\"/>",
  user: "<circle cx=\"12\" cy=\"8.5\" r=\"3.8\"/><path d=\"M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6\"/>",
  menu: "<path d=\"M4 7.5h16M4 12h16M4 16.5h16\"/>",
  close: "<path d=\"m6 6 12 12M18 6 6 18\"/>",
  plus: "<path d=\"M12 5v14M5 12h14\"/>",
  minus: "<path d=\"M5 12h14\"/>",
  down: "<path d=\"m7 10 5 5 5-5\"/>",
  up: "<path d=\"m7 14 5-5 5 5\"/>",
  right: "<path d=\"m10 7 5 5-5 5\"/>",
  left: "<path d=\"m14 7-5 5 5 5\"/>",
  arrow: "<path d=\"M5 12h14M13 6l6 6-6 6\"/>",
  back: "<path d=\"M19 12H5M11 6l-6 6 6 6\"/>",
  phone: "<path d=\"M6.6 3.8h2.6l1.4 4-1.9 1.4a11 11 0 0 0 6.1 6.1l1.4-1.9 4 1.4v2.6a1.8 1.8 0 0 1-2 1.8A16.4 16.4 0 0 1 4.8 5.8a1.8 1.8 0 0 1 1.8-2z\"/>",
  mail: "<rect x=\"3.5\" y=\"5.5\" width=\"17\" height=\"13\" rx=\"2\"/><path d=\"m4 7 8 6 8-6\"/>",
  clock: "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 7.5V12l3 2\"/>",
  pin: "<path d=\"M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.4\"/>",
  check: "<path d=\"m5 12.5 4.5 4.5L19 7.5\"/>",
  cal: "<rect x=\"4\" y=\"5.5\" width=\"16\" height=\"14.5\" rx=\"2\"/><path d=\"M4 10h16M8.5 3.5v4M15.5 3.5v4\"/>",
  info: "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 11v5.5M12 7.8v.4\"/>",
  sun: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7\"/>",
  moon: "<path d=\"M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z\"/>",
  bike: "<circle cx=\"6\" cy=\"16.5\" r=\"3\"/><circle cx=\"18\" cy=\"16.5\" r=\"3\"/><path d=\"M6 16.5 9.5 9h5l3.5 7.5M9.5 9 8 6H5.5M14.5 9l1.5-3h2.5M12 16.5l2.5-7.5\"/>",
  plane: "<path d=\"M3.5 13.5 21 6l-4.5 14-4.4-5.1zM12.1 14.9 21 6\"/>",
  store: "<path d=\"M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5c0 1.6 1.2 2.6 2.7 2.6s2.6-1 2.6-2.6c0 1.6 1.2 2.6 2.7 2.6s2.7-1 2.7-2.6c0 1.6 1.1 2.6 2.6 2.6S20 11.1 20 9.5M5.5 12v8h13v-8M10 20v-4.5h4V20\"/>",
  globe: "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5z\"/>",
  eye: "<path d=\"M2.8 12S6 5.8 12 5.8 21.2 12 21.2 12 18 18.2 12 18.2 2.8 12 2.8 12z\"/><circle cx=\"12\" cy=\"12\" r=\"2.8\"/>",
  filter: "<path d=\"M4 7h10M18 7h2M4 17h2M10 17h10\"/><circle cx=\"16\" cy=\"7\" r=\"2\"/><circle cx=\"8\" cy=\"17\" r=\"2\"/>",
  sort: "<path d=\"M7 5v14M4 16l3 3 3-3M17 19V5M14 8l3-3 3 3\"/>",
  compare: "<rect x=\"3.5\" y=\"5\" width=\"7\" height=\"14\" rx=\"1.5\"/><rect x=\"13.5\" y=\"5\" width=\"7\" height=\"14\" rx=\"1.5\"/>",
  link: "<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1\"/><path d=\"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"/>",
  share: "<circle cx=\"6.5\" cy=\"12\" r=\"2.5\"/><circle cx=\"17.5\" cy=\"6\" r=\"2.5\"/><circle cx=\"17.5\" cy=\"18\" r=\"2.5\"/><path d=\"m8.7 10.8 6.6-3.6M8.7 13.2l6.6 3.6\"/>",
  trash: "<path d=\"M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2a1 1 0 0 0 1 .8h7.2a1 1 0 0 0 1-.8L17.5 7\"/>",
  edit: "<path d=\"M4.5 19.5h4l10-10-4-4-10 10z\"/><path d=\"m13 7 4 4\"/>",
  cash: "<rect x=\"3\" y=\"6.5\" width=\"18\" height=\"11\" rx=\"1.6\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M6 9.5v5M18 9.5v5\"/>",
  locate: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3\"/>",
  send: "<path d=\"M4 12 20 4l-4 16-4.5-6.5z\"/><path d=\"M11.5 13.5 20 4\"/>",
  home: "<path d=\"M4 11 12 4.5 20 11\"/><path d=\"M6.5 9.5V20h11V9.5\"/>",
  box: "<path d=\"M4 8 12 4l8 4v8l-8 4-8-4z\"/><path d=\"M4 8l8 4 8-4M12 12v8\"/>",
  out: "<path d=\"M14 4.5H6.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H14\"/><path d=\"M10 12h10M16.5 8.5 20 12l-3.5 3.5\"/>",
  chat: "<path d=\"M5 5.5h14a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H10l-4.5 3.5V17H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1z\"/>",
  star: "<path d=\"m12 4 2.4 5 5.4.7-4 3.8 1 5.4L12 16.3 7.2 18.9l1-5.4-4-3.8 5.4-.7z\"/>",
  copy: "<rect x=\"8\" y=\"8\" width=\"11.5\" height=\"11.5\" rx=\"1.6\"/><path d=\"M16 8V5.6a1 1 0 0 0-1-1H5.6a1 1 0 0 0-1 1V15a1 1 0 0 0 1 1H8\"/>",
  lock: "<rect x=\"5\" y=\"10.5\" width=\"14\" height=\"9.5\" rx=\"1.6\"/><path d=\"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5\"/>",
  /* Layout additions in the same stroke: the invoice, a parcel's trip. */
  heart: "<path d=\"M12 19.5s-7.5-4.4-7.5-9.6A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.3c0 5.2-7.5 9.6-7.5 9.6z\"/>",
  doc: "<path d=\"M6.5 3.5h7.5l4 4v13h-11.5z\"/><path d=\"M13.5 3.5v4.5h4.5M9.5 12.5h5M9.5 16h5\"/>",
  google: "<path d=\"M20 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.5a3.9 3.9 0 0 1-1.7 2.5v2.1h2.7c1.6-1.5 2.5-3.6 2.5-6.2z\"/><path d=\"M12 20.3c2.3 0 4.2-.8 5.5-2l-2.7-2.1c-.7.5-1.7.8-2.8.8-2.2 0-4-1.5-4.7-3.4H4.5v2.1A8.3 8.3 0 0 0 12 20.3z\"/><path d=\"M7.3 13.6a5 5 0 0 1 0-3.2V8.3H4.5a8.3 8.3 0 0 0 0 7.4z\"/><path d=\"M12 7c1.2 0 2.3.4 3.2 1.2l2.4-2.4A8.3 8.3 0 0 0 4.5 8.3l2.8 2.1C8 8.5 9.8 7 12 7z\"/>",
  apple: "<path d=\"M15.6 4c.1 1.1-.3 2.1-1 2.9-.7.8-1.7 1.3-2.7 1.2-.1-1 .3-2 1-2.8.7-.8 1.8-1.3 2.7-1.3z\"/><path d=\"M18.8 15.9c-.5 1.1-.7 1.6-1.3 2.5-.9 1.3-2.1 2.9-3.6 2.9-1.3 0-1.7-.9-3.5-.8-1.8 0-2.2.8-3.5.8-1.5 0-2.6-1.5-3.5-2.8-2.4-3.6-2.7-7.9-1.2-10.2 1.1-1.6 2.7-2.6 4.3-2.6 1.6 0 2.6.9 3.9.9 1.3 0 2-.9 3.9-.9 1.4 0 2.9.8 4 2.1-3.5 1.9-2.9 6.9.5 8.1z\"/>",
  github: "<path d=\"M9 19c-4 1.3-4-2-5.6-2.5M14.6 21v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.2 2.6 5.2 2.9 5.2 2.9a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.8 9.3c0 4.7 2.9 5.7 5.6 6a3 3 0 0 0-.8 2.3V21\"/>",
  linkedin: "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"2.5\"/><path d=\"M8 10.5V16M8 7.6v.3M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6v3\"/>",
  gift: "<rect x=\"4\" y=\"9\" width=\"16\" height=\"11\" rx=\"1.4\"/><path d=\"M3.5 9h17M12 9v11M12 9c-1.5-3.5-5.5-4-5.5-1.5C6.5 9 12 9 12 9zm0 0c1.5-3.5 5.5-4 5.5-1.5C17.5 9 12 9 12 9z\"/>",
  tag: '<path d="M3.8 12.6V4.8a1 1 0 0 1 1-1h7.8l7.6 7.6a1 1 0 0 1 0 1.4l-7.8 7.8a1 1 0 0 1-1.4 0z"/><circle cx="8.3" cy="8.3" r="1.4"/>',
  /* Toy Fair (the design's own line icons, 24 × 24) */
  cart: '<path d="M2 4h3l3 11h11l3-8H6m3 13h.01m9 0h.01"/>',
  truck: '<path d="M1 5h14v12H1zm14 5h4l3 4v3h-7zm-7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>',
  grid: '<path d="M3.5 3.5h7v7h-7zm10 0h7v7h-7zm-10 10h7v7h-7zm10 0h7v7h-7z"/>',
  message: '<path d="M21 4H3v13h5l4 4v-4h9zM7 9h10m-10 4h6"/>',
  sparkle: '<path d="M12 2l2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z"/>',
  card: '<path d="M3 5h18v14H3zm0 5h18m-14 5h4"/>',
  book: '<path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4zm10 3a3 3 0 0 1 3-3h3v14h-3a3 3 0 0 0-3 3"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-6 2v4"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18h1.4a2.3 2.3 0 0 0 1.8-3.7 1.5 1.5 0 0 1 1.2-2.4H18a3 3 0 0 0 3-3c0-5-4-8.9-9-8.9Zm-4 7h.01M11 7h.01m4 1h.01m2 3h.01"/>',
  cal2: '<path d="M4 6h16v14H4zM4 10h16M8 3v5m8-5v5"/>',
};

export const ART: Record<string, string> = {
  /* Toy Fair: a toy line drawing under the base's name */
  croissant:
    '<rect x="22" y="62" width="34" height="34" rx="3"/><rect x="62" y="62" width="34" height="34" rx="3"/><rect x="42" y="26" width="34" height="34" rx="3"/>' +
    '<path d="M32 72h14M72 72l14 14M86 72 72 86M52 36h14v14H52z"/>',
  /* Toy Fair: a toy line drawing under the base's name */
  macaron:
    '<circle cx="60" cy="60" r="38"/><path d="M60 22c-14 12-14 64 0 76M60 22c14 12 14 64 0 76M22 60c12-8 64-8 76 0"/>',
  /* Toy Fair: a toy line drawing under the base's name */
  cupcake:
    '<circle cx="60" cy="64" r="30"/><circle cx="36" cy="38" r="11"/><circle cx="84" cy="38" r="11"/><ellipse cx="60" cy="74" rx="12" ry="9"/>' +
    '<path d="M56 72h8M60 72v5"/><circle cx="49" cy="58" r="2"/><circle cx="71" cy="58" r="2"/>',
  /* Toy Fair: a toy line drawing under the base's name */
  cake:
    '<path d="M60 14 88 46 60 92 32 46z"/><path d="M60 14v78M32 46h56"/><path d="M60 92c-6 6 6 10 0 16s-8 4-10 8"/><path d="M54 100l-6 4 6 3M62 108l6 3-6 4"/>',
  /* Toy Fair: a toy line drawing under the base's name */
  tart:
    '<path d="M60 24v-8M44 30h32l18 26-34 40-34-40z"/><path d="M26 56h68M60 96v8"/>',
  /* Toy Fair: a toy line drawing under the base's name */
  cookie:
    '<path d="M30 36h20c-4-12 24-12 20 0h20v20c12-4 12 24 0 20v20H70c4 12-24 12-20 0H30V76c-12 4-12-24 0-20z"/>',
  /* Toy Fair: a toy line drawing under the base's name */
  whisk:
    '<path d="M60 14c18 14 22 38 14 64H46c-8-26-4-50 14-64z"/><circle cx="60" cy="44" r="8"/><path d="M46 78 34 92l14-2M74 78l12 14-14-2M52 84v14M60 84v18M68 84v14"/>',
  clock:
    '<circle cx="60" cy="66" r="34"/><circle cx="60" cy="66" r="27"/>' +
    '<path d="M60 48v18l12 8M53 26h14M60 26v6M84 38l5-5"/>',
  cash:
    '<rect x="12" y="38" width="78" height="44" rx="4"/><circle cx="51" cy="60" r="11"/>' +
    '<path d="M22 48v24M80 48v24"/>' +
    '<circle cx="94" cy="84" r="15"/><circle cx="94" cy="84" r="9"/>',
  awning:
    '<path d="M18 46 26 24h68l8 22z"/>' +
    '<path d="M18 46c0 6 4 10 10 10s10-4 10-10c0 6 4 10 11 10s11-4 11-10c0 6 4 10 11 10s11-4 11-10c0 6 4 10 10 10s10-4 10-10"/>' +
    '<path d="M26 56v42h68V56M50 98V74h20v24M40 24l-5 22M60 24v22M80 24l5 22M16 98h88"/>',
};
