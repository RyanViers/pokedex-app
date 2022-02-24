let pokemonRepository = (function () {
  let pokemonList = [
    {name: 'Bulbasaur', height: 0.7, type: ['grass','poison']},
    {name: 'Charmander', height: 0.6, type: 'fire'},
    {name: 'Squirtle', height: 0.5, type: 'water'}
  ];

  /*Function that checks validation of pokemon that are trying to be added to 
  pokemonList array. If the pokemon passed to function clears validation it
  is added to the array.*/ 
  function add(pokemon){

    let obj1 = Object.keys(pokemon);
    let obj2 = Object.keys(pokemonList[0]);

    /*Function that checks validation for pokemon added to pokemonList array. If 
    variables obj1 and obj2 have the same number of keys in each array and the characters
    of both arrays match when passed into strings, function returns true, otherwise the
    function returns false.*/ 
    function isEqual(x, y){//validates user entry for pokemon

      if (x.length === y.length && x.toString() === y.toString()){//compares number of keys
        return true;
      }else {
        console.log('false');
        alert('You have entered Invalid Information');
        return false;
      }
    }
 
    if (typeof(pokemon) === 'object' && isEqual(obj1, obj2) === true){
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
    return pokemonList.filter((nameCheck) => nameCheck.name.toLowerCase() === var1.toLowerCase())
  }

  /*Funtion that returns pokemonList*/ 
  function getAll(){
    return pokemonList;
  }

  return{
    add: add,
    getAll: getAll,
    pokeTest: pokeTest
  };
})();

let item = {name: 'Pikachu', height: 1.05, type: 'electric'};
pokemonRepository.add(item);

let userInput = prompt("What pokemon are you searching for?");
let result = pokemonRepository.pokeTest(userInput);

pokemonRepository.getAll().forEach(function (pokemon){
  if (pokemon.height > 0.6){
    document.write(`${pokemon.name} (height: ${pokemon.height}) - Wow, that's big! <br><br>`);
  }else {
    document.write(`${pokemon.name} (height: ${pokemon.height})<br><br>`);
  }
});

if (result.length !== 0){
  document.write(`<br>Here is your Pokemon: <br><br> ${result[0].name} (height: ${result[0].height})`);
}else {
  document.write(`<br><br>${userInput} is an Invalid Entry!!!`);
}




