window.onload = function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const query = urlSearchParams.get('sortBy');
    const selectedOption = document.querySelector(`#sort option[value="${query}"]`);
    selectedOption.selected = true;
  };

const sortSelect = document.querySelector('#sort');
sortSelect.addEventListener('change', async (e) => {
    e.preventDefault();
    var sortValue = sortSelect.value;
    const response = await fetch('/allProducts?sortBy=' + sortValue, {
        method: 'GET',
    });
    

    window.location.href = '/allProducts?sortBy=' + sortValue;

    
});