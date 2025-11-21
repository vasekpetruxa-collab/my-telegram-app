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
            image: "images/assets/images/pizza/margarita.jpeg",
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
            description: "Томатный соус, моцарелла, пепперони",
            price: 550,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "500г"
        },
        {
            id: 3,
            category: "pizza",
            name: "4 Сыра", 
            description: "Моцарелла, горгонзола, пармезан, рикотта",
            price: 600,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "480г"
        },
        {
            id: 4,
            category: "pizza",
            name: "Римская Мясная",
            description: "Томатный соус, моцарелла, базилик",
            price: 450,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "450г"
        },
        {
            id: 5,
            category: "pizza",
            name: "СТАС",
            description: "Томатный соус, моцарелла, базилик",
            price: 450,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "450г"
        },
        {
            id: 6,
            category: "pizza",
            name: "СТАС",
            description: "Томатный соус, моцарелла, базилик",
            price: 450,
            image: "images/assets/images/pizza/margarita.jpeg",
            weight: "450г"
        },
        // ПАСТА
        {
            id: 67,
            category: "pasta",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 68,
            category: "pasta",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        // РЕБРА
        {
            id: 7,
            category: "rebra",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 8,
            category: "rebra",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 9,
            category: "rebra",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        //КРЫЛЬЯ
        {
            id: 10,
            category: "krilo",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 11,
            category: "krilo",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 12,
            category: "krilo",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        //ЗАКУСКИ
        {
            id: 13,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 14,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 15,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 16,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 17,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 18,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 19,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 20,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 21,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 22,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 23,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 24,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
        },
        {
            id: 25,
            category: "zakus",
            name: "Карбонара",
            description: "Спагетти, бекон, сыр, яйцо",
            price: 420,
            image: "images/assets/images/pizza/margarita.jpeg", 
            weight: "350г"
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