// ===================================
// Canvas Matrix/Particle Background (Efeito de Fundo)
// ===================================

// Seleciona o elemento canvas do HTML pelo ID
const canvas = document.getElementById('bg-canvas');
// Cria o contexto de desenho 2D
const ctx = canvas.getContext('2d');

// Variáveis para guardar largura e altura da tela
let width, height;
// Array que armazenará todas as partículas
let particles = [];
// =Configurações=
const particleCount = 80; // Quantidade de partículas (bolinhas)
const connectionDistance = 120; // Distância máxima para ligar com uma linha

// Função para ajustar o tamanho do canvas quando a tela muda de tamanho
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Classe que define como cada partícula se comporta
class Particle {
    constructor() {
        // Posição aleatória na tela
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Velocidade aleatória (vx = horizontal, vy = vertical)
        this.vx = (Math.random() - 0.5) * 1.5; 
        this.vy = (Math.random() - 0.5) * 1.5;
        // Tamanho aleatório entre 1 e 3
        this.size = Math.random() * 2 + 1;
        // Cor aleatória: 50% chance de ser Ciano, 50% Roxo
        this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255,' : 'rgba(188, 19, 254,';
    }

    // Função que atualiza a posição da partícula
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Efeito Pacman: Se sair de um lado, volta pelo outro
        if (this.x < 0) this.x = width; // Saiu na esquerda, volta na direita
        if (this.x > width) this.x = 0; // Saiu na direita, volta na esquerda
        if (this.y < 0) this.y = height; // Saiu no topo, volta em baixo
        if (this.y > height) this.y = 0; // Saiu em baixo, volta no topo
    }

    // Função que desenha a partícula na tela
    draw() {
        ctx.beginPath(); // Inicia o desenho
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Cria um círculo
        ctx.fillStyle = this.color + '0.8)'; // Cor de preenchimento
        ctx.fill(); // Preenche o círculo
    }
}

// Função para iniciar as partículas
function initParticles() {
    particles = []; // Limpa o array
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle()); // Cria novas partículas e adiciona ao array
    }
}

// Função de animação (loop infinito)
function animateParticles() {
    // Limpa a tela inteira para desenhar o próximo quadro
    ctx.clearRect(0, 0, width, height);

    // Para cada partícula...
    particles.forEach((p, index) => {
        p.update(); // Atualiza posição
        p.draw();   // Desenha

        // Verifica partículas próximas para desenhar linhas
        for (let j = index + 1; j < particles.length; j++) {
            const p2 = particles[j];
            // Calcula a distância usando Pitágoras
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

            // Se a distância for menor que o limite, desenha uma linha
            if (dist < connectionDistance) {
                ctx.beginPath();
                // A linha fica mais transparente quanto mais longe as partículas estiverem
                ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / connectionDistance})`; 
                ctx.lineWidth = 0.5; // Espessura fina
                ctx.moveTo(p.x, p.y); // Começa na partícula 1
                ctx.lineTo(p2.x, p2.y); // Vai até a partícula 2
                ctx.stroke(); // Desenha a linha
            }
        }
    });

    // Pede ao navegador para chamar essa função novamente no próximo quadro
    requestAnimationFrame(animateParticles);
}

// Adiciona um "ouvinte" para quando a tela for redimensionada
window.addEventListener('resize', () => {
    resize();
    initParticles();
});

// Inicializa tudo
resize();
initParticles();
animateParticles();

// ===================================
// Transições de Página (Polish Opcional)
// ===================================
// Espera o site carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os links
    const links = document.querySelectorAll('a');
    
    // Para cada link...
    links.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            // Se for link âncora (#) ou email, ignora
            if (href.startsWith('#') || href.startsWith('mailto')) return;
            
            // Previne a navegação imediata
            e.preventDefault();
            // Faz o corpo da página desaparecer suavemente
            document.body.style.opacity = 0;
            document.body.style.transition = 'opacity 0.5s ease';
            
            // Espera 0.5 segundos (tempo da animação) e então muda de página
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
});
