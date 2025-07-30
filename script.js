
const KEY = "tre_competencias_v1";
let QUESTIONS = [];
let state = {
  index: 0,
  answers: {}, // id -> value (1..4)
  savedAt: null,
};

function $(sel){ return document.querySelector(sel); }
function el(tag, attrs={}, children=[]){
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==="class") e.className=v; else if(k==="dataset"){ Object.assign(e.dataset,v); } else e.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(typeof c==="string") e.appendChild(document.createTextNode(c)); else if(c) e.appendChild(c);
  });
  return e;
}

function loadSaved(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return;
    const obj = JSON.parse(raw);
    if(obj && obj.answers){
      state = {...state, ...obj};
    }
  }catch(e){ console.warn("No saved state", e); }
}

function save(){
  state.savedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(state));
  updateSaveInfo();
}

function updateSaveInfo(){
  const s = state.savedAt ? new Date(state.savedAt).toLocaleString() : "—";
  $("#saveInfo").textContent = `Progreso guardado automáticamente · Último guardado: ${s}`;
  $("#footerSaved").textContent = s;
}

async function loadQuestions(){
  const res = await fetch("questions.json?ts="+Date.now());
  QUESTIONS = await res.json();
}

function percentComplete(){
  const answered = Object.keys(state.answers).length;
  return Math.round(100 * answered / QUESTIONS.length);
}

function renderProgress(){
  const elp = $("#progressBar");
  if(!elp) return;
  elp.style.setProperty("--w", percentComplete()+"%");
  elp.style.position = "relative";
  elp.innerHTML = "";
  const bar = el("div");
  bar.style.width = percentComplete()+"%";
  bar.style.height = "100%";
  bar.style.background = "var(--accent)";
  elp.appendChild(bar);
}

function renderGridNav(){
  const wrap = $("#gridNav");
  wrap.innerHTML = "";
  QUESTIONS.forEach((q,i)=>{
    const b = el("button", {}, String(i+1));
    if(state.answers[q.id]) b.classList.add("answered");
    if(i===state.index) b.classList.add("current");
    b.addEventListener("click", ()=>{ state.index = i; renderQuestion(); save(); });
    wrap.appendChild(b);
  });
}

function renderQuestion(){
  const q = QUESTIONS[state.index];
  $("#qIndex").textContent = `Pregunta ${state.index+1} de ${QUESTIONS.length}`;
  $("#qCompetence").textContent = q.competencia;
  $("#qText").textContent = q.texto;

  document.querySelectorAll(".opt").forEach(btn=>{
    btn.classList.remove("active");
    const v = parseInt(btn.dataset.value,10);
    if(state.answers[q.id] === v) btn.classList.add("active");
    btn.onclick = ()=>{
      state.answers[q.id] = v;
      renderGridNav();
      renderProgress();
      save();
    };
  });

  $("#btnPrev").disabled = state.index===0;
  $("#btnNext").disabled = state.index===QUESTIONS.length-1;
  renderGridNav();
  renderProgress();
}

function show(id){
  ["intro","questionView","summaryView"].forEach(sec=>$("#"+sec).classList.add("hidden"));
  $("#"+id).classList.remove("hidden");
}

function computeSummary(){
  const byComp = {};
  QUESTIONS.forEach(q=>{
    if(!byComp[q.competencia]) byComp[q.competencia] = {score:0, count:0};
    const val = state.answers[q.id];
    if(val){
      const v = q.reverse ? (5 - val) : val; // reverse-code if needed
      byComp[q.competencia].score += v;
      byComp[q.competencia].count += 1;
    }
  });
  return byComp;
}

function renderSummary(){
  const byComp = computeSummary();
  const wrap = $("#summary");
  wrap.innerHTML = "";

  const totalAnswered = Object.keys(state.answers).length;
  wrap.appendChild(el("p",{},`Preguntas respondidas: ${totalAnswered} / ${QUESTIONS.length} (${percentComplete()}%)`));

  const tbl = el("table",{class:"card", style:"width:100%;border-collapse:collapse"});
  const thead = el("thead",{}, el("tr",{},[el("th",{},"Competencia"), el("th",{},"Respondidas"), el("th",{},"Media (1–4)") ]));
  const tbody = el("tbody");
  Object.entries(byComp).forEach(([comp, data])=>{
    const avg = data.count? (data.score/data.count).toFixed(2) : "—";
    const tr = el("tr",{},[el("td",{},comp), el("td",{}, String(data.count)), el("td",{}, String(avg))]);
    tbody.appendChild(tr);
  });
  tbl.appendChild(thead); tbl.appendChild(tbody);
  wrap.appendChild(tbl);
}

function exportProgress(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "progreso_competencias.json";
  a.click();
}

function importProgress(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const obj = JSON.parse(reader.result);
      if(obj && obj.answers){
        state = {...state, ...obj};
        save();
        renderQuestion();
        alert("Progreso importado correctamente.");
      }else{
        alert("El archivo no es válido.");
      }
    }catch(e){
      alert("No se pudo leer el archivo.");
    }
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", async ()=>{
  loadSaved();
  updateSaveInfo();
  await loadQuestions();

  $("#btnStart").addEventListener("click", ()=>{ show("questionView"); renderQuestion(); });
  $("#btnReset").addEventListener("click", ()=>{
    if(confirm("Esto borrará todas las respuestas guardadas en este dispositivo. ¿Continuar?")){
      localStorage.removeItem(KEY);
      state = {index:0, answers:{}, savedAt:null};
      updateSaveInfo();
      renderGridNav();
      renderProgress();
      alert("Progreso reiniciado.");
    }
  });
  $("#btnPrev").addEventListener("click", ()=>{ if(state.index>0){ state.index--; renderQuestion(); save(); } });
  $("#btnNext").addEventListener("click", ()=>{ if(state.index<QUESTIONS.length-1){ state.index++; renderQuestion(); save(); } });
  $("#btnFinish").addEventListener("click", ()=>{ show("summaryView"); renderSummary(); });
  $("#btnBack").addEventListener("click", ()=>{ show("questionView"); });
  $("#btnExport").addEventListener("click", exportProgress);
  $("#btnExport2").addEventListener("click", exportProgress);
  $("#importFile").addEventListener("change", (e)=>{
    if(e.target.files && e.target.files[0]) importProgress(e.target.files[0]);
  });

  // If there's existing progress, offer to continue
  if(Object.keys(state.answers).length>0){
    $("#btnStart").textContent = "Continuar";
  }else{
    $("#btnStart").textContent = "Comenzar";
  }
});
