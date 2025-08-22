/**
 * TVS - The Sister's Vision Services
 * Sistema de Modais para Fundadoras + Projetos
 * Versão 2.1 - Suporte a informações detalhadas nos modais
 */

document.addEventListener('DOMContentLoaded', function() {

    // Classe para gerenciar modais e galeria
    class FoundersModalSystem {
        constructor() {
            this.modals = document.querySelectorAll('.modal');
            this.initModals();       // Inicializa os modais (fecha todos no início)
            this.initSwiper();       // Inicializa o Swiper se existir
            this.setupEventDelegation(); // Configura eventos para abrir/fechar modais
        }

        initModals() {
            this.closeAllModals();
            console.log('Sistema de Modais inicializado');
        }

        setupEventDelegation() {
            // Delegação de eventos para abrir/fechar modais
            document.addEventListener('click', (e) => {
                const founderCard = e.target.closest('.founder-card');
                const modalButton = e.target.closest('.btn-modal');
                const closeButton = e.target.closest('.close-modal');
                const modalBackground = e.target.classList.contains('modal');

                // Abrir modal ao clicar no card da fundadora
                if (founderCard && !modalButton) {
                    e.preventDefault();
                    const founderId = founderCard.getAttribute('data-founder') || 
                                     founderCard.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
                    if (founderId) this.openModal(founderId);
                }

                // Abrir modal ao clicar no botão do card
                if (modalButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    const founderCard = modalButton.closest('.founder-card');
                    const founderId = founderCard.getAttribute('data-founder') || 
                                     founderCard.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
                    if (founderId) this.openModal(founderId);
                }

                // Fechar modal ao clicar no botão X
                if (closeButton) {
                    e.preventDefault();
                    this.closeAllModals();
                }

                // Fechar modal ao clicar no fundo
                if (modalBackground) {
                    this.closeAllModals();
                }
            });

            // Fechar com tecla ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeAllModals();
            });

            // Clique nos itens da galeria para abrir modal de projeto
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('click', () => {
                    const imgSrc = item.dataset.img || item.querySelector('img').src;
                    const title = item.dataset.title || item.querySelector('h3').textContent;
                    const desc = item.dataset.desc || item.querySelector('p').textContent;
                    const details = item.dataset.details || "";

                    this.openProjectModal(imgSrc, title, desc, details);
                });
            });
        }

        // Abrir modal pelo ID
        openModal(modalId) {
            const modal = document.getElementById(`${modalId}-modal`);
            if (!modal) {
                console.error(`Modal não encontrado: ${modalId}`);
                return;
            }

            this.closeAllModals(); // Fecha outros modais antes
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Bloqueia scroll ao abrir modal

            modal.setAttribute('aria-hidden', 'false');
            document.querySelector(`[aria-controls="${modalId}-modal"]`)?.setAttribute('aria-expanded', 'true');

            // Foca no botão de fechar para acessibilidade
            setTimeout(() => {
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) closeBtn.focus();
            }, 100);
        }

        // Fecha todos os modais
        closeAllModals() {
            this.modals.forEach(modal => {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            });
            document.body.style.overflow = '';
            
            // Atualiza atributos ARIA dos botões
            document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
            });
        }

        // Modal para projetos (galeria)
        openProjectModal(imgSrc, title, desc, details = "") {
            const modal = document.getElementById('project-modal');
            if (!modal) return;

            document.getElementById('modal-project-img').src = imgSrc;
            document.getElementById('modal-project-img').alt = title;
            document.getElementById('modal-project-title').textContent = title;
            document.getElementById('modal-project-desc').textContent = desc;

            const detailsContainer = document.getElementById('modal-project-details');
            if (detailsContainer) {
                detailsContainer.innerHTML = details;
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Inicializa carrossel Swiper (se disponível)
        initSwiper() {
            if (typeof Swiper !== 'undefined') {
                new Swiper('.gallery-swiper', {
                    loop: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 30 },
                        1024: { slidesPerView: 3, spaceBetween: 40 },
                    }
                });
                console.log('Swiper inicializado com sucesso');
            } else {
                console.warn('Swiper não encontrado. Verifique se o script foi carregado.');
            }
        }
    }

    // Instancia o sistema de modais
    new FoundersModalSystem();

    // Acessibilidade: indica quando o usuário está usando teclado
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Tab') {
            document.documentElement.classList.add('keyboard-focus');
        }
    });
    document.addEventListener('mousedown', function() {
        document.documentElement.classList.remove('keyboard-focus');
    });

    // Scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Validação simples do formulário de contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const name = this.querySelector('#name');
            const email = this.querySelector('#email');
            const message = this.querySelector('#message');
            
            // Validação de nome
            if (!name.value.trim()) {
                isValid = false;
                name.style.borderColor = 'red';
            } else {
                name.style.borderColor = '#ddd';
            }
            
            // Validação de email
            if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                isValid = false;
                email.style.borderColor = 'red';
            } else {
                email.style.borderColor = '#ddd';
            }
            
            // Validação de mensagem
            if (!message.value.trim()) {
                isValid = false;
                message.style.borderColor = 'red';
            } else {
                message.style.borderColor = '#ddd';
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            }
        });
    }

    // Modal para serviços (abre ao clicar nos cards)
    const modal = document.getElementById("service-modal");
    const closeBtn = document.querySelector(".close-btn");
    const modalTitle = document.getElementById("modal-title");
    const modalText = document.getElementById("modal-text");
    const modalIcon = document.getElementById("modal-icon");

    // Dados dos serviços
    const servicesData = {
        catering: {
            title: "Catering Corporativo",
            text: "Serviços completos para eventos empresariais, com menus personalizados e padrões de excelência.",
            icon: "fas fa-utensils"
        },
        eventos: {
            title: "Eventos Especiais",
            text: "Casamentos, aniversários e celebrações com toque exclusivo e atenção aos detalhes.",
            icon: "fas fa-glass-cheers"
        },
        consultoria: {
            title: "Consultoria Gastronômica",
            text: "Desenvolvimento de conceitos, menus e operações para empreendimentos alimentícios.",
            icon: "fas fa-concierge-bell"
        }
    };

    // Abre o modal de serviços ao clicar no card
    document.querySelectorAll(".service-card").forEach(card => {
        card.addEventListener("click", () => {
            const service = card.getAttribute("data-service");
            modalTitle.innerText = servicesData[service].title;
            modalText.innerText = servicesData[service].text;
            modalIcon.className = servicesData[service].icon + " service-icon";
            modal.style.display = "flex";
        });
    });

    // Fecha ao clicar no X
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fecha ao clicar fora do modal
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

});

