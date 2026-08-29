let activeProduct = { title: '', price: '', img: '' };

// Live Search Filter
function filterProductsBySearch() {
  const searchInput = document.getElementById('product-search-input').value.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  productCards.forEach(card => {
    const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
    const description = card.querySelector('p')?.innerText.toLowerCase() || '';

    if (title.includes(searchInput) || description.includes(searchInput)) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const noResultsMsg = document.getElementById('no-results-msg');
  if (visibleCount === 0) {
    noResultsMsg.classList.remove('hidden');
  } else {
    noResultsMsg.classList.add('hidden');
  }
}

// Category Filter Tabs
function filterCategory(category, evt) {
  const searchInput = document.getElementById('p
