// sw.js - Service Worker corrigido
const CACHE_NAME = 'gym-pwa-v2';
const urlsToCache = [
  '/',
  '/index07.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Skip waiting para ativação imediata
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching arquivos');
        // Estratégia mais tolerante a falhas
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(error => {
              console.log(`Falha ao armazenar ${url} em cache:`, error);
              // Continua mesmo se algum arquivo falhar
              return Promise.resolve();
            });
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Instalação concluída');
      })
      .catch(error => {
        console.log('Service Worker: Falha na instalação', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo', cache);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => {
      // Tomar controle de todas as páginas imediatamente
      return self.clients.claim();
    })
    .then(() => {
      console.log('Service Worker: Ativação concluída');
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  // Ignorar requisições que não são GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar requisições de chrome-extension
  if (event.request.url.includes('chrome-extension')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }

        // Clonar a requisição
        const fetchRequest = event.request.clone();

        // Fazer requisição à rede
        return fetch(fetchRequest)
          .then(response => {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta
            const responseToCache = response.clone();

            // Adicionar ao cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.log('Erro ao adicionar ao cache:', error);
              });

            return response;
          })
          .catch(error => {
            console.log('Fetch falhou, retornando página offline:', error);
            
            // Se for uma navegação (HTML), tentar retornar a página offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index07.html');
            }
            
            // Para outros recursos, retornar uma resposta de fallback
            return new Response('Conteúdo offline não disponível', {
              status: 408,
              statusText: 'Offline'
            });
          });
      })
  );
});

// Mensagens do cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
