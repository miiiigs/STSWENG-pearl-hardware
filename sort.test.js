// controllers.test.js

// declare sortProducts function from controllers.js manually; the import cannot be done outside a module
async function sortProducts(product_list, sortValue) {
    if (sortValue !== undefined) {
        switch (sortValue) {
            case 'def':

                break;
            case 'price_asc':
                product_list.sort((a, b) => a.price - b.price);

                break;
            case 'price_desc':
                product_list.sort((a, b) => b.price - a.price);
                break;
            case 'name_asc':
                product_list.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                product_list.sort((a, b) => b.name.localeCompare(a.name));
                break;
			case 'stock_asc':
				product_list.sort((a, b) => a.quantity - b.quantity);
				break;
			case 'stock_desc':
				product_list.sort((a, b) => b.quantity - a.quantity);
				break;			
        }
    }
};

// Sample product list for testing sortProducts
const productList = [
  { name: 'Product A', price: 20, quantity: 10 },
  { name: 'Product B', price: 15, quantity: 5 },
  { name: 'Product C', price: 30, quantity: 20 }
];

// Test cases for sortProducts
describe('sortProducts function', () => {
    test('Sort by ascending price', () => {
      const sortedList = [...productList];
      sortProducts(sortedList, 'price_asc');
      expect(sortedList).toEqual([
        { name: 'Product B', price: 15, quantity: 5 },
        { name: 'Product A', price: 20, quantity: 10 },
        { name: 'Product C', price: 30, quantity: 20 }
      ]);
    });
  
    test('Sort by descending price', () => {
      const sortedList = [...productList];
      sortProducts(sortedList, 'price_desc');
      expect(sortedList).toEqual([
        { name: 'Product C', price: 30, quantity: 20 },
        { name: 'Product A', price: 20, quantity: 10 },
        { name: 'Product B', price: 15, quantity: 5 }
      ]);
    });
  
    test('Sort by ascending name', () => {
      const sortedList = [...productList];
      sortProducts(sortedList, 'name_asc');
      expect(sortedList).toEqual([
        { name: 'Product A', price: 20, quantity: 10 },
        { name: 'Product B', price: 15, quantity: 5 },
        { name: 'Product C', price: 30, quantity: 20 }
      ]);
    });
  
    test('Sort by descending name', () => {
      const sortedList = [...productList];
      sortProducts(sortedList, 'name_desc');
      expect(sortedList).toEqual([
        { name: 'Product C', price: 30, quantity: 20 },
        { name: 'Product B', price: 15, quantity: 5 },
        { name: 'Product A', price: 20, quantity: 10 }
      ]);
    });
  
    test('Sort by ascending stock', () => {
      const sortedList = [...productList];
      sortProducts(sortedList, 'stock_asc');
      expect(sortedList).toEqual([
        { name: 'Product B', price: 15, quantity: 5 },
        { name: 'Product A', price: 20, quantity: 10 },
        { name: 'Product C', price: 30, quantity: 20 }
      ]);
    });
  
    test('Sort by descending stock', () => {
      const sortedList = [...productList];
      sortProducts(sortedList, 'stock_desc');
      expect(sortedList).toEqual([
        { name: 'Product C', price: 30, quantity: 20 },
        { name: 'Product A', price: 20, quantity: 10 },
        { name: 'Product B', price: 15, quantity: 5 }
      ]);
    });
  });