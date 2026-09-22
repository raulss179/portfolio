/* ============================================================
   CARROSEL.JS — esteira infinita, JavaScript puro
   Funciona com o seu HTML:
     .carrosel > .carrosel-slides > .slide-active > .slide > img

   O que este script faz, resumido:
   1. repete os PNGs até a fila ficar mais larga que a tela;
   2. duplica essa fila (a cópia é o "rabo" que emenda no início);
   3. calcula a duração da animação a partir da velocidade em px/s;
   4. o CSS anima de 0 até -50% em loop → movimento contínuo, sem parar.

   Atributos opcionais no <section class="carrosel">:
     data-velocidade="60"        → pixels por segundo (padrão 60)
     data-direcao="esquerda"     → ou "direita"
     data-pausar-hover="false"   → "true" pausa quando o mouse entra
   ============================================================ */

(function() {
    "use strict";

    function criarEsteira(carrosel) {
        /* ---------- ETAPA 1 — Achar os elementos ---------- */
        const janela = carrosel.querySelector(".carrosel-slides");
        const trilho = carrosel.querySelector(".slide-active");

        if (!janela || !trilho) {
            console.error("[carrosel] Faltou .carrosel-slides ou .slide-active dentro de .carrosel.");
            return;
        }

        /* Guardamos os slides ORIGINAIS numa lista à parte. Todo o resto
           (repetições e cópia) é descartável e recriado quando necessário. */
        const originais = Array.from(trilho.querySelectorAll(".slide"))
            .filter(function(s) { return !s.dataset.clone; });

        if (originais.length === 0) {
            console.error("[carrosel] Nenhum .slide encontrado dentro de .slide-active.");
            return;
        }

        /* ---------- ETAPA 2 — Configuração vinda do HTML ---------- */
        const velocidade = Math.max(10, Number(carrosel.dataset.velocidade) || 60); // px/s
        if (!carrosel.dataset.direcao) carrosel.dataset.direcao = "esquerda";

        /* ---------- ETAPA 3 — Rede de segurança de estilos ----------
           Se o carrosel.css não carregou (caminho errado) ou foi
           sobrescrito por outra regra do site, aplicamos o essencial
           aqui em linha — assim a esteira roda de qualquer forma. */
        function garantirEstilos() {
            const est = getComputedStyle(trilho);
            if (est.display === "flex" && est.animationName !== "none") return; // CSS ok

            console.warn(
                "[carrosel] O carrosel.css não está sendo aplicado. Confira o caminho do <link> " +
                "e se alguma regra antiga do seu site sobrescreve .slide / .slide-active. " +
                "Aplicando os estilos mínimos por JavaScript."
            );

            // Cria as keyframes uma única vez, direto no documento.
            if (!document.getElementById("carrosel-estilos-minimos")) {
                const tag = document.createElement("style");
                tag.id = "carrosel-estilos-minimos";
                tag.textContent =
                    "@keyframes carrosel-esteira{from{transform:translate3d(0,0,0)}" +
                    "to{transform:translate3d(-50%,0,0)}}";
                document.head.appendChild(tag);
            }

            janela.style.overflow = "hidden";
            trilho.style.display = "flex";
            trilho.style.width = "max-content";
            trilho.style.animationName = "carrosel-esteira";
            trilho.style.animationTimingFunction = "linear";
            trilho.style.animationIterationCount = "infinite";
            if (carrosel.dataset.direcao === "direita") trilho.style.animationDirection = "reverse";

            trilho.querySelectorAll(".slide").forEach(function(s) {
                s.style.flex = "0 0 auto";
                s.style.width = "170px";
                s.style.display = "grid";
                s.style.placeItems = "center";
                s.style.padding = "26px 24px";
                s.style.boxSizing = "border-box";
                const img = s.querySelector("img");
                if (img) {
                    img.style.width = "100%";
                    img.style.height = "100px";
                    img.style.objectFit = "contain";
                }
            });
        }

        /* ---------- ETAPA 4 — Montar a fila ----------
           a) limpa o que existir de anterior;
           b) repete os originais até passar da largura da tela
              (necessário quando você tem poucos PNGs);
           c) duplica tudo uma vez → a metade final emenda na inicial. */
        function montar() {
            // (a) volta ao estado original
            trilho.querySelectorAll('[data-clone="1"]').forEach(function(n) { n.remove(); });

            const larguraJanela = janela.clientWidth || window.innerWidth;

            // (b) quantas repetições dos originais para cobrir a tela
            const larguraOriginais = originais.reduce(function(soma, s) {
                return soma + s.getBoundingClientRect().width;
            }, 0) || originais.length * 190;

            const repeticoes = Math.max(1, Math.ceil((larguraJanela * 1.2) / larguraOriginais));

            for (let r = 1; r < repeticoes; r++) {
                originais.forEach(function(s) { trilho.appendChild(marcarClone(s)); });
            }

            // (c) a cópia que fecha o ciclo: duplica a fila inteira
            Array.from(trilho.children).forEach(function(s) {
                trilho.appendChild(marcarClone(s));
            });

            // (d) duração = metade da fila (uma volta completa) ÷ velocidade
            const metade = trilho.getBoundingClientRect().width / 2;
            const segundos = Math.max(4, metade / velocidade);
            carrosel.style.setProperty("--duracao-esteira", segundos.toFixed(2) + "s");
            trilho.style.animationDuration = segundos.toFixed(2) + "s"; // vale também sem o CSS
        }

        /* Marca a cópia como clone e a esconde de leitores de tela,
           para o mesmo PNG não ser anunciado várias vezes. */
        function marcarClone(slide) {
            const copia = slide.cloneNode(true);
            copia.dataset.clone = "1";
            copia.setAttribute("aria-hidden", "true");
            return copia;
        }

        /* ---------- ETAPA 5 — Refazer as contas ao redimensionar ----------
           O debounce evita recalcular dezenas de vezes durante o arraste
           da borda da janela. */
        let debounce;
        window.addEventListener("resize", function() {
            clearTimeout(debounce);
            debounce = setTimeout(function() {
                garantirEstilos();
                montar();
            }, 200);
        });

        /* ---------- ETAPA 6 — Rótulos e partida ---------- */
        carrosel.setAttribute("aria-roledescription", "carrossel");
        if (!carrosel.getAttribute("aria-label")) {
            carrosel.setAttribute("aria-label", "Carrossel de imagens em rolagem contínua");
        }

        garantirEstilos();
        montar();

        /* As imagens podem chegar depois do script: quando a última
           terminar de carregar, as larguras mudam e refazemos a fila. */
        const imagens = Array.from(trilho.querySelectorAll("img"));
        let faltam = imagens.filter(function(i) { return !i.complete; }).length;
        imagens.forEach(function(img) {
            if (img.complete) return;
            img.addEventListener("load", function() { if (--faltam <= 0) montar(); });
            img.addEventListener("error", function() {
                console.warn("[carrosel] PNG não encontrado: " + img.getAttribute("src"));
                if (--faltam <= 0) montar();
            });
        });
    }

    /* ============================================================
       ETAPA 7 — Inicialização
       ============================================================ */
    function iniciar() {
        const lista = document.querySelectorAll(".carrosel");
        if (lista.length === 0) {
            console.error('[carrosel] Nenhum elemento com class="carrosel" na página.');
            return;
        }
        lista.forEach(criarEsteira);
        console.log("[carrosel] esteira iniciada em " + lista.length + " elemento(s).");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();

/*sessão SOBRE MIM */
/* ============================================================
   SOBRE.JS — troca de idioma PT / EN sem recarregar a página
   Como funciona:
   cada elemento traduzível carrega os dois textos no HTML, em
   data-pt e data-en. O script só copia o certo para dentro dele.

   Exemplo no HTML:
     <p data-pt="Olá, tudo bem?" data-en="Hi there!"></p>
   ============================================================ */

(function() {
        "use strict";
        /* ETAPA 1 — Elementos envolvidos */
        const botoes = document.querySelectorAll("[data-idioma]");
        const traduziveis = document.querySelectorAll("[data-pt][data-en]");
        let escolhido = "pt"; // idioma atual, guardado só na memória
        if (botoes.length === 0 || traduziveis.length === 0) return;
        /* ETAPA 2 — Aplicar um idioma
     innerHTML (e não textContent) para permitir <em> e <strong>
     dentro dos textos. Os valores vêm do seu próprio HTML, então
     não há risco de conteúdo externo aqui. */
        function aplicar(idioma) {
            traduziveis.forEach(function(el) {
                const texto = el.dataset[idioma]; // dataset.pt ou dataset.en
                if (texto) el.innerHTML = texto;
            });
            // marca o botão ativo (aria-pressed também informa leitores de tela)
            botoes.forEach(function(b) {
                b.setAttribute("aria-pressed", b.dataset.idioma === idioma ? "true" : "false");
            });
            // atualiza o idioma da página: ajuda buscadores e tradutores
            document.documentElement.lang = idioma === "en" ? "en" : "pt-BR";
            /* Quer lembrar a escolha na próxima visita? No SEU site, salve o
       idioma no armazenamento local do navegador com setItem("idioma",
       idioma) dentro de um try/catch. Nesta prévia isso fica bloqueado,
       então o idioma vive só na memória da página. */
            escolhido = idioma;
        }
        /* ETAPA 3 — Cliques nos botões */
        botoes.forEach(function(b) {
            b.addEventListener("click", function() {
                aplicar(b.dataset.idioma);
            });
        });
        /* ETAPA 4 — Idioma inicial
     Se o navegador do visitante não está em português, ele já cai
     no inglês — importante para recrutador de fora.
     No seu site, para respeitar a escolha anterior, leia o valor
     salvo com getItem("idioma") antes da linha abaixo. */
        let inicial = "pt";
        const idiomaNavegador = (navigator.language || "").toLowerCase();
        if (idiomaNavegador.indexOf("pt") !== 0) inicial = "en";
        aplicar(inicial);
    }

)();