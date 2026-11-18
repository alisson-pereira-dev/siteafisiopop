/**
 * Testes simples de scripts/check-pendencias.mjs (T0.6). Rodar: npm test
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { coletarPendencias, regraBloqueante } from "./check-pendencias.mjs";

const SCRIPT = fileURLToPath(new URL("./check-pendencias.mjs", import.meta.url));

function rodar(env = {}, args = []) {
  const ambiente = { ...process.env, ...env };
  if (!("LAUNCH" in env)) delete ambiente.LAUNCH;
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env: ambiente });
}

describe("coletarPendencias", () => {
  it("acha validar e provisorio com o caminho completo", () => {
    const r = coletarPendencias({
      a: { validar: true, nota: "n1" },
      b: [{ ok: 1 }, { provisorio: true, validar: true }],
      c: { validar: false },
    });
    expect(r.map((p) => p.caminho)).toEqual(["a", "b[1]"]);
    expect(r[0]).toMatchObject({ flags: ["validar"], motivo: "n1" });
    expect(r[1].flags).toEqual(["validar", "provisorio"]);
  });
});

describe("regraBloqueante", () => {
  const p = (caminho, flags = ["validar"]) => ({ caminho, flags, motivo: "" });
  it("bloqueia WhatsApp, endereços, registro profissional e depoimentos provisórios", () => {
    expect(regraBloqueante(p("site.contato.whatsapp"))).toBeTruthy();
    expect(regraBloqueante(p("secoes.unidades.itens[2]"))).toBeTruthy();
    expect(regraBloqueante(p("secoes.footer.registro_profissional"))).toBeTruthy();
    expect(regraBloqueante(p("secoes.depoimentos.itens[0]", ["provisorio"]))).toBeTruthy();
  });
  it("bloqueia o rascunho de privacidade e termos (T5.1), com qualquer marca", () => {
    for (const caminho of ["paginas.privacidade", "paginas.termos", "paginas.termos.blocos[0]"]) {
      expect(regraBloqueante(p(caminho))).toContain("revisão jurídica");
      expect(regraBloqueante(p(caminho, ["provisorio"]))).toContain("revisão jurídica");
    }
    expect(regraBloqueante(p("paginas.outra"))).toBeNull();
  });
  it("não bloqueia o resto", () => {
    expect(regraBloqueante(p("site.contato.email"))).toBeNull();
    expect(regraBloqueante(p("secoes.hero.selo"))).toBeNull();
    expect(regraBloqueante(p("secoes.depoimentos.itens[0]", ["validar"]))).toBeNull();
  });
});

describe("execução", () => {
  it("desenvolvimento: lista e sai com 0", () => {
    const r = rodar();
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("BLOQUEIAM O LANÇAMENTO");
  });
  it("LAUNCH=1: falha enquanto houver pendência bloqueante", () => {
    const r = rodar({ LAUNCH: "1" });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("bloqueado");
  });
  it("LAUNCH=1: lista privacidade e termos como bloqueio enquanto o rascunho estiver marcado", () => {
    const r = rodar({ LAUNCH: "1" });
    expect(r.stdout + r.stderr).toMatch(/paginas\.privacidade[^\n]*revisão jurídica/);
    expect(r.stdout + r.stderr).toMatch(/paginas\.termos[^\n]*revisão jurídica/);
  });
  it("--launch equivale a LAUNCH=1", () => {
    expect(rodar({}, ["--launch"]).status).toBe(1);
  });
});
