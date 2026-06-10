export type Locale = "en" | "es";

export const locales: Locale[] = ["en", "es"];

export type OccasionOption = {
  value: string;
  label: string;
};

export type ExperienceItem = {
  title: string;
  description: string;
};

export type BoatCopy = {
  highlight: string;
  duration: string;
};

export type Translations = {
  meta: {
    title: string;
    description: string;
  };
  a11y: {
    language: string;
    openMenu: string;
    closeMenu: string;
    primaryNav: string;
    mobileNav: string;
    footerNav: string;
  };
  nav: {
    fleet: string;
    experiences: string;
    book: string;
    reserve: string;
  };
  hero: {
    lineLight: string;
    lineBold: string;
    viewFleet: string;
    bookTrip: string;
  };
  signatureScene: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
  };
  pinkScene: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
  };
  fleet: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    signature: string;
    guests: string;
    from: string;
    select: string;
    selected: string;
  };
  experiences: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    items: ExperienceItem[];
  };
  jetSki: {
    eyebrow: string;
    title: string;
    description: string;
    promo: string;
    offerBadge: string;
    cta: string;
    whatsappCta: string;
    whatsappMessage: string;
  };
  booking: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    preferTalk: string;
    call: string;
    whatsapp: string;
    pickup: string;
    hours: string;
    fullName: string;
    email: string;
    phone: string;
    preferredDate: string;
    guests: string;
    occasion: string;
    selectYacht: string;
    notes: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    notesPlaceholder: string;
    guestSingular: string;
    guestPlural: string;
    submit: string;
    emailInstead: string;
    submitted: string;
    disclaimer: string;
    whatsappIntro: string;
    whatsappFields: {
      name: string;
      email: string;
      phone: string;
      date: string;
      guests: string;
      boat: string;
      occasion: string;
      notes: string;
      tbd: string;
    };
    occasions: OccasionOption[];
  };
  footer: {
    tagline: string;
    rights: string;
    hours: string;
  };
  boats: Record<string, BoatCopy>;
};

