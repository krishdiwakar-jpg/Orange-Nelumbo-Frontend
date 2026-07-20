(async function () {
  const C = {
    bg: "#0E0D10", surface: "#161418", raised: "#1E1B20", line: "#3B3030",
    soft: "#2A262E", paper: "#FAF8F2", muted: "#C7C5CC", orange: "#FF5A1F",
    ember: "#FF8A3D", cyan: "#3DE0D0", green: "#3DE08A", red: "#E0483C"
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
  function lotus(parent, x, y) {
    const mark = frame(parent, "Brand / Lotus", x, y, 38, 38, null);
    ellipse(mark, "Petal / Center", 14, 3, 10, 26, C.orange);
    const left = ellipse(mark, "Petal / Left", 7, 8, 10, 23, C.ember); left.rotation = -28;
    const right = ellipse(mark, "Petal / Right", 21, 8, 10, 23, C.ember); right.rotation = 28;
    ellipse(mark, "Seed", 16, 23, 6, 6, C.paper); return mark;
  }
  function button(parent, label, x, y, width, primary) {
    const node = frame(parent, "Button / " + label, x, y, width, 48, primary ? C.orange : null, primary ? null : C.orange);
    text(node, "Label", label, 0, 14, { font: F.bold, size: 14, color: primary ? C.bg : C.ember, width: width, align: "CENTER", lineHeight: 19 });
  }

  function publicHeader(root) {
    const node = frame(root, "Global / Marketing Header", 0, 0, 1440, 74, C.bg, C.line);
    lotus(node, 48, 18); text(node, "Brand", "ORANGE NELUMBO", 98, 27, { font: F.displayBold, size: 17 });
    ["Visual notes", "Simulations", "Educators", "Videos", "FAQs"].forEach(function (label, i) {
      text(node, "Nav / " + label, label, 500 + i * 112, 28, { font: F.bold, size: 13, color: C.muted });
    });
    button(node, "Sign in", 1160, 14, 100, false); button(node, "Explore free", 1272, 14, 122, true);
  }
  function publicFooter(root, y) {
    const node = frame(root, "Global / Marketing Footer", 0, y, 1440, 290, C.bg, C.line);
    lotus(node, 48, 44); text(node, "Brand", "ORANGE NELUMBO", 98, 53, { font: F.displayBold, size: 18 });
    text(node, "Description", "Visual JEE notes and interactive simulations that make difficult ideas easier to see and understand.", 48, 105, { size: 15, color: C.muted, width: 410, lineHeight: 24 });
    const cols = [["Learn", "Visual notes\nSimulation Lab\nVideo lectures"], ["Support", "FAQs\nEducator login\nContact"], ["Legal", "Privacy\nTerms"]];
    cols.forEach(function (col, i) {
      text(node, "Column / " + col[0], col[0], 660 + i * 220, 52, { font: F.bold, size: 14 });
      text(node, "Links / " + col[0], col[1], 660 + i * 220, 88, { size: 14, color: C.muted, lineHeight: 29 });
    });
    rule(node, "Divider", 48, 236, 1344); text(node, "Copyright", "© 2026 Orange Nelumbo", 48, 258, { size: 12, color: C.muted });
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

  function item(value) { return typeof value === "string" ? { title: value, body: "Editable content for this website section." } : value; }
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
      rect(card, "Icon", 22, 22, 38, 38, i % 2 ? C.cyan : C.orange, null, 0, 0.95);
      text(card, "Title", value.title, 22, 78, { font: learning ? F.bold : F.displayBold, size: 20, width: w - 44, lineHeight: 26 });
      if (value.meta) text(card, "Meta", value.meta, 22, 108, { font: F.medium, size: 12, color: C.ember, width: w - 44 });
      text(card, "Body", value.body || "", 22, value.meta ? 132 : 114, { size: 13, color: C.muted, width: w - 44, lineHeight: 20 });
    });
  }
  function rows(node, section, x, y, width, learning) {
    (section.items || []).forEach(function (raw, i) {
      const value = item(raw), row = frame(node, "Row / " + value.title, x, y + i * 78, width, 68, C.surface, C.soft);
      text(row, "Index", String(i + 1).padStart(2, "0"), 18, 24, { font: F.mono, size: 11, color: C.ember });
      text(row, "Title", value.title, 68, 15, { font: learning ? F.bold : F.displayBold, size: 17, width: 310 });
      text(row, "Body", value.body || "", 400, 14, { size: 13, color: C.muted, width: width - 430, lineHeight: 20 });
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
    text(content, "Body", "DM Sans keeps the learning interface clear at study density. This editable block represents the note copy, formulas, diagrams, callouts, examples, and interactive lab.", 0, 54, { size: 15, color: C.muted, width: width - 300, lineHeight: 26 });
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
    spec("About", "/about", "public", [section("Difficult concepts should be easier to see.", "hero", 500, [], "Why Orange Nelumbo is building visual learning tools for JEE.", { button: "Explore the library" }), section("How we build", "cards", 460, ["Make it visible", "Keep it focused", "Let students test it"], "Reduce the distance between a formula and its meaning."), section("Start with one concept", "hero", 420, [], "The demo includes visual notes and simulations across PCM.", { alt: true })]),
    spec("Access", "/pricing", "public", [section("Explore the current learning demo.", "hero", 460, [], "Public pricing is not final. The demo focuses on notes and simulations."), section("Demo access", "cards", 470, ["Visual notes", "Interactive simulations", "Bookmarks", "Future video preview"], "What students can use today.", { columns: 2 })]),
    spec("Help", "/help", "public", [section("How can we help?", "hero", 400, [], "Quick answers about the learning library and your account."), section("Help topics", "cards", 540, ["Visual notes", "Simulations", "Video lectures", "Profile and settings"], "", { columns: 2 }), section("Still need help?", "hero", 390, [], "Tell us which screen is causing trouble.", { alt: true, button: "Contact us" })]),
    spec("Contact", "/contact", "public", [section("Contact Orange Nelumbo", "hero", 390, [], "Send a question about notes, simulations, videos, or account access."), section("Contact form", "form", 720, ["Your name", "Email address", "Topic", "Message"], "Front-end demonstration form.", { button: "Show success state" })]),
    spec("Privacy", "/privacy", "public", [section("Privacy for the preview", "hero", 390, [], "How browser-local demo data is handled."), section("Privacy sections", "rows", 760, ["Data stored on this device", "Account information", "Learning progress", "Security", "Third-party services", "Your choices", "Contact"])]),
    spec("Terms", "/terms", "public", [section("Terms for the preview", "hero", 390, [], "Rules for using the Orange Nelumbo demonstration."), section("Terms sections", "rows", 840, ["Preview status", "Permitted use", "Accounts", "Educational content", "Payments", "Intellectual property", "Liability", "Changes"])]),
    spec("404", "/_not-found", "public", [section("Page not found", "hero", 650, [], "The page moved, the link is incomplete, or the route never existed.", { button: "Return to the library" })]),

    spec("Student Login", "/login", "auth", [section("Welcome back.", "form", 760, ["Email address", "Password"], "Continue your visual notes and simulations.", { button: "Sign in" })]),
    spec("Educator Login", "/login?role=educator", "auth", [section("Educator sign in.", "form", 760, ["Email address", "Password"], "For invited Orange Nelumbo educator accounts.", { button: "Sign in as educator" })]),
    spec("Signup", "/signup", "auth", [section("Create your learning account.", "form", 820, ["Full name", "Email address", "Password", "Confirm password"], "Save notes, simulations, and reading progress.", { button: "Create my workspace" })]),
    spec("Forgot Password", "/forgot-password", "auth", [section("Reset your password.", "form", 620, ["Email address"], "Prepare a reset link for your account.", { button: "Prepare reset link" })]),
    spec("Onboarding", "/onboarding", "auth", [section("Choose the target", "cards", 520, ["JEE Main", "JEE Advanced", "Class 11", "Class 12"], "Set the exam and academic stage.", { columns: 2 }), section("Set a workable rhythm", "cards", 520, ["30 min", "60 min", "90 min", "120 min"], "Pick a daily target and study window.", { columns: 2 }), section("Tune your starting point", "cards", 520, ["Physics", "Chemistry", "Mathematics", "Study city"], "Select subjects and optional study city.", { columns: 2 })]),

    spec("Learning Home", "/dashboard", "platform", [section("Welcome back, Aarav.", "cards", 460, ["Visual notes", "Simulations", "Video lectures"], "Pick up a visual note, test an idea, or browse a chapter."), section("Continue reading", "cards", 390, [{ title: "Motion under gravity", meta: "Physics · Kinematics", body: "Continue from the saved section in the dedicated reader." }], "", { columns: 1 }), section("Browse by subject", "cards", 440, ["Physics", "Chemistry", "Mathematics"]), section("Live simulations and saved notes", "cards", 410, ["Vertical throw", "Bookmarks"], "", { columns: 2 })], "Home"),
    spec("Visual Notes", "/learn", "platform", [section("Visual notes for JEE", "hero", 390, [], "Browse Physics, Chemistry, and Mathematics by chapter."), section("Continue reading", "cards", 380, ["Motion under gravity"], "", { columns: 1 }), section("Choose a subject", "cards", 450, ["Physics", "Chemistry", "Mathematics"]), section("Bookmarked concepts", "cards", 420, ["Motion under gravity", "Complex numbers", "Chemical bonding"])], "Visual notes"),
    spec("Subject", "/learn/[subject]", "platform", [section("Physics", "hero", 390, [], "Physical intuition, diagrams, derivations, and interactive models."), section("Chapter map", "cards", 720, ["Kinematics", "Laws of Motion", "Rotational Motion", "Electrostatics", "Optics", "Thermodynamics"], "", { columns: 2 })], "Visual notes"),
    spec("Chapter", "/learn/[subject]/[chapter]", "platform", [section("Kinematics", "hero", 390, [], "Build the chapter one visual note at a time."), section("Concept sequence", "rows", 620, ["Motion in a straight line", "Motion under gravity", "Relative motion", "Projectile motion", "Graphs in kinematics"]), section("Up next", "cards", 360, ["Motion under gravity"], "", { columns: 1 })], "Visual notes"),
    spec("Simulations", "/simulations", "platform", [section("Interactive simulations", "hero", 350, [], "Change one variable, predict the result, and see how the model responds."), section("Simulation gallery", "cards", 680, ["Vertical throw", "Projectile motion", "Electric field", "Molecular geometry", "Calculus area", "Wave interference"])], "Simulations"),
    spec("Simulation Detail", "/simulations/[slug]", "platform", [section("Vertical throw", "reader", 650, ["Model", "Controls", "Graph", "Prediction"], "A live model of velocity, height, and acceleration."), section("Simulation controls", "form", 520, ["Launch speed", "Preset", "Prediction"], "", { button: "Run simulation" })], "Simulations"),
    spec("Video Lectures", "/videos", "platform", [section("Video lectures are coming next.", "hero", 700, [], "Concise, visual-first lectures connected to each note and simulation.", { button: "Explore visual notes" })], "Video lectures"),
    spec("Bookmarks", "/bookmarks", "platform", [section("Saved notes", "hero", 330, [], "Quick access to bookmarked learning material."), section("Bookmarked concepts", "cards", 650, ["Motion under gravity", "Complex numbers", "Chemical bonding", "Limits", "Electrostatics", "Thermodynamics"])], "Bookmarks"),
    spec("Notifications", "/notifications", "platform", [section("Notifications", "hero", 320, [], "Updates about notes, simulations, and account activity."), section("Notification list", "rows", 650, ["New simulation available", "Reading progress saved", "Video lecture update", "Account preference changed", "New visual note"])], "Notifications"),
    spec("Profile", "/profile", "platform", [section("Student profile", "hero", 330, [], "Identity and preferences kept separate from learning content."), section("Profile details", "form", 620, ["Full name", "Email address", "Study city", "Target exam", "Target year"], "", { button: "Save changes" })], "Profile"),
    spec("Settings", "/settings", "platform", [section("Settings", "hero", 300, [], "Account, appearance, and device-local preferences."), section("Appearance", "cards", 370, ["Dark theme", "System theme"]), section("Notification preferences", "rows", 430, ["Email updates", "Simulation releases", "Video lecture updates"]), section("Session and data", "cards", 400, ["Reset preview data", "Log out"], "", { columns: 2 })], "Settings"),
    spec("Protected Note Reader", "/notes/[subject]/[chapter]/[topic]", "reader", [section("Motion under gravity", "hero", 410, [], "A dedicated protected reader for the full visual note.", { button: "Mark complete" }), section("Visual note content", "reader", 660, ["Basic theory", "Notation", "Derivation", "Special cases", "Worked examples", "Interactive lab"], "Every note section is editable and named."), section("Complete the concept", "cards", 370, ["Can you explain the mechanism without the note?"], "", { columns: 1 }), section("Previous and next topics", "cards", 340, ["Motion in a straight line", "Relative motion"], "", { columns: 2 })])
  ];

  function routeFrame(page, route, index) {
    const headerH = route.mode === "public" || route.mode === "platform" ? 74 : route.mode === "reader" ? 64 : 0;
    const footerH = route.mode === "public" ? 290 : 0;
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
      { title: "Public and account", values: routes.filter(function (r) { return r.mode === "public" || r.mode === "auth"; }).map(function (r) { return r.route; }) },
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
  const generated = [coverFrame(websitePage)];
  routes.forEach(function (route, i) { generated.push(routeFrame(websitePage, route, i + 1)); });

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
