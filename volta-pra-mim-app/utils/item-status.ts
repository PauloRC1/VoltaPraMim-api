import { MockItemStatus } from "@/data/mock-items";

export type ItemStatus = MockItemStatus | "PERDIDO" | "ENCONTRADO" | "DEVOLVIDO";

export function getItemStatusLabel(status: ItemStatus) {
  if (status === "Achado" || status === "ENCONTRADO") return "Encontrado";
  if (status === "Devolvido" || status === "DEVOLVIDO") return "Resolvido";
  return "Procurando";
}

export function getItemStatusStyle(status: ItemStatus) {
  if (status === "Achado" || status === "ENCONTRADO") {
    return {
      label: getItemStatusLabel(status),
      backgroundColor: "#ECFDF3",
      color: "#079455",
      icon: "checkmark-circle" as const,
    };
  }

  if (status === "Devolvido" || status === "DEVOLVIDO") {
    return {
      label: getItemStatusLabel(status),
      backgroundColor: "#F4F0FF",
      color: "#6840C6",
      icon: "return-up-back" as const,
    };
  }

  return {
    label: getItemStatusLabel(status),
    backgroundColor: "#EEF4FF",
    color: "#3552B2",
    icon: "search" as const,
  };
}
