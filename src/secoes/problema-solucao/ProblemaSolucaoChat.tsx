/**
 * Seção S03 · problema-solucao — ProblemaSolucaoChat (client): chat de vidro sobre o vídeo "Dor nas costas"
 * Ficha: docs/sections/fichas/problema-solucao.md (17/11/2026) · Conteúdo: content.json → secoes.problema_solucao.itens[0].chat
 * (usuario, digitando, assistente, usuario_final, avatar); sem foto, a inicial do avatar vem de site.nome (resolvida no servidor)
 * Avatar (18/11/2026): foto de perfil do usuário (public/assets/perfill_conversa.png → perfil_conversa-site.webp, 128×128, recorte do rosto).
 * Elementos: problema-solucao__chat, __chat-mensagem, __chat-avatar, __chat-pilula, __chat-pontos, __chat-ponto, __chat-balao,
 * __chat-balao-usuario, __chat-palavra
 * Receitas e valores literais do prompt: src/app/chat.css (EXCEÇÃO documentada). O chat é IRMÃO do <video> (quem o monta é o
 * ProblemaSolucaoStage, dentro da camada de mídia). Linha do tempo em JS, ciclo de 8 s em loop, independente do vídeo (objeto T):
 * 0,5 s msg1 · 1,3 s msg2 ("Digitando" + 3 pontinhos pulando) · 2,7 s esconde msg2 e mostra msg3 com as palavras ligando uma a uma (~30 ms) · 4,2 s msg4 ·
 * 8,0 s reseta tudo e recomeça. Roda só quando \`rodando\` (passo ativo + na tela + sem pausa + sem reduced-motion); em reduced-motion
 * mostra o estado final, parado. Só setTimeout (nenhum setInterval, nenhum listener de scroll). Decorativo: aria-hidden.
 */
"use client";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import { normalizarSrc } from "@/lib/midia";

export type ConteudoChat = {
  readonly usuario: string;
  readonly digitando: string;
  readonly assistente: string;
  readonly usuario_final: string;
  /** Foto de perfil do avatar (opcional; sem ela, a inicial do site). */
  readonly avatar?: string;
};

/** Tempos da linha do tempo, em ms (troque só aqui). */
const T = { m1: 500, m2: 1300, m3: 2700, palavra: 30, m4: 4200, ciclo: 8000 } as const;

type Estado = { m1: boolean; m2: boolean; m3: boolean; palavras: number; m4: boolean };
const VAZIO: Estado = { m1: false, m2: false, m3: false, palavras: 0, m4: false };

type Props = { chat: ConteudoChat; inicial: string; rodando: boolean; reduzido: boolean };

export function ProblemaSolucaoChat({ chat, inicial, rodando, reduzido }: Props) {
  const palavras = useMemo(() => chat.assistente.split(" "), [chat.assistente]);
  const [e, setE] = useState<Estado>(VAZIO);

  useEffect(() => {
    // parado: zera no tique seguinte (a próxima rodada começa do vazio, sem mostrar o estado antigo)
    if (!rodando) {
      const id = window.setTimeout(() => setE(VAZIO), 0);
      return () => window.clearTimeout(id);
    }
    const ids: number[] = [];
    const agendar = (fn: () => void, ms: number) => {
      ids.push(window.setTimeout(fn, ms));
    };
    const rodar = () => {
      agendar(() => setE(VAZIO), 0);
      agendar(() => setE((s) => ({ ...s, m1: true })), T.m1);
      agendar(() => setE((s) => ({ ...s, m2: true })), T.m2);
      agendar(() => setE((s) => ({ ...s, m2: false, m3: true })), T.m3);
      palavras.forEach((_, k) => agendar(() => setE((s) => ({ ...s, palavras: k + 1 })), T.m3 + k * T.palavra));
      agendar(() => setE((s) => ({ ...s, m4: true })), T.m4);
      agendar(rodar, T.ciclo); // 8,0 s: reseta tudo e recomeça
    };
    rodar();
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [rodando, palavras]);

  const v: Estado = reduzido ? { m1: true, m2: false, m3: true, palavras: palavras.length, m4: true } : rodando ? e : VAZIO;
  const estado = (ligado: boolean) => (ligado ? "visivel" : "oculta");

  const avatar = (
    <span
      className="problema-solucao__chat-avatar relative flex h-6 w-6 flex-none items-center justify-center overflow-hidden rounded-full bg-primary text-small font-strong text-primary-contrast"
      data-anim="chat-avatar"
    >
      {chat.avatar ? <Image src={normalizarSrc(chat.avatar)} alt="" fill sizes="32px" className="object-cover" /> : inicial}
    </span>
  );

  return (
    <div className="problema-solucao__chat" data-anim="chat" aria-hidden="true">
      <div className="problema-solucao__chat-mensagem justify-end" data-anim="chat-mensagem" data-estado={estado(v.m1)}>
        <p className="problema-solucao__chat-balao-usuario rounded-md px-4 py-3 text-body text-foreground" data-anim="chat-usuario">
          {chat.usuario}
        </p>
      </div>
      <div className="problema-solucao__chat-mensagem items-end gap-2" data-anim="chat-mensagem" data-estado={estado(v.m2)}>
        {avatar}
        <p className="problema-solucao__chat-pilula flex items-center gap-2 rounded-full px-4 py-2 text-small text-on-inverse" data-anim="chat-vidro">
          <span className="problema-solucao__chat-pontos flex items-center gap-1" aria-hidden="true">
            <span className="problema-solucao__chat-ponto" data-anim="chat-ponto" />
            <span className="problema-solucao__chat-ponto" data-anim="chat-ponto" />
            <span className="problema-solucao__chat-ponto" data-anim="chat-ponto" />
          </span>
          {chat.digitando}
        </p>
      </div>
      <div className="problema-solucao__chat-mensagem items-end gap-2" data-anim="chat-mensagem" data-estado={estado(v.m3)}>
        {avatar}
        <p className="problema-solucao__chat-balao rounded-md px-4 py-3 text-body text-on-inverse" data-anim="chat-vidro">
          {palavras.map((palavra, k) => (
            <Fragment key={k}>
              <span className="problema-solucao__chat-palavra" data-anim="chat-palavra" data-estado={k < v.palavras ? "ativa" : "inativa"}>
                {palavra}
              </span>
              {k < palavras.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>
      </div>
      <div className="problema-solucao__chat-mensagem justify-end" data-anim="chat-mensagem" data-estado={estado(v.m4)}>
        <p className="problema-solucao__chat-balao-usuario rounded-md px-4 py-3 text-body text-foreground" data-anim="chat-usuario">
          {chat.usuario_final}
        </p>
      </div>
    </div>
  );
}
