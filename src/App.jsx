import React, { useEffect, useMemo, useState } from "react";
import {
  diagnosticQuestions,
  evidenceItems,
  groups,
  readinessLevels,
  scenarios,
  stations,
  timeline,
} from "./lessonData";

const STORAGE_KEY = "sci0007-week1-lab-state";

const initialState = {
  activeStation: "course",
  policyScenarioIndex: 0,
  student: {
    name: "",
    studentId: "",
    groupId: "math",
    portfolioLink: "",
  },
  policyChoices: {},
  diagnostic: {},
  evidence: {},
  reflection: "",
  copied: false,
};

function safeLoadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d="M4 12a8 8 0 1 0 2.34-5.66L4 8.68" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4v4.68h4.68" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getCompletion(state) {
  const courseDone =
    state.student.name.trim() &&
    state.student.studentId.trim() &&
    state.student.groupId;
  const policyDone =
    scenarios.length > 0 &&
    scenarios.every((scenario) =>
      scenario.options.find(
        (option) =>
          option.id === state.policyChoices[scenario.id] && option.correct
      )
    );
  const diagnosticDone = diagnosticQuestions.every(
    (question) => state.diagnostic[question.id]
  );
  const portfolioDone =
    state.student.portfolioLink.trim() &&
    evidenceItems.every((item) => state.evidence[item.id]);
  const reflectionDone = state.reflection.trim().length >= 60;

  return {
    course: Boolean(courseDone),
    policy: Boolean(policyDone),
    diagnostic: Boolean(diagnosticDone),
    portfolio: Boolean(portfolioDone),
    reflection: Boolean(reflectionDone),
  };
}

function buildSummary(state, completion) {
  const group = groups.find((item) => item.id === state.student.groupId);
  const diagnosticText = diagnosticQuestions
    .map((question) => {
      const value = state.diagnostic[question.id] || "ยังไม่ตอบ";
      return `- ${question.label}: ${value}`;
    })
    .join("\n");
  const policyText = scenarios
    .map((scenario) => {
      const choiceId = state.policyChoices[scenario.id];
      const choice = scenario.options.find((option) => option.id === choiceId);
      return `- ${scenario.title}: ${choice ? choice.label : "ยังไม่ตอบ"}`;
    })
    .join("\n");
  const evidenceText = evidenceItems
    .map((item) => `- ${state.evidence[item.id] ? "ครบ" : "ยังไม่ครบ"}: ${item.label}`)
    .join("\n");
  const completedCount = Object.values(completion).filter(Boolean).length;

  return [
    "SCI0007 Week 1 Lab Onboarding",
    `ชื่อ-สกุล: ${state.student.name || "-"}`,
    `รหัสนักศึกษา: ${state.student.studentId || "-"}`,
    `กลุ่มเรียน: ${group ? `${group.label} (${group.detail})` : "-"}`,
    `Portfolio link: ${state.student.portfolioLink || "-"}`,
    `ความก้าวหน้า: ${completedCount}/5 สถานี`,
    "",
    "Diagnostic",
    diagnosticText,
    "",
    "AI policy scenario",
    policyText,
    "",
    "Evidence checklist",
    evidenceText,
    "",
    "Reflection",
    state.reflection || "-",
  ].join("\n");
}

