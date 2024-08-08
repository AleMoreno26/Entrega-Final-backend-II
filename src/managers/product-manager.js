import fs from 'fs/promises';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading products file:', error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) throw new Error('Product not found');
        products[index] = { ...products[index], ...updatedProduct };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter(product => product.id !== id);
        await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
    }
}
