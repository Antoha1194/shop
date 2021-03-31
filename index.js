
const  API = {
    baseURL: "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses",
    getCatalog: "/catalogData.json",
    getBasket: "/getBasket.json",
    addToBasket: "/addToBasket.json",
    deleteFromBasket: "/deleteFromBasket.json"
}



class GoodsItem{
    constructor(id, title, price,img = '/img/image.jpg' ){
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

    fetchGoods(url = '/', options = {}){
        

        return fetch(url, options).then(response => response.json());
    }

    render(callback) {
        let listHtml = '';
        this.goods.forEach(item => {
            let {id, title, price, img} = item;
            listHtml += new GoodsItem(id, title, price, img).render();
        })
        document.querySelector('.goods-list').innerHTML = listHtml;

        document.querySelectorAll('.add-basket__button').forEach($item => {
            
            $item.onclick = (e) => {
                const id_card = e.target.dataset.id;
                const count = e.target.nextElementSibling.value;
                list.goods.forEach(item => {
                    let {id, title, price } = item;
                    if(id == id_card)
                        callback(new BasketItem(id, title, price, '/img/image.jpg', count));
                        
                });
            }
            
        });

        
      }    
}



class Basket extends GoodsList{
    

    get sumPrice(){
        let i = 0;
        this.goods.forEach(item => {
            console.log(item);    
            i+= item.sumPrice
        });
        return i;
    }

    get coutProduct(){
        let i = 0;
        this.goods.forEach(item => {
            console.log(item);    
            i+= +item.count;
        });
        return i;
    }

    counter(){
        let $count = document.querySelector(".count_product")

        if(this.coutProduct > 0){
            $count.innerHTML = this.coutProduct;
            $count.style.display = "flex";
        }else{
            $count.style.display = "none";
        }
    }

    drop(id){
        this.goods = this.goods.filter(item => !(id == item.id));


    }

    add(item){
        this.goods.push(item);
        this.counter();
        //API не использовал потому что CORS не пускает
        // return fetch(API.baseURL + API.addToBasket, {
        //     method: "POST",
        //     headers:{
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(item)
        // }).then(response => response.json());
    }

    clear(){
        this.goods = [];
    }

    payment(){
        //TODO: Отправить корзину на оплату
    }

    render() {
        let listHtml = '';
        let $basket = document.querySelector('.basket-list')
        this.goods.forEach(item => {
            let {id, title, price, img, count } = item;
            listHtml += new BasketItem(id, title, price, img, count).render();
        })

        $basket.innerHTML = "";
        $basket.innerHTML = listHtml + `<h2>Стоимость покупки: ${this.sumPrice} </h2>`;

        document.querySelectorAll(".drop-basket__column").forEach($item => {
            $item.oninput = (e) => {
                const id_card = e.target.dataset.id;
                const count = e.target.value;
                this.goods.forEach(item => {
                    if(item.id == id_card)
                        item.count = count
                });
                this.render();
                this.counter();
            };
            
        })


        document.querySelectorAll(".drop-basket__button").forEach($item => {
            $item.onclick = (e) => {
                const id = e.target.dataset.id;
                this.drop(id);
                this.counter();
                this.render();
            };
        })

        
        
        
    }
}

class BasketItem extends GoodsItem{
    constructor(id, title, price, img, count){
        super(id, title, price, img);
        this.count = count;
    }

    get sumPrice(){
        return this.price * this.count;
    }
        

    render(){
        return `<div class="basket-item">
                    <img class="basket-item__img" src="${this.img}" alt="${this.title}">
                    <h3 class="basket-item__title">${this.title}</h3>
                        
                    <p class="basket-item__price">Цена: ${this.price} руб.</p>
                    <p class="basket-item__price">Сумма: ${this.sumPrice} руб.</p>  
                    <div class="drop-basket">
                        
                        <input class="drop-basket__column" type="number" data-id = ${this.id} value="${this.count}">
                        <button class="drop-basket__button" data-id = ${this.id}>Удалить</button>
                    </div>
                    
                </div>`
    }

}



const list = new GoodsList();
const basket = new Basket();

list.fetchGoods(API.baseURL + API.getCatalog).then(data => {

    data.forEach(item => {
        let {id_product, product_name, price } = item;
        list.goods.push(new GoodsItem(id_product, product_name, price));
    });

    list.render(basket.add.bind(basket));
})


basket.fetchGoods(API.baseURL + API.getBasket).then(data => {

    data.contents.forEach(item => {
        let {id_product, product_name, price } = item;
        //basket.goods.push(new BasketItem(id_product, product_name, price));
        console.log(basket.goods);
        
    })
    
    
})

document.querySelector("#basketBtn").addEventListener('click', basket.render.bind(basket));
document.querySelector("#basketBtn").addEventListener('click', () => {
    document.querySelector(".basket-list").classList.toggle('hidden')
});










