export type MockItemStatus = "Perdido" | "Achado" | "Devolvido";

export type MockItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: MockItemStatus;
  dateLabel: string;
  reporterName: string;
  contactHint: string;
  color: string;
};

export const mockItems: MockItem[] = [
  {
    id: "mochila-preta-b09",
    title: "Mochila preta com caderno",
    description:
      "Encontrada perto do bloco B com um caderno azul e um estojo pequeno no bolso frontal.",
    location: "Bloco B - corredor do 2 andar",
    category: "Mochila",
    status: "Achado",
    dateLabel: "Hoje, 10:20",
    reporterName: "Marina Costa",
    contactHint: "Combine a retirada na secretaria do bloco.",
    color: "#3552B2",
  },
  {
    id: "carteira-biblioteca",
    title: "Carteira marrom com documentos",
    description:
      "Carteira vista na biblioteca central proxima aos computadores de pesquisa.",
    location: "Biblioteca central",
    category: "Documentos",
    status: "Perdido",
    dateLabel: "Ontem, 18:45",
    reporterName: "Lucas Ferreira",
    contactHint: "Verifique com a recepcao antes de ir ate o local.",
    color: "#C96A1B",
  },
  {
    id: "fone-azul-lab",
    title: "Fone bluetooth azul",
    description:
      "Fone sem estojo encontrado no laboratorio de informatica, fileira do fundo.",
    location: "Laboratorio 4",
    category: "Eletronicos",
    status: "Achado",
    dateLabel: "Ontem, 14:10",
    reporterName: "Beatriz Araujo",
    contactHint: "Leve um documento para confirmar a retirada.",
    color: "#14806A",
  },
  {
    id: "cracha-estacionamento",
    title: "Cracha institucional",
    description:
      "Cracha com cordao azul encontrado na entrada lateral proxima ao estacionamento.",
    location: "Portaria lateral",
    category: "Acessorios",
    status: "Devolvido",
    dateLabel: "02 abr",
    reporterName: "Equipe de apoio",
    contactHint: "Item ja devolvido ao proprietario.",
    color: "#7A56D8",
  },
  {
    id: "garrafa-termica-auditorio",
    title: "Garrafa termica prata",
    description:
      "Garrafa com adesivo da faculdade deixada nas cadeiras do auditorio principal.",
    location: "Auditorio principal",
    category: "Acessorios",
    status: "Perdido",
    dateLabel: "01 abr",
    reporterName: "Renato Silva",
    contactHint: "Caso reconheca o item, entre com sua conta para solicitar contato.",
    color: "#AA3D69",
  },
];
