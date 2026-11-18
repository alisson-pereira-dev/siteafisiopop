/**
 * Seção S12 · preco-pop — PrecoPopNumeros (caixa "a conta do preço", embaixo do botão, no lugar da caixa de números da referência do usuário)
 * Ficha: docs/sections/fichas/preco-pop.md (revisão de 17/11/2026) · Conteúdo: content.json → secoes.preco_pop.conta (itens[] {valor, rotulo}, nota;
 * `validar` no conteúdo). NÃO repete os indicadores do hero: mostra o que o preço único significa na prática (1 serviço · R$ 49,99 por mês ·
 * R$ 1,67 por dia), só aritmética do preço (R$ 49,99 ÷ 30), sem comparação com concorrente nem promessa de resultado.
 * Elementos: preco-pop__numeros, __numeros-lista, __numero, __numero-valor, __numero-rotulo
 * Três colunas iguais (valor grande em cima, legenda curta de até 2 linhas embaixo, como a referência do usuário); no mobile, um item embaixo do outro. (Sem nota de rodapé: removida a pedido do usuário, 18/11/2026.) Server, sem animação.
 */
import { conteudo } from "@/lib/conteudo";

export function PrecoPopNumeros() {
  const conta = conteudo.secoes.preco_pop.conta;

  return (
    <div className="preco-pop__numeros flex flex-col gap-4 rounded-md bg-surface p-5 md:p-6">
      <ul className="preco-pop__numeros-lista grid gap-4 sm:grid-cols-3 sm:gap-x-5">
        {conta.itens.map((n) => (
          <li key={n.valor} className="preco-pop__numero flex min-w-0 flex-col gap-1">
            <p className="preco-pop__numero-valor whitespace-nowrap font-title text-h3 font-heading text-foreground sm:text-body-lg">{n.valor}</p>
            <p className="preco-pop__numero-rotulo text-small text-muted">{n.rotulo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
