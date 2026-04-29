import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("outputs");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "pitch-deck-voltapramim.pdf");

const W = 1280;
const H = 720;
const navy = [24, 44, 92];
const blue = [53, 82, 178];
const cyan = [38, 193, 215];
const yellow = [255, 199, 38];
const green = [18, 183, 106];
const red = [220, 55, 72];
const ink = [30, 41, 59];
const slate = [78, 88, 108];
const light = [246, 248, 252];
const white = [255, 255, 255];

function rgb([r, g, b]) {
  return `${(r / 255).toFixed(4)} ${(g / 255).toFixed(4)} ${(b / 255).toFixed(4)}`;
}

function esc(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

class Page {
  constructor() {
    this.ops = [];
  }

  fill(color) {
    this.ops.push(`${rgb(color)} rg`);
  }

  stroke(color) {
    this.ops.push(`${rgb(color)} RG`);
  }

  rect(x, y, w, h, color) {
    this.fill(color);
    this.ops.push(`${x} ${H - y - h} ${w} ${h} re f`);
  }

  line(x1, y1, x2, y2, color, width = 2) {
    this.stroke(color);
    this.ops.push(`${width} w ${x1} ${H - y1} m ${x2} ${H - y2} l S`);
  }

  circle(x, y, r, color) {
    const c = 0.5522847498;
    const cx = x;
    const cy = H - y;
    this.fill(color);
    this.ops.push(
      `${cx + r} ${cy} m`,
      `${cx + r} ${cy + c * r} ${cx + c * r} ${cy + r} ${cx} ${cy + r} c`,
      `${cx - c * r} ${cy + r} ${cx - r} ${cy + c * r} ${cx - r} ${cy} c`,
      `${cx - r} ${cy - c * r} ${cx - c * r} ${cy - r} ${cx} ${cy - r} c`,
      `${cx + c * r} ${cy - r} ${cx + r} ${cy - c * r} ${cx + r} ${cy} c f`,
    );
  }

  text(text, x, y, size = 28, color = ink, font = "F2", leading = 1.18) {
    this.fill(color);
    const lines = Array.isArray(text) ? text : String(text).split("\n");
    this.ops.push("BT", `/${font} ${size} Tf`, `${rgb(color)} rg`);
    lines.forEach((line, i) => {
      this.ops.push(`1 0 0 1 ${x} ${H - y - i * size * leading} Tm (${esc(line)}) Tj`);
    });
    this.ops.push("ET");
  }

  paragraph(text, x, y, size, color, maxChars, font = "F1", leading = 1.28) {
    const lines = wrap(text, maxChars);
    this.text(lines, x, y, size, color, font, leading);
    return lines.length * size * leading;
  }

  pill(text, x, y, w, h, fillColor, textColor = white) {
    this.rect(x, y, w, h, fillColor);
    this.text(text, x + 18, y + h / 2 + 8, 20, textColor, "F2");
  }

  card(x, y, w, h, title, body, accent = blue) {
    this.rect(x, y, w, h, white);
    this.rect(x, y, 8, h, accent);
    this.text(title, x + 28, y + 44, 26, navy, "F2");
    this.paragraph(body, x + 28, y + 88, 19, slate, Math.floor((w - 56) / 10.5));
  }

  header(section) {
    this.text("VoltaPraMim", 56, 54, 20, blue, "F2");
    this.text(section, 1050, 54, 16, slate, "F1");
    this.line(56, 78, 1224, 78, [222, 229, 240], 1);
  }
}

const pages = [];
const add = (fn) => {
  const p = new Page();
  fn(p);
  pages.push(p);
};

add((p) => {
  p.rect(0, 0, W, H, navy);
  p.circle(1060, 130, 160, blue);
  p.circle(1135, 515, 90, cyan);
  p.rect(0, 0, 20, H, yellow);
  p.pill("Pitch deck | MVP TRL 6", 80, 88, 260, 44, blue);
  p.text("VoltaPraMim", 80, 230, 72, white, "F2");
  p.paragraph("Achados e perdidos inteligente para universidades, empresas, eventos e condominios.", 84, 302, 30, [226, 234, 255], 48, "F1");
  p.rect(84, 500, 420, 86, [255, 255, 255]);
  p.text("Devolucoes mais rapidas.", 110, 536, 26, navy, "F2");
  p.text("Gestao organizada. Menos perda.", 110, 570, 22, slate, "F1");
});

add((p) => {
  p.rect(0, 0, W, H, light);
  p.header("1. Problema");
  p.text("O processo atual de achados e perdidos e manual, lento e pouco rastreavel.", 76, 142, 42, navy, "F2");
  p.card(76, 250, 330, 250, "Desorganizacao", "Itens sao divulgados em grupos de mensagem, planilhas ou atendimento presencial sem historico centralizado.", red);
  p.card(475, 250, 330, 250, "Baixa recuperacao", "O usuario nao sabe onde procurar, quem contatar ou se o item ja foi encontrado.", yellow);
  p.card(874, 250, 330, 250, "Custo operacional", "Secretarias e equipes gastam tempo respondendo casos repetidos e registrando itens manualmente.", blue);
});

add((p) => {
  p.rect(0, 0, W, H, white);
  p.header("2. Solucao");
  p.text("Uma plataforma unica para registrar, buscar e devolver itens.", 76, 140, 44, navy, "F2");
  p.paragraph("O VoltaPraMim centraliza os achados e perdidos em um app com login institucional, cadastro de itens, busca por filtros e acompanhamento de status.", 80, 205, 24, slate, 78);
  const steps = [
    ["1", "Usuario publica", "Item perdido ou encontrado com descricao, local e data."],
    ["2", "Sistema organiza", "Dados ficam salvos no banco e podem ser filtrados."],
    ["3", "Item retorna", "Responsavel acompanha e marca como devolvido."],
  ];
  steps.forEach(([n, t, b], i) => {
    const x = 100 + i * 390;
    p.circle(x + 40, 380, 34, i === 0 ? blue : i === 1 ? cyan : green);
    p.text(n, x + 29, 391, 28, white, "F2");
    p.text(t, x + 92, 370, 28, navy, "F2");
    p.paragraph(b, x + 92, 412, 19, slate, 30);
    if (i < 2) p.line(x + 300, 380, x + 370, 380, [190, 200, 220], 4);
  });
});

add((p) => {
  p.rect(0, 0, W, H, light);
  p.header("3. Produto");
  p.text("Produto ja possui base tecnica funcional.", 76, 135, 42, navy, "F2");
  const items = [
    ["App React Native / Expo", "Login, cadastro, home, explorar, publicar, detalhes e perfil."],
    ["API Fastify + TypeScript", "Rotas de autenticacao e itens com validacao e JWT."],
    ["PostgreSQL + Prisma", "Persistencia de usuarios, itens, categorias e status."],
    ["Integracao em andamento", "Login, cadastro e publicacao ja conectados a API real."],
  ];
  items.forEach(([t, b], i) => {
    const x = i % 2 === 0 ? 82 : 675;
    const y = i < 2 ? 240 : 440;
    p.card(x, y, 520, 140, t, b, i % 2 === 0 ? blue : cyan);
  });
});

add((p) => {
  p.rect(0, 0, W, H, white);
  p.header("4. Mercado");
  p.text("Aplicavel a ambientes com grande circulacao de pessoas.", 76, 138, 40, navy, "F2");
  p.rect(80, 230, 1120, 330, light);
  const labels = ["Universidades", "Escolas", "Empresas", "Eventos", "Condominios"];
  labels.forEach((label, i) => {
    const x = 130 + i * 210;
    const h = [235, 185, 150, 125, 105][i];
    p.rect(x, 520 - h, 120, h, [53, 82, 178]);
    p.text(label, x - 12, 560, 20, navy, "F2");
  });
  p.paragraph("Primeiro nicho recomendado: universidades e escolas, pois possuem fluxo recorrente, base identificada por RA e necessidade clara de organizacao.", 92, 620, 22, slate, 96);
});

add((p) => {
  p.rect(0, 0, W, H, light);
  p.header("5. Modelo de negocio");
  p.text("Receita recorrente por licenciamento da plataforma.", 76, 135, 42, navy, "F2");
  p.card(80, 235, 330, 260, "SaaS B2B", "Mensalidade por instituicao, com planos por numero de usuarios ou unidades atendidas.", blue);
  p.card(475, 235, 330, 260, "Implantacao", "Setup inicial, personalizacao de marca, treinamento e suporte para equipe administrativa.", cyan);
  p.card(870, 235, 330, 260, "Upsell", "Dashboard administrativo, relatorios, notificacoes, QR Code e integracao institucional.", green);
  p.pill("Potencial: baixo custo operacional + receita recorrente", 340, 585, 600, 48, navy);
});

add((p) => {
  p.rect(0, 0, W, H, white);
  p.header("6. Diferenciais");
  p.text("Mais seguro e escalavel que grupos de mensagem.", 76, 132, 42, navy, "F2");
  p.card(82, 225, 520, 150, "Autenticacao institucional", "Acesso com RA/e-mail e token JWT para reduzir fraude e organizar responsabilidades.", blue);
  p.card(680, 225, 520, 150, "Rastreabilidade", "Cada item tem registro, status, usuario responsavel e historico de publicacao.", green);
  p.card(82, 425, 520, 150, "Experiencia simples", "Busca por categorias, status e descricao, com interface mobile para uso rapido.", cyan);
  p.card(680, 425, 520, 150, "Produto replicavel", "Pode ser vendido para diferentes instituicoes sem reconstruir o sistema do zero.", yellow);
});

add((p) => {
  p.rect(0, 0, W, H, light);
  p.header("7. Estagio e proximos passos");
  p.text("MVP em desenvolvimento, pronto para validacao piloto.", 76, 132, 40, navy, "F2");
  p.rect(82, 220, 1110, 90, white);
  p.text("TRL 6", 112, 274, 42, blue, "F2");
  p.text("Prototipo em teste, com situacao proxima ao desempenho esperado.", 250, 268, 24, slate, "F1");
  const road = [
    ["Agora", "Finalizar feed real, detalhes e filtros conectados ao banco."],
    ["Piloto", "Testar com uma turma, secretaria ou setor de achados e perdidos."],
    ["Venda", "Empacotar dashboard, suporte e plano mensal para instituicoes."],
  ];
  road.forEach(([t, b], i) => p.card(82 + i * 370, 370, 320, 180, t, b, [blue, cyan, green][i]));
});

add((p) => {
  p.rect(0, 0, W, H, navy);
  p.circle(1080, 145, 140, cyan);
  p.circle(1130, 520, 80, yellow);
  p.text("Pedido", 76, 130, 54, white, "F2");
  p.paragraph("Buscamos apoio financeiro, mentorias e acesso a uma instituicao parceira para realizar um piloto real do VoltaPraMim.", 80, 210, 30, [232, 238, 255], 62);
  p.rect(80, 425, 520, 120, white);
  p.text("Uso do recurso", 110, 470, 28, navy, "F2");
  p.text("finalizar integracoes, testes, hospedagem e validacao comercial", 110, 508, 20, slate, "F1");
  p.text("VoltaPraMim", 80, 635, 28, yellow, "F2");
  p.text("Achados e perdidos com gestao inteligente.", 260, 635, 22, [232, 238, 255], "F1");
});

function makePdf() {
  const objects = [];
  const addObj = (body) => {
    objects.push(body);
    return objects.length;
  };

  const font1 = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const font2 = addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageRefs = [];
  const contentRefs = [];
  for (const page of pages) {
    const stream = page.ops.join("\n");
    const content = `<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`;
    contentRefs.push(addObj(content));
    pageRefs.push(null);
  }

  const pagesObjIndex = objects.length + pages.length + 1;
  for (let i = 0; i < pages.length; i++) {
    const pageObj = `<< /Type /Page /Parent ${pagesObjIndex} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`;
    pageRefs[i] = addObj(pageObj);
  }

  const pagesObj = addObj(`<< /Type /Pages /Kids [${pageRefs.map((r) => `${r} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  const catalogObj = addObj(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf, "binary"));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObj} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  fs.writeFileSync(outFile, Buffer.from(pdf, "binary"));
}

makePdf();
console.log(outFile);
