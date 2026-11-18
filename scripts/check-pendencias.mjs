#!/usr/bin/env node
/**
 * Script · check-pendencias
 * Fonte: content/content.json (campos `validar: true` e `provisorio: true`)
 *
 * Lista os caminhos pendentes. Em desenvolvimento só AVISA (exit 0).
 * No build de lançamento (LAUNCH=1, ou --launch) FALHA (exit 1) enquanto houver
 * pendência BLOQUEANTE: WhatsApp, endereços das unidades, registro profissional
 * e depoimentos provisórios (regras em BLOQUEANTES abaixo).
 *
 * Roda antes do `next build` (ver package.json). Para tirar uma pendência: confirmar o
 * dado com a clínica e remover `validar`/`provisorio` do item no content.json.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** @typedef {{ caminho: string, flags: string[], motivo: string }} Pendencia */

/**
 * Pendências que impedem o lançamento.
 * `flag` (opcional): só bloqueia se o item tiver essa marca.
 */
export const BLOQUEANTES = [
  { rotulo: "WhatsApp", padrao: /^site\.contato\.whatsapp$/ },
  { rotulo: "Endereço/horários da unidade", padrao: /^secoes\.unidades\.itens\[\d+\]$/ },
  { rotulo: "Registro profissional", padrao: /^secoes\.footer\.registro_profissional$/ },
  { rotulo: "Privacidade/termos: rascunho sem revisão jurídica (LGPD)", padrao: /^paginas\.(privacidade|termos)(\.|$)/ },
  { rotulo: "Depoimento provisório", padrao: /^secoes\.depoimentos(\.|$)/, flag: "provisorio" },
];

const FLAGS = ["validar", "provisorio"];

/**
 * Percorre o conteúdo e coleta todo objeto marcado com `validar: true` ou `provisorio: true`.
 * @param {unknown} no
 * @param {string} caminho
 * @param {Pendencia[]} saida
 * @returns {Pendencia[]}
 */
export function coletarPendencias(no, caminho = "", saida = []) {
  if (Array.isArray(no)) {
    no.forEach((filho, i) => coletarPendencias(filho, `${caminho}[${i}]`, saida));
  } else if (no && typeof no === "object") {
    const flags = FLAGS.filter((f) => no[f] === true);
    if (flags.length > 0 && caminho) {
      saida.push({ caminho, flags, motivo: no.nota ?? no.nota_provisorio ?? "" });
    }
    for (const [chave, filho] of Object.entries(no)) {
      coletarPendencias(filho, caminho ? `${caminho}.${chave}` : chave, saida);
    }
  }
  return saida;
}

/**
 * @param {Pendencia} pendencia
 * @returns {string | null} rótulo da regra bloqueante, ou null se não bloqueia
 */
export function regraBloqueante(pendencia) {
  const regra = BLOQUEANTES.find(
    (r) => r.padrao.test(pendencia.caminho) && (!r.flag || pendencia.flags.includes(r.flag)),
  );
  return regra ? regra.rotulo : null;
}

function linha(p, rotulo) {
  const marcas = p.flags.join("+");
  const alvo = rotulo ? ` · ${rotulo}` : "";
  const motivo = p.motivo ? `\n      ${p.motivo}` : "";
  return `  - ${p.caminho}  [${marcas}]${alvo}${motivo}`;
}

function principal() {
  const caminhoJson = fileURLToPath(new URL("../content/content.json", import.meta.url));
  const conteudo = JSON.parse(readFileSync(caminhoJson, "utf8"));

  const modoLancamento = process.env.LAUNCH === "1" || process.argv.includes("--launch");
  const todas = coletarPendencias(conteudo);
  const bloqueantes = [];
  const demais = [];
  for (const p of todas) {
    const rotulo = regraBloqueante(p);
    (rotulo ? bloqueantes : demais).push({ ...p, rotulo });
  }

  console.log(
    `check-pendencias · ${todas.length} item(ns) com validar/provisorio ` +
      `(${bloqueantes.length} bloqueante(s) para o lançamento) · modo ${modoLancamento ? "LANÇAMENTO" : "desenvolvimento"}`,
  );
  if (bloqueantes.length > 0) {
    console.log("\nBLOQUEIAM O LANÇAMENTO:");
    for (const p of bloqueantes) console.log(linha(p, p.rotulo));
  }
  if (demais.length > 0) {
    console.log("\nA validar com a clínica (não bloqueiam):");
    for (const p of demais) console.log(linha(p));
  }

  if (modoLancamento && bloqueantes.length > 0) {
    console.error(
      `\nERRO: build de lançamento bloqueado por ${bloqueantes.length} pendência(s). ` +
        "Resolva no content/content.json e remova a marca validar/provisorio.",
    );
    process.exit(1);
  }
  if (bloqueantes.length > 0) {
    console.log("\n(aviso) Em desenvolvimento isto não falha. Com LAUNCH=1 falharia.");
  }
}

// Só executa quando chamado direto (permite importar nos testes).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  principal();
}