// Funções globais para abrir/fechar modais
function openModal(modalId) {
    const modalSystem = new FoundersModalSystem();
    modalSystem.openModal(modalId);
}

function closeModal() {
    const modalSystem = new FoundersModalSystem();
    modalSystem.closeAllModals();
}

// Controle do menu hambúrguer
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open"); // anima o ícone
    navLinks.classList.toggle("active"); // mostra/esconde menu
});

/* Email */
(function() {
    emailjs.init("9gcyy6iP8sB6lYb2f"); // <-- Tua Public Key
})();

window.onload = function() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // ✅ Validação básica
        if (!form.name.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
            showMessage("Preencha todos os campos obrigatórios!", "red");
            return;
        }

        // ✅ Botão e status de envio
        setLoading(true);
        showMessage("Enviando mensagem... ⏳", "blue");

        // ✅ Adiciona data/hora oculta
        const tempoInput = document.createElement("input");
        tempoInput.type = "hidden";
        tempoInput.name = "tempo";
        tempoInput.value = new Date().toLocaleString();
        form.appendChild(tempoInput);

        // ✅ Envia via EmailJS com um único template
        emailjs.sendForm('service_yyh7pwq', 'template_UNICO', form)
        .then(function() {
            showMessage("Mensagem enviada com sucesso! ✅", "green");
            form.reset();
        })
        .catch(function(error) {
            console.error("Erro:", error);
            showMessage("Erro ao enviar ❌, tente novamente.", "red");
        })
        .finally(function() {
            setLoading(false);
        });
    });

    // ✅ Funções auxiliares
    function showMessage(text, color) {
        statusMsg.textContent = text;
        statusMsg.style.color = color;
        setTimeout(() => statusMsg.textContent = "", 6000);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        }
    }
};
 
