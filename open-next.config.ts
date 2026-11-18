/**
 * Configuração do OpenNext para o Cloudflare Workers (adaptador oficial).
 * Site 100% estático (nenhuma rota usa ISR nem revalidação), então o cache incremental padrão basta.
 * Doc: https://opennext.js.org/cloudflare
 */
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
