// Fonte única de dados do site. Edite aqui.
// Carregado antes dos scripts de cada página; cada <html> escolhe a marca via data-brand="pkz|oto".

(function () {
  // Horários de aula. dow = Date.getDay() (0 = domingo), usado para pré-selecionar o dia de hoje.
  // Ajuste aos horários reais; hoje é idêntico nas duas marcas.
  const schedule = () => ({
    days: [
      { short: "Seg", name: "Segunda-feira", dow: 1 },
      { short: "Ter", name: "Terça-feira", dow: 2 },
      { short: "Qua", name: "Quarta-feira", dow: 3 },
      { short: "Qui", name: "Quinta-feira", dow: 4 },
      { short: "Sex", name: "Sexta-feira", dow: 5 },
      { short: "Sáb", name: "Sábado", dow: 6 },
      { short: "Dom", name: "Domingo", dow: 0 },
    ],
    times: [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
    ],
  });

  const address = {
    street: "Av. Armando Lombardi, 949 — Loja G",
    city: "Barra da Tijuca, Rio de Janeiro — RJ",
  };

  window.SITE_DATA = {
    brands: {
      pkz: {
        name: "PKZ Lab",
        // Placeholder (DDI + DDD + número, só dígitos). Troque o número real AQUI.
        // Os links wa.me estáticos nos HTML (noscript e barra mobile) ainda têm o número escrito à mão.
        whatsapp: "5521000000000",
        contactFallbackName: "Atleta",
        contactMessage: (userName) =>
          `Fala equipe PKZ! Meu nome é ${userName} e gostaria de saber mais sobre as modalidades.`,
        modalities: ["Karatê", "Jiu-Jitsu", "Vôlei", "Futebol", "Natação", "Atletismo", "Outro esporte"],
        schedule: schedule(),
        address,
        instagram: { url: "https://www.instagram.com/playmakerz_pkz/", handle: "@playmakerz_pkz" },
      },
      oto: {
        name: "One To One",
        // Placeholder (DDI + DDD + número, só dígitos). Troque o número real AQUI.
        // Os links wa.me estáticos nos HTML (noscript e barra mobile) ainda têm o número escrito à mão.
        whatsapp: "5521000000000",
        contactFallbackName: "um visitante",
        contactMessage: (userName) =>
          `Olá, equipe One To One. Me chamo ${userName} e gostaria de agendar uma avaliação.`,
        modalities: ["Personal Training", "Fisioterapia", "Nutrição"],
        schedule: schedule(),
        address,
        instagram: { url: "https://www.instagram.com/studioonetoone/", handle: "@studioonetoone" },
      },
    },
  };
})();
