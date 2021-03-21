class GoodsItem{
    constructor(id, title, price,img ){
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }
    render(){
        return `<div class="goods-item">
                    <img class="goods-item__img" src="${this.img}" alt="${this.title}">
                    <div class="goods-item__text">
                        <h3 class="goods-item__title">${this.title}</h3>
                        <p class="good-item__price">Цена: ${this.price} руб.</p>
                    </div>
                    <div class="add-basket">
                        <button class="add-basket__button" data-id = ${this.id}>Добавить в корзину</button>
                        <input class="add-basket__column" type="number" value="1">
                    </div>
                    
                </div>`
    }
}

class GoodsList{
    constructor(){
        this.goods = [];
    }

    fetchGoods(){
        this.goods = [
            { id: 1, title: 'Shirt', price: 150, img: "/img/shirt.jpg" },
            { id: 2, title: 'Socks', price: 50, img: "/img/socks.jpg" },
            { id: 3, title: 'Jacket', price: 350, img: "/img/jacket.jpg" },
            { id: 4, title: 'Shoes', price: 250, img: "/img/shoes.jpg" },
        ];
    }

    sumPrice(){
        let sum = 0;
        this.goods.map(item => sum += item.price);
        return sum;
    }

    render() {
        let listHtml = '';
        this.goods.map(item => listHtml += new GoodsItem(item.id, item.title, item.price, item.img).render());
        document.querySelector('.goods-list').innerHTML = listHtml;
      }    
}

class Basket extends GoodsList{
    

    add(item){
        this.goods.push(item);
    }

    clear(){
        //TODO: Очистить корзину
    }

    payment(){
        //TODO: Отправить корзину на оплату
    }

    render() {
        //TODO:
    }
}

class BasketItem extends GoodsItem{
    constructor({id, title, price, img}, count){
        super(id, title, price, img);
        this.count = count;
    }

    drop(){
        //TODO: Удалить элемент их корзины
    }

    render(){
         //TODO:
    }

}

function addItemInBasket(e){
    const id = e.target.dataset.id;
    const count = e.target.nextElementSibling.value;
    list.goods.map(item => {
        if(item.id == id)
            basket.add(new BasketItem(item, count));
    });
    console.log(basket.goods);
}



const list = new GoodsList();
const basket = new Basket();
list.fetchGoods();
list.render();
console.log(list.sumPrice());
document.querySelectorAll('.add-basket__button').forEach(item => item.addEventListener('click',addItemInBasket));
