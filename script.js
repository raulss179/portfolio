var prevScrollpos = window.pageYOffset;
var header = document.querySelector("header");


window.addEventListener('load', function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 0);
  });
  
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;

  if (prevScrollpos > currentScrollPos) {
    // Rolagem para cima
    header.classList.remove("hidden");
  } else {
    // Rolagem para baixo
    header.classList.add("hidden");
  }

  window.onload = function() {
    var sectionHome = document.getElementById('s-home');
  
    if (sectionHome) {
      var sectionOffsetTop = sectionHome.offsetTop;
      window.scrollTo(0, sectionOffsetTop);
    }
  };
}
  


//RECUPERANDO REPOSITORIO DO GITHUB DINAMICAMENTE

const username = "Raulss179";
const excludedRepo = "nome-do-repositorio"; // Substitua pelo nome do repositório a ser excluído
const url = `https://api.github.com/users/${username}/repos`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const filteredData = data.filter(repo => repo.name !== excludedRepo); // Filtra os repositórios para excluir o repositório especificado

    const repoContainer = document.getElementById('repo-container');

    let currentRepoIndex = 1; // Índice do repositório central exibido no carrossel

    function displayRepos() {
      const prevRepoIndex = (currentRepoIndex - 1 + filteredData.length) % filteredData.length; // Índice do repositório anterior
      const nextRepoIndex = (currentRepoIndex + 1) % filteredData.length; // Índice do próximo repositório

      const prevRepo = filteredData[prevRepoIndex];
      const currentRepo = filteredData[currentRepoIndex];
      const nextRepo = filteredData[nextRepoIndex];

      repoContainer.innerHTML = ''; // Limpa o container

      // Exibe o repositório anterior
      const prevRepoCard = createRepoCard(prevRepo, 'small-repo-card-1');
      repoContainer.appendChild(prevRepoCard);

      // Exibe o repositório central (atual)
      const currentRepoCard = createRepoCard(currentRepo, 'repo-card');
      repoContainer.appendChild(currentRepoCard);

      // Exibe o próximo repositório
      const nextRepoCard = createRepoCard(nextRepo, 'small-repo-card');
      repoContainer.appendChild(nextRepoCard);
    }

    function createRepoCard(repo, cardClass) {
      const repoCard = document.createElement('div');
      repoCard.classList.add(cardClass);

      const repoName = document.createElement('h3');
      repoName.classList.add('repo-name');
      repoName.textContent = repo.name;

      const repoDesc = document.createElement('p');
      repoDesc.classList.add('repo-description');
      repoDesc.textContent = repo.description;

      const repoButton = document.createElement('a');
      repoButton.classList.add('repo-button');
      repoButton.href = repo.html_url;
      repoButton.textContent = "Visitar Repositório";
      repoButton.target = "_blank";

      repoCard.appendChild(repoName);
      repoCard.appendChild(repoDesc);
      repoCard.appendChild(repoButton);

      return repoCard;
    }

    function showNextRepo() {
      currentRepoIndex = (currentRepoIndex + 1) % filteredData.length; // Incrementa o índice considerando o tamanho do array
      displayRepos();
    }

    function showPreviousRepo() {
      currentRepoIndex = (currentRepoIndex - 1 + filteredData.length) % filteredData.length; // Decrementa o índice considerando o tamanho do array
      displayRepos();
    }

    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    prevButton.addEventListener('click', showPreviousRepo);
    nextButton.addEventListener('click', showNextRepo);

    displayRepos();
  })
  .catch(error => {
    console.error("Erro ao obter os repositórios do GitHub:", error);
  });
