/* =====================================================================
   MOCK DATA
   Realistic placeholder data so the dashboard works fully out of the
   box. Each metric score is 0–100, where a HIGHER score is better
   (e.g. Attendance = punctuality compliance, not lateness count).
   ===================================================================== */
const CLASSES = [
  {
    id: "7a",
    name: "Grade 7-A",
    teacher: "Ms. Siti Nurhaliza",
    students: [
      "Ahmad Farhan", "Bunga Citra", "Dewi Lestari", "Fajar Ramadhan",
      "Gita Ayu", "Hafiz Rahman", "Indah Permata", "Joko Susilo",
      "Kartika Sari", "Lukman Hakim", "Mira Anggraini", "Nur Aisyah",
      "Oki Setiawan", "Putri Wulandari", "Rizky Maulana", "Sari Utami"
    ],
    metrics: { cleaning: 92, attendance: 88, discipline: 95 }
  },
  {
    id: "7b",
    name: "Grade 7-B",
    teacher: "Mr. Budi Santoso",
    students: [
      "Adit Prasetyo", "Bella Safitri", "Dimas Aditya", "Eka Putri",
      "Farah Salsabila", "Galih Pratama", "Hana Fitria", "Irfan Maulidan",
      "Jihan Ramadhani", "Krisna Yuda", "Lala Anastasia", "Mahesa Putra"
    ],
    metrics: { cleaning: 74, attendance: 69, discipline: 80 }
  },
  {
    id: "8a",
    name: "Grade 8-A",
    teacher: "Mrs. Ratna Kusuma",
    students: [
      "Naufal Hakim", "Olivia Zahra", "Pandu Wicaksono", "Qonita Amelia",
      "Rafi Ardiansyah", "Salsa Aulia", "Taufik Hidayat", "Umi Kalsum",
      "Vino Bastian", "Wulan Sari", "Xena Amalia", "Yusuf Ibrahim",
      "Zahra Nabila"
    ],
    metrics: { cleaning: 58, attendance: 62, discipline: 66 }
  },
  {
    id: "8b",
    name: "Grade 8-B",
    teacher: "Mr. Andi Wijaya",
    students: [
      "Alya Ramadhani", "Bagas Saputra", "Citra Ningsih", "Doni Iskandar",
      "Elsa Marlina", "Fikri Aulia", "Gading Pratama", "Hesti Purnama",
      "Ivan Setiadi", "Jasmine Aulia", "Kevin Halim", "Larasati Dewi",
      "Miko Ferdian", "Nadia Rahmawati"
    ],
    metrics: { cleaning: 89, attendance: 95, discipline: 91 }
  },
  {
    id: "9a",
    name: "Grade 9-A",
    teacher: "Mrs. Fitriani Az-Zahra",
    students: [
      "Aldi Firmansyah", "Bilqis Ramadhani", "Chandra Kirana", "Devi Anjani",
      "Erlangga Putra", "Feby Amelia", "Gunawan Wibisono", "Hafizah Putri",
      "Ilham Nur Fadli", "Jasmine Kirani", "Karin Salsabila"
    ],
    metrics: { cleaning: 81, attendance: 77, discipline: 72 }
  },
  {
    id: "9b",
    name: "Grade 9-B",
    teacher: "Mr. Reza Firmansyah",
    students: [
      "Lintang Anggara", "Melati Suryani", "Naila Zahra", "Oscar Pradana",
      "Puspa Wardani", "Raka Aditya", "Sinta Marlina", "Teguh Prakoso",
      "Uut Permatasari", "Vania Puspita", "Wahyu Nugroho", "Yasmin Azzahra",
      "Zaki Ramadhan"
    ],
    metrics: { cleaning: 96, attendance: 90, discipline: 93 }
  }
];

// Human-facing metadata for each tracked evaluation metric.
const METRIC_META = {
  cleaning:   { label: "Cleaning",         idLabel: "Kebersihan",    sub: "Classroom & desk upkeep" },
  attendance: { label: "Late Attendance",  idLabel: "Keterlambatan", sub: "On-time arrival rate" },
  discipline: { label: "Discipline",       idLabel: "Kedisiplinan",  sub: "Conduct & rule compliance" }
};

/* =====================================================================
   STATUS HELPERS
   ===================================================================== */

// Map a 0-100 score to an evaluation status.
function getStatus(score){
  if (score >= 85) return { key: "good", label: "Excellent", color: "var(--good)", bg: "var(--good-bg)" };
  if (score >= 65) return { key: "warn", label: "Warning",   color: "var(--warn)", bg: "var(--warn-bg)" };
  return             { key: "bad",  label: "Needs Attention", color: "var(--bad)",  bg: "var(--bad-bg)" };
}

// Average the three tracked metrics into one overall class score.
function overallScore(cls){
  const { cleaning, attendance, discipline } = cls.metrics;
  return Math.round((cleaning + attendance + discipline) / 3);
}

