/* Builds a separate answer PDF from the selected original scheme images. */
(() => {
  if (window.OlvTypeMSDownload) return;
  const WIDTH = 1240, HEIGHT = 1754;
  let mapPromise, pdfPromise;
  const map = () => mapPromise ||= fetch('/igcsehumanbiology/workbooks/type-check-map.json?v=4', { credentials: 'same-origin' })
    .then(response => { if (!response.ok) throw new Error('The answer guide is unavailable. Please try again.'); return response.json(); });
  const pdfMaker = () => pdfPromise ||= new Promise((resolve, reject) => {
    if (window.OlvPaperDownloads?.pdfBlob) return resolve(window.OlvPaperDownloads);
    const script = document.createElement('script');
    script.src = '/igcsehumanbiology/assets/paper-downloads.js?v=1';
    script.onload = () => window.OlvPaperDownloads?.pdfBlob ? resolve(window.OlvPaperDownloads) : reject(new Error('The PDF tool is unavailable.'));
    script.onerror = () => reject(new Error('The PDF tool is unavailable. Please try again.'));
    document.head.append(script);
  });
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => image.naturalWidth && image.naturalHeight ? resolve(image) : reject(new Error('A marking image is unavailable. Please try again.'));
      image.onerror = () => reject(new Error('A marking image is unavailable. Please try again.'));
      image.src = src;
    });
  }
  function wrap(ctx, text, x, y, width, step) {
    let line = '';
    for (const word of String(text).split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > width) { ctx.fillText(line, x, y); y += step; line = word; }
      else line = next;
    }
    if (line) { ctx.fillText(line, x, y); y += step; }
    return y;
  }
  function jpeg(canvas) {
    const binary = atob(canvas.toDataURL('image/jpeg', .9).split(',')[1]);
    const result = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) result[i] = binary.charCodeAt(i);
    return result;
  }
  function page(type, part, index, image, crop, segment, pageNumber) {
    const canvas = document.createElement('canvas'); canvas.width = WIDTH; canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#26364b'; ctx.font = 'bold 25px Arial, sans-serif';
    ctx.fillText('olevels.com  |  International GCSE Human Biology (4HB1)', 68, 70);
    ctx.strokeStyle = '#d2d9e2'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(68, 92); ctx.lineTo(1172, 92); ctx.stroke();
    ctx.font = 'bold 35px Arial, sans-serif';
    let y = wrap(ctx, `Type MS | ${type.title}`, 68, 147, 1100, 43);
    ctx.fillStyle = '#a41b26'; ctx.font = 'bold 29px Arial, sans-serif';
    y = wrap(ctx, `Answer ${index + 1} of ${type.parts.length} | ${part.marks} ${Number(part.marks) === 1 ? 'mark' : 'marks'}`, 68, y + 18, 1100, 37);
    ctx.fillStyle = '#26364b'; ctx.font = '23px Arial, sans-serif';
    y = wrap(ctx, `${part.source}${part.images.length > 1 ? ` | extract ${segment + 1} of ${part.images.length}` : ''}`, 68, y + 8, 1100, 31) + 24;
    const [left, top, width, height] = crop;
    const sx = left * image.naturalWidth, sy = top * image.naturalHeight;
    const sw = width * image.naturalWidth, sh = height * image.naturalHeight;
    const scale = Math.min(1104 / sw, (1580 - y) / sh);
    ctx.drawImage(image, sx, sy, sw, sh, 68, y, sw * scale, sh * scale);
    ctx.strokeStyle = '#d2d9e2'; ctx.beginPath(); ctx.moveTo(68, 1670); ctx.lineTo(1172, 1670); ctx.stroke();
    ctx.fillStyle = '#526273'; ctx.font = '19px Arial, sans-serif';
    ctx.fillText('Match this answer number to the type practice PDF. Original exam material © Pearson Education Ltd.', 68, 1704);
    ctx.textAlign = 'right'; ctx.fillText(String(pageNumber), 1172, 1734);
    return jpeg(canvas);
  }
  async function download(tid, status = () => {}) {
    const [data, maker] = await Promise.all([map(), pdfMaker()]);
    const type = data.types?.[tid];
    if (!type?.parts?.length) throw new Error('This type has no answer guide.');
    const pages = [];
    for (let index = 0; index < type.parts.length; index++) {
      const part = type.parts[index];
      for (let segment = 0; segment < part.images.length; segment++) {
        const image = await loadImage(part.images[segment]);
        pages.push(page(type, part, index, image, [0, 0, 1, 1], segment, pages.length + 1));
      }
      status(`Preparing answers ${index + 1} of ${type.parts.length}…`);
      if (index % 5 === 4) await new Promise(resolve => setTimeout(resolve, 0));
    }
    const blob = maker.pdfBlob(pages);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `${tid.toLowerCase()}-MS.pdf`;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    status(`MS PDF ready: ${type.parts.length} answers on ${pages.length} pages.`);
    return { questions: type.parts.length, pages: pages.length, bytes: blob.size };
  }
  document.addEventListener('click', async event => {
    const button = event.target.closest?.('[data-download-type-ms]');
    if (!button || button.disabled) return;
    const message = button.closest('.practice-download')?.querySelector('[data-type-ms-status]');
    const status = value => { if (message) message.textContent = value; };
    button.disabled = true;
    try { status('Preparing your MS PDF…'); await download(button.dataset.downloadTypeMs, status); }
    catch (error) { status(error.message || 'The download could not be prepared. Please try again.'); }
    finally { button.disabled = false; }
  });
  window.OlvTypeMSDownload = { download };
})();
