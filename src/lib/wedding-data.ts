import type { GalleryPhoto, VenueInfo } from "@/types/wedding";

/**
 * Constantes oficiais do convite demonstrativo — Daniel & Sofia
 * Marca: Charle Convites
 */
export const WEDDING_DATA = {
  brand: {
    name: "Charle Convites",
    tagline: "Experiências Digitais de Casamento & Eventos Exclusivos",
    defaultUrl: "/marca",
  },
  couple: {
    groomFull: "Daniel António",
    brideFull: "Sofia Martins",
    groomShort: "Daniel",
    brideShort: "Sofia",
    displayNames: "Daniel & Sofia",
    displayNamesUpper: "DANIEL & SOFIA",
    monogram: "D & S",
  },
  event: {
    dateDisplay: "19 de Dezembro de 2026",
    dateDisplayUpper: "19 DE DEZEMBRO DE 2026",
    dateShort: "19 · 12 · 2026",
    // Horário local de Moçambique: Africa/Maputo (CAT = UTC+02:00, sem horário de verão)
    isoTargetMaputo: "2026-12-19T14:30:00+02:00",
    timezone: "Africa/Maputo",
    ceremonyTime: "14h30",
    receptionTime: "17h00",
    cityCountry: "Beira, Moçambique",
  },
  copy: {
    envelopePrompt: "Tens um convite especial",
    envelopeCta: "Abrir convite",
    heroAnnouncement: "Vamos casar!",
    mainMessage:
      "Dois corações, uma história e uma vida inteira para escrever. Com muita alegria, convidamos-te a celebrar o início do nosso para sempre.",
    highlightQuote: "Uma história escrita pelo destino, celebrada pelo amor.",
    storyTitle: "A nossa história",
    storyBody:
      "Há encontros que parecem escritos pelo destino. Entre sorrisos, conversas e momentos inesquecíveis, descobrimos que o nosso lugar favorito é um ao lado do outro. Agora, queremos celebrar esta história contigo.",
    countdownArrivedTitle: "Chegou o nosso grande dia!",
    countdownArrivedBody:
      "Hoje celebramos o amor, a união e o início do nosso para sempre em Beira, Moçambique.",
    eventDetailsTitle: "O grande dia",
    directionsTitle: "Como chegar",
    demonstrativeLocationsNote:
      "Nota demonstrativa: os espaços indicados abaixo são fictícios/ilustrativos para apresentação oficial da Charle Convites. Os atalhos utilizam pesquisas nominais no Google Maps.",
    galleryTitle: "Os nossos momentos",
    rsvpTitle: "Confirmação de presença",
    rsvpSubtitle:
      "A tua presença tornará este dia ainda mais memorável. Por favor, confirma até ao dia 25 de Novembro de 2026.",
    rsvpSuccessTitle: "Presença registada com carinho",
    rsvpSuccessMessage:
      "Obrigado por fazeres parte deste momento tão especial. A tua resposta foi recebida!",
    footerLove: "Com amor, Daniel & Sofia.",
    footerPleasure: "Será um prazer celebrar contigo.",
    footerCreditPrefix: "Convite digital criado por",
  },
  heroPhoto: {
    src: "/images/couple/01-horizonte-dourado.jpg",
    alt: "Daniel e Sofia de mãos dadas ao pôr do sol dourado",
    width: 1333,
    height: 2000,
  },
  storyPhoto: {
    src: "/images/couple/03-maos-e-promessa.jpg",
    alt: "Detalhe editorial das mãos entrelaçadas dos noivos",
    width: 2000,
    height: 1333,
  },
} as const;

/**
 * Construção segura de URLs de pesquisa Google Maps a partir de nome e cidade,
 * sem inventar coordenadas geográficas reais.
 */
function buildMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildMapsEmbedSearchUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=14&output=embed&iwloc=near`;
}

const ceremonySearch = "Catedral da Beira, Beira, Moçambique";
const receptionSearch = "Jardim das Acácias, Beira, Moçambique";

export const VENUES: VenueInfo[] = [
  {
    id: "ceremony",
    label: "Cerimónia Religiosa",
    title: "Catedral da Beira",
    subtitle: "Local demonstrativo · Cerimónia",
    date: "19 de Dezembro de 2026",
    time: "14h30",
    city: "Beira, Moçambique",
    description:
      "A bênção solene da nossa união terá lugar às 14h30. Recomendamos a chegada com 20 minutos de antecedência para acolhimento tranquilo dos convidados.",
    searchQuery: ceremonySearch,
    mapsSearchUrl: buildMapsSearchUrl(ceremonySearch),
    mapsEmbedUrl: buildMapsEmbedSearchUrl(ceremonySearch),
    isDemonstrative: true,
  },
  {
    id: "reception",
    label: "Copo-d'Água & Recepção",
    title: "Jardim das Acácias",
    subtitle: "Espaço de eventos fictício · Recepção",
    date: "19 de Dezembro de 2026",
    time: "17h00",
    city: "Beira, Moçambique",
    description:
      "Após a cerimónia, brindaremos juntos ao pôr do sol num ambiente intimista rodeado de jardins, música e gastronomia preparada com dedicação.",
    searchQuery: receptionSearch,
    mapsSearchUrl: buildMapsSearchUrl(receptionSearch),
    mapsEmbedUrl: buildMapsEmbedSearchUrl(receptionSearch),
    isDemonstrative: true,
  },
];

/**
 * Galeria "Os nossos momentos" — exclusivamente composta pelas 7 fotografias
 * reais fornecidas na pasta do projecto, com as respectivas proporções originais.
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "momento-1",
    src: "/images/couple/02-veu-ao-por-do-sol.jpg",
    alt: "Retrato intimista do casal sob o véu iluminado pela luz dourada do entardecer",
    caption: "Sob a luz dourada da nossa promessa",
    width: 1333,
    height: 2000,
    orientation: "portrait",
  },
  {
    id: "momento-2",
    src: "/images/couple/05-sorrisos-a-beira-lago.jpg",
    alt: "Casal sorridente junto ao lago com ramo de flores em tons quentes",
    caption: "A serenidade de caminharmos lado a lado",
    width: 2000,
    height: 1333,
    orientation: "landscape",
  },
  {
    id: "momento-3",
    src: "/images/couple/03-maos-e-promessa.jpg",
    alt: "Mãos dadas dos noivos projectando uma sombra em forma de coração na relva",
    caption: "Dois caminhos entrelaçados num só",
    width: 2000,
    height: 1333,
    orientation: "landscape",
  },
  {
    id: "momento-4",
    src: "/images/couple/04-abraco-no-campo.jpg",
    alt: "Noivos abraçados sob o véu branco num campo dourado",
    caption: "O nosso refúgio favorito",
    width: 1420,
    height: 2000,
    orientation: "portrait",
  },
  {
    id: "momento-5",
    src: "/images/couple/01-horizonte-dourado.jpg",
    alt: "Noivos a caminhar de mãos dadas em direcção ao pôr do sol nas montanhas",
    caption: "Rumo ao início do nosso para sempre",
    width: 1333,
    height: 2000,
    orientation: "portrait",
  },
  {
    id: "momento-6",
    src: "/images/couple/06-chuva-de-petalas.jpg",
    alt: "Celebração alegre dos noivos sob chuva de pétalas rodeados de amigos",
    caption: "Celebrados pelo carinho de quem amamos",
    width: 1333,
    height: 2000,
    orientation: "portrait",
  },
  {
    id: "momento-7",
    src: "/images/couple/07-celebracao-noite.jpg",
    alt: "Momento de festa e alegria na pista de dança com o ramo erguido",
    caption: "A alegria contagiante da nossa festa",
    width: 2000,
    height: 1326,
    orientation: "landscape",
  },
];