// Build "AB" style initials from a class name, e.g. "Grade 7-A" -> "7A".
function classInitials(name){
  const match = name.match(/(\d+)[^\dA-Za-z]*([A-Za-z])/);
  return match ? `${match[1]}${match[2]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}

// Build initials from a student's full name, e.g. "Ahmad Farhan" -> "AF".
function studentInitials(name){
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

/* =====================================================================
   RENDER: DASHBOARD (overview cards + stat strip)
   ===================================================================== */

function renderStatStrip(){
  const strip = document.getElementById("statStrip");
  const totalStudents = CLASSES.reduce((sum, c) => sum + c.students.length, 0);
  const avgScore = Math.round(CLASSES.reduce((sum, c) => sum + overallScore(c), 0) / CLASSES.length);
  const needsAttention = CLASSES.filter(c => getStatus(overallScore(c)).key === "bad").length;

  const stats = [
    { num: CLASSES.length, label: "Classes tracked" },
    { num: totalStudents, label: "Total students" },
    { num: `${avgScore}%`, label: "School-wide average" },
    { num: needsAttention, label: "Classes needing attention" }
  ];

  strip.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-card__num">${s.num}</div>
      <div class="stat-card__label">${s.label}</div>
    </div>
  `).join("");
}

function renderClassGrid(){
  const grid = document.getElementById("classGrid");

  grid.innerHTML = CLASSES.map(cls => {
    const score = overallScore(cls);
    const status = getStatus(score);

    const meters = Object.keys(cls.metrics).map(key => {
      const meta = METRIC_META[key];
      const val = cls.metrics[key];
      const s = getStatus(val);
      return `
        <div class="meter">
          <span class="meter__label">${meta.label}</span>
          <span class="meter__track">
            <span class="meter__fill" style="--fill-color:${s.color}; width:${val}%"></span>
          </span>
        </div>
      `;
    }).join("");

    return `
      <button class="class-card" data-id="${cls.id}" style="--status-color:${status.color}; --status-bg:${status.bg}">
        <div class="class-card__top">
          <span class="class-card__id">${classInitials(cls.name)}</span>
          <span class="class-card__status">${status.label}</span>
        </div>
        <div class="class-card__name">${cls.name}</div>
        <div class="class-card__teacher">${cls.teacher}</div>

        <div class="class-card__meters">${meters}</div>

        <div class="class-card__footer">
          <span class="class-card__score">${score}<span style="font-size:0.7rem;color:var(--ink-400);font-weight:500;"> / 100</span></span>
          <span class="class-card__cta">
            View details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </span>
        </div>
      </button>
    `;
  }).join("");

  // Attach click handlers to every generated card.
  grid.querySelectorAll(".class-card").forEach(card => {
    card.addEventListener("click", () => openClassDetail(card.dataset.id));
  });
}

/* =====================================================================
   RENDER: DETAIL VIEW
   ===================================================================== */

function renderMetrics(cls){
  const container = document.getElementById("metricsContainer");

  container.innerHTML = Object.keys(cls.metrics).map(key => {
    const meta = METRIC_META[key];
    const val = cls.metrics[key];
    const status = getStatus(val);

    return `
      <div class="stamp">
        <div class="stamp__ring" style="--pct:${val}; --ring-color:${status.color}">
          <span class="stamp__value">${val}</span>
        </div>
        <div class="stamp__label">${meta.label}</div>
        <div class="stamp__sub">${meta.idLabel} · ${meta.sub}</div>
        <span class="stamp__tag" style="--status-color:${status.color}; --status-bg:${status.bg}">${status.label}</span>
      </div>
    `;
  }).join("");
}

function renderRoster(cls){
  const list = document.getElementById("rosterList");
  document.getElementById("studentCount").textContent = cls.students.length;

  list.innerHTML = cls.students.map((name, i) => `
    <li class="roster__item">
      <span class="roster__no">${i + 1}</span>
      <span class="roster__avatar">${studentInitials(name)}</span>
      <span class="roster__name">${name}</span>
    </li>
  `).join("");
}

function openClassDetail(id){
  const cls = CLASSES.find(c => c.id === id);
  if (!cls) return;

  const score = overallScore(cls);
  const status = getStatus(score);

  document.getElementById("detailInitial").textContent = classInitials(cls.name);
  document.getElementById("detailClassName").textContent = cls.name;
  document.getElementById("detailTeacher").textContent = `Evaluating teacher: ${cls.teacher}`;
  document.getElementById("detailOverallScore").textContent = score;
  document.getElementById("detailOverallScore").style.color = status.color;

  renderMetrics(cls);
  renderRoster(cls);

  switchView("detailView");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================================================================
   VIEW SWITCHING
   ===================================================================== */

function switchView(viewId){
  document.querySelectorAll(".view").forEach(v => v.classList.remove("view--active"));
  document.getElementById(viewId).classList.add("view--active");
}

/* =====================================================================
   INIT
   ===================================================================== */

function setToday(){
  const el = document.getElementById("todayDate");
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  el.textContent = new Date().toLocaleDateString("en-US", options);
}

document.addEventListener("DOMContentLoaded", () => {
  setToday();
  renderStatStrip();
  renderClassGrid();

  document.getElementById("backBtn").addEventListener("click", () => {
    switchView("dashboardView");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
