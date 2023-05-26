import { initScrollReveal } from "./scrollReveal.js";
import { hoverChangeExperience } from "./hoverChangeExperience.js";
import { typeWrite } from "./typeWrite.js";
import { hoverChangeDescription } from "./hoverChangeDescription.js";
import { menu } from "./menu.js";

menu();
initScrollReveal();
typeWrite(document.querySelector(".typewriter"));

hoverChangeExperience(
  ".digitalhouse",
  `Colaborei com colegas no desenvolvimento de páginas web, usando habilidades front-end como HTML, CSS e JavaScript. Utilizei frameworks populares e trabalhei em equipe, compartilhando conhecimentos e resolvendo problemas. Mantive o código organizado usando Git e garanti a qualidade das aplicações por meio de testes e depuração.
  `,
  "Professor conteudista em Frontend",
  "Digital House",
  "Nov 2021 - Nov 2022 (1 ano)"
)
hoverChangeDescription(
  ".html",
  "HTML é uma linguagem de marcação, onde marcamos os elementos para definir quais informações a página vai exibir."
);
hoverChangeDescription(
  ".css",
  "CSS é uma linguagem de folha de estilo composta por “camadas”, criado com o propósito de estilizar as páginas."
);
hoverChangeDescription(
  ".js",
  "JavaScript é uma linguagem de programação que permite a você implementar elementos dinâmicos em páginas web."
);
hoverChangeDescription(
  ".sass",
  "Sass é um pré-processador CSS que adiciona alguns recursos que não estão disponíveis de forma nativa."
);
hoverChangeDescription(
  ".react",
  "React é uma biblioteca JavaScript com foco em criar interfaces de usuário de forma componetizada."
);
hoverChangeDescription(
  ".next",
  "Next.js é uma estrutura da web que permite funcionalidades como renderização do lado do servidor e geração de sites estáticos para web baseados em React."
);
hoverChangeDescription(
  ".styled",
  "styled-components é uma biblioteca que utiliza o conceito de CSS-in-JS, ou seja, que nos permite escrever códigos CSS dentro do Javascript."
);
hoverChangeDescription(
  ".tailwind",
  "Tailwind CSS é um framework CSS que nos fornece classes utilitárias com o propósito de estilizar as páginas."
);
hoverChangeDescription(
  ".typescript",
  "TypeScript é um superset do JavaScript que incluir recursos que não estão presentes na linguagem de forma nativa, além de torná-la estática."
);
hoverChangeDescription(
  ".radix",
  "Radix é uma biblioteca que fornece componentes acessíveis e sem estilos para a criação de aplicação em React."
);
hoverChangeDescription(
  ".cypress",
  "Cypress é um framework para automação de testes end-to-end, onde atualmente usa a linguagem JavaScript."
);
hoverChangeDescription(
  ".storybook",
  "Storybook é uma ferramenta que tem como objetivo documentar e testar os componentes da aplicação."
);
