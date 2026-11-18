/**
 * Helper · junta classes sem criar "undefined"
 * Conteúdo: nenhum. Uso: className={juntar(className, "ui-titulo text-h2")}
 * A classe-nome da seção (prop `className`) vai SEMPRE primeiro; as classes do componente compartilhado
 * entram como string literal (para o grep achar). Nunca montar classe-nome por concatenação.
 */
export function juntar(...partes: ReadonlyArray<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(" ");
}
