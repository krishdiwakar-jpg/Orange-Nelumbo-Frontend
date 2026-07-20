(async function () {
  const C = {
    bg: "#0E0D10", surface: "#161418", raised: "#1E1B20", line: "#48251C",
    soft: "#2A262E", hair: "#2E2B31", paper: "#FAF8F2", muted: "#C7C5CC",
    silver: "#DAD8DE", orange: "#FF5A1F", ember: "#FF8A3D", amber: "#F5D9A8",
    cyan: "#3DE0D0", green: "#3DE08A", yellow: "#F6C344", red: "#E0483C"
  };

  function rgb(hex) {
    const value = hex.replace("#", "");
    return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
  }
  function paint(hex, opacity) { return [{ type: "SOLID", color: rgb(hex), opacity: opacity == null ? 1 : opacity }]; }
  async function font(candidates) {
    for (const candidate of candidates) {
      try { await figma.loadFontAsync(candidate); return candidate; } catch (error) {}
    }
    const fallback = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(fallback);
    return fallback;
  }

  const F = {
    display: await font([{ family: "Fraunces", style: "SemiBold" }, { family: "Fraunces", style: "Regular" }, { family: "Georgia", style: "Regular" }, { family: "Inter", style: "Semi Bold" }]),
    displayBold: await font([{ family: "Fraunces", style: "Bold" }, { family: "Fraunces", style: "SemiBold" }, { family: "Inter", style: "Bold" }]),
    body: await font([{ family: "DM Sans", style: "Regular" }, { family: "Inter", style: "Regular" }]),
    medium: await font([{ family: "DM Sans", style: "Medium" }, { family: "Inter", style: "Medium" }, { family: "Inter", style: "Regular" }]),
    bold: await font([{ family: "DM Sans", style: "Bold" }, { family: "DM Sans", style: "SemiBold" }, { family: "Inter", style: "Bold" }]),
    mono: await font([{ family: "JetBrains Mono", style: "Regular" }, { family: "Roboto Mono", style: "Regular" }, { family: "Inter", style: "Regular" }])
  };

  function add(parent, node, name, x, y) {
    parent.appendChild(node); node.name = name; node.x = x || 0; node.y = y || 0; return node;
  }
  function frame(parent, name, x, y, width, height, fill, stroke) {
    const node = figma.createFrame(); add(parent, node, name, x, y); node.resize(width, height);
    node.clipsContent = false; node.fills = fill ? paint(fill) : [];
    if (stroke) { node.strokes = paint(stroke); node.strokeWeight = 1; node.strokeAlign = "INSIDE"; }
    return node;
  }
  function rect(parent, name, x, y, width, height, fill, stroke, radius, opacity) {
    const node = figma.createRectangle(); add(parent, node, name, x, y); node.resize(width, height);
    node.fills = fill ? paint(fill, opacity) : [];
    if (stroke) { node.strokes = paint(stroke); node.strokeWeight = 1; node.strokeAlign = "INSIDE"; }
    if (radius) node.cornerRadius = radius; return node;
  }
  function ellipse(parent, name, x, y, width, height, fill, stroke, opacity) {
    const node = figma.createEllipse(); add(parent, node, name, x, y); node.resize(width, height);
    node.fills = fill ? paint(fill, opacity) : [];
    if (stroke) { node.strokes = paint(stroke, opacity == null ? 1 : opacity); node.strokeWeight = 1; }
    return node;
  }
  function text(parent, name, value, x, y, options) {
    const o = options || {}; const node = figma.createText(); add(parent, node, name, x, y);
    node.fontName = o.font || F.body; node.fontSize = o.size || 16; node.characters = String(value);
    node.fills = paint(o.color || C.paper, o.opacity == null ? 1 : o.opacity);
    if (o.lineHeight) node.lineHeight = { unit: "PIXELS", value: o.lineHeight };
    if (o.align) node.textAlignHorizontal = o.align;
    if (o.width) { node.textAutoResize = "HEIGHT"; node.resize(o.width, Math.max(1, o.lineHeight || (o.size || 16) * 1.4)); }
    else node.textAutoResize = "WIDTH_AND_HEIGHT";
    return node;
  }
  function rule(parent, name, x, y, width, color) { return rect(parent, name, x, y, width, 1, color || C.soft); }
  function grid(parent, name, x, y, width, height, spacing, color, opacity) {
    const node = frame(parent, name, x, y, width, height, null);
    const step = spacing || 46;
    for (let gx = 0; gx <= width; gx += step) rect(node, "Grid / V / " + gx, gx, 0, 1, height, color || C.orange, null, 0, opacity == null ? 0.07 : opacity);
    for (let gy = 0; gy <= height; gy += step) rect(node, "Grid / H / " + gy, 0, gy, width, 1, color || C.orange, null, 0, opacity == null ? 0.07 : opacity);
    return node;
  }
  function lotus(parent, x, y) {
    const mark = frame(parent, "Brand / Lotus", x, y, 46, 41, C.raised);
    ellipse(mark, "Petal / Center", 18, 4, 10, 27, C.orange);
    const left = ellipse(mark, "Petal / Left", 11, 9, 10, 24, C.ember); left.rotation = -30;
    const right = ellipse(mark, "Petal / Right", 25, 9, 10, 24, C.ember); right.rotation = 30;
    ellipse(mark, "Petal / Outer left", 6, 16, 9, 18, C.orange);
    ellipse(mark, "Petal / Outer right", 31, 16, 9, 18, C.orange);
    rect(mark, "Water line", 8, 34, 30, 2, C.ember); return mark;
  }
  function button(parent, label, x, y, width, variant) {
    const kind = variant === true ? "primary" : variant === false ? "outline" : (variant || "primary");
    const primary = kind === "primary", ghost = kind === "ghost";
    const node = frame(parent, "Button / " + label, x, y, width, 48, primary ? C.orange : null, primary ? null : ghost ? C.hair : C.orange);
    text(node, "Label", label, 0, 14, { font: F.bold, size: 14, color: primary ? C.bg : ghost ? C.paper : C.ember, width: width, align: "CENTER", lineHeight: 19 });
    return node;
  }

  function publicHeader(root) {
    const node = frame(root, "Global / Marketing Header", 0, 0, 1440, 74, C.bg, C.line);
    lotus(node, 56, 17); text(node, "Brand", "ORANGE NELUMBO", 112, 28, { font: F.displayBold, size: 17 });
    const navX = [520, 620, 695, 810, 880, 985];
    ["Simulations", "Notes", "Concept map", "Pricing", "Educators", "FAQs"].forEach(function (label, i) {
      text(node, "Nav / " + label, label, navX[i], 28, { font: F.displayBold, size: 12, color: C.muted });
    });
    button(node, "Sign in", 1170, 14, 98, "ghost"); button(node, "Explore free", 1280, 14, 112, "outline");
  }
  function publicFooter(root, y) {
    const node = frame(root, "Global / Marketing Footer", 0, y, 1440, 444, C.bg, C.line);
    lotus(node, 56, 64); text(node, "Brand", "ORANGE NELUMBO", 112, 75, { font: F.displayBold, size: 18 });
    text(node, "Description", "Visual JEE notes and interactive simulations that make difficult ideas easier to see and understand.", 56, 129, { font: F.display, size: 15, color: C.muted, width: 390, lineHeight: 27 });
    button(node, "Explore free", 56, 224, 154, "primary");
    const cols = [["Learn", "Free simulations\nSample notes\nPricing"], ["Support", "FAQs\nEducator login\nContact"], ["Legal", "Privacy\nTerms"]];
    cols.forEach(function (col, i) {
      text(node, "Column / " + col[0], col[0], 674 + i * 220, 68, { font: F.displayBold, size: 14 });
      text(node, "Links / " + col[0], col[1], 674 + i * 220, 106, { font: F.display, size: 14, color: C.muted, lineHeight: 30 });
    });
    rule(node, "Legal divider", 0, 310, 1440, C.hair);
    text(node, "Independence note", "Orange Nelumbo is an independent educational platform and is not affiliated with, endorsed by, or sponsored by the NTA, the JEE Apex Board, or the IITs.", 56, 332, { font: F.display, size: 12, color: C.muted, width: 1328, lineHeight: 20 });
    rule(node, "Copyright divider", 0, 383, 1440, C.hair);
    text(node, "Copyright", "\u00A9 2026 Orange Nelumbo", 56, 405, { font: F.display, size: 12, color: C.muted });
    text(node, "Tagline", "See the idea. Understand the concept.", 1100, 405, { font: F.display, size: 12, color: C.muted });
  }
  function learningRail(root, height, active) {
    const node = frame(root, "Global / Learning Navigation", 0, 0, 278, height, C.surface, C.line);
    lotus(node, 24, 18); text(node, "Brand", "ORANGE NELUMBO", 74, 27, { font: F.displayBold, size: 16 }); rule(node, "Divider", 0, 73, 278);
    text(node, "Learning", "Learning", 24, 104, { font: F.bold, size: 12, color: C.muted });
    ["Home", "Visual notes", "Simulations", "Video lectures"].forEach(function (label, i) {
      const y = 134 + i * 48;
      if (label === active) rect(node, "Active / " + label, 12, y, 252, 44, C.orange, null, 0, 0.09);
      rect(node, "Icon / " + label, 27, y + 13, 18, 18, label === active ? C.ember : C.muted, null, 3, label === active ? 1 : 0.55);
      text(node, "Nav / " + label, label, 58, y + 12, { font: F.bold, size: 14, color: label === active ? C.paper : C.muted });
    });
    text(node, "Library", "Your library", 24, 354, { font: F.bold, size: 12, color: C.muted });
    text(node, "Bookmarks", "Bookmarks", 58, 397, { font: F.bold, size: 14, color: active === "Bookmarks" ? C.paper : C.muted });
    text(node, "Account", "Account", 24, 462, { font: F.bold, size: 12, color: C.muted });
    ["Profile", "Settings", "Help centre"].forEach(function (label, i) { text(node, "Account / " + label, label, 58, 503 + i * 48, { font: F.bold, size: 14, color: active === label ? C.paper : C.muted }); });
  }
  function learningHeader(root, title) {
    const node = frame(root, "Global / Learning Header", 278, 0, 1162, 74, C.bg, C.line);
    text(node, "Title", title, 32, 25, { font: F.bold, size: 20 });
    const search = frame(node, "Search", 650, 15, 255, 44, C.surface, C.soft); text(search, "Placeholder", "Search notes and simulations", 16, 13, { size: 13, color: C.muted });
    rect(node, "Notifications", 922, 15, 44, 44, C.surface, C.soft); rect(node, "Profile", 984, 15, 44, 44, C.orange);
  }

  const contentCopy = {
    "Make it visible": "Use diagrams, motion, and spatial explanation wherever words alone create friction.",
    "Keep it focused": "Remove dashboard noise and keep each screen centred on the student's immediate learning task.",
    "Let students test it": "Turn passive reading into exploration through small, purposeful simulations.",
    "Visual notes": "Notes open in a dedicated reader so the learning document stays separate from the rest of the app.",
    "Simulations": "Live simulations let you change inputs and observe the result. Upcoming simulations are clearly marked.",
    "Video lectures": "Video lectures are planned for a future release and are not presented as currently available.",
    "Profile and settings": "Profile, notifications, and preferences are grouped under Account and kept separate from learning.",
    "1. Scope of this preview": "This notice describes the Orange Nelumbo front-end demonstration. The preview has no production account service, payment processor, or server-side academic profile.",
    "2. Information shown or entered": "The fictional student profile, sample progress, ranks, and study history are demonstration data and are not linked to a real learner.",
    "3. Browser-local storage": "The preview may use browser storage to remember demonstration choices, progress, or interface preferences on the current device.",
    "4. Cookies, analytics, and third parties": "The preview is not designed to set advertising cookies or send product analytics to an application backend.",
    "5. Students and minors": "A production account and consent flow must be designed for applicable requirements. This preview does not request a child's real academic or identity data.",
    "6. Security and retention": "No demo form data is intentionally retained by an Orange Nelumbo application server. Browser-local values remain until cleared.",
    "7. Your choices and questions": "You can stop using the preview and clear its browser data at any time. This notice may change before a live service launches.",
    "1. Demonstration status": "Orange Nelumbo currently provides a front-end demonstration. Features, plans, prices, dates, ranks, and results are sample product content.",
    "2. Educational purpose and no guarantees": "Lessons and simulations are educational tools. No rank, score, percentile, admission, or selection is promised.",
    "3. Official exam information": "Students must verify dates, eligibility, syllabi, and application rules through the official examination authorities.",
    "4. Acceptable use": "Use the preview for lawful educational purposes. Do not disrupt the service, bypass access controls, or use it to cheat in an examination.",
    "5. Plans, prices, refunds, and payments": "No live purchase occurs in this preview. A future paid service must show final prices and terms before payment.",
    "6. Availability and changes": "Preview features may change, reset, or become unavailable. Browser-local progress can disappear when site data is cleared.",
    "7. Responsibility and limitation": "Use of the preview is at your discretion. Do not make decisions solely from demo analytics or incomplete preview content.",
    "8. Contact": "Questions about these demonstration terms can be directed to the reference support address shown in the product."
  };
  function item(value) { return typeof value === "string" ? { title: value, body: contentCopy[value] || "" } : value; }
  function heading(node, section, learning, x, width) {
    const hero = section.type === "hero";
    text(node, "Heading", section.title, x, 42, { font: learning ? F.bold : F.displayBold, size: hero ? 50 : 35, width: width, lineHeight: hero ? 56 : 42 });
    if (section.description) text(node, "Description", section.description, x, hero ? 116 : 94, { font: learning ? F.body : F.display, size: hero ? 18 : 16, color: C.muted, width: width, lineHeight: hero ? 30 : 26 });
  }
  function cards(node, section, x, y, width, learning) {
    const data = section.items || []; const cols = section.columns || Math.min(3, Math.max(1, data.length)); const gap = 18;
    const w = (width - gap * (cols - 1)) / cols; const h = section.cardHeight || 184;
    data.forEach(function (raw, i) {
      const value = item(raw), col = i % cols, row = Math.floor(i / cols);
      const card = frame(node, "Card / " + value.title, x + col * (w + gap), y + row * (h + gap), w, h, C.surface, C.line);
      const icon = frame(card, "Icon", 22, 22, 38, 38, null, C.line);
      text(icon, "Glyph", i % 3 === 0 ? "\u2297" : i % 3 === 1 ? "\u25B3" : "\u03A3", 0, 9, { font: F.mono, size: 16, color: i % 2 ? C.cyan : C.ember, width: 38, align: "CENTER", lineHeight: 20 });
      text(card, "Title", value.title, 22, 78, { font: learning ? F.bold : F.displayBold, size: 20, width: w - 44, lineHeight: 26 });
      if (value.meta) text(card, "Meta", value.meta, 22, 108, { font: F.medium, size: 12, color: C.ember, width: w - 44 });
      if (value.body) text(card, "Body", value.body, 22, value.meta ? 132 : 114, { size: 13, color: C.muted, width: w - 44, lineHeight: 20 });
    });
  }
  function rows(node, section, x, y, width, learning) {
    const rowHeight = section.height > 1000 ? Math.min(230, Math.floor((section.height - y - 50) / Math.max(1, (section.items || []).length))) : 68;
    const rowGap = section.height > 1000 ? 16 : 10;
    (section.items || []).forEach(function (raw, i) {
      const value = item(raw), row = frame(node, "Row / " + value.title, x, y + i * (rowHeight + rowGap), width, rowHeight, C.surface, C.soft);
      text(row, "Index", String(i + 1).padStart(2, "0"), 18, 24, { font: F.mono, size: 11, color: C.ember });
      text(row, "Title", value.title, 68, 15, { font: learning ? F.bold : F.displayBold, size: 17, width: 310 });
      if (value.body) text(row, "Body", value.body, 400, 14, { size: 13, color: C.muted, width: width - 430, lineHeight: 20 });
    });
  }
  function form(node, section, x, y, width) {
    const fields = section.items || ["Email address", "Password"], formW = Math.min(620, width);
    fields.forEach(function (raw, i) {
      const value = item(raw); text(node, "Label / " + value.title, value.title, x, y + i * 74, { font: F.bold, size: 13 });
      const input = frame(node, "Input / " + value.title, x, y + 23 + i * 74, formW, 44, C.bg, C.line);
      text(input, "Placeholder", value.body || "Enter " + value.title.toLowerCase(), 14, 13, { size: 13, color: C.muted, opacity: 0.65 });
    });
    button(node, section.button || "Continue", x, y + fields.length * 74 + 12, 210, true);
  }
  function faq(node, section, x, y, width) {
    let rowY = y;
    (section.items || []).forEach(function (raw, i) {
      const value = item(raw), h = i === 0 ? 112 : 64, row = frame(node, "FAQ / " + value.title, x, rowY, width, h, null);
      rule(row, "Divider", 0, 0, width, C.line); text(row, "Question", value.title, 0, 20, { font: F.displayBold, size: 18, width: width - 50 });
      text(row, "Toggle", i === 0 ? "−" : "+", width - 30, 18, { size: 22, color: C.ember });
      if (i === 0) text(row, "Answer", value.body || "Editable answer text for this frequently asked question.", 0, 55, { size: 13, color: C.muted, width: width - 60, lineHeight: 21 });
      rowY += h;
    });
  }
  function reader(node, section, x, y, width) {
    const toc = frame(node, "Table of contents", x, y, 210, 360, C.surface, C.line);
    text(toc, "Title", "On this page", 18, 18, { font: F.bold, size: 13, color: C.muted });
    (section.items || ["Core idea", "Derivation", "Visual model", "Worked example"]).forEach(function (label, i) {
      text(toc, "Link / " + label, String(i + 1).padStart(2, "0") + "  " + label, 18, 56 + i * 42, { font: F.medium, size: 12, color: i === 0 ? C.ember : C.muted, width: 175 });
    });
    const content = frame(node, "Reading content", x + 238, y, width - 238, 430, C.bg);
    text(content, "Title", "The concept, explained visually", 0, 0, { font: F.bold, size: 28, width: width - 280 });
    text(content, "Body", "Follow the diagram, connect each variable to the motion, and use the worked relation to predict what changes at the highest point.", 0, 54, { size: 15, color: C.muted, width: width - 300, lineHeight: 26 });
    const visual = frame(content, "Visual diagram", 0, 150, width - 290, 220, C.surface, C.line);
    ellipse(visual, "Orbit", 150, 36, 145, 145, null, C.orange, 0.45); ellipse(visual, "Core", 202, 88, 42, 42, C.orange);
    rect(visual, "Graph axis", 370, 42, 2, 130, C.muted, null, 0, 0.45); rect(visual, "Graph line", 370, 107, Math.max(160, width - 720), 3, C.cyan);
  }
  function drawSection(parent, section, x, y, width, learning, index) {
    const node = frame(parent, "Section / " + String(index + 1).padStart(2, "0") + " / " + section.title, x, y, width, section.height, section.alt ? C.surface : C.bg, section.border ? C.line : null);
    const inset = 52, contentW = width - inset * 2; heading(node, section, learning, inset, Math.min(760, contentW));
    const start = section.type === "hero" ? 190 : 140;
    if (section.type === "cards") cards(node, section, inset, start, contentW, learning);
    else if (section.type === "rows") rows(node, section, inset, start, contentW, learning);
    else if (section.type === "form") form(node, section, inset, start, contentW);
    else if (section.type === "faq") faq(node, section, inset, start, contentW);
    else if (section.type === "reader") reader(node, section, inset, start, contentW);
    else {
      const visual = frame(node, "Hero visual", width - 500, 54, 430, section.height - 108, C.surface, C.line);
      ellipse(visual, "Orbit", 105, 42, 220, 220, null, C.orange, 0.38); ellipse(visual, "Core", 185, 122, 60, 60, C.orange);
      rule(visual, "Axis", 54, section.height - 180, 322, C.cyan); button(node, section.button || "Explore", inset, section.height - 92, 190, true);
    }
  }

  function outlinedIcon(parent, name, x, y, symbol, color) {
    const icon = frame(parent, "Icon / " + name, x, y, 48, 48, null, C.line);
    text(icon, "Glyph", symbol, 0, 12, { font: F.mono, size: 20, color: color || C.ember, width: 48, align: "CENTER", lineHeight: 24 });
    return icon;
  }

  function motionCard(parent, x, y, width, height) {
    const card = frame(parent, "Hero visual / Motion under gravity", x, y, width, height, C.surface, C.line);
    grid(card, "Background grid", 0, 0, width, height, 46, C.orange, 0.055);
    text(card, "Subject", "Physics \u00B7 Kinematics", 28, 30, { font: F.displayBold, size: 14, color: C.ember });
    text(card, "Title", "Motion under gravity", 28, 55, { font: F.displayBold, size: 24 });
    text(card, "Book icon", "\u25A1", width - 56, 43, { font: F.mono, size: 24, color: C.ember });
    rule(card, "Header divider", 28, 95, width - 56, C.hair);
    const orbit = frame(card, "Vertical throw visual", 28, 123, width - 56, 320, null, C.line);
    orbit.cornerRadius = 150;
    const axisX = Math.round((width - 56) / 2);
    rect(orbit, "Dashed path", axisX, 53, 1, 202, C.muted, null, 0, 0.5);
    ellipse(orbit, "Ball / Apex", axisX - 16, 42, 32, 32, C.amber);
    ellipse(orbit, "Ball / Ground", axisX - 16, 244, 32, 32, C.amber);
    text(orbit, "Apex label", "v = 0 at the top", axisX + 48, 51, { font: F.displayBold, size: 14, color: C.cyan });
    text(orbit, "Gravity label", "g stays downward", 88, 138, { font: F.display, size: 14, color: C.ember });
    const note = frame(card, "Explanation / Note", 28, height - 82, (width - 68) / 2, 54, C.bg, C.hair);
    text(note, "Copy", "A visual note explains the idea.", 16, 17, { font: F.display, size: 14, color: C.muted });
    const lab = frame(card, "Explanation / Simulation", 40 + (width - 68) / 2, height - 82, (width - 68) / 2, 54, C.bg, C.hair);
    text(lab, "Copy", "A simulation lets you test it.", 16, 17, { font: F.display, size: 14, color: C.muted });
    return card;
  }

  function subjectCard(parent, x, y, width, title, symbol, copy) {
    const card = frame(parent, "Card / " + title, x, y, width, 188, C.surface, C.line);
    outlinedIcon(card, title, 28, 28, symbol, C.ember);
    text(card, "Title", title, 28, 98, { font: F.displayBold, size: 24 });
    text(card, "Description", copy, 28, 132, { font: F.display, size: 15, color: C.muted, width: width - 56, lineHeight: 25 });
  }

  function quoteCard(parent, x, y, width, name, detail, quote) {
    const card = frame(parent, "Testimonial / " + name, x, y, width, 355, C.surface, C.line);
    text(card, "Quote mark", "\u201C", 28, 26, { font: F.displayBold, size: 44, color: C.ember });
    text(card, "Quote", quote, 28, 95, { font: F.display, size: 18, color: C.silver, width: width - 56, lineHeight: 30 });
    rule(card, "Divider", 28, 277, width - 56, C.hair);
    text(card, "Student", name, 28, 298, { font: F.displayBold, size: 15 });
    text(card, "Detail", detail, 28, 323, { font: F.display, size: 13, color: C.muted });
  }

  function legacyHomeFrame(page, index) {
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / Home / /", 0, 0, 1440, 4822, C.bg);
    root.clipsContent = true; root.setPluginData("route", "/"); publicHeader(root);

    const hero = frame(root, "Section / 01 / Hero", 0, 74, 1440, 713, C.bg, C.line);
    grid(hero, "Hero grid", 0, 0, 1440, 713, 46, C.orange, 0.065);
    text(hero, "Heading / Line 1", "JEE concepts", 56, 157, { font: F.displayBold, size: 72, width: 650, lineHeight: 76 });
    text(hero, "Heading / Line 2", "made", 56, 244, { font: F.displayBold, size: 72, width: 230, lineHeight: 76 });
    text(hero, "Heading / Accent", "visible.", 286, 244, { font: F.displayBold, size: 72, color: C.orange, width: 320, lineHeight: 76 });
    text(hero, "Description", "Learn Physics, Chemistry, and Mathematics through visual notes and interactive simulations built for understanding\u2014not information overload.", 56, 357, { font: F.display, size: 20, color: C.muted, width: 660, lineHeight: 32 });
    button(hero, "Explore the library  \u2192", 56, 467, 218, "primary");
    button(hero, "Open demo", 286, 467, 138, "ghost");
    [["\u2713", "Visual notes"], ["\u2713", "Interactive simulations"], ["\u2713", "Video lectures coming soon"]].forEach(function (value, i) {
      const x = 56 + [0, 128, 328][i]; text(hero, "Proof / Check / " + i, value[0], x, 552, { font: F.bold, size: 14, color: C.green });
      text(hero, "Proof / " + i, value[1], x + 24, 552, { font: F.display, size: 14, color: C.muted });
    });
    motionCard(hero, 788, 80, 580, 554);

    const notes = frame(root, "Section / 02 / Visual notes", 0, 787, 1440, 598, C.bg);
    text(notes, "Heading", "Notes designed to help you see\nthe logic.", 56, 127, { font: F.displayBold, size: 46, width: 680, lineHeight: 54 });
    text(notes, "Description", "Each topic brings together diagrams, definitions, derivations, formulas, and common mistakes in one focused reading experience.", 856, 139, { font: F.display, size: 18, color: C.muted, width: 500, lineHeight: 31 });
    subjectCard(notes, 56, 281, 424, "Physics", "\u2297", "Diagrams, physical intuition, derivations, and interactive models.");
    subjectCard(notes, 500, 281, 424, "Chemistry", "\u25B3", "Visual structures, reaction logic, trends, and concise revision maps.");
    subjectCard(notes, 944, 281, 424, "Mathematics", "\u03A3", "Step-by-step reasoning, geometric meaning, and worked patterns.");

    const simulations = frame(root, "Section / 03 / Simulation Lab", 0, 1385, 1440, 529, C.surface, C.hair);
    text(simulations, "Lab icon", "\u25B3", 56, 82, { font: F.mono, size: 34, color: C.cyan });
    text(simulations, "Heading", "The Simulation Lab", 56, 136, { font: F.displayBold, size: 46 });
    text(simulations, "Description", "Turn formulas into behaviour. Predict the result, change the inputs, and build intuition you can carry into a JEE question.", 56, 200, { font: F.display, size: 18, color: C.muted, width: 570, lineHeight: 31 });
    const control = frame(simulations, "Feature / Controls", 56, 309, 282, 76, C.bg, C.hair);
    text(control, "Icon", "\u2195", 18, 25, { font: F.mono, size: 19, color: C.ember }); text(control, "Copy", "Control variables and\ncompare outcomes.", 54, 15, { font: F.display, size: 14, color: C.muted, lineHeight: 23 });
    const graphs = frame(simulations, "Feature / Graphs", 350, 309, 282, 76, C.bg, C.hair);
    text(graphs, "Icon", "\u25CE", 18, 25, { font: F.mono, size: 19, color: C.cyan }); text(graphs, "Copy", "See graphs and motion\nupdate together.", 54, 15, { font: F.display, size: 14, color: C.muted, lineHeight: 23 });
    button(simulations, "Open the Simulation Lab  \u2192", 56, 413, 244, "outline");
    const telemetry = frame(simulations, "Simulation preview / Vertical throw", 760, 87, 608, 356, C.bg, C.line);
    text(telemetry, "Title", "Vertical throw", 32, 31, { font: F.displayBold, size: 24 }); text(telemetry, "Status", "Live", 530, 35, { font: F.displayBold, size: 14, color: C.green });
    rect(telemetry, "Slider track", 32, 107, 544, 8, C.soft); rect(telemetry, "Slider fill", 32, 107, 337, 8, C.orange);
    text(telemetry, "Slider label", "Launch speed", 32, 132, { font: F.display, size: 14, color: C.muted }); text(telemetry, "Slider value", "9.8 m/s", 516, 132, { font: F.displayBold, size: 14 });
    [["Time", "2.00 s"], ["Velocity", "-9.80 m/s"], ["Height", "0.00 m"]].forEach(function (value, i) {
      const stat = frame(telemetry, "Telemetry / " + value[0], 32 + i * 181, 227, 180, 92, C.surface, C.hair);
      text(stat, "Label", value[0], 16, 18, { font: F.display, size: 12, color: C.muted }); text(stat, "Value", value[1], 16, 49, { font: F.bold, size: 16, color: C.cyan });
    });

    const testimonials = frame(root, "Section / 04 / Student testimonials", 0, 1914, 1440, 761, C.bg);
    text(testimonials, "Heading", "Built for the moment a concept\nfinally clicks.", 56, 119, { font: F.displayBold, size: 46, width: 730, lineHeight: 54 });
    text(testimonials, "Description", "Students use the notes and labs to replace disconnected formulas with a picture they can reason through.", 856, 132, { font: F.display, size: 18, color: C.muted, width: 500, lineHeight: 31 });
    quoteCard(testimonials, 56, 285, 424, "Meera Iyer", "JEE 2027 aspirant \u00B7 Chennai", "The derivation ladders show me exactly where each result comes from. I revise faster because I am no longer memorising disconnected formulas.");
    quoteCard(testimonials, 500, 285, 424, "Aryan Kapoor", "Class 11 \u00B7 Jaipur", "The simulations make a difficult graph feel obvious. I can change one variable, predict the result and immediately test my reasoning.");
    quoteCard(testimonials, 944, 285, 424, "Sana Khan", "JEE 2026 aspirant \u00B7 Hyderabad", "I like that progress means finishing the work, not collecting points. The notebook stays calm even when my week is busy.");

    const educators = frame(root, "Section / 05 / Educator access", 0, 2675, 1440, 444, C.surface, C.hair);
    text(educators, "Icon", "\u25B3", 56, 75, { font: F.mono, size: 34, color: C.ember });
    text(educators, "Heading", "A dedicated entry for educators.", 56, 132, { font: F.displayBold, size: 46 });
    text(educators, "Description", "Invited teachers and academic contributors can sign in through the educator entry to access their Orange Nelumbo workspace.", 56, 198, { font: F.display, size: 18, color: C.muted, width: 690, lineHeight: 31 });
    button(educators, "Educator login  \u2192", 56, 308, 180, "primary");
    const educatorCard = frame(educators, "Educator access card", 856, 75, 512, 294, C.bg, C.line); grid(educatorCard, "Card grid", 0, 0, 512, 294, 46, C.orange, 0.045);
    rect(educatorCard, "Avatar", 28, 28, 48, 48, C.orange); text(educatorCard, "Avatar glyph", "E", 28, 40, { font: F.bold, size: 18, color: C.bg, width: 48, align: "CENTER" });
    text(educatorCard, "Title", "Educator access", 96, 32, { font: F.displayBold, size: 20 }); text(educatorCard, "Meta", "For invited accounts", 96, 60, { font: F.display, size: 13, color: C.muted });
    rule(educatorCard, "Divider", 28, 98, 456, C.hair);
    ["Separate educator sign-in entry", "Access tied to an invited account", "Student learning remains in its own workspace"].forEach(function (label, i) { text(educatorCard, "Check / " + i, "\u2713", 28, 126 + i * 45, { font: F.bold, size: 13, color: C.green }); text(educatorCard, "Item / " + i, label, 55, 126 + i * 45, { font: F.display, size: 14, color: C.muted }); });

    const videos = frame(root, "Section / 06 / Future video lectures", 0, 3119, 1440, 573, C.bg);
    const videoCard = frame(videos, "Video lectures panel", 56, 112, 1312, 349, C.surface, C.line); grid(videoCard, "Panel grid", 0, 0, 1312, 349, 46, C.orange, 0.05);
    text(videoCard, "Icon", "\u25B7", 56, 51, { font: F.mono, size: 34, color: C.ember });
    text(videoCard, "Heading", "Visual-first video lectures are coming.", 56, 108, { font: F.displayBold, size: 46, width: 850, lineHeight: 54 });
    text(videoCard, "Description", "Videos will connect directly to the same notes and simulations, so every topic stays part of one clear learning path.", 56, 181, { font: F.display, size: 18, color: C.muted, width: 760, lineHeight: 31 });
    button(videoCard, "Start with the notes  \u2192", 1045, 240, 210, "primary");

    const faqs = frame(root, "Section / 07 / FAQs", 0, 3692, 1440, 686, C.surface, C.hair);
    text(faqs, "Heading", "Frequently asked\nquestions", 56, 92, { font: F.displayBold, size: 46, width: 500, lineHeight: 54 });
    text(faqs, "Description", "Clear answers about the current library, future videos, simulations, and educator access.", 56, 226, { font: F.display, size: 18, color: C.muted, width: 420, lineHeight: 31 });
    button(faqs, "Visit the help centre  \u2192", 56, 331, 206, "ghost");
    const questions = [
      ["What does Orange Nelumbo offer today?", "The current learning library focuses on visual notes and interactive simulations for JEE Physics, Chemistry, and Mathematics."],
      ["Are the notes useful for JEE Main and JEE Advanced?", ""], ["How does the Simulation Lab help?", ""], ["Are video lectures available now?", ""], ["Who can use educator access?", ""], ["Can I save notes and continue later?", ""]
    ];
    let faqY = 86;
    questions.forEach(function (value, i) {
      const h = i === 0 ? 126 : 73, item = frame(faqs, "FAQ / " + String(i + 1).padStart(2, "0"), 590, faqY, 778, h, null);
      rule(item, "Top border", 0, 0, 778, C.line); text(item, "Question", value[0], 0, 24, { font: F.displayBold, size: 18, width: 700, lineHeight: 25 }); text(item, "Toggle", i === 0 ? "-" : "+", 742, 22, { font: F.display, size: 22, color: C.ember });
      if (value[1]) text(item, "Answer", value[1], 0, 63, { font: F.display, size: 14, color: C.muted, width: 720, lineHeight: 22 }); faqY += h;
    });

    publicFooter(root, 4378); return root;
  }

  function homeFrame(page, index) {
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / Home / /", 0, 0, 1440, 7072, C.bg);
    root.clipsContent = true; root.setPluginData("route", "/"); publicHeader(root);

    const hero = frame(root, "Section / 01 / Hero", 0, 74, 1440, 720, C.bg, C.line);
    grid(hero, "Hero grid", 0, 0, 1440, 720, 46, C.orange, 0.055);
    text(hero, "Heading / Line 1", "JEE concepts", 56, 175, { font: F.displayBold, size: 72, width: 650, lineHeight: 76 });
    text(hero, "Heading / Line 2", "made", 56, 262, { font: F.displayBold, size: 72, width: 230, lineHeight: 76 });
    text(hero, "Heading / Accent", "visible.", 286, 262, { font: F.displayBold, size: 72, color: C.orange, width: 320, lineHeight: 76 });
    text(hero, "Description", "Learn Physics, Chemistry, and Mathematics through visual notes and interactive simulations built for understanding—not information overload.", 56, 375, { font: F.display, size: 20, color: C.muted, width: 660, lineHeight: 32 });
    button(hero, "Explore free simulations  →", 56, 485, 250, "primary"); button(hero, "Preview visual notes", 318, 485, 190, "ghost");
    [["Visual notes", 56], ["Interactive simulations", 208], ["Videos in future", 408]].forEach(function (value) { text(hero, "Proof / Check / " + value[0], "✓", value[1], 570, { font: F.bold, size: 14, color: C.green }); text(hero, "Proof / " + value[0], value[0], value[1] + 23, 570, { font: F.display, size: 14, color: C.muted }); });
    const canvas = frame(hero, "Hero visual / Live concept canvas", 760, 76, 624, 568, C.surface, C.line); grid(canvas, "Canvas grid", 0, 0, 624, 568, 46, C.orange, 0.035);
    text(canvas, "Live indicator", "■  LIVE CONCEPT CANVAS", 20, 18, { font: F.mono, size: 10, color: C.green }); text(canvas, "Model count", "05 MODELS / LOOP", 482, 18, { font: F.mono, size: 10, color: C.ember }); rule(canvas, "Header divider", 0, 48, 624, C.hair);
    const canvasItems = [
      ["01 / KINEMATICS", "Vertical throw", C.ember, "↑\n●\n↓"],
      ["02 / WAVES", "Interference", C.cyan, "∿  ∿"],
      ["03 / ATOMIC", "Orbital probability", "#B48CFF", "⊙"],
      ["04 / CALCULUS", "Function transform", C.green, "∫  ↗"]
    ];
    canvasItems.forEach(function (value, i) {
      const item = frame(canvas, "Looping model / " + value[1], (i % 2) * 312, 49 + Math.floor(i / 2) * 236, 312, 236, C.bg, C.hair);
      text(item, "Code", value[0], 18, 18, { font: F.mono, size: 9, color: value[2] });
      text(item, "Visual", value[3], 0, 64, { font: F.mono, size: i === 2 ? 58 : 30, color: value[2], width: 312, align: "CENTER", lineHeight: 39 });
      text(item, "Title", value[1], 18, 198, { font: F.displayBold, size: 15 });
    });
    rule(canvas, "Ticker divider", 0, 521, 624, C.hair); text(canvas, "Ticker", "PHY-01 VERTICAL THROW    CHM-01 ORBITALS    MAT-01 FUNCTION TRANSFORM", 20, 539, { font: F.mono, size: 9, color: C.muted });

    const simulations = frame(root, "Section / 02 / Simulations Lab", 0, 794, 1440, 735, C.bg);
    text(simulations, "Heading", "A lab that turns formulas into behaviour.", 56, 104, { font: F.displayBold, size: 46, width: 690, lineHeight: 54 });
    text(simulations, "Description", "Play with five free simulations. Change one input, predict the outcome, and see the relationship respond.", 856, 112, { font: F.display, size: 18, color: C.muted, width: 500, lineHeight: 31 }); button(simulations, "Explore free simulations  →", 856, 228, 238, "outline");
    const simNames = [["Vertical throw", "Physics", C.ember], ["Projectile range", "Physics", C.amber], ["Spring oscillator", "Physics", C.cyan], ["Electric field", "Physics", C.green], ["Function grapher", "Mathematics", "#B48CFF"]];
    simNames.forEach(function (value, i) {
      const w = 1312 / 5, card = frame(simulations, "Demo / " + value[0], 56 + i * w, 330, w, 314, C.surface, C.line);
      text(card, "Number", "0" + (i + 1), 20, 20, { font: F.mono, size: 10, color: C.muted }); text(card, "Icon", i === 4 ? "Σ" : i === 2 ? "∿" : "⊙", w - 44, 20, { font: F.mono, size: 17, color: value[2] });
      text(card, "Subject", value[1].toUpperCase(), 20, 156, { font: F.mono, size: 9, color: C.muted }); text(card, "Title", value[0], 20, 184, { font: F.displayBold, size: 19, width: w - 40 });
      text(card, "Action", "Play demo  →", 20, 258, { font: F.displayBold, size: 13, color: C.ember });
    });

    const notes = frame(root, "Section / 03 / Sample notes", 0, 1529, 1440, 711, C.surface, C.hair);
    text(notes, "Heading", "Preview the logic before opening the full note.", 56, 92, { font: F.displayBold, size: 46, width: 710, lineHeight: 54 });
    text(notes, "Description", "Five sample notes show how diagrams, relationships, and retention points fit together across all three subjects.", 856, 100, { font: F.display, size: 18, color: C.muted, width: 500, lineHeight: 31 }); button(notes, "Browse sample notes  →", 856, 212, 212, "primary");
    const noteNames = [["Motion under gravity", "PHYSICS · KINEMATICS", "v² = u² + 2as", C.ember], ["Electric field & potential", "PHYSICS · ELECTROSTATICS", "E = −dV / dr", C.cyan], ["Chemical bonding", "CHEMISTRY · INORGANIC", "SN = σ + LP", C.green], ["Entropy & spontaneity", "CHEMISTRY · THERMODYNAMICS", "ΔG = ΔH − TΔS", C.yellow], ["Integration as accumulation", "MATHEMATICS · CALCULUS", "∫ f(x)dx", "#B48CFF"]];
    noteNames.forEach(function (value, i) {
      const w = 250, card = frame(notes, "Note preview / " + value[0], 56 + i * 266, 314, w, 318, C.paper, C.hair); rect(card, "Accent", 0, 0, w, 7, value[3]);
      text(card, "Icon", i < 2 ? "⊗" : i < 4 ? "△" : "Σ", 20, 28, { font: F.mono, size: 18, color: value[3] }); text(card, "Meta", value[1], 20, 104, { font: F.mono, size: 8, color: C.soft });
      text(card, "Title", value[0], 20, 135, { font: F.displayBold, size: 18, color: C.surface, width: 210, lineHeight: 24 }); const formula = frame(card, "Formula", 20, 206, 210, 56, "#FFF5EE"); rect(formula, "Formula accent", 0, 0, 2, 56, C.orange); text(formula, "Relationship", value[2], 14, 16, { font: F.displayBold, size: 17, color: C.surface }); text(card, "Action", "Open preview  →", 20, 282, { font: F.displayBold, size: 12, color: "#8A2F0A" });
    });

    const utility = frame(root, "Section / 04 / Marginal utility", 0, 2240, 1440, 870, C.bg);
    const curve = frame(utility, "Marginal utility / Visual", 56, 111, 620, 620, C.surface, C.line); grid(curve, "Visual grid", 0, 0, 620, 620, 46, C.orange, 0.04); text(curve, "Title", "Useful understanding", 28, 28, { font: F.displayBold, size: 23 }); text(curve, "Label", "NEXT ACTION", 494, 33, { font: F.mono, size: 9, color: C.green });
    rect(curve, "Y axis", 55, 115, 1, 410, C.muted, null, 0, 0.45); rect(curve, "X axis", 55, 524, 510, 1, C.muted, null, 0, 0.45);
    const bars = [52, 112, 176, 236, 292, 338, 373, 397, 414, 425]; bars.forEach(function (height, i) { rect(curve, "Utility curve / " + i, 74 + i * 47, 524 - height, 30, height, C.orange, null, 0, 0.12 + i * 0.055); });
    rect(curve, "Focus line", 196, 114, 1, 410, C.cyan, null, 0, 0.65); ellipse(curve, "Focus point", 190, 285, 13, 13, C.cyan); const callout = frame(curve, "Next action callout", 224, 216, 280, 98, C.bg, C.hair); text(callout, "Copy", "The next focused connection adds more than another hour of passive rereading.", 16, 15, { font: F.display, size: 13, color: C.muted, width: 248, lineHeight: 21 }); text(curve, "Axis label", "STUDY EFFORT  →", 436, 545, { font: F.mono, size: 9, color: C.muted });
    text(utility, "Heading", "Make every extra minute earn its place.", 760, 118, { font: F.displayBold, size: 46, width: 610, lineHeight: 54 }); text(utility, "Description", "Marginal utility is the usefulness of your next study action. It is not an adaptive score—it is a way to move from seeing, to testing, to remembering.", 760, 258, { font: F.display, size: 18, color: C.muted, width: 580, lineHeight: 31 });
    ["See the mechanism", "Change one variable", "Retrieve the idea", "Revisit the weak link"].forEach(function (label, i) { const row = frame(utility, "Utility step / " + label, 760, 408 + i * 86, 608, 86, null); rule(row, "Divider", 0, 0, 608, C.line); text(row, "Index", "0" + (i + 1), 0, 32, { font: F.mono, size: 10, color: C.ember }); text(row, "Title", label, 52, 27, { font: F.displayBold, size: 19 }); text(row, "Toggle", i === 0 ? "−" : "+", 574, 24, { font: F.display, size: 23, color: C.ember }); });

    const concept = frame(root, "Section / 05 / Concept map heat map", 0, 3110, 1440, 763, C.surface, C.hair);
    text(concept, "Heading", "See the chapter before you enter it.", 56, 124, { font: F.displayBold, size: 46, width: 520, lineHeight: 54 }); text(concept, "Description", "A concept map exposes the dependencies between topics. The heat view makes strong connections visible, so a chapter feels like a system rather than a list.", 56, 268, { font: F.display, size: 18, color: C.muted, width: 480, lineHeight: 31 });
    [[C.orange, "Strong dependency"], ["#9A421F", "Supporting link"], ["#49271F", "Light connection"]].forEach(function (value, i) { rect(concept, "Legend / " + value[1], 56 + i * 166, 430, 12, 12, value[0]); text(concept, "Legend label / " + value[1], value[1], 76 + i * 166, 428, { font: F.display, size: 11, color: C.muted }); });
    const heat = frame(concept, "Concept map / Heat map", 590, 92, 778, 580, C.bg, C.line); const columns = ["CONCEPT", "FOUNDATION", "CONNECT", "APPLY", "REVISIT"]; columns.forEach(function (label, i) { text(heat, "Column / " + label, label, i === 0 ? 22 : 180 + (i - 1) * 145, 24, { font: F.mono, size: 8, color: C.muted }); });
    const rowsData = [["Motion", [1, .75, .55, .28]], ["Forces", [.72, 1, .78, .36]], ["Energy", [.48, .82, 1, .52]], ["Rotation", [.28, .56, .86, 1]], ["Electrostatics", [.62, .92, .64, .42]], ["Optics", [.36, .58, .74, .88]]];
    rowsData.forEach(function (value, r) { const y = 64 + r * 81; rule(heat, "Row divider / " + r, 18, y, 742, C.hair); text(heat, "Row index / " + r, "0" + (r + 1), 22, y + 31, { font: F.mono, size: 9, color: C.ember }); text(heat, "Row label / " + value[0], value[0], 54, y + 27, { font: F.displayBold, size: 14 }); value[1].forEach(function (strength, c) { const cell = rect(heat, "Heat / " + value[0] + " / " + c, 176 + c * 145, y + 12, 124, 58, C.orange, C.line, 0, 0.08 + strength * 0.78); text(heat, "Heat value / " + value[0] + " / " + c, Math.round(strength * 100), 176 + c * 145, y + 33, { font: F.mono, size: 9, color: C.paper, width: 124, align: "CENTER" }); }); });

    const pricing = frame(root, "Section / 06 / Pricing", 0, 3873, 1440, 970, C.bg);
    text(pricing, "Heading", "Choose how much of the visual library you need.", 56, 102, { font: F.displayBold, size: 46, width: 720, lineHeight: 54 }); text(pricing, "Description", "Three clear annual plans. No adaptive engine, no unrelated test-prep features, and no hidden product layer.", 856, 112, { font: F.display, size: 18, color: C.muted, width: 500, lineHeight: 31 });
    const planData = [["Notes", "₹4,999", "A focused visual notebook across Physics, Chemistry, and Mathematics.", ["Complete visual note library", "Five public sample notes", "Protected full-page reader", "Bookmarks and reading progress"]], ["Notes + Simulations", "₹6,999", "Connect every important relationship with a model you can control.", ["Everything in Notes", "Complete simulation library", "Variable controls and live graphs", "New labs added through the year"]], ["Complete Library", "₹9,999", "The full visual collection, including lectures as they are released.", ["Everything in Notes + Simulations", "Video lectures as released", "Educator-curated visual sequences", "All future library additions this year"]]];
    planData.forEach(function (value, i) { const plan = frame(pricing, "Plan / " + value[0], 56 + i * 444, 298, 424, 574, i === 1 ? C.raised : C.surface, i === 1 ? C.orange : C.hair); if (i === 1) { const tag = frame(plan, "Most visual", 290, 0, 134, 32, C.orange); text(tag, "Label", "MOST VISUAL", 0, 10, { font: F.mono, size: 8, color: C.bg, width: 134, align: "CENTER" }); } text(plan, "Name", value[0], 28, 34, { font: F.displayBold, size: 24 }); text(plan, "Price", value[1], 28, 106, { font: F.displayBold, size: 39 }); text(plan, "Period", "/ year", 182, 127, { font: F.display, size: 13, color: C.muted }); text(plan, "Description", value[2], 28, 178, { font: F.display, size: 15, color: C.muted, width: 360, lineHeight: 25 }); value[3].forEach(function (feature, f) { text(plan, "Check / " + f, "✓", 28, 296 + f * 45, { font: F.bold, size: 12, color: C.green }); text(plan, "Feature / " + f, feature, 54, 294 + f * 45, { font: F.display, size: 13, color: C.muted, width: 330 }); }); button(plan, "Choose " + value[0], 28, 502, 368, i === 1 ? "primary" : "outline"); });

    const educators = frame(root, "Section / 07 / Educator login", 0, 4843, 1440, 278, C.orange);
    const educatorIcon = frame(educators, "Educator icon", 56, 86, 56, 56, null, C.bg); text(educatorIcon, "Glyph", "△", 0, 15, { font: F.mono, size: 22, color: C.bg, width: 56, align: "CENTER" }); text(educators, "Heading", "Educators get a separate door.", 142, 67, { font: F.displayBold, size: 42, color: C.bg }); text(educators, "Description", "Use educator login for exclusive academic content, contributor resources, and material prepared for invited teachers.", 142, 130, { font: F.display, size: 17, color: C.bg, width: 800, lineHeight: 28, opacity: 0.75 }); const educatorButton = frame(educators, "Button / Educator login", 1105, 104, 238, 52, C.bg); text(educatorButton, "Label", "Educator login  →", 0, 17, { font: F.bold, size: 14, width: 238, align: "CENTER" });

    const testimonials = frame(root, "Section / 08 / Student testimonials", 0, 5121, 1440, 787, C.bg);
    text(testimonials, "Heading", "What changes when the concept becomes visible.", 56, 103, { font: F.displayBold, size: 46, width: 720, lineHeight: 54 }); text(testimonials, "Description", "Students describe the shift from memorising isolated results to seeing how the ideas connect.", 856, 112, { font: F.display, size: 18, color: C.muted, width: 500, lineHeight: 31 });
    quoteCard(testimonials, 56, 304, 424, "Meera Iyer", "JEE 2027 aspirant · Chennai", "The derivation ladders show me exactly where each result comes from. I revise faster because I am no longer memorising disconnected formulas."); quoteCard(testimonials, 500, 304, 424, "Aryan Kapoor", "Class 11 · Jaipur", "The simulations make a difficult graph feel obvious. I can change one variable, predict the result and immediately test my reasoning."); quoteCard(testimonials, 944, 304, 424, "Sana Khan", "JEE 2026 aspirant · Hyderabad", "I like that progress means finishing the work, not collecting points. The notebook stays calm even when my week is busy.");

    const faqs = frame(root, "Section / 09 / FAQs and final CTA", 0, 5908, 1440, 720, C.surface, C.hair);
    text(faqs, "Icon", "✦", 56, 82, { font: F.displayBold, size: 26, color: C.ember }); text(faqs, "Heading", "Questions answered.\nTry the idea next.", 56, 131, { font: F.displayBold, size: 46, width: 520, lineHeight: 54 }); text(faqs, "Description", "Start with five simulations and five note previews. No sign-in is needed for either.", 56, 269, { font: F.display, size: 18, color: C.muted, width: 430, lineHeight: 31 }); button(faqs, "Start with a simulation  →", 56, 382, 226, "primary"); button(faqs, "Open a note", 294, 382, 142, "ghost");
    const faqNames = ["What can I use on Orange Nelumbo today?", "Can I try anything without signing in?", "Are these resources for JEE Main and Advanced?", "Is there an adaptive engine or test platform?", "How does educator access work?", "Do notes open inside the dashboard?"];
    let homeFaqY = 78; faqNames.forEach(function (label, i) { const h = i === 0 ? 128 : 76, item = frame(faqs, "FAQ / " + String(i + 1).padStart(2, "0"), 590, homeFaqY, 778, h, null); rule(item, "Divider", 0, 0, 778, C.line); text(item, "Question", label, 0, 24, { font: F.displayBold, size: 18, width: 710 }); text(item, "Toggle", i === 0 ? "−" : "+", 744, 22, { font: F.display, size: 22, color: C.ember }); if (i === 0) text(item, "Answer", "Visual notes and interactive simulations are available today. Video lectures are planned for a future release.", 0, 65, { font: F.display, size: 13, color: C.muted, width: 720, lineHeight: 21 }); homeFaqY += h; });

    publicFooter(root, 6628); return root;
  }

  function freeSimulationsFrame(page, route, index) {
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / Free Simulations / /free-simulations", 0, 0, 1440, 1958, C.bg);
    root.clipsContent = true; root.setPluginData("route", route.route); publicHeader(root);
    const hero = frame(root, "Section / 01 / Free simulations hero", 0, 74, 1440, 420, C.bg, C.line); grid(hero, "Hero grid", 0, 0, 1440, 420, 46, C.orange, 0.055);
    text(hero, "Availability", "FREE · NO SIGN-IN", 56, 72, { font: F.mono, size: 10, color: C.green }); text(hero, "Heading", "Five ideas you can move, test, and see.", 56, 112, { font: F.displayBold, size: 55, width: 970, lineHeight: 62 }); text(hero, "Description", "Change one variable, predict what happens, and use the visual response to connect the formula with its behaviour.", 56, 260, { font: F.display, size: 18, color: C.muted, width: 720, lineHeight: 31 });
    const lab = frame(root, "Section / 02 / Playable simulation lab", 0, 494, 1440, 800, C.bg);
    const nav = frame(lab, "Demo navigation", 56, 82, 280, 616, C.surface, C.line); ["Vertical throw", "Projectile range", "Spring oscillator", "Electric field", "Function grapher"].forEach(function (label, i) { const row = frame(nav, "Demo / " + label, 8, 8 + i * 120, 264, 112, i === 0 ? C.raised : null, i === 0 ? C.orange : C.hair); text(row, "Index", "0" + (i + 1) + " / " + (i === 4 ? "MATHEMATICS" : "PHYSICS"), 18, 20, { font: F.mono, size: 8, color: C.muted }); text(row, "Title", label, 18, 55, { font: F.displayBold, size: 16 }); text(row, "Arrow", "→", 228, 50, { font: F.display, size: 18, color: C.ember }); });
    const player = frame(lab, "Simulation player / Vertical throw", 356, 82, 1028, 616, C.surface, C.line); text(player, "Status", "PLAYABLE DEMO · NO SIGN-IN", 28, 25, { font: F.mono, size: 9, color: C.green }); text(player, "Title", "Vertical throw", 28, 55, { font: F.displayBold, size: 28 }); button(player, "Replay", 884, 26, 116, "ghost"); rule(player, "Header divider", 0, 112, 1028, C.hair);
    const visual = frame(player, "Animated model", 0, 113, 720, 503, C.bg); grid(visual, "Model grid", 0, 0, 720, 503, 46, C.orange, 0.035); rect(visual, "Flight path", 359, 66, 1, 320, C.muted, null, 0, 0.45); ellipse(visual, "Ball", 346, 96, 28, 28, C.amber); rule(visual, "Ground", 120, 400, 480, C.hair); text(visual, "Apex", "v = 0 at apex", 400, 88, { font: F.mono, size: 10, color: C.cyan });
    const controls = frame(player, "Control panel", 720, 113, 308, 503, C.surface, C.hair); text(controls, "Label", "CONTROL ONE VARIABLE", 24, 28, { font: F.mono, size: 9, color: C.ember }); text(controls, "Name", "Launch speed", 24, 78, { font: F.displayBold, size: 15 }); text(controls, "Value", "10 m/s", 224, 80, { font: F.mono, size: 12, color: C.cyan }); rect(controls, "Slider", 24, 125, 260, 6, C.soft); rect(controls, "Slider fill", 24, 125, 143, 6, C.orange); const tip = frame(controls, "Try this", 24, 185, 260, 128, C.bg, C.hair); rect(tip, "Accent", 0, 0, 2, 128, C.cyan); text(tip, "Title", "Try this", 16, 16, { font: F.displayBold, size: 13, color: C.cyan }); text(tip, "Copy", "Move the control slowly. Predict the change before the visual catches up.", 16, 47, { font: F.display, size: 13, color: C.muted, width: 224, lineHeight: 21 }); button(controls, "Run again", 24, 376, 260, "primary");
    const cta = frame(root, "Section / 03 / Membership CTA", 0, 1294, 1440, 220, C.surface, C.hair); text(cta, "Heading", "Ready for the complete library?", 56, 67, { font: F.displayBold, size: 34 }); text(cta, "Copy", "Keep the demos free. Join when you want the full notes and simulation collection.", 56, 120, { font: F.display, size: 16, color: C.muted }); button(cta, "Create an account  →", 1148, 84, 236, "primary"); publicFooter(root, 1514); return root;
  }

  function sampleNotesFrame(page, route, index) {
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / Sample Notes / /sample-notes", 0, 0, 1440, 2018, C.bg);
    root.clipsContent = true; root.setPluginData("route", route.route); publicHeader(root);
    const hero = frame(root, "Section / 01 / Sample notes hero", 0, 74, 1440, 420, C.bg, C.line); grid(hero, "Hero grid", 0, 0, 1440, 420, 46, C.orange, 0.055);
    text(hero, "Availability", "FIVE OPEN PREVIEWS", 56, 72, { font: F.mono, size: 10, color: C.ember }); text(hero, "Heading", "Notes that show the idea before compressing it.", 56, 112, { font: F.displayBold, size: 55, width: 1040, lineHeight: 62 }); text(hero, "Description", "Browse samples across Physics, Chemistry, and Mathematics. Each preview keeps the visual, formula, and key ideas in one readable unit.", 56, 260, { font: F.display, size: 18, color: C.muted, width: 780, lineHeight: 31 });
    const browserSection = frame(root, "Section / 02 / Note preview browser", 0, 494, 1440, 850, C.bg);
    const nav = frame(browserSection, "Note navigation", 56, 82, 310, 662, C.surface, C.line); ["Motion under gravity", "Electric field & potential", "Chemical bonding", "Entropy & spontaneity", "Integration as accumulation"].forEach(function (label, i) { const row = frame(nav, "Note / " + label, 8, 8 + i * 128, 294, 120, i === 0 ? C.raised : null, i === 0 ? C.orange : C.hair); text(row, "Index", "0" + (i + 1) + " / " + (i < 2 ? "PHYSICS" : i < 4 ? "CHEMISTRY" : "MATHEMATICS"), 18, 20, { font: F.mono, size: 8, color: C.muted }); text(row, "Title", label, 18, 55, { font: F.displayBold, size: 15, width: 240, lineHeight: 21 }); text(row, "Arrow", "→", 258, 51, { font: F.display, size: 18, color: C.ember }); });
    const sheet = frame(browserSection, "Paper note / Motion under gravity", 386, 82, 998, 662, C.paper, C.line); const ink = C.surface; text(sheet, "Meta", "PHYSICS · KINEMATICS", 34, 32, { font: F.mono, size: 9, color: C.soft }); text(sheet, "Counter", "SAMPLE 01 / 05", 844, 32, { font: F.mono, size: 9, color: C.soft }); text(sheet, "Title", "Motion under gravity", 34, 68, { font: F.displayBold, size: 31, color: ink }); rule(sheet, "Header divider", 0, 124, 998, "#D6D1C8"); text(sheet, "Summary", "Read velocity, displacement, and time as one connected picture.", 34, 158, { font: F.display, size: 16, color: "#4A454D", width: 560, lineHeight: 27 });
    const diagram = frame(sheet, "Concept diagram", 34, 218, 560, 244, "#FFFFFF", "#D6D1C8"); rule(diagram, "Ground", 56, 198, 448, "#9C969F"); rect(diagram, "Path", 279, 37, 1, 161, "#9C969F"); ellipse(diagram, "Ball / Launch", 267, 178, 25, 25, C.amber); ellipse(diagram, "Ball / Apex", 267, 33, 25, 25, C.amber); text(diagram, "Turning point", "turning point", 320, 32, { font: F.mono, size: 9, color: "#8A2F0A" });
    const formula = frame(sheet, "Core relationship", 34, 490, 560, 118, "#FFF0E8"); rect(formula, "Accent", 0, 0, 4, 118, C.orange); text(formula, "Label", "CORE RELATIONSHIP", 20, 20, { font: F.mono, size: 8, color: "#8A2F0A" }); text(formula, "Equation", "v² = u² + 2as", 20, 54, { font: F.displayBold, size: 28, color: ink });
    text(sheet, "Retain heading", "Three ideas to retain", 636, 160, { font: F.displayBold, size: 20, color: ink }); ["Acceleration stays downward", "Velocity becomes zero only at the apex", "Equal levels have equal speed magnitude"].forEach(function (label, i) { rect(sheet, "Index block / " + i, 636, 214 + i * 92, 28, 28, ink); text(sheet, "Index / " + i, "0" + (i + 1), 636, 222 + i * 92, { font: F.mono, size: 8, color: C.paper, width: 28, align: "CENTER" }); text(sheet, "Idea / " + i, label, 680, 215 + i * 92, { font: F.body, size: 13, color: "#4A454D", width: 265, lineHeight: 21 }); }); rule(sheet, "Aside divider", 636, 500, 322, "#D6D1C8"); text(sheet, "Format label", "PREVIEW FORMAT", 636, 530, { font: F.mono, size: 8, color: "#8A2F0A" }); text(sheet, "Format copy", "Every note can add its own visual, formula, and retention list without changing the layout.", 636, 561, { font: F.body, size: 13, color: "#4A454D", width: 300, lineHeight: 21 });
    const cta = frame(root, "Section / 03 / Full library CTA", 0, 1344, 1440, 230, C.surface, C.hair); text(cta, "Heading", "Continue with the full note library.", 56, 70, { font: F.displayBold, size: 34 }); text(cta, "Copy", "Open protected, distraction-free note pages after signing in.", 56, 124, { font: F.display, size: 16, color: C.muted }); button(cta, "Explore membership  →", 1148, 89, 236, "primary"); publicFooter(root, 1574); return root;
  }

  function authFrame(page, route, index) {
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / " + route.name + " / " + route.route, 0, 0, 1440, 900, C.bg);
    root.clipsContent = true; root.setPluginData("route", route.route);
    const left = frame(root, "Authentication / Brand panel", 0, 0, 756, 900, C.surface, C.hair);
    grid(left, "Brand grid", 0, 0, 756, 900, 46, C.orange, 0.045);
    ellipse(left, "Orbit / Outer", 355, -160, 540, 540, null, C.orange, 0.14);
    ellipse(left, "Orbit / Inner", 435, -80, 380, 380, null, C.orange, 0.10);
    lotus(left, 64, 42); text(left, "Brand", "ORANGE NELUMBO", 120, 53, { font: F.displayBold, size: 18 });
    text(left, "Statement", "Learn the idea. Test\nthe edge cases. Keep\nmoving.", 64, 282, { font: F.displayBold, size: 53, width: 610, lineHeight: 62 });
    text(left, "Description", "A focused JEE study system for notes, simulations, deliberate practice, and the small wins that compound.", 64, 472, { font: F.display, size: 18, color: C.muted, width: 520, lineHeight: 31 });
    const proof = [["\u2297", "Concept-first notes"], ["\u03A3", "JEE-level practice"], ["\u2197", "Progress that makes sense"]];
    proof.forEach(function (value, i) {
      const card = frame(left, "Proof / " + value[1], 64 + i * 196, 565, 184, 94, C.raised, C.hair);
      text(card, "Icon", value[0], 16, 15, { font: F.mono, size: 19, color: C.cyan }); text(card, "Label", value[1], 16, 49, { font: F.displayBold, size: 14, width: 150, lineHeight: 20 });
    });
    text(left, "System label", "ORANGE NELUMBO LEARNING SYSTEM  \u2197", 64, 848, { font: F.mono, size: 11, color: C.muted });

    const right = frame(root, "Authentication / Form panel", 756, 0, 684, 900, C.bg);
    const isEducator = route.name === "Educator Login", isSignup = route.name === "Signup", isForgot = route.name === "Forgot Password";
    const headingValue = isEducator ? "Educator sign in." : isSignup ? "Create your learning account." : isForgot ? "Reset your password." : "Welcome back.";
    const kickerValue = isEducator ? "EDUCATOR ACCESS" : isSignup ? "START WITH A CLEAR PLAN" : isForgot ? "ACCOUNT RECOVERY" : "STUDENT WORKSPACE";
    const descriptionValue = isEducator ? "Use the credentials associated with your invited Orange Nelumbo educator account." : isSignup ? "Save your notes, simulations, and reading progress on this device." : isForgot ? "Enter your account email to prepare a reset link in this front-end demonstration." : "Continue your visual notes and simulations from exactly where you stopped.";
    const top = isSignup ? 56 : 78;
    text(right, "Kicker", kickerValue, 86, top, { font: F.mono, size: 11, color: C.orange });
    text(right, "Heading", headingValue, 86, top + 31, { font: F.displayBold, size: isSignup ? 42 : 48, width: 520, lineHeight: 52 });
    text(right, "Description", descriptionValue, 86, top + (isSignup ? 91 : 94), { font: F.display, size: 16, color: C.muted, width: 500, lineHeight: 27 });
    if (isSignup) {
      ["\u2713  Visual notes", "\u2713  Interactive simulations", "\u2713  Saved progress on this device"].forEach(function (label, i) { text(right, "Benefit / " + i, label, 86 + i * 162, 190, { font: F.display, size: 13, color: i ? C.muted : C.cyan }); });
    }
    const formY = isSignup ? 226 : top + 155;
    const formH = isSignup ? 610 : isEducator ? 426 : isForgot ? 300 : 570;
    const card = frame(right, "Form card", 86, formY, 512, formH, C.surface, C.hair);
    const fields = isSignup ? ["Full name", "Email address", "Password", "Confirm password"] : isForgot ? ["Email address"] : ["Email address", "Password"];
    fields.forEach(function (label, i) {
      const twoColumn = isSignup && i >= 2, inputW = twoColumn ? 218 : 456;
      const fieldX = twoColumn ? 28 + (i - 2) * 238 : 28;
      const fieldY = isSignup ? (i < 2 ? 26 + i * 91 : 208) : 28 + i * 96;
      text(card, "Label / " + label, label, fieldX, fieldY, { font: F.displayBold, size: 14 });
      const input = frame(card, "Input / " + label, fieldX, fieldY + 28, inputW, 50, C.bg, C.line);
      text(input, "Placeholder", label === "Email address" && !isSignup ? "aarav@orangenelumbo.com" : label === "Full name" ? "Aarav Sharma" : label.indexOf("Password") >= 0 ? "8+ characters" : "you@example.com", 14, 15, { font: F.display, size: 14, color: C.muted });
    });
    if (!isSignup && !isForgot) text(card, "Forgot password", "Forgot password?", 350, 219, { font: F.displayBold, size: 13, color: C.ember });
    if (isSignup) {
      rect(card, "Demo consent", 28, 302, 16, 16, C.orange); text(card, "Consent copy", "I understand this prototype stores dummy account data only in this browser.", 56, 300, { font: F.display, size: 13, color: C.muted, width: 400, lineHeight: 21 });
      button(card, "Create my workspace  \u2192", 28, 363, 456, "primary");
      text(card, "Account link", "Already have a dummy account?  Sign in", 0, 442, { font: F.display, size: 13, color: C.muted, width: 512, align: "CENTER" });
    } else if (isForgot) {
      button(card, "Prepare reset link  \u2192", 28, 132, 456, "primary"); text(card, "Back", "\u2190  Back to sign in", 28, 218, { font: F.displayBold, size: 13, color: C.ember });
    } else {
      button(card, isEducator ? "Sign in as educator  \u2192" : "Sign in  \u2192", 28, 257, 456, "primary");
      if (isEducator) text(card, "Invite note", "Educator access is invite-only. Contact Orange Nelumbo if your account has not been activated.", 28, 334, { font: F.display, size: 13, color: C.muted, width: 456, lineHeight: 21 });
      else {
        text(card, "Divider label", "OR EXPLORE FIRST", 0, 332, { font: F.mono, size: 10, color: C.muted, width: 512, align: "CENTER" });
        button(card, "Open the student demo", 28, 370, 456, "outline");
        text(card, "Demo note", "Demo access loads a sample JEE 2027 profile. Nothing is submitted.", 0, 429, { font: F.display, size: 12, color: C.muted, width: 512, align: "CENTER" });
        const dummy = frame(card, "Dummy login", 28, 465, 456, 78, C.raised, C.hair);
        text(dummy, "Title", "Dummy login", 16, 12, { font: F.displayBold, size: 12 }); text(dummy, "Credentials", "aarav@orangenelumbo.com\norange2027", 16, 34, { font: F.mono, size: 11, color: C.muted, lineHeight: 17 });
      }
    }
    return root;
  }

  function onboardingFrame(page, route, index) {
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / Onboarding / /onboarding", 0, 0, 1440, 900, C.bg);
    root.clipsContent = true; root.setPluginData("route", "/onboarding"); grid(root, "Background grid", 0, 0, 1440, 900, 46, C.orange, 0.035);
    lotus(root, 64, 36); text(root, "Brand", "ORANGE NELUMBO", 120, 47, { font: F.displayBold, size: 18 }); text(root, "Progress meta", "PROFILE SETUP \u00B7 1 / 3", 1164, 51, { font: F.mono, size: 11, color: C.muted });
    const aside = frame(root, "Onboarding / Plan overview", 64, 150, 460, 650, null);
    text(aside, "Kicker", "WELCOME, AARAV", 0, 0, { font: F.mono, size: 11, color: C.orange });
    text(aside, "Heading", "Turn the syllabus into a plan you can actually follow.", 0, 38, { font: F.displayBold, size: 45, width: 450, lineHeight: 49 });
    text(aside, "Description", "Three quick choices personalise the front-end demo. They stay on this device and can be reset anytime.", 0, 202, { font: F.display, size: 16, color: C.muted, width: 430, lineHeight: 27 });
    rect(aside, "Progress track", 0, 306, 420, 6, C.soft); rect(aside, "Progress fill", 0, 306, 140, 6, C.orange);
    [["01", "Choose the target"], ["02", "Set a workable rhythm"], ["03", "Tune your starting point"]].forEach(function (value, i) {
      const y = 350 + i * 76; const marker = frame(aside, "Step / " + value[0], 0, y, 32, 32, null, i === 0 ? C.orange : C.hair); text(marker, "Index", value[0], 0, 9, { font: F.mono, size: 10, color: i === 0 ? C.orange : C.muted, width: 32, align: "CENTER" }); text(aside, "Label / " + value[0], value[1], 48, y + 5, { font: F.bold, size: 14, color: i === 0 ? C.paper : C.muted });
    });
    const card = frame(root, "Onboarding / Step 1 card", 590, 132, 786, 700, C.surface, C.hair);
    outlinedIcon(card, "Target", 40, 38, "\u25CE", C.orange); text(card, "Step", "STEP 1", 40, 112, { font: F.mono, size: 10, color: C.orange }); text(card, "Heading", "Choose the target", 40, 139, { font: F.bold, size: 30 }); text(card, "Description", "Set the exam and academic stage that shape your plan.", 40, 182, { size: 14, color: C.muted });
    text(card, "Exam label", "Primary exam target", 40, 239, { font: F.bold, size: 14 });
    [["JEE Main", "Speed, coverage, and accuracy"], ["JEE Advanced", "Depth, combinations, and edge cases"]].forEach(function (value, i) {
      const choice = frame(card, "Choice / " + value[0], 40 + i * 344, 272, 324, 98, i === 1 ? C.raised : C.bg, i === 1 ? C.orange : C.hair); text(choice, "Title", value[0], 18, 22, { font: F.bold, size: 16 }); text(choice, "Description", value[1], 18, 51, { size: 12, color: C.muted }); rect(choice, "Check", 282, 14, 20, 20, i === 1 ? C.orange : null, i === 1 ? null : C.hair);
    });
    [["Academic stage", ["Class 11", "Class 12", "Dropper"]], ["Target year", ["JEE 2027", "JEE 2028", "JEE 2029"]]].forEach(function (group, gi) {
      const gx = 40 + gi * 344; text(card, "Label / " + group[0], group[0], gx, 414, { font: F.bold, size: 14 }); group[1].forEach(function (label, i) { const choice = frame(card, "Choice / " + label, gx, 448 + i * 52, 324, 42, i === 0 ? C.raised : C.bg, i === 0 ? C.orange : C.hair); text(choice, "Label", label, 14, 13, { font: gi ? F.mono : F.bold, size: 13, color: i === 0 ? C.paper : C.muted }); });
    });
    rule(card, "Action divider", 40, 626, 708, C.hair); text(card, "Recommended", "Use recommended setup", 40, 655, { font: F.bold, size: 13, color: C.muted }); button(card, "Continue  \u2192", 584, 640, 164, "primary");
    return root;
  }

  function noteSection(parent, number, title, subtitle, y, height) {
    const node = frame(parent, "Lesson section / " + String(number).padStart(2, "0") + " / " + title, 0, y, 860, height, C.bg);
    rule(node, "Top border", 0, 0, 860, C.line);
    text(node, "Number", String(number).padStart(2, "0"), 0, 45, { font: F.mono, size: 14, color: C.ember });
    text(node, "Heading", title, 42, 37, { font: F.bold, size: 34, width: 760, lineHeight: 41 });
    text(node, "Subtitle", subtitle, 42, 89, { size: 15, color: C.muted, width: 720, lineHeight: 25 });
    return node;
  }

  function readerFrame(page, route, index) {
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / Protected Note Reader / " + route.route, 0, 0, 1440, 5320, C.bg);
    root.clipsContent = true; root.setPluginData("route", route.route);
    const header = frame(root, "Global / Protected Reader Header", 0, 0, 1440, 64, C.bg, C.hair);
    text(header, "Back", "\u2190  Notes library", 40, 22, { font: F.bold, size: 14, color: C.muted }); lotus(header, 688, 12); text(header, "Protection", "\u25A1  Protected reader", 1244, 23, { font: F.medium, size: 12, color: C.green });
    const hero = frame(root, "Reader / Lesson hero", 0, 64, 1440, 430, C.bg, C.line); grid(hero, "Hero grid", 0, 0, 1440, 430, 46, C.orange, 0.055);
    text(hero, "Breadcrumb", "Learn  /  Physics  /  Kinematics  /  Motion under gravity", 60, 35, { size: 13, color: C.muted });
    [["KIN-006 \u2192 011", C.ember], ["42% READ", C.yellow], ["CONCEPTS C1-C5", C.cyan]].forEach(function (value, i) { const badge = frame(hero, "Badge / " + i, 60 + i * 150, 84, 134, 28, null, value[1]); text(badge, "Label", value[0], 0, 8, { font: F.mono, size: 9, color: value[1], width: 134, align: "CENTER" }); });
    text(hero, "Title", "Motion under gravity", 60, 137, { font: F.bold, size: 44, width: 850, lineHeight: 52 });
    text(hero, "Summary", "Build the equations from one clean sign convention, connect the graph to the motion, and recognise the special cases JEE repeats.", 60, 205, { size: 18, color: C.muted, width: 820, lineHeight: 30 });
    text(hero, "Metadata", "38 MIN     JEE MAIN + ADVANCED     \u25B3 INTERACTIVE LAB", 60, 292, { font: F.mono, size: 11, color: C.muted });
    button(hero, "Bookmark", 986, 187, 120, "ghost"); button(hero, "Print / PDF", 1118, 187, 126, "ghost"); button(hero, "Mark complete", 1256, 187, 140, "primary");
    text(hero, "Progress label", "Reading progress", 60, 354, { font: F.bold, size: 13, color: C.muted }); text(hero, "Progress value", "42%", 680, 354, { font: F.mono, size: 12, color: C.cyan }); rect(hero, "Progress track", 60, 384, 660, 10, C.soft); rect(hero, "Progress fill", 60, 384, 277, 10, C.orange);

    const shell = frame(root, "Reader / Content shell", 60, 494, 1320, 4660, C.bg);
    const toc = frame(shell, "Reader / Table of contents", 0, 0, 220, 660, C.bg);
    text(toc, "Title", "ON THIS PAGE", 0, 42, { font: F.mono, size: 10, color: C.muted });
    ["Basic theory", "Notation", "Derivation", "Special cases", "Worked examples", "Interactive lab"].forEach(function (label, i) {
      const active = i === 0; if (active) rect(toc, "Active indicator", 0, 84 + i * 50, 2, 44, C.orange);
      text(toc, "Link / " + label, String(i + 1).padStart(2, "0") + "  " + label, 16, 98 + i * 50, { font: F.medium, size: 13, color: active ? C.paper : C.muted });
    });
    const chapter = frame(toc, "Chapter topics", 0, 430, 190, 210, C.surface, C.hair); text(chapter, "Label", "CHAPTER \u00B7 TOPICS", 16, 17, { font: F.mono, size: 9, color: C.ember }); text(chapter, "Title", "Kinematics", 16, 43, { font: F.bold, size: 18 }); ["Motion in a straight line", "Motion under gravity", "Relative motion", "Projectile motion"].forEach(function (label, i) { text(chapter, "Topic / " + i, label, 16, 82 + i * 29, { size: 11, color: i === 1 ? C.paper : C.muted }); });
    const article = frame(shell, "Reader / Article", 270, 0, 860, 4660, C.bg);

    const theory = noteSection(article, 1, "Basic theory", "Read the motion as one continuous story: ascent, apex, and descent all share the same downward acceleration.", 0, 620);
    text(theory, "Body", "A body thrown vertically upward slows because gravity acts downward. At the highest point its velocity is zero for an instant, but its acceleration remains g downward.", 42, 142, { size: 16, color: C.silver, width: 750, lineHeight: 29 });
    const phase = frame(theory, "Visual / Three phases", 42, 250, 750, 282, C.surface, C.line); grid(phase, "Grid", 0, 0, 750, 282, 38, C.orange, 0.04);
    ["ASCENT", "APEX", "DESCENT"].forEach(function (label, i) { const x = 38 + i * 236; text(phase, "Phase / " + label, label, x, 30, { font: F.mono, size: 10, color: i === 1 ? C.cyan : C.ember }); rect(phase, "Path / " + label, x + 86, 75, 1, 130, C.muted, null, 0, 0.45); ellipse(phase, "Ball / " + label, x + 75, 69 + (i === 1 ? 0 : i === 0 ? 92 : 45), 24, 24, C.amber); text(phase, "Signal / " + label, i === 0 ? "v upward, speed falling" : i === 1 ? "v = 0, a = -g" : "v downward, speed rising", x, 224, { size: 12, color: C.muted, width: 190, align: "CENTER" }); });

    const notation = noteSection(article, 2, "Notation", "Keep the sign convention visible before substituting values.", 620, 560);
    [["u", "Initial velocity"], ["v", "Velocity after time t"], ["a", "Acceleration = -g"], ["s", "Displacement"], ["t", "Elapsed time"], ["g", "9.8 m/s\u00B2 downward"]].forEach(function (value, i) { const col = i % 3, row = Math.floor(i / 3), card = frame(notation, "Definition / " + value[0], 42 + col * 252, 174 + row * 145, 236, 128, C.surface, C.hair); text(card, "Symbol", value[0], 18, 17, { font: F.displayBold, size: 31, color: C.yellow }); text(card, "Term", value[1], 18, 66, { font: F.bold, size: 14, width: 200, lineHeight: 21 }); });

    const derivation = noteSection(article, 3, "Derivation", "Start from constant acceleration and carry the negative sign through every step.", 1180, 760);
    [["01", "v = u - gt", "Velocity-time relation"], ["02", "s = ut - 1/2 gt\u00B2", "Displacement-time relation"], ["03", "v\u00B2 = u\u00B2 - 2gs", "Time-free relation"]].forEach(function (value, i) { const row = frame(derivation, "Formula / " + value[0], 42, 170 + i * 120, 750, 104, C.surface, C.line); text(row, "Step", "STEP " + value[0], 20, 19, { font: F.mono, size: 10, color: C.muted }); text(row, "Formula", value[1], 130, 17, { font: F.displayBold, size: 25, color: C.paper }); text(row, "Explanation", value[2], 130, 58, { size: 13, color: C.muted }); });
    const graph = frame(derivation, "Visual / Velocity-time graph", 42, 548, 750, 150, C.bg, C.hair); rect(graph, "Y axis", 80, 25, 1, 102, C.muted); rect(graph, "X axis", 80, 93, 610, 1, C.muted); const line = rect(graph, "v-t line", 120, 36, 500, 3, C.cyan); line.rotation = 10; text(graph, "Apex", "v = 0", 365, 73, { font: F.mono, size: 10, color: C.ember });

    const cases = noteSection(article, 4, "Special cases", "These are the shortcuts worth deriving once and then recognising quickly.", 1940, 670);
    [["C1", "Time to reach the top", "t = u/g"], ["C2", "Maximum height", "H = u\u00B2/2g"], ["C3", "Total time of flight", "T = 2u/g"], ["C4", "Same height on return", "speed magnitude repeats"]].forEach(function (value, i) { const row = frame(cases, "Special case / " + value[0], 42, 165 + i * 108, 750, 92, C.surface, C.line); const badge = frame(row, "Badge", 18, 18, 52, 26, null, C.orange); text(badge, "Label", value[0], 0, 8, { font: F.mono, size: 9, color: C.ember, width: 52, align: "CENTER" }); text(row, "Title", value[1], 92, 17, { font: F.bold, size: 17 }); text(row, "Expression", value[2], 500, 20, { font: F.mono, size: 13, color: C.cyan }); text(row, "Trigger", "Recognise the constraint before choosing the equation.", 92, 53, { size: 12, color: C.muted }); });

    const examples = noteSection(article, 5, "Worked examples", "Each example names the setup, attack, trap, and finishing line.", 2610, 870);
    ["Find the maximum height", "Return to the launch point"].forEach(function (title, i) { const card = frame(examples, "Worked example / " + String(i + 1).padStart(2, "0"), 42, 168 + i * 315, 750, 285, C.surface, C.line); text(card, "Concept", "C" + (i + 1) + "  \u00B7  JEE PATTERN", 20, 18, { font: F.mono, size: 10, color: C.ember }); rule(card, "Divider", 0, 50, 750, C.hair); text(card, "Title", title, 52, 78, { font: F.bold, size: 24 }); [["THE SETUP", "Translate the words into u, v, a, s, and t."], ["HOW TO ATTACK", "Choose the equation that removes the missing variable."], ["THE TRAP", "Do not set acceleration to zero at the apex."], ["THE FINISH", "Check the sign and the limiting case."]].forEach(function (value, j) { const col = j % 2, row = Math.floor(j / 2); text(card, "Label / " + j, value[0], 28 + col * 360, 135 + row * 72, { font: F.mono, size: 9, color: j === 1 ? C.cyan : j === 2 ? C.red : j === 3 ? C.green : C.muted }); text(card, "Copy / " + j, value[1], 28 + col * 360, 156 + row * 72, { size: 12, color: C.muted, width: 320, lineHeight: 18 }); }); });

    const lab = noteSection(article, 6, "Interactive lab", "Change the launch speed, predict the apex, and connect the animation to the graph.", 3480, 720);
    const model = frame(lab, "Lab / Vertical throw", 42, 165, 750, 480, C.surface, C.line); grid(model, "Lab grid", 0, 0, 750, 480, 38, C.orange, 0.04); text(model, "Title", "Vertical throw lab", 24, 24, { font: F.bold, size: 22 }); text(model, "Status", "LIVE MODEL", 630, 30, { font: F.mono, size: 9, color: C.green }); rect(model, "Path", 374, 92, 1, 230, C.muted, null, 0, 0.55); ellipse(model, "Ball", 361, 110, 28, 28, C.amber); const controls = frame(model, "Controls", 24, 352, 702, 96, C.bg, C.hair); text(controls, "Label", "Launch speed", 18, 16, { size: 12, color: C.muted }); rect(controls, "Slider", 18, 49, 430, 7, C.soft); rect(controls, "Slider fill", 18, 49, 270, 7, C.orange); text(controls, "Value", "9.8 m/s", 470, 43, { font: F.mono, size: 13, color: C.cyan }); button(controls, "Run", 584, 24, 98, "primary");

    const complete = frame(article, "Lesson completion", 0, 4200, 860, 260, C.bg); rule(complete, "Top border", 0, 0, 860, C.line); const completeCard = frame(complete, "Completion card", 0, 54, 860, 170, C.surface, C.line); text(completeCard, "Heading", "Can you explain the mechanism without the note?", 28, 30, { font: F.bold, size: 25, width: 570, lineHeight: 32 }); text(completeCard, "Copy", "Mark this concept complete only when the central relation and common trap feel retrievable.", 28, 83, { size: 13, color: C.muted, width: 540, lineHeight: 21 }); button(completeCard, "Mark complete", 650, 61, 170, "primary");
    const adjacent = frame(article, "Adjacent topics", 0, 4460, 860, 150, C.bg); const previous = frame(adjacent, "Previous concept", 0, 0, 430, 130, C.surface, C.hair); text(previous, "Label", "\u2190  PREVIOUS CONCEPT", 22, 22, { font: F.mono, size: 9, color: C.muted }); text(previous, "Title", "Motion in a straight line", 22, 58, { font: F.bold, size: 19 }); const next = frame(adjacent, "Next concept", 430, 0, 430, 130, C.surface, C.hair); text(next, "Label", "NEXT CONCEPT  \u2192", 0, 22, { font: F.mono, size: 9, color: C.muted, width: 408, align: "RIGHT" }); text(next, "Title", "Relative motion", 0, 58, { font: F.bold, size: 19, width: 408, align: "RIGHT" });
    text(article, "Disclaimer", "Orange Nelumbo is independent and is not affiliated with NTA, the JEE Apex Board, or the IITs.", 0, 4630, { size: 11, color: C.muted, width: 860, lineHeight: 18 });
    return root;
  }

  function spec(name, route, mode, sections, active) { return { name: name, route: route, mode: mode, sections: sections, active: active || name }; }
  function section(title, type, height, items, description, options) {
    const value = { title: title, type: type, height: height, items: items || [], description: description || "" };
    Object.assign(value, options || {}); return value;
  }

  const routes = [
    spec("Home", "/", "public", [
      section("JEE concepts made visible.", "hero", 690, [], "Visual notes and interactive simulations built for understanding—not information overload.", { button: "Explore the library" }),
      section("Visual notes", "cards", 470, ["Physics", "Chemistry", "Mathematics"], "Notes designed to help students see the logic."),
      section("The Simulation Lab", "hero", 610, [], "Predict the result, change the inputs, and watch the model respond.", { alt: true, button: "Open the Simulation Lab" }),
      section("Student testimonials", "cards", 520, [
        { title: "Meera Iyer", meta: "JEE 2027 aspirant", body: "The derivation ladders show me exactly where each result comes from." },
        { title: "Aryan Kapoor", meta: "Class 11", body: "The simulations make a difficult graph feel obvious." },
        { title: "Sana Khan", meta: "JEE aspirant", body: "The notebook stays calm even when my week is busy." }
      ], "Built for the moment a concept finally clicks."),
      section("Educator access", "cards", 430, ["Educator login", "Invite-only workspace"], "A dedicated entry for invited teachers and academic contributors.", { alt: true, columns: 2 }),
      section("Video lectures", "hero", 470, [], "Visual-first lectures will connect to the same notes and simulations.", { button: "Start with the notes" }),
      section("Frequently asked questions", "faq", 660, ["What does Orange Nelumbo offer today?", "Does it cover JEE Main and Advanced?", "How does the Simulation Lab help?", "Are video lectures available now?", "Who can use educator access?", "Can I save notes?"], "Clear answers about notes, labs, videos, and educator access.", { alt: true })
    ]),
    spec("About", "/about", "public", [section("Difficult concepts should be easier to see.", "hero", 421, [], "Orange Nelumbo is building a focused JEE learning library around visual notes, interactive simulations, and visual-first video lectures."), section("We are reducing the distance between a formula and its meaning.", "cards", 656, ["Make it visible", "Keep it focused", "Let students test it"], ""), section("Start with one concept. See if it clicks.", "hero", 361, [], "The current demo includes sample visual notes and simulations across Physics, Chemistry, and Mathematics.", { alt: true, button: "Explore the library" })]),
    spec("Pricing", "/pricing", "public", [section("Three plans. One visual way to learn.", "hero", 390, [], "Choose notes, add simulations, or include future video lectures. Every plan stays focused on the learning library."), section("Choose your library", "cards", 680, [{ title: "Notes · ₹4,999/year", body: "Complete visual notes, protected reader, bookmarks, and reading progress." }, { title: "Notes + Simulations · ₹6,999/year", body: "Everything in Notes plus the complete interactive simulation library." }, { title: "Complete Library · ₹9,999/year", body: "The full collection, including video lectures as they are released." }], "", { columns: 3, cardHeight: 420 })]),
    spec("Free Simulations", "/free-simulations", "public", [section("Five ideas you can move, test, and see.", "hero", 420, [], "Change one variable, predict what happens, and use the visual response to connect the formula with its behaviour."), section("Playable simulation lab", "reader", 820, ["Vertical throw", "Projectile range", "Spring oscillator", "Electric field", "Function grapher"], "Five live demos with controls and animated response."), section("Ready for the complete library?", "hero", 220, [], "Keep the demos free. Join when you want the full notes and simulation collection.", { alt: true, button: "Create an account" })]),
    spec("Sample Notes", "/sample-notes", "public", [section("Notes that show the idea before compressing it.", "hero", 420, [], "Browse five open samples across Physics, Chemistry, and Mathematics."), section("Five open note previews", "reader", 820, ["Motion under gravity", "Electric field & potential", "Chemical bonding", "Entropy & spontaneity", "Integration as accumulation"], "Each preview keeps the visual, formula, and key ideas in one readable unit."), section("Continue with the full note library.", "hero", 220, [], "Open protected, distraction-free note pages after signing in.", { alt: true, button: "Explore membership" })]),
    spec("Help", "/help", "public", [section("How can we help?", "hero", 278, [], "Quick answers about the learning library and your account."), section("Help topics", "cards", 650, ["Visual notes", "Simulations", "Video lectures", "Profile and settings"], "", { columns: 2, cardHeight: 210 }), section("Still need help?", "hero", 201, [], "Tell us which note, simulation, or account screen is causing trouble.", { alt: true, button: "Contact us" })]),
    spec("Contact", "/contact", "public", [section("Help starts with the real question.", "hero", 366, [], "Be specific and calm. Tell us what you were trying to do, what happened, and what you expected instead."), section("This form is deliberately a demo.", "form", 923, ["Your name", "Email address", "Topic", "Message"], "There is no backend or support inbox connected yet.", { button: "Show success state" }), section("Independence notice", "rows", 129, ["Orange Nelumbo is an independent educational platform."])]),
    spec("Privacy", "/privacy", "public", [section("Privacy, stated precisely.", "hero", 334, [], "What this front-end preview stores, what it does not collect, and the choices available on this device."), section("Privacy sections", "rows", 2289, ["1. Scope of this preview", "2. Information shown or entered", "3. Browser-local storage", "4. Cookies, analytics, and third parties", "5. Students and minors", "6. Security and retention", "7. Your choices and questions"]), section("Independence notice", "rows", 129, ["Orange Nelumbo is an independent educational platform."])]),
    spec("Terms", "/terms", "public", [section("Terms for the preview.", "hero", 334, [], "Please read these terms before using the Orange Nelumbo front-end demonstration."), section("Terms sections", "rows", 2692, ["1. Demonstration status", "2. Educational purpose and no guarantees", "3. Official exam information", "4. Acceptable use", "5. Plans, prices, refunds, and payments", "6. Availability and changes", "7. Responsibility and limitation", "8. Contact"])]),
    spec("404", "/_not-found", "public", [section("Page not found", "hero", 650, [], "The page moved, the link is incomplete, or the route never existed.", { button: "Return to the library" })]),

    spec("Student Login", "/login", "auth", [section("Welcome back.", "form", 760, ["Email address", "Password"], "Continue your visual notes and simulations.", { button: "Sign in" })]),
    spec("Educator Login", "/login?role=educator", "auth", [section("Educator sign in.", "form", 760, ["Email address", "Password"], "For invited Orange Nelumbo educator accounts.", { button: "Sign in as educator" })]),
    spec("Signup", "/signup", "auth", [section("Create your learning account.", "form", 820, ["Full name", "Email address", "Password", "Confirm password"], "Save notes, simulations, and reading progress.", { button: "Create my workspace" })]),
    spec("Forgot Password", "/forgot-password", "auth", [section("Reset your password.", "form", 620, ["Email address"], "Prepare a reset link for your account.", { button: "Prepare reset link" })]),
    spec("Onboarding", "/onboarding", "onboarding", [section("Choose the target", "cards", 520, ["JEE Main", "JEE Advanced", "Class 11", "Class 12"], "Set the exam and academic stage.", { columns: 2 })]),

    spec("Learning Home", "/dashboard", "platform", [section("Welcome back, Aarav.", "cards", 460, ["Visual notes", "Simulations", "Video lectures"], "Pick up a visual note, test an idea, or browse a chapter."), section("Continue reading", "cards", 390, [{ title: "Motion under gravity", meta: "Physics · Kinematics", body: "Continue from the saved section in the dedicated reader." }], "", { columns: 1 }), section("Browse by subject", "cards", 440, ["Physics", "Chemistry", "Mathematics"]), section("Live simulations and saved notes", "cards", 410, ["Vertical throw", "Bookmarks"], "", { columns: 2 })], "Home"),
    spec("Visual Notes", "/learn", "platform", [section("Visual notes for JEE.", "hero", 390, [], "Browse Physics, Chemistry, and Mathematics by chapter. Every topic opens as a dedicated note, separate from the rest of the app."), section("Your active concept", "cards", 380, [{ title: "Motion under gravity", meta: "Physics \u00B7 Kinematics", body: "Return to the exact section where you stopped reading." }], "", { columns: 1 }), section("Choose a workbench", "cards", 520, ["Physics", "Chemistry", "Mathematics"]), section("Bookmarked concepts", "cards", 420, ["Motion under gravity", "Complex numbers", "Chemical bonding"])], "Visual notes"),
    spec("Subject", "/learn/[subject]", "platform", [section("Physics", "hero", 390, [], "Physical intuition, diagrams, derivations, and interactive models."), section("Chapter map", "cards", 720, ["Kinematics", "Laws of Motion", "Rotational Motion", "Electrostatics", "Optics", "Thermodynamics"], "", { columns: 2 })], "Visual notes"),
    spec("Chapter", "/learn/[subject]/[chapter]", "platform", [section("Kinematics", "hero", 390, [], "Build the chapter one visual note at a time."), section("Concept sequence", "rows", 620, ["Motion in a straight line", "Motion under gravity", "Relative motion", "Projectile motion", "Graphs in kinematics"]), section("Up next", "cards", 360, ["Motion under gravity"], "", { columns: 1 })], "Visual notes"),
    spec("Simulations", "/simulations", "platform", [section("Interactive simulations", "hero", 350, [], "Change one variable, predict the result, and see how the model responds."), section("Simulation gallery", "cards", 680, ["Vertical throw", "Projectile motion", "Electric field", "Molecular geometry", "Calculus area", "Wave interference"])], "Simulations"),
    spec("Simulation Detail", "/simulations/[slug]", "platform", [section("Vertical throw", "reader", 650, ["Model", "Controls", "Graph", "Prediction"], "A live model of velocity, height, and acceleration."), section("Simulation controls", "form", 520, ["Launch speed", "Preset", "Prediction"], "", { button: "Run simulation" })], "Simulations"),
    spec("Video Lectures", "/videos", "platform", [section("Video lectures are coming next.", "hero", 700, [], "Concise, visual-first lectures connected to each note and simulation.", { button: "Explore visual notes" })], "Video lectures"),
    spec("Bookmarks", "/bookmarks", "platform", [section("The ideas worth another pass.", "hero", 330, [], "Keep difficult concepts close without creating another backlog. Saved topics update immediately across the concept library on this device."), section("Saved concepts", "cards", 650, ["Motion under gravity", "Complex numbers", "Chemical bonding", "Limits", "Electrostatics", "Thermodynamics"])], "Bookmarks"),
    spec("Notifications", "/notifications", "platform", [section("Only the alerts that change your next move.", "hero", 350, [], "Study prompts, plan notices, and product updates. Read state is stored only in this browser for the preview."), section("Notification list", "rows", 650, ["New simulation available", "Reading progress saved", "Video lecture update", "Account preference changed", "New visual note"])], "Notifications"),
    spec("Profile", "/profile", "platform", [section("A profile built around the attempt ahead.", "hero", 350, [], "Your target and study rhythm shape recommendations. Changes are saved to this browser-only profile."), section("Student record", "form", 760, ["Full name", "Email address", "Study city", "Target exam", "Target year"], "", { button: "Save changes" }), section("Study rhythm and priority subjects", "cards", 480, ["90 minutes", "Evening", "Physics", "Mathematics"], "", { columns: 2 })], "Profile"),
    spec("Settings", "/settings", "platform", [section("Make the system quieter and more useful.", "hero", 340, [], "Tune appearance, reminders, study rhythm, and sample data. Every control is local to this browser."), section("Appearance", "cards", 320, ["Dark"]), section("Notification preferences", "rows", 470, ["Study reminders", "Mock test alerts", "Weekly progress summary", "Product announcements"]), section("Study rhythm", "cards", 390, ["30 min", "60 min", "90 min", "120 min"], "", { columns: 2 }), section("Preview data and session", "cards", 420, ["Reset demo", "Sign out"], "", { columns: 2 })], "Settings"),
    spec("Protected Note Reader", "/notes/[subject]/[chapter]/[topic]", "reader", [section("Motion under gravity", "hero", 410, [], "A dedicated protected reader for the full visual note.", { button: "Mark complete" }), section("Visual note content", "reader", 660, ["Basic theory", "Notation", "Derivation", "Special cases", "Worked examples", "Interactive lab"], "Every note section is editable and named."), section("Complete the concept", "cards", 370, ["Can you explain the mechanism without the note?"], "", { columns: 1 }), section("Previous and next topics", "cards", 340, ["Motion in a straight line", "Relative motion"], "", { columns: 2 })])
  ];

  function routeFrame(page, route, index) {
    const headerH = route.mode === "public" || route.mode === "platform" ? 74 : route.mode === "reader" ? 64 : 0;
    const footerH = route.mode === "public" ? 444 : 0;
    const sectionsH = route.sections.reduce(function (sum, value) { return sum + value.height; }, 0);
    const totalH = headerH + sectionsH + footerH;
    const root = frame(page, "Frame / " + String(index).padStart(2, "0") + " / " + route.name + " / " + route.route, 0, 0, 1440, totalH, C.bg); root.clipsContent = true; root.setPluginData("route", route.route);
    let x = 0, width = 1440, y = headerH, learning = false;
    if (route.mode === "public") publicHeader(root);
    if (route.mode === "platform") { learningRail(root, totalH, route.active); learningHeader(root, route.name); x = 278; width = 1162; learning = true; }
    if (route.mode === "reader") {
      learning = true; const header = frame(root, "Global / Protected Reader Header", 0, 0, 1440, 64, C.bg, C.line);
      text(header, "Back", "← Notes library", 40, 22, { font: F.bold, size: 14, color: C.muted }); lotus(header, 686, 13); text(header, "Protection", "Protected reader", 1240, 23, { font: F.medium, size: 12, color: C.green });
    }
    if (route.mode === "auth") {
      const brand = frame(root, "Global / Authentication Brand Panel", 0, 0, 500, totalH, C.surface, C.line); lotus(brand, 48, 40);
      text(brand, "Brand", "ORANGE NELUMBO", 98, 49, { font: F.displayBold, size: 18 });
      text(brand, "Statement", route.name === "Educator Login" ? "Teach the idea.\nMake it visible." : "See the idea.\nUnderstand the concept.", 48, 220, { font: F.displayBold, size: 44, width: 390, lineHeight: 50 });
      x = 500; width = 940;
    }
    route.sections.forEach(function (value, sectionIndex) { drawSection(root, value, x, y, width, learning, sectionIndex); y += value.height; });
    if (route.mode === "public") publicFooter(root, y);
    return root;
  }

  function coverFrame(page) {
    const root = frame(page, "Frame / 00 / Import Index", 0, 0, 1440, 1920, C.bg);
    lotus(root, 64, 58); text(root, "Title", "Orange Nelumbo\nFull website import", 64, 132, { font: F.displayBold, size: 56, width: 760, lineHeight: 62 });
    text(root, "Description", "Every live route template has its own top-level frame on this page. Every website section is a named, editable frame. Dynamic routes are represented once as reusable frame templates.", 64, 285, { font: F.display, size: 20, color: C.muted, width: 820, lineHeight: 32 });
    const groups = [
      { title: "Public and account", values: routes.filter(function (r) { return r.mode === "public" || r.mode === "auth" || r.mode === "onboarding"; }).map(function (r) { return r.route; }) },
      { title: "Learning workspace", values: routes.filter(function (r) { return r.mode === "platform" || r.mode === "reader"; }).map(function (r) { return r.route; }) },
      { title: "Legacy redirects", values: ["/analytics → /dashboard", "/planner → /dashboard", "/practice/* → /dashboard", "/mocks/* → /dashboard", "/rank-map → /dashboard", "/results/* → /dashboard", "/diagnostic → /", "/checkout/* → /pricing", "/learn/[subject]/[chapter]/[topic] → /notes/…"] },
      { title: "Generation notes", values: ["Desktop canvas: 1440 px", "Fraunces: marketing", "DM Sans: learning", "Named section frames", "Editable cards, rows, forms and text", "Dynamic routes use [param] templates"] }
    ];
    groups.forEach(function (group, i) {
      const x = 64 + (i % 2) * 650, y = 430 + Math.floor(i / 2) * 650;
      const card = frame(root, "Index / " + group.title, x, y, 610, 590, C.surface, C.line);
      text(card, "Title", group.title, 28, 28, { font: F.displayBold, size: 28 });
      text(card, "Items", group.values.join("\n"), 28, 84, { font: F.mono, size: 13, color: C.muted, width: 550, lineHeight: 27 });
    });
    return root;
  }

  const websitePage = figma.currentPage;
  websitePage.name = "Orange Nelumbo · Full Website";
  websitePage.children.slice().forEach(function (node) {
    const generatedRoute = node.type === "FRAME" && node.name.indexOf("Frame / ") === 0 && node.getPluginData("route");
    const generatedIndex = node.type === "FRAME" && node.name === "Frame / 00 / Import Index";
    if (generatedRoute || generatedIndex) node.remove();
  });
  const generated = [coverFrame(websitePage)];
  routes.forEach(function (route, i) {
    generated.push(route.route === "/" ? homeFrame(websitePage, i + 1) : route.route === "/free-simulations" ? freeSimulationsFrame(websitePage, route, i + 1) : route.route === "/sample-notes" ? sampleNotesFrame(websitePage, route, i + 1) : route.mode === "auth" ? authFrame(websitePage, route, i + 1) : route.mode === "onboarding" ? onboardingFrame(websitePage, route, i + 1) : route.mode === "reader" ? readerFrame(websitePage, route, i + 1) : routeFrame(websitePage, route, i + 1));
  });

  const columns = 3;
  const horizontalGap = 180;
  const verticalGap = 220;
  const columnHeights = new Array(columns).fill(0);
  generated.forEach(function (root) {
    let column = 0;
    for (let i = 1; i < columns; i++) {
      if (columnHeights[i] < columnHeights[column]) column = i;
    }
    root.x = column * (1440 + horizontalGap);
    root.y = columnHeights[column];
    columnHeights[column] += root.height + verticalGap;
  });

  figma.currentPage.selection = [generated[0]];
  figma.viewport.scrollAndZoomIntoView([generated[0]]);
  figma.notify("Orange Nelumbo created: " + generated.length + " route frames on one Figma page.", { timeout: 5000 });
  figma.closePlugin();
})();
