class Product {

    constructor(name, price, year) {
        this.name = name,
        this.price = price,
        this.year = year
    }

}

class Model {

    constructor() {
        this.products = JSON.parse(localStorage.getItem('products'));
        if (!this.products || this.products.length < 1) {
            this.products = [
                {
                    id: 0,
                    name: 'Demo',
                    price: 5000,
                    year: 2008
                }
            ];
            this.currentId = 1;
        }else {
            this.currentId = this.products[this.products.length - 1].id + 1;
        }
    }

    save() {
        localStorage.setItem('products', JSON.stringify(this.products))
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        product.id = this.currentId++;
        this.products.push(product);

        this.save();
        return product;
    }

    deleteProduct(element) {
        if(element.name === 'delete') {
            const card = element.parentElement.parentElement;
            const id = parseInt(card.id, 10);

            const index = this.products.findIndex( (product) => product.id === id );
            const product = this.products[index];
            this.products.splice(index, 1);

            this.save();
            return product;
        }
    }
}

class UI {

    addProduct(product) {
        const productList = document.getElementById('product-list');
        const element = document.createElement('div');
        element.setAttribute('id', product.id)
        element.classList.add('card', 'text-center', 'mb-4');
        element.innerHTML = `
            <div class='card-body'>
                <strong>Producto: </strong> ${product.name}
                <strong>Precio: </strong> ${product.price}
                <strong>Año: </strong> ${product.year}
                <a href="#" class="btn btn-danger" name="delete">Eliminar</a>
            </div>
        `;

        productList.appendChild(element);
        this.resetForm();

        this.showMessage(`El producto ${product.name} ha sido creado exitosamente`, 'success');
    }

    loadProduct(product) {
        const productList = document.getElementById('product-list');
        const element = document.createElement('div');
        element.setAttribute('id', product.id)
        element.classList.add('card', 'text-center', 'mb-4');
        element.innerHTML = `
            <div class='card-body'>
                <strong>Producto: </strong> ${product.name}
                <strong>Precio: </strong> ${product.price}
                <strong>Año: </strong> ${product.year}
                <a href="#" class="btn btn-danger" name="delete">Eliminar</a>
            </div>
        `;

        productList.appendChild(element);
    }

    resetForm() {
        document.getElementById('product-form').reset();
    }

    deleteProduct(element, product) {
        if(element.name === 'delete') {
            const card = element.parentElement.parentElement;
            card.remove();
            this.showMessage(`El producto: ${product.name} ha sido eliminado exitosamente`, 'danger');
        }
    }

    showMessage(message, cssClass) {
        const div = document.createElement('div');
        div.classList.add(`alert`, `alert-${cssClass}`);
        div.appendChild(document.createTextNode(message))
        //Show in DOM
        const divApp = document.getElementById('app');
        divApp.insertAdjacentElement('afterbegin', div);

        setTimeout( () => {
            div.remove();
        }, 3000);
    }
}

//DOM EVENTS
const model = new Model();
const ui = new UI();
//Send Form
document.getElementById('product-form').addEventListener('submit', (e) => { submitForm(e) });

submitForm = (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const year = document.getElementById('year').value;

    const product = new Product(name, price, year);

    productSaved = model.addProduct(product);
    if(productSaved) {
        ui.addProduct(productSaved);
    }

}

//Delete Product
document.getElementById('product-list').addEventListener('click', (e) => { deleteProduct(e) });

deleteProduct = (e) => {
    productDeleted = model.deleteProduct(e.target)
    if (productDeleted) {
        ui.deleteProduct(e.target, productDeleted);
    }
}

//render
render = () => {
    const products = model.getProducts();
    products.forEach( (product) => {ui.loadProduct(product)} );
}

render();