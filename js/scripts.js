let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let modalContainer = document.querySelector('#modal-container');
  let dialogPromiseReject;
  searchPokemon();

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

  /*Function adds button for list item of each pokemon object, and sends the
  button and the pokemon object to the addClick() function.*/
  function addListItem(pokemon){
    let pokemonList = document.querySelector('.pokemon-list');

    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item','modal-background');
    //listItem.classList.add('col-3');

    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('btn','button-class');
    
    
    /* Adds the data toggle and data target to trigger the modal.*/
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modal-container');

    listItem.appendChild(button);//append the button to the list item as its child
    pokemonList.appendChild(listItem);//append the list item to the unordered list as its child

    button.addEventListener('click', () => {
      showDetails(pokemon);
    });
  }
  
  function showDetails(pokemon){
    loadDetails(pokemon).then(function (){
      showModal(pokemon);
      console.log(pokemon);
    });
  }

  /*Function loads API data for each pokemon object into pokemonList array.*/
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

  /*Function sets keywords to use for each individual pokemon that are passed into function.*/
  function loadDetails(pokemon){
    let url =pokemon.detailsUrl;
    return fetch(url).then(function (response){
      return response.json();
    }).then(function (details){
        pokemon.imageUrlFront = details.sprites.front_default;
        pokemon.imageUrlBack = details.sprites.back_default;
        pokemon.height = details.height;
        pokemon.weight = details.weight;
        pokemon.types = [];
        details.types.forEach(element => {
          pokemon.types.push(element.type.name);
        })
        pokemon.abilities = [];
        details.abilities.forEach(element => {
          pokemon.abilities.push(element.ability.name);
        })
    }).catch(function (e){
        console.error(e);
    });
  }

  /*Function creates modal for each individual pokemon when user clicks on individual pokemon button.*/
  function showModal(pokemon){
    let modalTitle = $('.modal-title');
    let modalBody = $('.modal-body');
    let modalFooter = $('.modal-footer');

    modalTitle.empty();
    modalBody.empty();
    modalFooter.empty();

    let nameElement = $(`<h1>${pokemon.name}</h1>`);

    let imageElementFront = $('<img class="modal-image" style="width:50%">');
    imageElementFront.attr('src', pokemon.imageUrlFront);

    let imageElementBack = $('<img class="modal-image" style="width:50%">');
    imageElementBack.attr('src', pokemon.imageUrlBack);

    let heightElement = $(`<p><br>Height: ${pokemon.height}</p><br>`);

    let weightElement = $(`<p>Weight: ${pokemon.weight}</p><br>`);

    let typeElement = $(`<p>Types: ${pokemon.types}</p><br>`);

    let abilitiesElement = $(`<p>Abilities: ${pokemon.abilities}</p>`);

    modalTitle.append(nameElement);
    modalBody.append(imageElementFront);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(weightElement);
    modalBody.append(typeElement);
    modalBody.append(abilitiesElement);
  }
  
  /*This function removes is-visible class making the modal disapear.*/
  function hideModal(){
    modalContainer.classList.remove('is-visible');

    if(dialogPromiseReject){
      //dialogPromiseReject();
      dialogPromiseReject = null;
    }
  }
  
  /*Function that shows a input dialog that ask for the pokemon
  name that user is searching for.*/
  function showDialog(){
    let modalTitle = $('.modal-title');
    let modalBody = $('.modal-body');
    let modalFooter = $('.modal-footer');

    modalTitle.empty();
    modalBody.empty();
    modalFooter.empty();  

    let searchQuestion = $(`<h1>Type Pokemon Name In Search Bar: </h1>`);

    let userInput = $('<input type="text" class="form-control">');

    let confirmButton = $('<button>Confirm</button>');

    modalTitle.append(searchQuestion);
    modalBody.append(userInput);
    modalFooter.append(confirmButton);
    confirmButton.focus();//Focus the confirmButton so that the user can simply press Enter.

    return new Promise((resolve, reject) => {
      confirmButton.on('click', () => {
        let pokeCheck = pokeTest(userInput.val());
        if(pokeCheck.length === 0){
          console.log('error');
          alert('You Have Entered Invalid Information!');
        }else {
          showDetails(pokeCheck[0]);
        }
        hideModal();
        resolve();
      });
      dialogPromiseReject = reject;
    });
  }

  /*Function that puts a search button in the h1 element that
  opens the showDialog() modal when pressed.*/
  function searchPokemon () {
    let searchButton = document.querySelector('#searchButton');
    //let searchButton = document.createElement('button');
    //searchButton.classList.add('h1-button');
    //searchButton.innerText = "Search";

    /* Adds the data toggle and data target to trigger the modal.*/
    searchButton.setAttribute('data-toggle', 'modal');
    searchButton.setAttribute('data-target', '#modal-container');

    //modal.appendChild(searchButton);
    searchButton.addEventListener('click', () => {
      showDialog();
    });
  }

  /*Calls the hideModal() function to remove modal if user pushers Escape on keyboard.*/
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();  
    }
  });
  
  /*Calls the hideModal() fuction to remove modal if user clicks mouse outside of modal.
  Designed to only remove modal if pointer is clicked directly on modal-container overlay
  and not inside the modal itself.*/
  modalContainer.addEventListener('click', (e) => {
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

  return{
    add: add,
    getAll: getAll,
    pokeTest: pokeTest,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    searchPokemon: searchPokemon
  };
})();

pokemonRepository.loadList().then(function (){
  pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
  });
});
