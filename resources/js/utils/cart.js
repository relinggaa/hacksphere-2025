export const CART_STORAGE_KEY = 'kai_cart_items';

export function getCartItems() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

export function saveCartItems(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addToCart(item) {
    const items = getCartItems();
    items.push({ ...item, _cartId: item._cartId || `${Date.now()}` });
    saveCartItems(items);
}

export function removeFromCart(cartId) {
    const items = getCartItems().filter(i => i._cartId !== cartId);
    saveCartItems(items);
}

export function clearCart() {
    saveCartItems([]);
}