export default function App() {
  const [state, setState] = useState(safeLoadState);
  const completion = useMemo(() => getCompletion(state), [state]);
  const completedCount = Object.values(completion).filter(Boolean).length;
  const summary = useMemo(() => buildSummary(state, completion), [state, completion]);
  const activeStation = stations.find((station) => station.id === state.activeStation) || stations[0];
  const activeGroup = groups.find((group) => group.id === state.student.groupId);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateStudent = (field, value) => {
    setState((current) => ({
      ...current,
      copied: false,
      student: { ...current.student, [field]: value },
    }));
  };

  const setActiveStation = (stationId) => {
    setState((current) => ({ ...current, activeStation: stationId }));
  };

  const copySummary = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(summary);
    } catch {
      const copyField = document.createElement("textarea");
      copyField.value = summary;
      copyField.setAttribute("readonly", "");
      copyField.style.position = "fixed";
      copyField.style.opacity = "0";
      document.body.appendChild(copyField);
      copyField.select();
      document.execCommand("copy");
      document.body.removeChild(copyField);
    }
    setState((current) => ({ ...current, copied: true }));
  };

  const resetAll = () => {
    const ok = window.confirm("ล้างข้อมูลกิจกรรมบนเครื่องนี้ทั้งหมด?");
    if (!ok) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="course-code">SCI0007</p>
          <div>
            <h1>วิทยาการคำนวณและปัญญาประดิษฐ์ในวิทยาศาสตร์</h1>
            <p className="subtitle">สัปดาห์ที่ 1: ปฐมนิเทศรายวิชาและการใช้งานเครื่องมือ</p>
          </div>
        </div>
        <div className="lab-meta" aria-label="ข้อมูลห้องเรียน">
          <span>Lab 2</span>
          <label>
            ชื่อ-สกุล
            <input
              value={state.student.name}
              onChange={(event) => updateStudent("name", event.target.value)}
              placeholder="กานต์ จันทร์ดี"
            />
          </label>
          <label>
            กลุ่ม
            <select
              value={state.student.groupId}
              onChange={(event) => updateStudent("groupId", event.target.value)}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            รหัสนักศึกษา
            <input
              value={state.student.studentId}
              onChange={(event) => updateStudent("studentId", event.target.value)}
              placeholder="69312001"
            />
          </label>
          <button className="ghost-button" type="button" onClick={resetAll}>
            <ResetIcon />
            ล้างข้อมูล
          </button>
        </div>
      </header>

      <section className="stepper-wrap" aria-label="ความก้าวหน้าของสถานีเรียน">
        <nav className="station-stepper">
          {stations.map((station) => (
            <button
              key={station.id}
              data-testid={`step-${station.id}`}
              className={`step-item ${station.id === activeStation.id ? "active" : ""} ${completion[station.id] ? "complete" : ""}`}
              type="button"
              onClick={() => setActiveStation(station.id)}
              aria-current={station.id === activeStation.id ? "step" : undefined}
            >
              <span className="step-circle">
                {completion[station.id] ? <CheckIcon /> : station.number}
              </span>
              <span className="step-copy">
                <strong>{station.title}</strong>
                <small>{completion[station.id] ? "เสร็จแล้ว" : station.id === activeStation.id ? "กำลังทำ" : "ยังไม่เริ่ม"}</small>
              </span>
            </button>
          ))}
        </nav>
      </section>

      <main className="workspace">
        <section className="activity-panel panel">
          <div className="activity-heading">
            <div>
              <span className="station-label">สถานี {activeStation.number}</span>
              <h2>{activeStation.title}</h2>
              <p>{activeStation.outcome}</p>
            </div>
            <div className="clo-chip">{activeStation.clo}</div>
          </div>

          <StationContent state={state} setState={setState} activeStation={activeStation.id} />
        </section>

        <aside className="right-panel">
          <section className="panel evidence-panel">
            <div className="panel-heading">
              <h2>Evidence checklist</h2>
              <span>{Object.values(state.evidence).filter(Boolean).length}/{evidenceItems.length}</span>
            </div>
            <div className="evidence-list">
              {evidenceItems.map((item) => (
                <label key={item.id} className="check-row">
                  <input
                    data-testid={`evidence-${item.id}`}
                    type="checkbox"
                    checked={Boolean(state.evidence[item.id])}
                    onChange={(event) =>
                      setState((current) => ({
                        ...current,
                        copied: false,
                        evidence: {
                          ...current.evidence,
                          [item.id]: event.target.checked,
                        },
                      }))
                    }
                  />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="panel summary-panel">
            <div className="panel-heading">
              <h2>Google Form summary</h2>
              <span>{summary.length} chars</span>
            </div>
            <div className="summary-progress">
              <strong>{completedCount}/5</strong>
              <span>{activeGroup?.label}</span>
              <div className="meter-track">
                <div style={{ width: `${(completedCount / 5) * 100}%` }} />
              </div>
            </div>
            <textarea readOnly value={summary} aria-label="ข้อความสรุปสำหรับส่ง Google Form" />
            <button data-testid="copy-summary" className="primary-button" type="button" onClick={copySummary}>
              <CopyIcon />
              {state.copied ? "คัดลอกแล้ว" : "Copy Summary"}
            </button>
          </section>
        </aside>
      </main>
      <footer className="statusbar">
        <span>นโยบายการใช้ AI</span>
        <span>จริยธรรมในการใช้ AI</span>
        <span>บันทึกอัตโนมัติแล้ว</span>
      </footer>
    </div>
  );
}

function StationContent({ state, setState, activeStation }) {
  if (activeStation === "course") {
    return (
      <div className="station-content">
        <div className="instruction-card">
          <h3>เป้าหมายในคาบนี้</h3>
          <p>
            นักศึกษาจะเปิดระบบกิจกรรม ทำความเข้าใจนโยบายการใช้ AI และสร้างแฟ้มหลักฐาน
            ที่ใช้ต่อเนื่องทั้งรายวิชา
          </p>
        </div>
        <div className="outcome-grid">
          <Outcome title="CLO2" text="ใช้ Google Drive/Form และเว็บกิจกรรมเพื่อจัดการหลักฐานการเรียนรู้" />
          <Outcome title="CLO4" text="ตรวจสอบและเปิดเผยการใช้ AI อย่างรับผิดชอบ" />
          <Outcome title="Workflow" text="input → activity → evidence → submission" />
        </div>
        <section className="timeline">
          <h3>แผนเวลา 4 ชั่วโมง</h3>
          {timeline.map(([time, text]) => (
            <div key={time} className="timeline-row">
              <span>{time}</span>
              <p>{text}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (activeStation === "policy") {
    const scenario = scenarios[state.policyScenarioIndex] || scenarios[0];
    const selectedId = state.policyChoices[scenario.id];
    const selected = scenario.options.find((option) => option.id === selectedId);
    return (
      <div className="station-content scenario-stack">
        <article className="scenario-card">
          <div className="scenario-status">
            <span>สถานการณ์ที่ {state.policyScenarioIndex + 1}</span>
            <strong>{state.policyScenarioIndex + 1} / {scenarios.length}</strong>
          </div>
          <div className="scenario-brief">
            <div className="scenario-visual" aria-hidden="true">
              <svg viewBox="0 0 160 128">
                <rect x="16" y="76" width="128" height="34" rx="8" fill="#d9ebfb" />
                <rect x="64" y="45" width="72" height="46" rx="7" fill="#ffffff" stroke="#9fc7e8" strokeWidth="3" />
                <path d="M73 59h52M73 72h34" stroke="#2c77bd" strokeWidth="5" strokeLinecap="round" />
                <circle cx="49" cy="54" r="22" fill="#f0c49f" />
                <path d="M30 52c8-25 40-24 43-3-12-5-22-2-33 7-4-1-7-2-10-4Z" fill="#17324a" />
                <path d="M34 78c9-9 25-9 34 0l11 32H24l10-32Z" fill="#1d67b1" />
                <rect x="78" y="88" width="49" height="29" rx="5" fill="#7895aa" />
                <path d="M102 94h1" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3>{scenario.title}</h3>
              <p>{scenario.prompt}</p>
              <strong className="question-line">ควรทำอย่างไร?</strong>
            </div>
          </div>
          <div className="choice-list">
            {scenario.options.map((option, index) => (
              <label
                key={option.id}
                data-testid={`policy-option-${scenario.id}-${option.id}`}
                className={`choice-row ${selectedId === option.id ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name={scenario.id}
                  checked={selectedId === option.id}
                  onChange={() =>
                    setState((current) => ({
                      ...current,
                      copied: false,
                      policyChoices: {
                        ...current.policyChoices,
                        [scenario.id]: option.id,
                      },
                    }))
                  }
                />
                <span>{String.fromCharCode(65 + index)}. {option.label}</span>
              </label>
            ))}
          </div>
          {selected && (
            <div className={`feedback ${selected.correct ? "correct" : "needs-work"}`}>
              <strong>{selected.correct ? "ถูกต้อง!" : "ลองคิดใหม่"}</strong>
              <span>{selected.feedback}</span>
            </div>
          )}
          <div className="scenario-actions">
            <button
              data-testid="policy-prev"
              className="ghost-button"
              type="button"
              disabled={state.policyScenarioIndex === 0}
              onClick={() =>
                setState((current) => ({
                  ...current,
                  policyScenarioIndex: Math.max(0, current.policyScenarioIndex - 1),
                }))
              }
            >
              กลับ
            </button>
            <span>สถานีที่ 2 จาก 5</span>
            <button
              data-testid="policy-next"
              className="primary-button compact"
              type="button"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  policyScenarioIndex:
                    current.policyScenarioIndex + 1 >= scenarios.length
                      ? 0
                      : current.policyScenarioIndex + 1,
                }))
              }
            >
              ถัดไป
            </button>
          </div>
        </article>
      </div>
    );
  }

  if (activeStation === "diagnostic") {
    return (
      <div className="station-content">
        <div className="instruction-card">
          <h3>สำรวจความพร้อมก่อนเริ่มรายวิชา</h3>
          <p>เลือกคำตอบที่ตรงกับตนเองที่สุด ข้อมูลนี้ใช้เพื่อให้อาจารย์ปรับการสาธิตใน lab</p>
        </div>
        <div className="diagnostic-list">
          {diagnosticQuestions.map((question) => (
            <fieldset key={question.id} className="diagnostic-row">
              <legend>
                <strong>{question.label}</strong>
                <span>{question.question}</span>
              </legend>
              <div className="segmented">
                {readinessLevels.map((level) => (
                  <label key={level} className={state.diagnostic[question.id] === level ? "active" : ""}>
                    <input
                      type="radio"
                      name={question.id}
                      checked={state.diagnostic[question.id] === level}
                      onChange={() =>
                        setState((current) => ({
                          ...current,
                          copied: false,
                          diagnostic: { ...current.diagnostic, [question.id]: level },
                        }))
                      }
                    />
                    {level}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>
    );
  }

  if (activeStation === "portfolio") {
    return (
      <div className="station-content">
        <div className="instruction-card">
          <h3>ตั้งค่าแฟ้มหลักฐานใน Google Drive</h3>
          <p>
            สร้างโฟลเดอร์หลักและโฟลเดอร์ย่อย จากนั้นวางลิงก์ที่ตั้งสิทธิ์ให้ผู้สอนเปิดดูได้
          </p>
        </div>
        <div className="folder-map">
          <div className="folder root">SCI0007_รหัส_ชื่อ</div>
          <div className="folder-children">
            <span>lab</span>
            <span>prompt-log</span>
            <span>reflection</span>
            <span>project</span>
          </div>
        </div>
        <label className="wide-input">
          Portfolio link
          <input
            value={state.student.portfolioLink}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                copied: false,
                student: { ...current.student, portfolioLink: event.target.value },
              }))
            }
            placeholder="วางลิงก์ Google Drive folder ที่เปิดสิทธิ์แล้ว"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="station-content">
      <div className="instruction-card">
        <h3>Reflection ท้ายคาบ</h3>
        <p>
          เขียนอย่างน้อย 60 ตัวอักษร ด้วยภาษาของตนเอง แล้วคัดลอก summary ไปส่ง Google Form
        </p>
      </div>
      <label className="reflection-box">
        ฉันจะใช้ AI อย่างไรให้ช่วยเรียนรู้จริง ไม่ใช่ทำงานแทนฉัน
        <textarea
          value={state.reflection}
          onChange={(event) =>
            setState((current) => ({ ...current, copied: false, reflection: event.target.value }))
          }
          placeholder="ตัวอย่าง: ฉันจะใช้ AI เพื่อถามแนวทางหรือขอให้ช่วยตรวจความชัดเจน แต่จะตรวจแหล่งข้อมูลและเขียนคำตอบสุดท้ายด้วยตนเอง..."
        />
      </label>
      <div className="reflection-counter">
        {state.reflection.trim().length}/60 ตัวอักษรขั้นต่ำ
      </div>
    </div>
  );
}

function Outcome({ title, text }) {
  return (
    <article className="outcome-card">
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
