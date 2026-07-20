(async function () {
  const C = {
    canvas: "#F3EEE6",
    paper: "#FCFAF5",
    ink: "#2C2723",
    dark: "#231F1B",
    terracotta: "#B05A3B",
    terracottaDark: "#94472C",
    terracottaSoft: "#F1E4DA",
    orange: "#D98A5E",
    body: "#6B6358",
    muted: "#938A7D",
    faint: "#A79C8B",
    line: "#E4DCCE",
    lineSoft: "#EDE7DB",
    teal: "#4F7E77",
    green: "#6C8A56",
    warm: "#F7F1E8",
    cream: "#F3EEE6",
    white: "#FFFFFF"
  };

  function rgb(hex) {
    const value = hex.replace("#", "");
    return {
      r: parseInt(value.slice(0, 2), 16) / 255,
      g: parseInt(value.slice(2, 4), 16) / 255,
      b: parseInt(value.slice(4, 6), 16) / 255
    };
  }

  function paint(hex, opacity) {
    return [{ type: "SOLID", color: rgb(hex), opacity: opacity == null ? 1 : opacity }];
  }

  async function firstFont(candidates) {
    for (const candidate of candidates) {
      try {
        await figma.loadFontAsync(candidate);
        return candidate;
      } catch (error) {
        // Try the next locally available font.
      }
    }
    const fallback = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(fallback);
    return fallback;
  }

  const F = {
    serif: await firstFont([
      { family: "DM Serif Display", style: "Regular" },
      { family: "Georgia", style: "Regular" },
      { family: "Inter", style: "Regular" }
    ]),
    medium: await firstFont([
      { family: "Nunito", style: "Medium" },
      { family: "Inter", style: "Medium" },
      { family: "Inter", style: "Regular" }
    ]),
    semibold: await firstFont([
      { family: "Nunito", style: "SemiBold" },
      { family: "Inter", style: "Semi Bold" },
      { family: "Inter", style: "Medium" }
    ]),
    bold: await firstFont([
      { family: "Nunito", style: "Bold" },
      { family: "Inter", style: "Bold" },
      { family: "Inter", style: "Semi Bold" }
    ]),
    extra: await firstFont([
      { family: "Nunito", style: "ExtraBold" },
      { family: "Inter", style: "Bold" }
    ])
  };

  function add(parent, node, name, x, y) {
    parent.appendChild(node);
    node.name = name;
    node.x = x || 0;
    node.y = y || 0;
    return node;
  }

  function frame(parent, name, x, y, width, height, fill, radius, stroke) {
    const node = figma.createFrame();
    add(parent, node, name, x, y);
    node.resize(width, height);
    node.clipsContent = false;
    node.fills = fill ? paint(fill) : [];
    if (radius) node.cornerRadius = radius;
    if (stroke) {
      node.strokes = paint(stroke);
      node.strokeWeight = 1;
      node.strokeAlign = "INSIDE";
    }
    return node;
  }

  function rect(parent, name, x, y, width, height, fill, radius, stroke, opacity) {
    const node = figma.createRectangle();
    add(parent, node, name, x, y);
    node.resize(width, height);
    node.fills = fill ? paint(fill, opacity) : [];
    if (radius) node.cornerRadius = radius;
    if (stroke) {
      node.strokes = paint(stroke);
      node.strokeWeight = 1;
      node.strokeAlign = "INSIDE";
    }
    return node;
  }

  function ellipse(parent, name, x, y, width, height, fill, stroke, strokeOpacity) {
    const node = figma.createEllipse();
    add(parent, node, name, x, y);
    node.resize(width, height);
    node.fills = fill ? paint(fill) : [];
    if (stroke) {
      node.strokes = paint(stroke, strokeOpacity == null ? 1 : strokeOpacity);
      node.strokeWeight = 1;
      node.strokeAlign = "INSIDE";
    }
    return node;
  }

  function rule(parent, name, x, y, width, height, color) {
    return rect(parent, name, x, y, width, height, color || C.lineSoft, 0);
  }

  function text(parent, name, value, x, y, options) {
    const o = options || {};
    const node = figma.createText();
    add(parent, node, name, x, y);
    node.fontName = o.font || F.medium;
    node.fontSize = o.size || 14;
    node.characters = String(value);
    node.fills = paint(o.color || C.ink, o.opacity == null ? 1 : o.opacity);
    if (o.letterSpacing != null) node.letterSpacing = { unit: "PIXELS", value: o.letterSpacing };
    if (o.lineHeight != null) node.lineHeight = { unit: "PIXELS", value: o.lineHeight };
    if (o.align) node.textAlignHorizontal = o.align;
    if (o.width) {
      node.textAutoResize = "HEIGHT";
      node.resize(o.width, Math.max(1, o.lineHeight || (o.size || 14) * 1.3));
    } else {
      node.textAutoResize = "WIDTH_AND_HEIGHT";
    }
    return node;
  }

  function label(parent, name, value, x, y, width, color, align) {
    return text(parent, name, value.toUpperCase(), x, y, {
      font: F.extra,
      size: 11,
      color: color || C.muted,
      letterSpacing: 0.75,
      lineHeight: 14,
      width: width,
      align: align
    });
  }

  function navIcon(parent, type, x, y, color) {
    const icon = frame(parent, "Icon / " + type, x, y, 18, 18, null, 0);
    if (type === "Dashboard") {
      rect(icon, "Square 1", 1, 1, 7, 7, color, 0);
      rect(icon, "Square 2", 10, 1, 7, 7, color, 0);
      rect(icon, "Square 3", 1, 10, 7, 7, color, 0);
      rect(icon, "Square 4", 10, 10, 7, 7, color, 0);
    } else if (type === "Notes Library") {
      rect(icon, "Line 1", 1, 2, 16, 2, color, 0);
      rect(icon, "Line 2", 1, 8, 16, 2, color, 0);
      rect(icon, "Line 3", 1, 14, 11, 2, color, 0);
    } else if (type === "Simulations") {
      ellipse(icon, "Orbit", 1, 1, 15, 15, null, color, 1);
      ellipse(icon, "Point", 13, 2, 4, 4, color, null);
    } else if (type === "Practice & Mocks") {
      ellipse(icon, "Outer", 1, 1, 16, 16, null, color, 1);
      ellipse(icon, "Inner", 5, 5, 8, 8, null, color, 1);
      ellipse(icon, "Center", 8, 8, 2, 2, color, null);
    } else {
      const diamond = rect(icon, "Diamond", 4, 4, 10, 10, color, 0);
      diamond.rotation = 45;
    }
    return icon;
  }

  function createNavItem(parent, y, name, active) {
    const item = frame(parent, "Nav / " + name, 16, y, 224, 44, active ? C.terracottaSoft : null, active ? 4 : 0);
    if (active) rule(item, "Active indicator", 0, 0, 3, 44, C.terracotta);
    navIcon(item, name, 13, 13, active ? C.terracottaDark : C.body);
    text(item, "Label", name, 44, 12, {
      font: F.bold,
      size: 14,
      color: active ? C.terracottaDark : C.body,
      lineHeight: 20
    });
    return item;
  }

  function createLotus(parent, x, y) {
    const badge = frame(parent, "Brand mark", x, y, 40, 40, C.dark, 5);
    const p1 = ellipse(badge, "Petal center", 15, 7, 10, 22, C.terracotta, null);
    const p2 = ellipse(badge, "Petal left", 9, 10, 9, 20, C.orange, null);
    p2.rotation = -28;
    const p3 = ellipse(badge, "Petal right", 22, 10, 9, 20, C.orange, null);
    p3.rotation = 28;
    ellipse(badge, "Seed", 17, 22, 6, 6, C.paper, null);
    return badge;
  }

  const root = frame(figma.currentPage, "Orange Nelumbo / JEE Dashboard", 0, 0, 1440, 1360, C.canvas, 0);
  root.clipsContent = true;

  // LEFT RAIL
  const rail = frame(root, "01 / Left rail", 0, 0, 256, 1360, C.paper, 0);
  rule(rail, "Right border", 255, 0, 1, 1360, C.line);
  const brand = frame(rail, "Brand", 0, 0, 256, 84, C.paper, 0);
  rule(brand, "Bottom border", 0, 83, 256, 1, C.lineSoft);
  createLotus(brand, 22, 22);
  text(brand, "Orange Nelumbo", "Orange Nelumbo", 74, 22, { font: F.serif, size: 17, color: C.ink, lineHeight: 21 });
  text(brand, "The JEE Notebook", "THE JEE NOTEBOOK", 74, 47, { font: F.extra, size: 10, color: C.terracotta, letterSpacing: 0.8, lineHeight: 13 });

  const nav = frame(rail, "Navigation", 0, 84, 256, 252, null, 0);
  createNavItem(nav, 18, "Dashboard", true);
  createNavItem(nav, 65, "Notes Library", false);
  createNavItem(nav, 112, "Simulations", false);
  createNavItem(nav, 159, "Practice & Mocks", false);
  createNavItem(nav, 206, "Packages", false);

  const plan = frame(rail, "Plan card", 18, 350, 220, 146, C.warm, 5, C.line);
  label(plan, "Eyebrow", "Your plan", 16, 16, 188, C.muted);
  text(plan, "Plan", "Notes · Active", 16, 40, { font: F.serif, size: 17, color: C.ink, lineHeight: 22 });
  text(plan, "Locked", "Practice — not unlocked", 16, 65, { font: F.semibold, size: 11, color: C.faint, lineHeight: 15 });
  const unlock = frame(plan, "Unlock button", 16, 92, 188, 38, null, 3, C.terracotta);
  text(unlock, "Button label", "Unlock Practice →", 0, 10, { font: F.extra, size: 12, color: C.terracotta, width: 188, align: "CENTER", lineHeight: 16 });

  const profile = frame(rail, "Profile", 0, 1280, 256, 80, C.paper, 0);
  rule(profile, "Top border", 0, 0, 256, 1, C.lineSoft);
  const avatar = frame(profile, "Avatar", 20, 20, 38, 38, C.dark, 5);
  text(avatar, "Initial", "A", 0, 8, { font: F.serif, size: 16, color: C.cream, width: 38, align: "CENTER", lineHeight: 21 });
  text(profile, "Name", "Aarav Sharma", 70, 19, { font: F.extra, size: 13.5, color: C.ink, lineHeight: 18 });
  text(profile, "Meta", "JEE aspirant · 2027", 70, 41, { font: F.semibold, size: 11, color: C.muted, lineHeight: 15 });

  // HEADER
  const header = frame(root, "02 / Header", 256, 0, 1184, 68, C.paper, 0);
  rule(header, "Bottom border", 0, 67, 1184, 1, C.line);
  const search = frame(header, "Search", 30, 13, 440, 42, C.canvas, 3, C.line);
  text(search, "Placeholder", "search a concept, chapter, formula…", 14, 11, { font: F.semibold, size: 14, color: C.faint, lineHeight: 19 });

  const examDate = new Date("2027-05-16T00:00:00");
  const today = new Date();
  const daysToGo = Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / 86400000));
  const status = frame(header, "Status", 676, 0, 508, 68, null, 0);
  label(status, "Streak label", "Reading streak", 0, 16, 150, C.faint, "RIGHT");
  text(status, "Streak", "47 days", 0, 33, { font: F.extra, size: 17, color: C.terracotta, width: 150, align: "RIGHT", lineHeight: 22 });
  rule(status, "Divider 1", 172, 13, 1, 42, C.line);
  label(status, "Target label", "Target", 194, 16, 132, C.faint, "RIGHT");
  text(status, "Target", "JEE Adv '27", 194, 33, { font: F.extra, size: 17, color: C.ink, width: 132, align: "RIGHT", lineHeight: 22 });
  rule(status, "Divider 2", 348, 13, 1, 42, C.line);
  label(status, "Days label", "Days to go", 370, 16, 116, C.faint, "RIGHT");
  text(status, "Days", String(daysToGo), 370, 33, { font: F.extra, size: 17, color: C.teal, width: 116, align: "RIGHT", lineHeight: 22 });

  // MAIN CONTENT
  const main = frame(root, "03 / Dashboard content", 256, 68, 1184, 1292, C.canvas, 0);
  const contentX = 62;
  const contentW = 1060;

  label(main, "Hero / Eyebrow", "Your notebook", contentX, 44, 300, C.terracotta);
  text(main, "Hero / Greeting", "Good evening, Aarav.", contentX, 68, { font: F.serif, size: 40, color: C.ink, lineHeight: 44 });
  text(main, "Hero / Description", "You've read 12 of 32 topics so far. Pick up Motion under gravity where you left off, or open a new chapter.", contentX, 121, {
    font: F.semibold,
    size: 16,
    color: C.body,
    width: 690,
    lineHeight: 25.6
  });

  const stats = frame(main, "Stats strip", contentX, 200, contentW, 112, C.paper, 6, C.line);
  const statWidths = [244, 244, 244, 328];
  const statData = [
    ["Topics read", "12", "/ 32"],
    ["Chapters completed", "2", "/ 10"],
    ["Reading streak", "47", "days"],
    ["Last opened", "Motion under gravity", ""]
  ];
  let statX = 0;
  for (let i = 0; i < statData.length; i++) {
    if (i > 0) rule(stats, "Divider " + i, statX, 0, 1, 112, C.lineSoft);
    const item = frame(stats, "Stat / " + statData[i][0], statX, 0, statWidths[i], 112, null, 0);
    label(item, "Label", statData[i][0], 26, 23, statWidths[i] - 52, C.muted);
    if (i < 3) {
      text(item, "Value", statData[i][1], 26, 48, { font: F.extra, size: 32, color: C.ink, lineHeight: 40 });
      text(item, "Suffix", statData[i][2], 74, 61, { font: F.extra, size: 17, color: C.faint, lineHeight: 22 });
    } else {
      text(item, "Value", statData[i][1], 26, 54, { font: F.bold, size: 18, color: C.ink, width: statWidths[i] - 52, lineHeight: 23 });
    }
    statX += statWidths[i];
  }

  text(main, "Continue / Heading", "Continue where you left off", contentX, 366, { font: F.serif, size: 24, color: C.ink, lineHeight: 30 });
  text(main, "Continue / Link", "ALL SUBJECTS →", contentX + contentW - 150, 372, { font: F.extra, size: 12, color: C.terracotta, letterSpacing: 0.5, width: 150, align: "RIGHT", lineHeight: 16 });
  const continueCard = frame(main, "Continue card", contentX, 409, contentW, 225, C.dark, 6);
  ellipse(continueCard, "Decoration / Small ring", 720, 115, 280, 280, null, C.white, 0.06);
  ellipse(continueCard, "Decoration / Large ring", 640, 65, 420, 420, null, C.white, 0.04);
  label(continueCard, "Eyebrow", "Physics · Kinematics · in progress", 34, 31, 560, C.orange);
  text(continueCard, "Title", "Motion under gravity", 34, 56, { font: F.serif, size: 30, color: C.cream, lineHeight: 37 });
  text(continueCard, "Description", "Up and down are mirror images. Read the derivation section and run the vertical-throw lab at the end.", 34, 101, {
    font: F.semibold,
    size: 15,
    color: "#B7AE9F",
    width: 620,
    lineHeight: 24
  });
  text(continueCard, "Meta", "6 concepts · 1 lab · 5 PYQ patterns", 34, 174, { font: F.semibold, size: 12, color: "#8C8375", lineHeight: 16 });
  const openButton = frame(continueCard, "Open note button", 454, 159, 160, 44, C.terracotta, 3);
  text(openButton, "Label", "Open note →", 0, 12, { font: F.extra, size: 14, color: C.paper, width: 160, align: "CENTER", lineHeight: 19 });

  text(main, "Subjects / Heading", "Your subjects", contentX, 688, { font: F.serif, size: 24, color: C.ink, lineHeight: 30 });
  text(main, "Subjects / Meta", "READING PROGRESS", contentX + contentW - 180, 694, { font: F.extra, size: 12, color: C.faint, width: 180, align: "RIGHT", lineHeight: 16 });
  const subjects = [
    { code: "PHY", name: "Physics", done: "3 / 13 read", chapters: "4 chapters" },
    { code: "CHM", name: "Chemistry", done: "4 / 9 read", chapters: "3 chapters" },
    { code: "MAT", name: "Mathematics", done: "5 / 10 read", chapters: "3 chapters" }
  ];
  const cardW = (contentW - 36) / 3;
  for (let i = 0; i < subjects.length; i++) {
    const s = subjects[i];
    const card = frame(main, "Subject card / " + s.name, contentX + i * (cardW + 18), 733, cardW, 118, C.paper, 6, C.line);
    text(card, "Code", s.code, 22, 20, { font: F.extra, size: 11, color: C.terracotta, letterSpacing: 0.7, lineHeight: 15 });
    text(card, "Progress", s.done, cardW - 142, 20, { font: F.semibold, size: 12, color: "#8C8375", width: 120, align: "RIGHT", lineHeight: 16 });
    text(card, "Name", s.name, 22, 48, { font: F.serif, size: 21, color: C.ink, lineHeight: 27 });
    text(card, "Chapters", s.chapters, 22, 81, { font: F.semibold, size: 12, color: C.faint, lineHeight: 16 });
  }

  function checklistCard(parent, name, x, y, width, rows, rightLink) {
    const card = frame(parent, name, x, y, width, 247, C.paper, 6, C.line);
    const rowH = 77;
    for (let i = 0; i < rows.length; i++) {
      const row = frame(card, "Row / " + rows[i].title, 22, 8 + i * rowH, width - 44, rowH, null, 0);
      if (i < rows.length - 1) rule(row, "Divider", 0, rowH - 1, width - 44, 1, C.lineSoft);
      ellipse(row, "Status", 0, 18, 18, 18, null, rows[i].done ? C.green : "#C4B9A8", 1);
      if (rows[i].done) {
        ellipse(row, "Status fill", 0, 18, 18, 18, C.green, null);
        text(row, "Check", "✓", 0, 19, { font: F.extra, size: 10, color: C.white, width: 18, align: "CENTER", lineHeight: 14 });
      }
      text(row, "Title", rows[i].title, 32, 13, { font: F.bold, size: 15, color: C.ink, width: rightLink ? width - 180 : width - 88, lineHeight: 20 });
      text(row, "Meta", rows[i].meta, 32, 37, { font: F.semibold, size: 11, color: C.faint, width: width - 110, lineHeight: 15 });
      if (rightLink) text(row, "Open", "Open →", width - 120, 26, { font: F.bold, size: 12, color: C.terracotta, width: 76, align: "RIGHT", lineHeight: 16 });
    }
    return card;
  }

  const colW = (contentW - 24) / 2;
  text(main, "Reading / Heading", "Today's reading", contentX, 905, { font: F.serif, size: 24, color: C.ink, lineHeight: 30 });
  text(main, "Up next / Heading", "Up next", contentX + colW + 24, 905, { font: F.serif, size: 24, color: C.ink, lineHeight: 30 });
  checklistCard(main, "Today's reading card", contentX, 947, colW, [
    { title: "Motion under gravity", meta: "Physics · Kinematics" },
    { title: "Electric field & potential", meta: "Physics · Electrostatics" },
    { title: "Entropy & spontaneity", meta: "Chemistry · Thermodynamics" }
  ], false);
  checklistCard(main, "Up next card", contentX + colW + 24, 947, colW, [
    { title: "Motion under gravity", meta: "Physics · Kinematics" },
    { title: "Relative motion", meta: "Physics · Kinematics" },
    { title: "Projectile motion", meta: "Physics · Kinematics" }
  ], true);

  root.x = figma.viewport.center.x - root.width / 2;
  root.y = figma.viewport.center.y - root.height / 2;
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("Orange Nelumbo dashboard created — all layers are editable.", { timeout: 3500 });
  figma.closePlugin();
})();
