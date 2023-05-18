var prevScrollpos = window.pageYOffset;

window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.querySelector("header").classList.remove("hidden");
  } else {
    document.querySelector("header").classList.add("hidden");
  }
  prevScrollpos = currentScrollPos;
}

//RECUPERANDO REPOSITORIO DO GITHUB DINAMICAMENTE

const username = "Raulss179";
const url = `https://api.github.com/users/${username}/repos`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const repoList = document.getElementById('repo-list');
    
    const maxRepos = 6; // Número máximo de repositórios a serem exibidos

    for (let i = 0; i < data.length && i < maxRepos; i++) {
      const repo = data[i];

      const repoCard = document.createElement('div');
      repoCard.classList.add('repo-card');

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
      repoList.appendChild(repoCard);
    }

    // Adicionar botão "Ver Mais" se houver mais repositórios
    if (data.length > maxRepos) {
      const verMaisButton = document.createElement('button');
      verMaisButton.classList.add('ver-mais-button');
      verMaisButton.textContent = "Ver Mais";
      verMaisButton.addEventListener('click', () => {
        // Redirecionar para a página com todos os repositórios
        window.location.href = `https://github.com/${username}?tab=repositories`;
      });
      repoList.appendChild(verMaisButton);
    }
  })
  .catch(error => {
    console.error("Erro ao obter os repositórios do GitHub:", error);
  });
