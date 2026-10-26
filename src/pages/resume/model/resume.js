(function () {
  'use strict';
  const d=window.PORTFOLIO_DATA;
  const main=document.getElementById('resume');
  main.innerHTML=`<header><p class="resume-kicker">Resumo profissional · outubro de 2026</p><h1>${d.owner.name}</h1><p class="resume-role">${d.owner.role}</p><p>${d.owner.location} · <a href="mailto:${d.owner.email}">${d.owner.email}</a></p><p class="resume-links">${d.social.filter(s=>s.name!=='Instagram').map(s=>`<a href="${s.url}">${s.name}: ${s.url.replace('https://','')}</a>`).join('<br>')}</p></header>
  <section><h2>Perfil</h2><p>${d.owner.bio}</p><p>Busco minha primeira oportunidade profissional em desenvolvimento para contribuir e aprender em equipe.</p></section>
  <section><h2>Competências técnicas</h2><dl>${Object.entries(d.skills).map(([key,items])=>`<div><dt>${d.skillCategories[key]}</dt><dd>${items.join(' · ')}</dd></div>`).join('')}</dl></section>
  <section><h2>Projetos selecionados</h2>${d.projects.filter(p=>p.featured).map(p=>`<article><h3>${p.title} <span>— ${p.status}</span></h3><p>${p.desc}</p><p>${p.tags.join(' · ')}</p><a href="${p.github}">${p.github.replace('https://','')}</a></article>`).join('')}</section>
  <section><h2>Experiência profissional</h2>${d.timeline.filter(t=>t.company.includes('Axtron')).map(t=>`<article><h3>${t.role} · ${t.company}</h3><p>${t.period}</p><p>${t.desc}</p></article>`).join('')}</section>
  <section><h2>Formação</h2>${d.education.map(e=>`<article><h3>${e.title}</h3><p>${e.school} · ${e.year}</p></article>`).join('')}</section>
  <section><h2>Idiomas</h2><p>${d.polyglot.languages.map(l=>l.name+': '+l.level).join(' · ')}</p></section>
  <footer>Conteúdo do portfólio atualizado em 26/10/2026. Formação e projetos em andamento estão identificados como tal.</footer>`;
  document.getElementById('print-resume').addEventListener('click',()=>window.print());
})();
