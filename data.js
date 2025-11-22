// Данные меню ресторана
const menuData = {
    restaurant: {
        name: "🍕 гастропаб БУНКЕР",
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
            id: 73,
            category: "pasta",
            name: "Паста Карбонара",
            description: "Паста, бекон, пармезан, яйцо, провансальские травы",
            price: 380,
            image: "images/assets/images/pasta/karbonara.jpg", 
            weight: "200г"
        },
        {
            id: 74,
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
            image: "images/assets/images/zakuski/", 
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
            name: "Poutine, он же Путин",
            description: "Картофель фри, грудинка, моцарела, кетчуп, специи",
            price: 660,
            image: "images/assets/images/zakuski k pen/poutine.jpg",
            weight: "310г"
        },
        {
            id: 27,
            category: "zakus k pen",
            name: "Гренки Чеснокова",
            description: "Бородинский хлеб, чесночное масло, специи, зелень, соус чесночный",
            price: 240,
            image: "images/assets/images/zakuski k pen/grenki ches.jpg",
            weight: "180г"
        },
        {
            id: 28,
            category: "zakus k pen",
            name: "Гренки духовые с сыром",
            description: "Бородинский хлеб, моцарелла, специи, зелень",
            price: 260,
            image: "images/assets/images/zakuski k pen/grenki mazarela.jpg",
            weight: "180г"
        },
        {
            id: 29,
            category: "zakus k pen",
            name: "Кальмар Командор",
            description: "Филе кальмара, хрустящая панировка, соус спайси",
            price: 530,
            image: "images/assets/images/zakuski k pen/kalmar.jpg",
            weight: "190г"
        },
        {
            id: 30,
            category: "zakus k pen",
            name: "Картофель фри",
            description: "Картофель, специи, кетчуп",
            price: 220,
            image: "images/assets/images/zakuski k pen/free.jpg",
            weight: "190г"
        },
        {
            id: 31,
            category: "zakus k pen",
            name: "Креветки пивные вареные",
            description: "Креветки северные приготовленные в фирменом маринаде",
            price: 1080,
            image: "images/assets/images/zakuski k pen/krev piv.jpg",
            weight: "250г"
        },
        {
            id: 32,
            category: "zakus k pen",
            name: "Креветки пивные жареные",
            description: "Креветки северные обжаренные в специях",
            price: 1050,
            image: "images/assets/images/zakuski k pen/krev piv zhar.jpg",
            weight: "250г"
        },
        {
            id: 33,
            category: "zakus k pen",
            name: "Крокеты сырные",
            description: "Моцарела, гауда, пармезан с картофелем в фирменной панировке",
            price: 360,
            image: "images/assets/images/zakuski k pen/cheeze crock.jpg",
            weight: "210г"
        },
        {
            id: 34,
            category: "zakus k pen",
            name: "Мидии КИВИ",
            description: "Мидии зеленые в полустворках с сырным/острым соусом",
            price: 840,
            image: "images/assets/images/zakuski k pen/midii kivi.jpg",
            weight: "180г"
        },
        {
            id: 35,
            category: "zakus k pen",
            name: "Стрипсы куриные",
            description: "Куриное филе, панировка, соус терияки, специи",
            price: 280,
            image: "images/assets/images/zakuski k pen/chiken strips.jpg",
            weight: "230г"
        },
        // СУП
        {
            id: 36,
            category: "sup",
            name: "Крем-суп грибной",
            description: "Грибы, морковь, лук, картофель, специи, молочная пенка, сухарики",
            price: 380,
            image: "images/assets/images/sup/sup kapuch.jpg",
            weight: "280г"
        },
        {
            id: 37,
            category: "sup",
            name: "Крем-суп из зеленого горошка",
            description: "Зеленый горошек, тигровые креветки, зеленое масло, пармезан",
            price: 590,
            image: "images/assets/images/sup/goroh krev.jpg",
            weight: "300г"
        },
        {
            id: 38,
            category: "sup",
            name: "Лапша по-домашнему",
            description: "Куриный бульон, лапша, лук, морковь, яйцо пашот, специи, сухарики",
            price: 420,
            image: "images/assets/images/sup/lapsha.jpg",
            weight: "320г"
        },
        {
            id: 39,
            category: "sup",
            name: "Солянка с копченостями",
            description: "Бульон свино-говяжий, ассорти колбас, лук, морковь, маслины, лимон, сметана, зелень",
            price: 540,
            image: "images/assets/images/sup/solyanka.jpg",
            weight: "350г"
        },
        {
            id: 40,
            category: "sup",
            name: "Тайский супчик",
            description: "Бульон на кокосовом молоке, паста том ям, мидии, кальмар, креветки, томаты, рис, кунжут",
            price: 620,
            image: "images/assets/images/sup/tayskiy.jpg",
            weight: "320г"
        },
        // БУРГЕРЫ
        {
            id: 41,
            category: "burgers",
            name: "Дабл-килл",
            description: "Булочка, две говяжьи котлеты, лук, огурец, помидор, сыр чеддер, бекон, соус сырный, салат коул слоу",
            price: 950,
            image: "images/assets/images/burgers/dable kill.jpg",
            weight: "500г"
        },
        {
            id: 42,
            category: "burgers",
            name: "Классический американский",
            description: "Булочка, говяжья котлета, сыр гауда, соленый огурец, помидор, соус BBQ, коул слоу",
            price: 640,
            image: "images/assets/images/burgers/class americ.jpg",
            weight: "360г"
        },
        {
            id: 43,
            category: "burgers",
            name: "Сырное безумие",
            description: "Булочка, говяжья котлета, моцарелла, салат, огурец соленый, помидор, соус бургер, коул слоу",
            price: 720,
            image: "images/assets/images/burgers/cheeze meat.jpg",
            weight: "460г"
        },
        {
            id: 44,
            category: "burgers",
            name: "Чикен бекон",
            description: "Булочка, куриная котлета, бекон, салат, чеддер, помидор, лук, салат, коул слоу",
            price: 620,
            image: "images/assets/images/burgers/chiken becon.jpg",
            weight: "380г"
        }, 
        // ГОРЯЧИЕ БЛЮДА
        {
            id: 45,
            category: "hot eat",
            name: "Бефстроганов с пюре",
            description: "Вырезка говяжья, картофельное пюре, соус Строганов, соленый огурчик",
            price: 580,
            image: "images/assets/images/hot eat/stroganov.jpg",
            weight: "320г"
        },
        {
            id: 46,
            category: "hot eat",
            name: "Жареха с копченостями",
            description: "Картофель, грудика, лук, кабачок, перец болгарски, шампиньоны, специи, зелень",
            price: 640,
            image: "images/assets/images/hot eat/zhar kopch.jpg",
            weight: "380г"
        },
        
        {
            id: 47,
            category: "hot eat",
            name: "Жареха с курицей",
            description: "Картофель, куриное филе, лук, кабачок, перец болгарски, шампиньоны, специи, зелень",
            price: 590,
            image: "images/assets/images/hot eat/zhar kur.jpg",
            weight: "360г"
        },
        {
            id: 48,
            category: "hot eat",
            name: "Куриные шашлычки с овощами гриль",
            description: "Куриное филе, кабачок, перец болгарский, лук, томаты, соус терияки,",
            price: 550,
            image: "images/assets/images/hot eat/shashli.jpg",
            weight: "360г"
        },
        {
            id: 49,
            category: "hot eat",
            name: "Свинина, томленная в пиве с пшеничной кашей",
            description: "Каша пшеничная в сливочном соусе с пармезаном, свинина томленая в пиве, соус терияки, томаты, зелень",
            price: 620,
            image: "images/assets/images/hot eat/svin toml.jpg",
            weight: "320г"
        },
        {
            id: 50,
            category: "hot eat",
            name: "Стейк из лосося с фирменным рисом",
            description: "Филе лосося, рис, перец болгарский, морковь, кабачок, сливочный соус, кунжут",
            price: 890,
            image: "images/assets/images/hot eat/steyk fish.jpg",
            weight: "270г"
        },
        {
            id: 51,
            category: "hot eat",
            name: "Стейк из свиной шеи с овощами гриль",
            description: "Шея свиная, соус барбекю, соус чесночный, перец болгарский, кабачок, шампиньоны, специи, зелень",
            price: 680,
            image: "images/assets/images/hot eat/steyk pig.jpg",
            weight: "360г"
        },
        // ДЕСЕРТЫ
        {
            id: 52,
            category: "deserts",
            name: "Жареный шоколад",
            description: "Шоколадный бисквит, соус крем чиз, карамель, вафельная крошка",
            price: 320,
            image: "images/assets/images/deserts/choco.jpg",
            weight: "140г"
        },
        {
            id: 53,
            category: "deserts",
            name: "Ореховая Анна Павлова",
            description: "Безе с грецким орехом, сливочный соус, банан, яблоко, груша, киви",
            price: 360,
            image: "images/assets/images/deserts/anna pavlova.jpg",
            weight: "200г"
        },
        {
            id: 54,
            category: "deserts",
            name: "Чизкейк Лимонный",
            description: "Песочный корж с цитрусовым крем чиз",
            price: 340,
            image: "images/assets/images/deserts/limon cheeze.jpg",
            weight: "170г"
        },
        //СЕТЫ
        {
            id: 55,
            category: "sets",
            name: "В своей тарелке",
            description: "Мидии, кальмар, креветки, сырные наггетсы, соусы спайси, сырный, терияки, оливки, маслины",
            price: 1440,
            image: "images/assets/images/sets/v svoey tar.jpg",
            weight: "640г"
        },
        {
            id: 56,
            category: "sets",
            name: "Время экзекуции",
            description: "Колбаски гриль, шея свиная, крылья, ребра, соус барбекю, сальса, кетчуп",
            price: 1650,
            image: "images/assets/images/sets/vremya ekzik.jpg",
            weight: "690г"
        },
        {
            id: 57,
            category: "sets",
            name: "Трали-Вали",
            description: "Сырные крокеты, суджук, фисташки, мидии, гренки, пастрома куриная, сырный соус, медово-горчичный соус",
            price: 1290,
            image: "images/assets/images/sets/trali vali.jpg",
            weight: "560г"
        },
        {
            id: 58,
            category: "sets",
            name: "Эни-Бени",
            description: "Гренки, сырные крокеты, куриные стрипсы, картофель фри, суджук, кетчуп, соус чесночный",
            price: 740,
            image: "images/assets/images/sets/eni beni.jpg",
            weight: "460г"
        },
            // САЛАТЫ
        {
            id: 59,
            category: "salads",
            name: "Греческий",
            description: "Лист салата, перец болгарский, томаты, огурец, лук, фета, маслины, масло оливковое",
            price: 460,
            image: "images/assets/images/satads/grech.jpg",
            weight: "320г"
        },
        {
            id: 60,
            category: "salads",
            name: "Салат с кальмаром гриль и печеный перец",
            description: "Лист салата, перец болгарский, кальмар, багет, соус устричный, томатный сальса, пармезан",
            price: 690,
            image: "images/assets/images/satads/kalmar.jpg",
            weight: "220г"
        },
        {
            id: 61,
            category: "salads",
            name: "Салат с куриной печенью",
            description: "Лист салата, печень куриная, яблоко, мед, соевый соус, крем-бальзамик, соус песто, пармезан",
            price: 520,
            image: "images/assets/images/satads/chicken apple.jpg",
            weight: "220г"
        },
        {
            id: 62,
            category: "salads",
            name: "Салат с морепродуктами",
            description: "Лист салата, мидии, кальмар, креветки, томаты, перец болгарский, соус унаги, кукуруза",
            price: 780,
            image: "images/assets/images/satads/sea.jpg",
            weight: "240г"
        },
        {
            id: 63,
            category: "salads",
            name: "Салат с телячьей вырезкой",
            description: "Лист салата, вырезка говяжья, соус унаги, перец болгарский, кабачок, огурец, картофель, шампиньоны, кунжут, пармезан",
            price: 560,
            image: "images/assets/images/satads/beef.jpg",
            weight: "220г"
        },
        {
            id: 64,
            category: "salads",
            name: "Цезарь с креветкой",
            description: "Лист салата, креветки тигровые, соус цезарь, томаты, пармезан, сухарики",
            price: 520,
            image: "images/assets/images/satads/cez krev.jpg",
            weight: "180г"
        },
        {
            id: 65,
            category: "salads",
            name: "Цезарь с курицей",
            description: "Лист салата, филе куриное, соус цезарь, томаты, пармезан, сухарики",
            price: 420,
            image: "images/assets/images/satads/cez chick.jpg",
            weight: "180г"
        },
        {
            id: 66,
            category: "salads",
            name: "Цезарь с лососем",
            description: "Лист салата, лосось слабосоленый, соус цезарь, томаты, пармезан, сухарики",
            price: 520,
            image: "images/assets/images/satads/cez fish.jpg",
            weight: "170г"
        },
        
        // НАПИТКИ
        {
            id: 67, 
            category: "drinks",
            name: "Добрый cola",
            description:"",
            price: 200,
            image: "images/assets/images/pizza/",
            volume: "300мл"
        },
        {
            id: 68, 
            category: "drinks",
            name: "Добрый lemonLime",
            description: "",
            price: 200,
            image: "images/assets/images/pizza/",
            volume: "330мл"
        },
        {
            id: 69, 
            category: "drinks",
            name: "Tonik",
            description: "",
            price: 200,
            image: "images/assets/images/pizza/",
            volume: "330мл"
        },
        {
            id: 70, 
            category: "drinks",
            name: "Вода газ стекло",
            description: "",
            price: 170,
            image: "images/assets/images/pizza/",
            volume: "500мл"
        },
        {
            id: 71, 
            category: "drinks",
            name: "Вода не газ. стекло",
            description: "",
            price: 160,
            image: "images/assets/images/pizza/",
            volume: "500мл"
        },
        {
            id: 72, 
            category: "drinks",
            name: "Сок в ассортименте",
            description: "",
            price: 420,
            image: "images/assets/images/pizza/",
            volume: "920-1000мл"
        },
    ]
};