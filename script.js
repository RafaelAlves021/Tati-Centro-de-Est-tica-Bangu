/* ===== CONFIGURAÇÃO (edite aqui) ===== */
const CONFIG = {
  telefone: '5521965275464',
  telefoneExibicao: '(21) 96527-5464',
  instagram: 'https://www.instagram.com/taticentrodeesteticarj/',
  facebook: 'https://www.facebook.com/tatiesteticafacial/',
  avaliacoesGoogle: 'https://www.google.com/maps/search/?api=1&query=Tati+Centro+de+Est%C3%A9tica+Bangu',
  endereco: 'Rua 12 de Fevereiro, 357, Bangu, Rio de Janeiro',
  // Horários: só a terça é confirmada. Complete os demais quando souber.
  horarios: [
    { dia: 'Terça-feira', hora: 'a partir das 08:00' }
  ],
  chamadaHorarios: 'Consulte os demais horários pelo WhatsApp',
  mensagemPadrao: 'Olá! Gostaria de agendar uma avaliação.'
};

const waLink = t => `https://wa.me/${CONFIG.telefone}?text=${encodeURIComponent(t)}`;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Links do WhatsApp (com mensagem do serviço, se houver) */
$$('[data-wa]').forEach(a => {
  const s = a.dataset.s;
  a.href = waLink(s ? `Olá! Tenho interesse em ${s}. Pode me passar mais informações?` : CONFIG.mensagemPadrao);
  a.target = '_blank'; a.rel = 'noopener';
});
$$('[data-tel]').forEach(a => a.href = 'tel:+' + CONFIG.telefone);
const links = { instagram: CONFIG.instagram, facebook: CONFIG.facebook, reviews: CONFIG.avaliacoesGoogle };
$$('[data-key]').forEach(a => a.href = links[a.dataset.key]);
$('#rota').href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(CONFIG.endereco);

/* Horários */
$('#horarios').innerHTML = CONFIG.horarios.map(h => `<li><strong>${h.dia}:</strong> ${h.hora}</li>`).join('') +
  `<li class="mt-2"><a class="gold" href="${waLink(CONFIG.mensagemPadrao)}" target="_blank" rel="noopener">${CONFIG.chamadaHorarios}</a></li>`;

/* Ano dinâmico */
$('#ano').textContent = new Date().getFullYear();

/* Navbar e botão voltar ao topo */
const nav = $('#navbar'), topBtn = $('#toTop');
const onScroll = () => {
  nav.classList.toggle('scrolled', scrollY > 40);
  topBtn.classList.toggle('show', scrollY > 600);
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* Scroll suave com offset da navbar */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const alvo = $(id); if (!alvo) return;
  e.preventDefault();
  scrollTo({ top: alvo.getBoundingClientRect().top + scrollY - nav.offsetHeight + 1, behavior: 'smooth' });
  const m = $('#menu'); if (m.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(m).hide();
}));

/* Reveal on scroll + contadores */
const contar = el => {
  const fim = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, t0 = performance.now();
  const passo = t => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = (fim * p).toFixed(dec).replace('.', ',');
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  $$('[data-count]', e.target).forEach(contar);
  io.unobserve(e.target);
}), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* Luz que acompanha o mouse nos cards */
$$('.glass').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

/* Formulário -> WhatsApp */
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const nome = $('#nome'), serv = $('#servico');
  [nome, serv].forEach(c => c.classList.toggle('is-invalid', !c.value.trim()));
  if (!nome.value.trim() || !serv.value) return;
  const data = $('#data').value.trim(), msg = $('#msg').value.trim();
  const texto = `Olá! Meu nome é ${nome.value.trim()}.\nServiço de interesse: ${serv.value}.` +
    (data ? `\nData/horário preferido: ${data}.` : '') + (msg ? `\nMensagem: ${msg}` : '');
  open(waLink(texto), '_blank', 'noopener');
});