/* Builds complete, image-based A4 PDFs on the teacher's device. */
(() => {
  const WIDTH = 1240;
  const HEIGHT = 1754;
  const PDF_WIDTH = 595.28;
  const PDF_HEIGHT = 841.89;
  const encoder = new TextEncoder();
  const assetId = src => new URL(src, location.href).pathname.split('/').pop().replace(/\.png$/, '');

  // Keep the question's opening context, but stop after the last image holding the assigned part.
  function questionSources(part, boxes = {}) {
    const sources = part.images?.length ? part.images : [part.image];
    let last = -1;
    sources.forEach((src, index) => { if (boxes[assetId(src)]) last = index; });
    return last === -1 ? sources : sources.slice(0, last + 1);
  }

  function drawBoundary(ctx, x, y, width, height, label, minTop) {
    ctx.strokeStyle = '#d01829';
    ctx.lineWidth = 6;
    ctx.strokeRect(x, y, width, height);
    ctx.font = 'bold 22px Arial, sans-serif';
    const tabWidth = ctx.measureText(label).width + 28;
    // The tab sits on the box's top-left corner, or just inside it when the box starts at the image edge.
    const tabTop = y - 34 >= minTop ? y - 34 : y;
    ctx.fillStyle = '#d01829';
    ctx.fillRect(x - 3, tabTop, tabWidth, 34);
    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + 11, tabTop + 25);
  }

  async function loadImage(src) {
    const image = new Image();
    image.src = src;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('A source image could not be loaded. Please try again.');
    return image;
  }

  function makePage(paper, part, index, segment, count, image, box, kind, pageNumber) {
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#26364b';
    ctx.font = 'bold 25px Arial, sans-serif';
    ctx.fillText('olevels.com  |  International GCSE Human Biology (4HB1)', 68, 70);
    ctx.strokeStyle = '#d2d9e2';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(68, 91); ctx.lineTo(1172, 91); ctx.stroke();
    ctx.font = 'bold 35px Arial, sans-serif';
    const title = kind === 'scheme' ? 'Teacher marking scheme' : paper.title || 'Human Biology question paper';
    ctx.fillText(title.slice(0, 55), 68, 145);
    ctx.font = '25px Arial, sans-serif';
    const total = paper.parts.reduce((sum, item) => sum + Number(item.marks || 0), 0);
    ctx.fillText(`${total} marks${paper.minutes ? `  |  ${paper.minutes} minutes` : ''}`, 68, 185);
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillText(`Question ${index + 1}  |  ${part.marks} ${Number(part.marks) === 1 ? 'mark' : 'marks'}`, 68, 248);
    ctx.font = '21px Arial, sans-serif';
    ctx.fillText(String(part.source).slice(0, 82), 68, 284);
    ctx.fillStyle = kind === 'scheme' ? '#a41b26' : '#526273';
    ctx.font = '21px Arial, sans-serif';
    ctx.fillText(kind === 'scheme'
      ? `Official marking extract ${segment + 1} of ${count}. Use the row for part ${part.part}.`
      : box ? `Original question image ${segment + 1} of ${count}. Answer only the part inside the red box.`
        : `Original question image ${segment + 1} of ${count}. Read for context; your part is marked in red.`, 68, 321);
    const imageTop = 350;
    const imageMaxHeight = kind === 'scheme' ? 1260 : 1180;
    const scale = Math.min(1104 / image.naturalWidth, imageMaxHeight / image.naturalHeight);
    const imageWidth = image.naturalWidth * scale;
    const imageHeight = image.naturalHeight * scale;
    const left = (WIDTH - imageWidth) / 2;
    ctx.drawImage(image, left, imageTop, imageWidth, imageHeight);
    if (box && kind === 'question')
      drawBoundary(ctx, left + box[0] * imageWidth, imageTop + box[1] * imageHeight,
        (box[2] - box[0]) * imageWidth, (box[3] - box[1]) * imageHeight, `Question ${index + 1}: answer this part`, imageTop);
    if (kind === 'question' && segment === count - 1) {
      const top = Math.max(360, imageTop + imageHeight + 35);
      if (top < 1550) {
        ctx.fillStyle = '#26364b';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('Working and answer', 68, top);
        ctx.strokeStyle = '#b9c2cc';
        ctx.lineWidth = 1;
        for (let y = top + 36; y < 1630; y += 39) {
          ctx.beginPath(); ctx.moveTo(68, y); ctx.lineTo(1172, y); ctx.stroke();
        }
      }
    }
    ctx.fillStyle = '#526273';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Original exam material © Pearson Education Ltd.  |  olevels.com', 68, 1707);
    ctx.textAlign = 'right';
    ctx.fillText(String(pageNumber), 1172, 1707);
    return jpegBytes(canvas);
  }

  function jpegBytes(canvas) {
    const encoded = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function pdfBlob(pages) {
    const chunks = [];
    const offsets = [0];
    let position = 0;
    const append = value => { const bytes = typeof value === 'string' ? encoder.encode(value) : value; chunks.push(bytes); position += bytes.length; };
    const object = (number, pieces) => {
      offsets[number] = position;
      append(`${number} 0 obj\n`);
      for (const piece of pieces) append(piece);
      append('\nendobj\n');
    };
    append('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    object(1, ['<< /Type /Catalog /Pages 2 0 R >>']);
    const pageRefs = pages.map((_, index) => `${3 + index * 3} 0 R`).join(' ');
    object(2, [`<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>`]);
    pages.forEach((jpeg, index) => {
      const pageId = 3 + index * 3;
      const imageId = pageId + 1;
      const streamId = pageId + 2;
      object(pageId, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_WIDTH} ${PDF_HEIGHT}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${streamId} 0 R >>`]);
      object(imageId, [`<< /Type /XObject /Subtype /Image /Width ${WIDTH} /Height ${HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`, jpeg, '\nendstream']);
      const commands = `q ${PDF_WIDTH} 0 0 ${PDF_HEIGHT} 0 0 cm /Im0 Do Q\n`;
      object(streamId, [`<< /Length ${encoder.encode(commands).length} >>\nstream\n${commands}endstream`]);
    });
    const xref = position;
    append(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
    for (let number = 1; number < offsets.length; number++) append(`${String(offsets[number]).padStart(10, '0')} 00000 n \n`);
    append(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(chunks, { type: 'application/pdf' });
  }

  async function download(paper, kind, manifest, onProgress = () => {}) {
    if (!paper?.parts?.length || !['question', 'scheme'].includes(kind)) throw new Error('Build a paper first.');
    const pages = [];
    for (let index = 0; index < paper.parts.length; index++) {
      const part = paper.parts[index];
      const entry = manifest.parts?.[part.id];
      if (!entry) throw new Error(`The paper source for question ${index + 1} is unavailable.`);
      const sources = kind === 'scheme'
        ? entry.schemes.map(id => `/igcsehumanbiology/mark-schemes/canonical/${id}.png`)
        : questionSources(part, entry.boxes);
      for (let segment = 0; segment < sources.length; segment++) {
        const image = await loadImage(sources[segment]);
        const box = kind === 'question' ? entry.boxes[assetId(sources[segment])] : null;
        // The original exam pages already carry their answer lines, so no blank page is added.
        pages.push(makePage(paper, part, index, segment, sources.length, image, box, kind, pages.length + 1));
      }
      onProgress(`Preparing ${kind === 'scheme' ? 'marking scheme' : 'question paper'}: ${index + 1} of ${paper.parts.length} questions…`);
    }
    const blob = pdfBlob(pages);
    const safeTitle = String(paper.title || 'igcsehumanbiology-paper').normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'igcsehumanbiology-paper';
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeTitle}-${kind === 'scheme' ? 'marking-scheme' : 'question-paper'}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return { pages: pages.length, bytes: blob.size };
  }
  window.OlvPaperDownloads = { download, pdfBlob, questionSources };
})();
