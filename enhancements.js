
// enhancements.js - performance & accessibility helpers
document.addEventListener('DOMContentLoaded', function() {
  // Add meta improvements: ensure images decode async and lazy-load where possible
  function enhanceImg(img) {
    try {
      if (!img.getAttribute('loading')) img.setAttribute('loading','lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding','async');
      if (!img.getAttribute('alt')) {
        var src = img.getAttribute('src') || img.getAttribute('data-src') || '';
        var name = src.split('/').pop().split('?')[0].replace(/[-_0-9]+/g,' ').split('.')[0];
        img.setAttribute('alt', name || 'image');
      }
    } catch(e){}
  }

  // enhance existing images
  document.querySelectorAll('img').forEach(enhanceImg);

  // observe for dynamically added images (from app.js)
  var mo = new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      m.addedNodes.forEach(function(node){
        if (node.nodeType===1) {
          if (node.tagName==='IMG') enhanceImg(node);
          node.querySelectorAll && node.querySelectorAll('img').forEach(enhanceImg);
        }
      });
    });
  });
  mo.observe(document.body, {childList:true, subtree:true});

  // lazy-load background images for elements with data-bg attribute
  const bgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const src = el.getAttribute('data-bg');
        if (src) {
          el.style.backgroundImage = 'url('+src+')';
          el.removeAttribute('data-bg');
        }
        obs.unobserve(el);
      }
    });
  }, {rootMargin: '200px'});
  document.querySelectorAll('[data-bg]').forEach(el => bgObserver.observe(el));

  // Accessibility: ensure focus outlines for keyboard users
  document.body.classList.add('js-enabled');

  // Simple performance hint: defer non-critical scripts already handled via type=module and defer by browsers
});
