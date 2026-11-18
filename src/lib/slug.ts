/**
 * Helper · slug para `data-item`
 * Conteúdo: nomes vindos do content.json (serviços, soluções, unidades)
 * "Drenagem Linfática" → "drenagem-linfatica" (kebab-case, sem acento), como na convenção (`data-item`).
 */
export function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
