const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CURRICULUM_ROOT = path.join(__dirname, '..', 'curriculum', 'lessons');
const SITE_LESSONS = path.join(__dirname, 'lessons');

// slug -> { lessonTitle, seriesName } for breadcrumbs and nav
const LESSONS = [
  {
    slug: 'fruit-of-spirit-01-love',
    lessonTitle: 'Love (Week 1)',
    seriesName: 'Fruit of the Spirit',
  },
  {
    slug: 'jesus-calms-the-storm',
    lessonTitle: 'Jesus Calms the Storm',
    seriesName: 'Jesus: Life & Teachings',
  },
];

const DOC_TYPES = [
  { file: 'leader-guide.md', label: 'Leader guide' },
  { file: 'student-sheet.md', label: 'Student sheet' },
  { file: 'family-take-home.md', label: 'Family take-home' },
];

function getLayout(lessonTitle, seriesName, docLabel, contentHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(docLabel)} — ${escapeHtml(lessonTitle)} — Family Faith</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&family=Dancing+Script:wght@600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../assets/style.css" />
</head>
<body>
  <div class="promo-banner">
    <span class="promo-text">Get free family devotionals when you subscribe.</span>
    <span class="promo-icons"><a href="../../index.html">Home</a></span>
  </div>
  <header class="site-header">
    <div class="logo-wrap">
      <a href="../../index.html" class="logo">Family Faith</a>
      <span class="logo-tagline">Helping families grow in faith</span>
    </div>
    <nav class="nav">
      <a href="../../index.html">Home</a>
      <a href="../index.html">Lessons</a>
      <a href="#">Shop</a>
      <a href="#">Contact</a>
    </nav>
  </header>
  <div class="value-bar">
    <div><span>&#x1f4da;</span> Bible-based resources</div>
    <div><span>&#x1f4ac;</span> Support for families</div>
    <div><span>&#x1f4e6;</span> Digital + print options</div>
  </div>
  <div class="page">
    <div class="breadcrumb">
      <a href="../index.html">Lessons</a> → ${escapeHtml(seriesName)} → ${escapeHtml(lessonTitle)} → ${escapeHtml(docLabel)}
    </div>
    <div class="actions">
      <button type="button" class="btn btn-primary" id="print-btn">Print</button>
      <button type="button" class="btn btn-secondary" id="copy-btn">Copy</button>
    </div>
    <div class="lesson-content" id="lesson-content">
${contentHtml}
    </div>
  </div>
  <script>
    document.getElementById('print-btn').onclick = function() { window.print(); };
    document.getElementById('copy-btn').onclick = function() {
      var el = document.getElementById('lesson-content');
      var text = el.innerText || el.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copy-btn');
          var orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(function() { btn.textContent = orig; }, 1500);
        });
      } else {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
        try {
          document.execCommand('copy');
          sel.removeAllRanges();
          var btn = document.getElementById('copy-btn');
          var orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(function() { btn.textContent = orig; }, 1500);
        } catch (e) {}
      }
    };
  </script>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function build() {
  marked.setOptions({ gfm: true });
  ensureDir(SITE_LESSONS);

  for (const lesson of LESSONS) {
    const srcDir = path.join(CURRICULUM_ROOT, lesson.slug);
    const outDir = path.join(SITE_LESSONS, lesson.slug);
    if (!fs.existsSync(srcDir)) {
      console.warn('Skip (no folder):', lesson.slug);
      continue;
    }
    ensureDir(outDir);

    for (const doc of DOC_TYPES) {
      const srcFile = path.join(srcDir, doc.file);
      if (!fs.existsSync(srcFile)) {
        console.warn('Skip (no file):', path.relative(CURRICULUM_ROOT, srcFile));
        continue;
      }
      const md = fs.readFileSync(srcFile, 'utf8');
      const contentHtml = marked.parse(md);
      const htmlFile = doc.file.replace('.md', '.html');
      const outPath = path.join(outDir, htmlFile);
      const fullHtml = getLayout(
        lesson.lessonTitle,
        lesson.seriesName,
        doc.label,
        contentHtml
      );
      fs.writeFileSync(outPath, fullHtml, 'utf8');
      console.log('Wrote', path.relative(__dirname, outPath));
    }
  }
}

build();
