/**
 * Compartilhado · UiIcone (ícones Lucide, registro fechado)
 * Ficha: docs/sections/componentes.md §1 · Conteúdo: o nome do ícone vem do content.json (`icone`)
 * Elementos: ui-icone (a classe-nome da seção entra primeiro via `className`)
 * Nome fora do REGISTRO lança erro (quebra o build; nunca cai em ícone padrão).
 * Decorativo = aria-hidden; com significado = role="img" + aria-label (`rotulo`).
 */
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Bone,
  Check,
  ChevronDown,
  CircleDot,
  Droplets,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Pause,
  Play,
  Plus,
  Ruler,
  Sparkles,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import { juntar } from "@/lib/classes";
import type { DadosAttr } from "./tipos";

/** Registro fechado (docs/sections/componentes.md §1): serviços + interface. */
export const REGISTRO_ICONES = {
  activity: Activity,
  droplets: Droplets,
  moon: Moon,
  ruler: Ruler,
  "circle-dot": CircleDot,
  sparkles: Sparkles,
  bone: Bone,
  stethoscope: Stethoscope,
  menu: Menu,
  x: X,
  check: Check,
  "arrow-right": ArrowRight,
  "arrow-down": ArrowDown,
  "chevron-down": ChevronDown,
  plus: Plus,
  pause: Pause,
  play: Play,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
} as const satisfies Record<string, LucideIcon>;

export type NomeIcone = keyof typeof REGISTRO_ICONES;
export type TamanhoIcone = 16 | 20 | 24 | 32 | 48; // 48: ícone central dos ladrilhos de mídia pendente

type Props = DadosAttr & {
  nome: string;
  tamanho?: TamanhoIcone;
  /** Contêiner `rounded-icon` com fundo suave (cards de serviço, passos). */
  contorno?: boolean;
  /** Se houver, o ícone tem significado (`role="img"`); sem ele é decorativo (`aria-hidden`). */
  rotulo?: string;
  className?: string;
};

export function UiIcone({ nome, tamanho = 24, contorno = false, rotulo, className, ...dados }: Props) {
  if (!Object.hasOwn(REGISTRO_ICONES, nome)) {
    throw new Error(
      `UiIcone: ícone "${nome}" fora do registro (${Object.keys(REGISTRO_ICONES).join(", ")}). Adicione-o ao registro antes de usar.`,
    );
  }
  const Icone = REGISTRO_ICONES[nome as NomeIcone];
  const a11y = rotulo ? ({ role: "img", "aria-label": rotulo } as const) : ({ "aria-hidden": true } as const);

  if (contorno) {
    return (
      <span
        className={juntar(className, "ui-icone inline-flex shrink-0 items-center justify-center rounded-icon bg-secondary-soft p-3 text-foreground")}
        {...a11y}
        {...dados}
      >
        <Icone size={tamanho} aria-hidden="true" focusable="false" />
      </span>
    );
  }
  return <Icone className={juntar(className, "ui-icone shrink-0")} size={tamanho} focusable="false" {...a11y} {...dados} />;
}
