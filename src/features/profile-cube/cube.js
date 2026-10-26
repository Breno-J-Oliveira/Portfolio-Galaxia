/* A deliberate rotation, only when a face is selected. Information remains in HTML. */
(function () {
  "use strict";
  const cube = document.querySelector(".profile-cube");
  if (!cube) return;
  const faces = [
    [
      "Perfil",
      "Breno J. Oliveira",
      "Desenvolvedor Full Stack de Santo André, SP. Estudo Desenvolvimento de Sistemas no SENAI e busco minha primeira oportunidade na área.",
      "resume.html",
      "Ver resumo profissional",
      "BJO",
      "Full Stack",
    ],
    [
      "Projeto atual",
      "Nexly",
      "Desenvolvo com a equipe NexusTech o nosso TCC: um sistema que conecta agenda, estoque e ponto de venda.",
      "projects.html?project=nexly",
      "Conhecer o Nexly",
      "Nexly",
      "TCC · NexusTech",
    ],
    [
      "Tecnologias",
      "Da interface à API",
      "Uso React e Next.js nas interfaces, NestJS e Node.js no backend, TypeScript e bancos SQL. Cada projeto me ajuda a aprofundar essa base.",
      "#skills",
      "Ver tecnologias",
      "{ }",
      "React · NestJS",
    ],
    [
      "Formação",
      "SENAI",
      "Curso Técnico em Desenvolvimento de Sistemas em andamento, com conclusão prevista para dezembro de 2026.",
      "#education",
      "Ver formação",
      "SENAI",
      "Dezembro de 2026",
    ],
    [
      "Experiência",
      "Trabalho em equipe",
      "Na Axtron.IO, gerencio uma equipe de produção de ativos publicitários. Nos projetos acadêmicos, colaboro com a NexusTech.",
      "#timeline",
      "Conhecer a trajetória",
      "Equipe",
      "Axtron.IO · NexusTech",
    ],
    [
      "Contato",
      "Vamos conversar",
      "Tenho interesse em oportunidades de desenvolvimento e projetos em que possa contribuir e continuar aprendendo.",
      "contact.html?intent=opportunity",
      "Entrar em contato",
      "Olá.",
      "Uma conversa começa aqui",
    ],
  ];
  const rotations = [
    [-16, 24],
    [-16, -66],
    [-16, -156],
    [-16, 114],
    [-74, 0],
    [106, 0],
  ];
  const controls = document.querySelector(".cube-controls");
  const buttons = [...controls.querySelectorAll("button")];
  const detail = document.getElementById("cube-detail");
  controls.hidden = false;
  document.querySelector(".cube-instruction").hidden = false;
  function select(index) {
    const face = faces[index];
    cube.style.transform = `rotateX(${rotations[index][0]}deg) rotateY(${rotations[index][1]}deg)`;
    buttons.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
    detail.querySelector(".cube-kicker").textContent = face[0];
    detail.querySelector("h3").textContent = face[1];
    detail.querySelector("p:not(.cube-kicker)").textContent = face[2];
    const link = detail.querySelector("a");
    link.href = face[3];
    link.textContent = face[4];
  }
  buttons.forEach((button, index) =>
    button.addEventListener("click", () => select(index)),
  );
  controls.addEventListener("keydown", (event) => {
    const index = buttons.indexOf(document.activeElement);
    if (
      index < 0 ||
      !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
    )
      return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 5
          : (index + (event.key === "ArrowRight" ? 1 : -1) + 6) % 6;
    buttons[next].focus();
    select(next);
  });
})();
