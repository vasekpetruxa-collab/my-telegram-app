// Данные меню ресторана
const menuData = {
    restaurant: {
        name: "🍕 гастропаб 'БУНКЕР'",
        description: "Сочетание пиццы и бургеров"
    },
    
    categories: [
        {
            id: "pizza",
            name: " Пицца",
            description: "Настоящая итальянская пицца",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "rebra",
            name: " Ребра",
            description: "свиные ребра с гарниром",
            image: "images/assets/images/rebra/rebra free.jpg",
        },
        {
            id: "krilo",
            name: " Крылья",
            description: "куриные крылья с гарниром",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "zakus",
            name: " Холодные закуски",
            description: "закуски к пенному",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "zakus k pen",
            name: " Закуски",
            description: "закуски горячие",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "sup",
            name: " Супы",
            description: "супы на любой вкус",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "burgers",
            name: " Бургеры",
            description: "сочные, мощные бургеры",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "hot eat",
            name: " Горячие блюда",
            description: "вкуснейшие блюда",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "deserts",
            name: " Десерты",
            description: "десерты собственного приготовления",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "sets",
            name: " Сеты на компанию",
            description: "сеты к пенному",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "pasta", 
            name: " Паста",
            description: "Свежая паста ручной работы",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "salads",
            name: " Салаты",
            description: "Свежие салаты",
            image: "images/assets/images/pizza/margarita.jpeg",
        },
        {
            id: "drinks",
            name: " Напитки", 
            description: "Освежающие напитки",
            image: "images/assets/images/pizza/margarita.jpeg",
        }
    ],
    
    items: [
        // ПИЦЦА
        {
            id: 1,
            category: "pizza",
            name: "Римская Маргарита",
            description: "Томатный соус, моцарелла, базилик, черри, соус песто",
            price: 450,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "380г"
        },
        {
            id: 2,
            category: "pizza", 
            name: "Пепперони",
            description: "Томатный соус, моцарелла, базилик, пепперони",
            price: 520,
            image: "images/assets/images/pizza/pepperoni.jpg",
            weight: "460г"
        },
        {
            id: 3,
            category: "pizza",
            name: "4 Сыра", 
            description: "Сливочный соус, моцарелла, горгонзола, пармезан, гауда, фета",
            price: 660,
            image: "images/assets/images/pizza/4 cheeze.jpg",
            weight: "480г"
        },
        {
            id: 4,
            category: "pizza",
            name: "Римская Мясная",
            description: "Томатный соус, моцарелла, базилик, шея свиная, бекон, цыпленок",
            price: 620,
            image: "images/assets/images/pizza/dereven myas.jpg",
            weight: "400г"
        },
        {
            id: 5,
            category: "pizza",
            name: "Мясная",
            description: "Томатный соус, моцарелла, базилик, пепперони, шея свиная, бекон, цыпленок",
            price: 620,
            image: "images/assets/images/pizza/myasn.jpg",
            weight: "480г"
        },
        {
            id: 6,
            category: "pizza",
            name: "Ветчина и грибы",
            description: "Томатный соус, моцарелла, базилик, ветчина, грибы",
            price: 520,
            image: "images/assets/images/pizza/vetch i grib.jpg",
            weight: "480г"
        },
        // ПАСТА
        {
            id: 67,
            category: "pasta",
            name: "Паста Карбонара",
            description: "Паста, бекон, пармезан, яйцо, провансальские травы",
            price: 380,
            image: "images/assets/images/pasta/karbonara.jpg", 
            weight: "200г"
        },
        {
            id: 68,
            category: "pasta",
            name: "Паста Нэро",
            description: "мидии, кальмары, креветка тигровая, спагетти, сливки, пармезан",
            price: 680,
            image: "images/assets/images/pasta/nero.jpg", 
            weight: "280г"
        },
        // РЕБРА
        {
            id: 7,
            category: "rebra",
            name: "Ребра BBQ с луком фри",
            description: "свиные ребра с гарниром: лук фри, бекон, капуста тушеная, соус BBQ",
            price: 580,
            image: "images/assets/images/rebra/rebra free.jpg", 
            weight: "330г"
        },
        {
            id: 8,
            category: "rebra",
            name: "Ребра в соусе тейсти с кедровым орехом",
            description: "свиные ребра с гарниром: кедровый орех, капуста тушеная, соус тейсти",
            price: 620,
            image: "images/assets/images/rebra/rebra teysti.jpg", 
            weight: "330г"
        },
        {
            id: 9,
            category: "rebra",
            name: "Ребра сырные с фисташкой",
            description: "свиные ребра с гарниром: фисташки, сыр, капуста тушеная, соус сырный",
            price: 560,
            image: "images/assets/images/rebra/rebra cheeze.jpg", 
            weight: "330г"
        },
        //КРЫЛЬЯ
        {
            id: 10,
            category: "krilo",
            name: "Крылья BBQ с луком фри",
            description: "куриные крылья с гарниром: лук фри, коул слоу, соус BBQ",
            price: 520,
            image: "images/assets/images/krilo/bbq.jpg", 
            weight: "400г"
        },
        {
            id: 11,
            category: "krilo",
            name: "Крылья Том Ям с зеленью",
            description: "куриные крылья с гарниром: зелень, коул слоу, соус том ям",
            price: 480,
            image: "images/assets/images/krilo/tom yam.jpg", 
            weight: "400г"
        },
        {
            id: 12,
            category: "krilo",
            name: "Крылья по-шанхайски",
            description: "куриные крылья с гарниром: зелень, коул слоу, соус томатный",
            price: 480,
            image: "images/assets/images/krilo/shankh.jpg", 
            weight: "400г"
        },
        //ЗАКУСКИ
        {
            id: 13,
            category: "zakus",
            name: "Ассорти мясных деликатесов",
            description: "Сальчичон, пастрома куриная, грудинка свиная, суджук, гренки, соусы кетчуп и чесночный",
            price: 680,
            image: "images/assets/images/zakuski/as myaso.jpg", 
            weight: "280г"
        },
        {
            id: 14,
            category: "zakus",
            name: "Ассорти овощей",
            description: "огурцы, помидоры, перец болгарский, зелень",
            price: 540,
            image: "images/assets/images/zakuski/as vegetable.jpg", 
            weight: "350г"
        },
        {
            id: 15,
            category: "zakus",
            name: "Ассорти сала",
            description: "два вида сала, горчица, хрен, гренки",
            price: 460,
            image: "images/assets/images/zakuski/as salo.jpg", 
            weight: "260г"
        },
        {
            id: 16,
            category: "zakus",
            name: "Ассорти солений",
            description: "Бочковые разносолы: перец, огурец, капуста, томат, опята, кукуруза",
            price: 620,
            image: "images/assets/images/zakuski/as bochkov.jpg", 
            weight: "350г"
        },
        {
            id: 17,
            category: "zakus",
            name: "Ассорти сыров",
            description: "Пармезан, гауда, фета в кунжуте, горгонзола, конфитюр луковый и брусничный",
            price: 640,
            image: "images/assets/images/zakuski/as cheeze.jpg", 
            weight: "240г"
        },
        {
            id: 18,
            category: "zakus",
            name: "Ассорти фруктов",
            description: "Груша, яблоко, киви, банан, виноград, сливочный соус, цитрус",
            price: 520,
            image: "images/assets/images/zakuski/as fruit.jpg", 
            weight: "410г"
        },
        {
            id: 19,
            category: "zakus",
            name: "Лимон",
            description: "Нарезка лимона с сахаром",
            price: 100,
            image: "gift lemon.jpg", 
            weight: "100г"
        },
        {
            id: 20,
            category: "zakus",
            name: "Маслины",
            description: "Маслины с зеленью",
            price: 240,
            image: "images/assets/images/zakuski/maslin.jpg", 
            weight: "80г"
        },
        {
            id: 21,
            category: "zakus",
            name: "Оливки",
            description: "Оливки с зеленью",
            price: 230,
            image: "images/assets/images/zakuski/olivki.jpg", 
            weight: "80г"
        },
        {
            id: 22,
            category: "zakus",
            name: "Паштет куриный с конфитюром",
            description: "Паштет от шефа с конфитюром и багетом",
            price: 460,
            image: "images/assets/images/zakuski/pashtet.jpg", 
            weight: "210г"
        },
        {
            id: 23,
            category: "zakus",
            name: "Сельдь атлантическая",
            description: "Сельдь с маринованным луком и гренками",
            price: 360,
            image: "images/assets/images/zakuski/seld.jpg", 
            weight: "200г"
        },
        {
            id: 24,
            category: "zakus",
            name: "Суджук",
            description: "Колбаска к пенному",
            price: 280,
            image: "images/assets/images/zakuski/sudzh.jpg", 
            weight: "50г"
        },
        {
            id: 25,
            category: "zakus",
            name: "Фисташки",
            description: "Фисташки к пенному",
            price: 380,
            image: "images/assets/images/zakuski/fist.jpg", 
            weight: "80г"
        },
        // Закуски горячие
        {
            id: 26,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 27,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 28,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 29,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 30,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 31,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 32,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 33,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 34,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 35,
            category: "zakus k pen",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        // СУП
        {
            id: 36,
            category: "sup",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 37,
            category: "sup",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 38,
            category: "sup",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 39,
            category: "sup",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 40,
            category: "sup",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        // БУРГЕРЫ
        {
            id: 41,
            category: "burgers",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 42,
            category: "burgers",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 43,
            category: "burgers",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 44,
            category: "burgers",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        }, 
        // ГОРЯЧИЕ БЛЮДА
        {
            id: 45,
            category: "hot eat",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 46,
            category: "hot eat",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 47,
            category: "hot eat",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        // ДЕСЕРТЫ
        {
            id: 48,
            category: "deserts",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 49,
            category: "deserts",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 52,
            category: "deserts",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        //СЕТЫ
        {
            id: 50,
            category: "sets",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 51,
            category: "sets",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 53,
            category: "sets",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 54,
            category: "sets",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
            // САЛАТЫ
        {
            id: 55,
            category: "salads",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 56,
            category: "salads",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 57,
            category: "salads",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 58,
            category: "salads",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 59,
            category: "salads",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        {
            id: 60,
            category: "salads",
            name: "Цезарь",
            description: "Курица, салат, сухарики, соус цезарь",
            price: 320,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "280г"
        },
        
        // НАПИТКИ
        {
            id: 61, 
            category: "drinks",
            name: "Кола",
            description: "Coca-Cola 0.5л",
            price: 120,
            image: "images/assets/images/pizza/margarita.jpeg",
            volume: "500мл"
        },
        {
            id: 62, 
            category: "drinks",
            name: "Кола",
            description: "Coca-Cola 0.5л",
            price: 120,
            image: "images/assets/images/pizza/margarita.jpeg",
            volume: "500мл"
        },
        {
            id: 63, 
            category: "drinks",
            name: "Кола",
            description: "Coca-Cola 0.5л",
            price: 120,
            image: "images/assets/images/pizza/margarita.jpeg",
            volume: "500мл"
        },
        {
            id: 64, 
            category: "drinks",
            name: "Кола",
            description: "Coca-Cola 0.5л",
            price: 120,
            image: "images/assets/images/pizza/margarita.jpeg",
            volume: "500мл"
        },
        {
            id: 65, 
            category: "drinks",
            name: "Кола",
            description: "Coca-Cola 0.5л",
            price: 120,
            image: "images/assets/images/pizza/margarita.jpeg",
            volume: "500мл"
        },
        {
            id: 66, 
            category: "drinks",
            name: "Кола",
            description: "Coca-Cola 0.5л",
            price: 120,
            image: "images/assets/images/pizza/margarita.jpeg",
            volume: "500мл"
        },
    ]
};