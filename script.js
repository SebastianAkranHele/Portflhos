/**
 * TVS - The Sister's Vision Services
 * Sistema de Modais para Fundadoras + Projetos
 * Versão 2.1 - Suporte a informações detalhadas nos modais
 */

document.addEventListener('DOMContentLoaded', function() {
    class FoundersModalSystem {
        constructor() {
            this.modals = document.querySelectorAll('.modal');
            this.initModals();
            this.initSwiper();
            this.setupEventDelegation();
        }

        initModals() {
            this.closeAllModals();
            console.log('Sistema de Modais inicializado');
        }

        setupEventDelegation() {
            document.addEventListener('click', (e) => {
                const founderCard = e.target.closest('.founder-card');
                const modalButton = e.target.closest('.btn-modal');
                const closeButton = e.target.closest('.close-modal');
                const modalBackground = e.target.classList.contains('modal');

                if (founderCard && !modalButton) {
                    e.preventDefault();
                    const founderId = founderCard.getAttribute('data-founder') || 
                                     founderCard.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
                    if (founderId) this.openModal(founderId);
                }

                if (modalButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    const founderCard = modalButton.closest('.founder-card');
                    const founderId = founderCard.getAttribute('data-founder') || 
                                     founderCard.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
                    if (founderId) this.openModal(founderId);
                }

                if (closeButton) {
                    e.preventDefault();
                    this.closeAllModals();
                }

                if (modalBackground) {
                    this.closeAllModals();
                }
            });

            // Fechar com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeAllModals();
            });

            // Clique nos itens da galeria (usando data-attributes)
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

        openModal(modalId) {
            const modal = document.getElementById(`${modalId}-modal`);
            if (!modal) {
                console.error(`Modal não encontrado: ${modalId}`);
                return;
            }

            this.closeAllModals();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            modal.setAttribute('aria-hidden', 'false');
            document.querySelector(`[aria-controls="${modalId}-modal"]`)?.setAttribute('aria-expanded', 'true');

            setTimeout(() => {
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) closeBtn.focus();
            }, 100);
        }

        closeAllModals() {
            this.modals.forEach(modal => {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            });
            document.body.style.overflow = '';
            
            document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
            });
        }

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

    new FoundersModalSystem();

    // Acessibilidade: foco com TAB
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Tab') {
            document.documentElement.classList.add('keyboard-focus');
        }
    });

    document.addEventListener('mousedown', function() {
        document.documentElement.classList.remove('keyboard-focus');
    });

    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Validação formulário contato
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const name = this.querySelector('#name');
            const email = this.querySelector('#email');
            const message = this.querySelector('#message');
            
            if (!name.value.trim()) {
                isValid = false;
                name.style.borderColor = 'red';
            } else {
                name.style.borderColor = '#ddd';
            }
            
            if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                isValid = false;
                email.style.borderColor = 'red';
            } else {
                email.style.borderColor = '#ddd';
            }
            
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

   const modal = document.getElementById("service-modal");
const closeBtn = document.querySelector(".close-btn");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalIcon = document.getElementById("modal-icon");

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

// Abre o modal quando clicar num card
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

// Funções globais
function openModal(modalId) {
    const modalSystem = new FoundersModalSystem();
    modalSystem.openModal(modalId);
}

function closeModal() {
    const modalSystem = new FoundersModalSystem();
    modalSystem.closeAllModals();
}

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open"); // anima o hambúrguer
  navLinks.classList.toggle("active"); // mostra/esconde menu
});


