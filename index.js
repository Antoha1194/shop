const goods = [
    {
        img: '/img/shirt.jpg', 
        title: 'Shirt', 
        price: 150 
    },
    { 
        img: '/img/socks.jpg',
        title: 'Socks',
        price: 50 
    },
    { 
        img: '/img/jacket.jpg',
        title: 'Jacket',
        price: 350 
    },
    { 
        img: '/img/shoes.jpg',
        title: 'Shoes', 
        price: 250 
    }
  ];
  
  const renderGoodsItem = (img ,title, price) => {
    return `<div class="goods-item">
                <img class="goods-item__img" src="${img}" alt="${title}">
                <div class="goods-item__text">
                    <h3 class="goods-item__title">${title}</h3>
                    <p class="good-item__price">Цена: ${price} руб.</p>
                </div>
            </div>`;
  };
  
  const renderGoodsList = (list) => {
    let goodsList = list.map(item => renderGoodsItem(item.img ,item.title, item.price));
    document.querySelector('.goods-list').innerHTML = goodsList.join('');
  }
  
  renderGoodsList(goods);