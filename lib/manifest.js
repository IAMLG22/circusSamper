/* =============================================================
   Spaghettería Circus — DATOS DE LA MARCA (todo editable aquí)
   -------------------------------------------------------------
   Cambia textos, platos, precios y horarios en este archivo.
   No hace falta tocar el HTML para el contenido dinámico.
   Los horarios alimentan el widget "Abierto ahora / Cerrado".
   ============================================================= */
(function () {
  "use strict";

  window.__BRAND__ = {
    /* --- Identidad --------------------------------------------------- */
    name: "Spaghettería Circus",
    tagline: "Trattoria-espectáculo en Teatinos",
    since: 1997,

    /* --- Contacto (DATOS REALES) ------------------------------------ */
    contact: {
      phone: "+34 951 732 575",
      phoneHref: "+34951732575",          // sin espacios, para tel: y wa.me
      whatsapp: "34951732575",            // para enlaces wa.me
      email: "1997circus@gmail.com",
      address: "Av. de Gregorio Prieto, 25",
      city: "29010 Málaga (Teatinos)",
      instagram: "spaghetteriacircus",
      instagramUrl: "https://www.instagram.com/spaghetteriacircus/",
      // Mapa: dirección para el embed y para "Cómo llegar"
      mapsQuery: "Spaghetteria Circus, Av. de Gregorio Prieto, 25, 29010 Málaga",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Av.+de+Gregorio+Prieto+25+29010+Malaga"
    },

    /* --- Horarios ---------------------------------------------------
       Formato por día (0=Domingo … 6=Sábado). Cada franja es [inicio, fin]
       en formato "HH:MM". Un día cerrado = [] (array vacío).
       El widget "Abierto/Cerrado" se calcula en vivo desde aquí.
    ------------------------------------------------------------------ */
    hours: {
      0: [["13:00", "16:30"], ["20:00", "23:30"]], // Domingo
      1: [["13:00", "16:00"]],                        // Lunes
      2: [],                                          // Martes CERRADO
      3: [["13:00", "16:00"]],                        // Miércoles
      4: [["13:00", "16:00"], ["20:00", "23:30"]],  // Jueves
      5: [["13:00", "16:30"], ["20:00", "23:30"]],  // Viernes
      6: [["13:00", "16:30"], ["20:00", "23:30"]]   // Sábado
    },
    // Texto legible de horarios (para mostrar en la web)
    hoursText: [
      { dias: "Lunes y miércoles", horas: "13:00 – 16:00" },
      { dias: "Martes", horas: "Cerrado" },
      { dias: "Jueves", horas: "13:00 – 16:00 · 20:00 – 23:30" },
      { dias: "Viernes, sábado y domingo", horas: "13:00 – 16:30 · 20:00 – 23:30" }
    ],

    /* --- Prueba social (PLACEHOLDER — pendiente de datos reales) ----- */
    social_proof: {
      rating: "4,X",           // TODO: sustituir por nota real de Google
      reviews: "XX",           // TODO: sustituir por nº real de reseñas
      note: "pendiente de datos reales"
    },

    /* --- Platos estrella (Home) ------------------------------------- */
    // photo: nombre del archivo WebP cuando exista. Por ahora placeholder.
    stars: [
      {
        id: "gratinado",
        name: "El Gratinado",
        desc: "Nuestro plato insignia desde 1997. Saliendo del horno, burbujeante.",
        price: "14,50",
        photoHint: "FOTO: gratinado saliendo del horno, queso burbujeante",
        badge: "El insignia"
      },
      {
        id: "carbonara",
        name: "Spaghetti Carbonara",
        desc: "Guanciale, huevo, pecorino y pimienta. La receta romana de verdad.",
        price: "12,90",
        photoHint: "FOTO: carbonara cremosa con guanciale"
      },
      {
        id: "tartufo",
        name: "Tagliatelle al Tartufo",
        desc: "Pasta fresca al huevo con crema de trufa y parmesano.",
        price: "15,50",
        photoHint: "FOTO: tagliatelle con virutas de trufa"
      },
      {
        id: "tiramisu",
        name: "Tiramisú della Casa",
        desc: "Mascarpone, café y cacao. El gran final de la función.",
        price: "6,50",
        photoHint: "FOTO: tiramisú con cacao espolvoreado"
      }
    ],

    /* --- CARTA COMPLETA (editable) ---------------------------------
       Presentada como "actos" de una función. Cada acto tiene platos.
       star: true -> lleva foto (placeholder) en la carta.
    ------------------------------------------------------------------ */
    menu: [
      {
        act: "Preludio",
        subtitle: "Entrantes para abrir el telón",
        items: [
          { name: "Bruschetta al pomodoro", desc: "Pan tostado, tomate, albahaca y ajo.", price: "6,50" },
          { name: "Burrata pugliese", desc: "Burrata cremosa, tomate seco y rúcula.", price: "9,90" },
          { name: "Tabla de embutidos italianos", desc: "Selección de salumi y quesos.", price: "13,50" },
          { name: "Arancini (4 uds.)", desc: "Croquetas de risotto rellenas de mozzarella.", price: "7,90" },
          { name: "Focaccia della casa", desc: "Recién horneada con romero y aceite de oliva.", price: "4,50" }
        ]
      },
      {
        act: "Acto principal",
        subtitle: "Pastas, gratinados y horno",
        items: [
          { name: "El Gratinado", desc: "El insignia de la casa desde 1997.", price: "14,50", star: true, photoHint: "FOTO: gratinado en su cazuela" },
          { name: "Spaghetti Carbonara", desc: "Guanciale, huevo, pecorino, pimienta.", price: "12,90", star: true, photoHint: "FOTO: carbonara auténtica" },
          { name: "Tagliatelle al Tartufo", desc: "Pasta fresca, crema de trufa, parmesano.", price: "15,50", star: true, photoHint: "FOTO: tagliatelle con trufa" },
          { name: "Lasaña de la nonna", desc: "Boloñesa, bechamel y horno. Como toca.", price: "13,50" },
          { name: "Penne all'Arrabbiata", desc: "Tomate, ajo, guindilla. Con carácter.", price: "10,90" },
          { name: "Ravioli di ricotta e spinaci", desc: "Rellenos de ricotta y espinaca, salvia y mantequilla.", price: "13,90" },
          { name: "Risotto ai funghi", desc: "Arroz carnaroli con setas y parmesano.", price: "13,50" },
          { name: "Gnocchi al gorgonzola", desc: "Ñoquis de patata con crema de gorgonzola.", price: "12,50" }
        ]
      },
      {
        act: "Gran final",
        subtitle: "Postres para cerrar el espectáculo",
        items: [
          { name: "Tiramisú della Casa", desc: "Mascarpone, café y cacao.", price: "6,50", star: true, photoHint: "FOTO: tiramisú de la casa" },
          { name: "Panna cotta", desc: "Con coulis de frutos rojos.", price: "5,50" },
          { name: "Cannoli siciliani", desc: "Rellenos de crema de ricotta.", price: "6,00" },
          { name: "Affogato al caffè", desc: "Helado de vainilla ahogado en espresso.", price: "5,00" }
        ]
      },
      {
        act: "Entreacto",
        subtitle: "Bebidas y vinos",
        items: [
          { name: "Copa de vino de la casa", desc: "Tinto o blanco italiano.", price: "3,50" },
          { name: "Aperol Spritz", desc: "El clásico de la sobremesa.", price: "6,50" },
          { name: "Agua / Refrescos", desc: "", price: "2,50" },
          { name: "Espresso / Caffè", desc: "Como en Italia.", price: "1,80" }
        ]
      }
    ],

    // Fecha visible de la carta (para el botón "Descargar PDF")
    menuUpdated: "septiembre 2025"
  };
})();