const en: Translations = {
  meta: {
    title: "2YACHTS MIAMI | Luxury Yacht Charters in Miami",
    description:
      "Private yacht charters for sandbar days, sunset cruises, celebrations, and VIP escapes on Biscayne Bay.",
  },
  a11y: {
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryNav: "Primary",
    mobileNav: "Mobile primary",
    footerNav: "Footer",
  },
  nav: {
    fleet: "Fleet",
    experiences: "Experiences",
    book: "Book",
    reserve: "Reserve",
  },
  hero: {
    lineLight: "Private",
    lineBold: "Yacht charters",
    viewFleet: "View the fleet",
    bookTrip: "Book your trip",
  },
  signatureScene: {
    eyebrow: "Signature Experience",
    title: "Live the luxury",
    titleAccent: "of the open sea",
    description:
      "This is not just a boat ride — it is music, bubbles, skyline views, and a crew that keeps the vibes high from dock to sandbar.",
  },
  pinkScene: {
    eyebrow: "Fan Favorite",
    title: "The Pink Yacht",
    titleAccent: "experience",
    description:
      "Our iconic pink vessel brings bachelorette energy, birthday hype, and VIP style to Biscayne Bay. Luxury in pink, by design.",
  },
  fleet: {
    eyebrow: "Our Fleet",
    titleLine1: "Choose your",
    titleLine2: "vessel",
    description:
      "From intimate day boats to statement luxury yachts — every charter includes a certified captain, fuel for local cruising, and a crew ready to deliver a worry-free day on the water.",
    signature: "Signature",
    guests: "up to {count} guests",
    from: "From",
    select: "Select",
    selected: "Selected",
  },
  experiences: {
    eyebrow: "Experiences",
    titleLine1: "More than a ride.",
    titleLine2: "A private escape.",
    description:
      "Whether you are chasing the sandbar, planning a bachelorette, or hosting clients on the bay — we tailor every charter to your vibe.",
    items: [
      {
        title: "Haulover Sandbar",
        description: "Crystal water, music, and the iconic Miami sandbar scene.",
      },
      {
        title: "Sunset Cruises",
        description: "Golden-hour skyline views with bubbles and your crew.",
      },
      {
        title: "Bachelorette & Birthdays",
        description: "Signature pink yacht energy for unforgettable celebrations.",
      },
      {
        title: "Corporate & VIP",
        description: "Polished crew, premium vessels, zero stress on the water.",
      },
    ],
  },
  jetSki: {
    eyebrow: "Jet Ski Rental",
    title: "Rent your Jet Ski in Miami and get 15 minutes free",
    description:
      "Experience the thrill on the water with top-quality Jet Skis, expert guidance, and affordable packages so the fun never stops.",
    promo: "Book today and enjoy 15 extra minutes on your first ride.",
    offerBadge: "15 min free",
    cta: "Book a Jet Ski",
    whatsappCta: "WhatsApp us",
    whatsappMessage:
      "Hi 2YACHTS MIAMI — I'd like to book a Jet Ski rental in Miami. I'd like to claim the 15 extra minutes on my first ride.",
  },
  booking: {
    eyebrow: "Book Your Trip",
    titleLine1: "Reserve your",
    titleLine2: "day at sea",
    description:
      "Tell us your date, group size, and vibe. We will confirm availability and walk you through the deposit — no guesswork, just premium service.",
    preferTalk: "Prefer to talk now?",
    call: "Call",
    whatsapp: "WhatsApp",
    pickup: "We depart from:",
    hours: "Hours",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    preferredDate: "Preferred date",
    guests: "Guests",
    occasion: "Occasion",
    selectYacht: "Select a yacht",
    notes: "Anything else we should know?",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@email.com",
    phonePlaceholder: "(305) 555-0100",
    notesPlaceholder: "DJ, decorations, route preferences, etc.",
    guestSingular: "guest",
    guestPlural: "guests",
    submit: "Send booking request",
    emailInstead: "Email instead",
    submitted:
      "Your request opened in WhatsApp. We will confirm availability and next steps shortly.",
    disclaimer:
      "Submitting opens WhatsApp with your details pre-filled. Gratuity and premium add-ons are quoted separately.",
    whatsappIntro: "Hi {brand} — I'd like to book a charter.",
    whatsappFields: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      date: "Date",
      guests: "Guests",
      boat: "Boat",
      occasion: "Occasion",
      notes: "Notes",
      tbd: "TBD",
    },
    occasions: [
      { value: "day-charter", label: "Day charter" },
      { value: "sunset", label: "Sunset cruise" },
      { value: "celebration", label: "Bachelorette / birthday" },
      { value: "corporate", label: "Corporate / VIP" },
      { value: "sandbar", label: "Sandbar day" },
      { value: "jet-ski", label: "Jet Ski rental" },
    ],
  },
  footer: {
    tagline:
      "Cheers, friends, and the open sea — that is how the best Miami memories are made.",
    rights: "All rights reserved.",
    hours: "Daily · 8am – 10pm",
  },
  boats: {
    "tiffany-sunseeker-60": {
      highlight: "Sunseeker luxury with room for up to 13 guests on Biscayne Bay.",
      duration: "4 hours",
    },
    "nodman-48-fly": {
      highlight: "Spacious flybridge layout for day charters, sandbar runs, and celebrations.",
      duration: "4 hours",
    },
  },
};

