/* ============================================================
   FICHA AERMYNUZ — lógica (imprimir, baixar PDF, salvar)
   ============================================================ */
(function () {
  "use strict";

  const KEY = "ficha_aermynuz_v1";
  const sheet = document.getElementById("sheet");

  /* ---------- coletar / aplicar valores ---------- */
  function getInputs() {
    return Array.from(sheet.querySelectorAll("input, textarea, select"));
  }

  function collect() {
    const data = {};
    getInputs().forEach((el, i) => { data["f" + i] = el.value; });
    return data;
  }

  function apply(data) {
    if (!data) return;
    getInputs().forEach((el, i) => {
      if (data["f" + i] !== undefined) el.value = data["f" + i];
    });
  }

  /* ---------- salvar / carregar (localStorage) ---------- */
  function save(silent) {
    try {
      localStorage.setItem(KEY, JSON.stringify(collect()));
      if (!silent) toast("Ficha salva neste navegador.");
    } catch (e) { console.warn("Falha ao salvar:", e); }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) apply(JSON.parse(raw));
    } catch (e) { console.warn("Falha ao carregar:", e); }
  }

  function clearAll() {
    if (!confirm("Apagar todos os dados desta ficha?")) return;
    getInputs().forEach((el) => { el.value = ""; });
    try { localStorage.removeItem(KEY); } catch (e) {}
    toast("Ficha limpa.");
  }

  /* ---------- imprimir ---------- */
  function printSheet() {
    window.print();
  }

  /* ---------- baixar PDF (html2canvas + jsPDF) ---------- */
  async function downloadPDF() {
    const btn = document.getElementById("btnPDF");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Gerando PDF...";

    try {
      if (!window.html2canvas || !window.jspdf) {
        throw new Error("Bibliotecas de PDF não carregaram.");
      }

      const canvas = await window.html2canvas(sheet, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: sheet.scrollWidth,
        windowHeight: sheet.scrollHeight
      });

      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;

      // A4 retrato em mm
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const usableW = pageW - margin * 2;

      // proporção da imagem
      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;

      if (imgH <= pageH - margin * 2) {
        // cabe em 1 página
        pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
      } else {
        // fatiar em múltiplas páginas
        let remaining = imgH;
        let position = margin;
        const sliceH = pageH - margin * 2;
        let srcY = 0;
        const pxPerMM = canvas.width / imgW;

        while (remaining > 0) {
          const thisH = Math.min(sliceH, remaining);
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = Math.round(thisH * pxPerMM);
          const ctx = sliceCanvas.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(canvas, 0, srcY, canvas.width, sliceCanvas.height,
                        0, 0, canvas.width, sliceCanvas.height);
          pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG",
                       margin, position, imgW, thisH);
          remaining -= thisH;
          srcY += sliceCanvas.height;
          if (remaining > 0) { pdf.addPage(); }
        }
      }

      const nomeEl = sheet.querySelector('input');
      const nome = (nomeEl && nomeEl.value.trim()) || "personagem";
      pdf.save("Ficha_AERMYNUZ_" + nome.replace(/\s+/g, "_") + ".pdf");
      toast("PDF gerado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Não foi possível gerar o PDF. Tente usar 'Imprimir' e salvar como PDF.\n\n" + e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  /* ---------- toast simples ---------- */
  let toastTimer;
  function toast(msg) {
    let el = document.getElementById("ff-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "ff-toast";
      el.style.cssText =
        "position:fixed;left:50%;bottom:32px;transform:translateX(-50%);" +
        "background:#1e1e30;color:#e8c97a;border:1px solid #c8a95a;" +
        "padding:.7rem 1.3rem;border-radius:4px;font-family:'Cinzel',serif;" +
        "font-size:.8rem;letter-spacing:.05em;z-index:9999;opacity:0;" +
        "transition:opacity .3s;box-shadow:0 6px 20px rgba(0,0,0,.5);";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => { el.style.opacity = "1"; });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 2200);
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    load();

    const bP = document.getElementById("btnImprimir");
    const bPDF = document.getElementById("btnPDF");
    const bS = document.getElementById("btnSalvar");
    const bL = document.getElementById("btnLimpar");

    if (bP) bP.addEventListener("click", printSheet);
    if (bPDF) bPDF.addEventListener("click", downloadPDF);
    if (bS) bS.addEventListener("click", () => save(false));
    if (bL) bL.addEventListener("click", clearAll);

    // auto-save ao digitar (debounce)
    let t;
    sheet.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(() => save(true), 600);
    });
  });
})();
