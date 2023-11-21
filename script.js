class Coin {
    constructor(uuid, rank, iconUrl, name, price, change, marketCap){
        this.uuid = "id-" + uuid;  
        this.rank = rank;           
        this.iconUrl = iconUrl;    
        this.name = name;         
        this.price = price;
        this.change = change;
        this.marketCap = marketCap;
    }

    getUuid(){
        return this.uuid.slice(3, this.uuid.length);  // Zwraca unikalny identyfikator bez "id-"
    }

    getFormattedMarketCap(){
        return parseFloat(this.marketCap).toLocaleString("en-US", {style:"currency", currency:"USD"});  // Formatuje kapitalizację rynkową jako wartość walutową
    }

    getFormattedPrice(){
        return parseFloat(this.price).toLocaleString("en-US", {style:"currency", currency:"USD"});  // Formatuje cenę jako wartość walutową
    }

    getColorClass(){
        if(parseFloat(this.change) > 0){
            return "greenText";  // Zwraca klasę stylu zielonego tekstu dla dodatniej zmiany ceny
        } else if(parseFloat(this.change) < 0){
            return "redText";    // Zwraca klasę stylu czerwonego tekstu dla ujemnej zmiany ceny
        } else{
            return "";           // Zwraca pustą klasę dla braku zmiany ceny
        }
    }
}

async function fetchData() {
    const url = 'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd0f8a4203cmshc1958e7fde9620fp192f92jsn870f96664053',
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        displayData(result);
    } catch (error) {
        console.error(error);
    }
}

fetchData();

/*let listOfFav = new Array();

// Operacje na localStorage
/*localStorage.setItem("name", "John");
console.log(localStorage.getItem("name"));
localStorage.clear();
localStorage.name = "Paul";
console.log(localStorage.name);

const listOfNames = ["Maria", "John", "Paul", "Peter", "Greta"];
localStorage.names = JSON.stringify(listOfNames);
const newListOfNames = JSON.parse(localStorage.names)
console.log(newListOfNames[3]);*/

function displayData(result){
    const coinsDataElement = document.getElementById("coinsData");
    // Przetwarzanie i wyświetlanie danych
    JSON.parse(result).data.coins.forEach(coin => {
        const myCoin = new Coin(coin.uuid, coin.rank, coin.iconUrl, coin.name, coin.price, coin.change, coin.marketCap);

        coinsDataElement.innerHTML += `
            <tr>
                <td><i id="${myCoin.uuid}" onclick="addToFav(this.id)" class="fa-regular fa-star"</i></td>
                <td>${coin.rank}</td>
                <td><img width="25px" src="${coin.iconUrl}">${coin.name}</td>
                <td class=${myCoin.getColorClass()}>${myCoin.getFormattedPrice()}</td>
                <td class=${myCoin.getColorClass()}>${coin.change}</td>
                <td>${myCoin.getFormattedMarketCap()}</td>
                <td>${myCoin.getUuid()}</td>
            </tr>
        `;
    });
    displayFav();
}

function displayFav(){
    if(localStorage.favList){
        // Wyświetlanie ulubionych na podstawie danych z localStorage
        JSON.parse(localStorage.favList).forEach(id => {
            document.getElementById(id).classList = "fa-regular fa-star goldText";
        }) 
        listOfFav = JSON.parse(localStorage.favList);

    }
}

function addToFav(id){
    const isIdInFav = listOfFav.includes(id);

    if(isIdInFav){
        const indexToDelete = listOfFav.indexOf(id);
        listOfFav.splice(indexToDelete, 1);
        document.getElementById(id).classList = "fa-regular fa-star";
    }
    else{
        listOfFav.push(id);
        document.getElementById(id).classList = "fa-regular fa-star goldText";
    }

    localStorage.favList = JSON.stringify(listOfFav);

    /*if(listOfFav.includes(id)){
        let index = listOfFav.indexOf(id);
        listOfFav.splice();
    }else{
        listOfFav.push(id);
    }

    console.log(listOfFav);*/
}