const es: Translations = {
  meta: {
    title: "2YACHTS MIAMI | Alquiler de yates de lujo en Miami",
    description:
      "Alquiler de yates privados para días en el sandbar, cruceros al atardecer, celebraciones y escapadas VIP en Biscayne Bay.",
  },
  a11y: {
    language: "Idioma",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    primaryNav: "Principal",
    mobileNav: "Menú móvil",
    footerNav: "Pie de página",
  },
  nav: {
    fleet: "Flota",
    experiences: "Experiencias",
    book: "Reservar",
    reserve: "Reservar",
  },
  hero: {
    lineLight: "Alquiler",
    lineBold: "de yates privados",
    viewFleet: "Ver la flota",
    bookTrip: "Reserva tu viaje",
  },
  signatureScene: {
    eyebrow: "Experiencia signature",
    title: "Vive el lujo",
    titleAccent: "del mar abierto",
    description:
      "Esto no es solo un paseo en barco — es música, burbujas, vistas del skyline y una tripulación que mantiene la energía alta del muelle al sandbar.",
  },
  pinkScene: {
    eyebrow: "Favorito del público",
    title: "El yate rosa",
    titleAccent: "experiencia",
    description:
      "Nuestro icónico yate rosa trae energía de despedida de soltera, hype de cumpleaños y estilo VIP a Biscayne Bay. Lujo en rosa, por diseño.",
  },
  fleet: {
    eyebrow: "Nuestra flota",
    titleLine1: "Elige tu",
    titleLine2: "embarcación",
    description:
      "Desde lanchas íntimas hasta yates de lujo — cada charter incluye capitán certificado, combustible para navegación local y tripulación lista para un día sin preocupaciones.",
    signature: "Signature",
    guests: "hasta {count} invitados",
    from: "Desde",
    select: "Seleccionar",
    selected: "Seleccionado",
  },
  experiences: {
    eyebrow: "Experiencias",
    titleLine1: "Más que un paseo.",
    titleLine2: "Un escape privado.",
    description:
      "Ya sea que busques el sandbar, planees una despedida de soltera o recibas clientes en la bahía — adaptamos cada charter a tu estilo.",
    items: [
      {
        title: "Sandbar de Haulover",
        description: "Agua cristalina, música y la icónica escena del sandbar de Miami.",
      },
      {
        title: "Cruceros al atardecer",
        description: "Vistas doradas del skyline con burbujas y tu crew.",
      },
      {
        title: "Despedidas y cumpleaños",
        description: "La energía del yate rosa para celebraciones inolvidables.",
      },
      {
        title: "Corporativo y VIP",
        description: "Tripulación impecable, embarcaciones premium, cero estrés en el agua.",
      },
    ],
  },
  jetSki: {
    eyebrow: "Alquiler de Jet Ski",
    title: "Alquila tu Jet Ski en Miami y obtén 15 minutos gratis",
    description:
      "Vive la emoción en el agua con Jet Skis de primera calidad, orientación experta y paquetes accesibles para que la diversión no pare.",
    promo: "Reserva hoy y disfruta 15 minutos extra en tu primera salida.",
    offerBadge: "15 min gratis",
    cta: "Reservar Jet Ski",
    whatsappCta: "WhatsApp",
    whatsappMessage:
      "Hola 2YACHTS MIAMI — me gustaría reservar un Jet Ski en Miami. Quiero reclamar los 15 minutos extra en mi primera salida.",
  },
  booking: {
    eyebrow: "Reserva tu viaje",
    titleLine1: "Reserva tu",
    titleLine2: "día en el mar",
    description:
      "Cuéntanos tu fecha, tamaño del grupo y el ambiente. Confirmaremos disponibilidad y te guiaremos con el depósito — sin adivinanzas, solo servicio premium.",
    preferTalk: "¿Prefieres hablar ahora?",
    call: "Llamar",
    whatsapp: "WhatsApp",
    pickup: "Salimos desde:",
    hours: "Horario",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono",
    preferredDate: "Fecha preferida",
    guests: "Invitados",
    occasion: "Ocasión",
    selectYacht: "Selecciona un yate",
    notes: "¿Algo más que debamos saber?",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "tu@email.com",
    phonePlaceholder: "(305) 555-0100",
    notesPlaceholder: "DJ, decoración, preferencias de ruta, etc.",
    guestSingular: "invitado",
    guestPlural: "invitados",
    submit: "Enviar solicitud de reserva",
    emailInstead: "Enviar por correo",
    submitted:
      "Tu solicitud se abrió en WhatsApp. Confirmaremos disponibilidad y próximos pasos pronto.",
    disclaimer:
      "Al enviar se abre WhatsApp con tus datos prellenados. Propinas y extras premium se cotizan por separado.",
    whatsappIntro: "Hola {brand} — me gustaría reservar un charter.",
    whatsappFields: {
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      date: "Fecha",
      guests: "Invitados",
      boat: "Yate",
      occasion: "Ocasión",
      notes: "Notas",
      tbd: "Por definir",
    },
    occasions: [
      { value: "day-charter", label: "Charter de día" },
      { value: "sunset", label: "Crucero al atardecer" },
      { value: "celebration", label: "Despedida / cumpleaños" },
      { value: "corporate", label: "Corporativo / VIP" },
      { value: "sandbar", label: "Día en el sandbar" },
      { value: "jet-ski", label: "Alquiler de Jet Ski" },
    ],
  },
  footer: {
    tagline:
      "Brindis, amigos y mar abierto — así se crean los mejores recuerdos de Miami.",
    rights: "Todos los derechos reservados.",
    hours: "Diario · 8am – 10pm",
  },
  boats: {
    "tiffany-sunseeker-60": {
      highlight:
        "Lujo Sunseeker con espacio para hasta 13 invitados en Biscayne Bay.",
      duration: "4 horas",
    },
    "nodman-48-fly": {
      highlight:
        "Flybridge amplio para charters de día, sandbar y celebraciones.",
      duration: "4 horas",
    },
  },
};

export const translations: Record<Locale, Translations> = { en, es };

export function interpolate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? `{${key}}`),
  );
}
