let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  /*Function that checks validation of pokemon that are trying to be added to 
  pokemonList array. If the pokemon passed to function clears validation it
  is added to the array.*/ 
  function add(pokemon){
    if (typeof pokemon === 'object' && "name" in pokemon){
      console.log('true');
      pokemonList.push(pokemon);
    }else {
      console.log(pokemon);
      alert('You have entered Invalid Information');
      console.log("error");
    }
  }
  
  /*Funtion that filters through pokemonList objects until a match is made
  between the object key name and the user entry. Function will return array
  with object that matches user input, otherwise it returns an empty array.*/
  function pokeTest (var1){
    return pokemonList.filter((nameCheck) => nameCheck.name.toLowerCase() === var1.toLowerCase());
  }

  /*Funtion that returns pokemonList*/ 
  function getAll(){
    return pokemonList;
  }

  function addListItem(pokemon){
    let pokemonList = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('button-class');
    listItem.appendChild(button);//append the button to the list item as its child
    pokemonList.appendChild(listItem);//append the list item to the unordered list as its child
    addClick(button, pokemon);
  }

  function addClick (button, pokemon){
    button.addEventListener('click', () => {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon){
    loadDetails(pokemon).then(function (){
      console.log(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,//sets name as key
          detailsUrl: item.url//set detailsUrl as key
        };
        add(pokemon);
      });
    }).catch(function (e) {
        console.error(e);
    })
  }

  function loadDetails(item){
    let url =item.detailsUrl;
    return fetch(url).then(function (response){
      return response.json();
    }).then(function (details){
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
    }).catch(function (e){
        console.error(e);
    });
  }

  return{
    add: add,
    getAll: getAll,
    pokeTest: pokeTest,
    addListItem: addListItem,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

pokemonRepository.loadList().then(function (){
  pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
  });
})





