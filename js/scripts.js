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
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('button-class');
    listItem.appendChild(button);//append the button to the list item as its child
    pokemonList.appendChild(listItem);//append the list item to the unordered list as its child
    addClick(button, pokemon);
  }

  /*Function adds a click listener event for each pokemon button and calls the
  showDetails() fuction and sends the pokemon object as a parameter.*/
  function addClick (button, pokemon){
    button.addEventListener('click', () => {
      showDetails(pokemon);
    })
  }

  /*Function loads the details from the individual pokemon object and send 
  the object to the showModal() function.*/
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
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.types = details.types;
    }).catch(function (e){
        console.error(e);
    });
  }

  /*Function creates modal for each individual pokemon when user clicks on individual pokemon button.*/
  function showModal(pokemon){
    modalContainer.innerHTML = '';//Clear all exsisting modal content.

    /*Creates modal.*/
    let modal = document.createElement('div');
    modal.classList.add('modal');

    /*Creates close button inside of modal.*/
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    /*Creates title element for pokemon name inside of modal.*/
    let titleElement = document.createElement('h1');
    let pokeName = pokemon.name;
    titleElement.innerText = 'Pokemon Name: ' + pokeName;

    /*Creates height element for pokemon inside of modal.*/
    let contentElement = document.createElement('p');
    let pokeHeight = pokemon.height;
    contentElement.innerText = 'Pokemon Height: ' + pokeHeight + ' (meters)';

    /*Creates types element for pokemon and checks to see if more than 1 type is present.*/
    let typeElement = document.createElement('p');
    let pokeTypes = pokemon.types;
    let pokeTypesList = pokemon.types[0].type.name;
    for(let i = 1; i < pokeTypes.length; i++){
      let secondType = pokeTypes[i].type.name;
      pokeTypesList += ', ' + secondType;
    }
    let formatType = pokeTypes.length < 2 ? "Type: " : "Types: ";
    typeElement.innerText = formatType + pokeTypesList;

    /*Creates image element for pokemon inside of the modal.*/
    let imageElement = document.createElement('img');
    imageElement.classList.add('modal-image');
    let pokeImage = pokemon.imageUrl;
    imageElement.src = pokeImage;

    /*Adds all the elements to the modal then adds modal to modal-container in the index.html file.*/
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modal.appendChild(typeElement);
    modal.appendChild(imageElement);
    modalContainer.appendChild(modal);
  
    modalContainer.classList.add('is-visible');
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
    modalContainer.innerHTML = '';
    let modal = document.createElement('div');
    modal.classList.add('modal');

    let searchQuestion = document.createElement('h1');
    searchQuestion.innerText = 'Type Pokemon Name In Search Bar: ';

    let userInput = document.createElement('input');
    userInput.classList.add('.input');

    let confirmButton = document.createElement('button');
    confirmButton.classList.add('modal-confirm');
    confirmButton.innerText = 'Confirm';

    let cancelButton = document.createElement('button');
    cancelButton.classList.add('modal-cancel');
    cancelButton.innerText = 'Cancel';

    modal.appendChild(searchQuestion);
    modal.appendChild(userInput);
    modal.appendChild(confirmButton);
    modal.appendChild(cancelButton);
    modalContainer.appendChild(modal);
    modalContainer.classList.add('is-visible');
    confirmButton.focus();//Focus the confirmButton so that the user can simply press Enter.

    return new Promise((resolve, reject) => {
      cancelButton.addEventListener('click', hideModal);
      confirmButton.addEventListener('click', () => {
        let pokeCheck = pokeTest(userInput.value);
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
    let modal = document.querySelector('h1')
    let searchButton = document.createElement('button');
    searchButton.classList.add('h1-button');
    searchButton.innerText = "Search";
    modal.appendChild(searchButton);
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
    showDetails: showDetails,
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
