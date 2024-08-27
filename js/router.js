// Função para carregar o conteúdo HTML da página
function loadPage(page) {
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('app').innerHTML = data;
            loadScript(page);
        });
}

// Função para gerenciar o roteamento com base no hash da URL
function router() {
    const path = window.location.hash.substring(1) || 'home';
    loadPage(path);
}

// Função para carregar e executar scripts JS dinâmicos para a página carregada
async function loadScript(page) {
    // Remover o script existente se já estiver presente
    const existingScript = document.querySelector(`script[src="/js/pages/${page}.js"]`);
    if (existingScript) {
        existingScript.remove();
    }

    // Adiciona o novo script à página
    const script = document.createElement('script');
    script.src = `/js/pages/${page}.js`;
    script.type = 'module';
    script.onload = async () => {
        try {
            const modulePath = `${window.location.origin}/js/pages/${page}.js`;
            const module = await import(modulePath);
            if (typeof module.initialize === 'function') {
                module.initialize();
            }
        } catch (error) {
            console.error(`Erro ao importar o módulo /js/pages/${page}.js:`, error);
        }
    };
    document.body.appendChild(script);
}

// Adiciona ouvintes de eventos para carregar o roteador ao mudar o hash ou carregar a página
window.addEventListener('hashchange', router);
window.addEventListener('load', router);