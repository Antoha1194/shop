import "./css/style.scss";
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

    render(callback, search = '') {
        let listHtml = '';
        this.goods.forEach(item => {
            let {id, title, price, img} = item;
            if(title.includes(search) || search == ""){
                listHtml += new GoodsItem(id, title, price, img).render();
            }
            
            
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
        this.counter();


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
}

class BasketItem extends GoodsItem{
    constructor(id, title, price, img, count){
        super(id, title, price, img);
        this.count = count;
    }

    get sumPrice(){
        return this.price * this.count;
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


//VUE Components

Vue.component('basket', {
    data: function () {
      return {
        showList: false,

        
        
      }
    },
    template: ` <div>
                    <basket-list v-show="showList" ></basket-list>
                    <basket-btn @b="showList = !showList"></basket-btn>
                </div>
                `
  });


Vue.component('basket-item', {
    
    data: function () {
      return {
      }
    },
    props: ['shop'],
    template: `<div class="basket-item">
                    <img class="basket-item__img" :src=shop.img :alt=shop.title>
                    <h3 class="basket-item__title">{{shop.title}}</h3>
                        
                    <p class="basket-item__price">Цена: {{shop.price}} руб.</p>
                    <p class="basket-item__price">Сумма: {{shop.sumPrice}} руб.</p>  
                    <div class="drop-basket">
                        
                        <input class="drop-basket__column" type="number" v-model="shop.count" @change="$emit('editCount', shop)">
                        <button class="drop-basket__button" @click="$emit('dropItem', shop.id)">Удалить</button>
                    </div>
                    
                </div>`,
   
  });

Vue.component('basket-list', {
    data: function () {
      return {
        shops: basket.goods
      }
    },
    template: ` <div class="basket-list"  >
                    <basket-item v-for="shop in shops" :key="shop.id" v-bind:shop="shop" @dropItem="dropItem" @editCount="editCount"></basket-item>
                </div>`,
    methods: {
        dropItem(id){
            basket.drop(id);
            this.shops = basket.goods;
        },
        editCount(shop){
            basket.goods.map(item => {
                if(shop.id == item.id){
                    item.count = shop.count;
                }
            })
        }
    }
  });

  

Vue.component('basket-btn', {
    data: function () {
      return {
      }
    },
    template: `<button id="basketBtn" class="site-header__cart-button cart-button" v-on:click="$emit('b')" type="button">
                    <svg class="cart-button__icon" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="m504.399 185.065c-6.761-8.482-16.904-13.348-27.83-13.348h-98.604l-53.469-122.433c-3.315-7.591-12.157-11.06-19.749-7.743-7.592 3.315-11.059 12.158-7.743 19.75l48.225 110.427h-178.458l48.225-110.427c3.315-7.592-.151-16.434-7.743-19.75-7.591-3.317-16.434.15-19.749 7.743l-53.469 122.434h-98.604c-10.926 0-21.069 4.865-27.83 13.348-6.637 8.328-9.086 19.034-6.719 29.376l52.657 230c3.677 16.06 17.884 27.276 34.549 27.276h335.824c16.665 0 30.872-11.216 34.549-27.276l52.657-230.001c2.367-10.342-.082-21.048-6.719-29.376zm-80.487 256.652h-335.824c-2.547 0-4.778-1.67-5.305-3.972l-52.657-229.998c-.413-1.805.28-3.163.936-3.984.608-.764 1.985-2.045 4.369-2.045h85.503l-3.929 8.997c-3.315 7.592.151 16.434 7.743 19.75 1.954.854 3.99 1.258 5.995 1.258 5.782 0 11.292-3.363 13.754-9l9.173-21.003h204.662l9.173 21.003c2.462 5.638 7.972 9 13.754 9 2.004 0 4.041-.404 5.995-1.258 7.592-3.315 11.059-12.158 7.743-19.75l-3.929-8.997h85.503c2.384 0 3.761 1.281 4.369 2.045.655.822 1.349 2.18.936 3.983l-52.657 230c-.528 2.301-2.76 3.971-5.307 3.971z"/>
                        <path d="m166 266.717c-8.284 0-15 6.716-15 15v110c0 8.284 6.716 15 15 15s15-6.716 15-15v-110c0-8.284-6.715-15-15-15z"/><path d="m256 266.717c-8.284 0-15 6.716-15 15v110c0 8.284 6.716 15 15 15s15-6.716 15-15v-110c0-8.284-6.716-15-15-15z"/>
                        <path d="m346 266.717c-8.284 0-15 6.716-15 15v110c0 8.284 6.716 15 15 15s15-6.716 15-15v-110c-.001-8.284-6.716-15-15-15z"/></svg>
                    </svg>
                    <span class="count_product"></span>
                </button>`,
    methods: {
        say: function () {
            alert('message');

        }
    }
  });

Vue.component('search-product', {
data: function () {
    return {
        name: ''
    }
},
template: `<div class="search site-header__search">
                <input class="search__input" type="text" v-model="name" @change="search" placeholder="Название товара">
                <button class="search__button" type="button" @click="search()">Найти</button>
            </div>`,
methods: {
    search(){
        console.log(1);
        list.render(basket.add.bind(basket), this.name);
    }
}
})


let app = new Vue({
    el: '#app'
    
  });

 










