'use strict';

const store =[];

const pexelApiKey = '563492ad6f917000010000011bdc2da76e6344cfa398e5038f23b7a4';
const pexelUrl = "https://api.pexels.com/v1/search";
const adviceUrl = "https://api.adviceslip.com/advice";



function formatQueryParams(params){ //for pexel api search
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayImage(responseJson){ //display random image from pexel search
  console.log(responseJson);
  if(responseJson.total_results === 0){
    store.pop();
    return $('#js-form').append(`<h2 id="error">Results Not Found, Try Searching Something Else </h2>`);
  }
  else{
    $('#js-form').remove(); //removes the form
    $('html').removeClass('background'); //changes background color
    $('h1').addClass('hidden'); //hides the title
    $('#results').removeClass('hidden'); //reveals the results page
    $('body').removeClass('space'); //removes space
  const random = Math.floor(Math.random() * Math.floor(responseJson.photos.length)); //gets random image
  $('#image').empty();
  $('#image').append(`<img src="${responseJson.photos[random].src.medium}">`); //displays the image

  getAdvice(); //calls getAdvice function
  }
}

function getImage(query){ //retrieve image from json
    
    const params ={ //gets search term
      query: query,
    }
    const queryString=
    formatQueryParams(params); 
    const pexelApiUrl = pexelUrl + "?" + queryString + "&per_page=75"; //makes pexel api url
    console.log(pexelApiUrl);

    const options = { //authorizes use of pexelapi with key
      headers: new Headers({
        "Authorization": pexelApiKey})
  };
    fetch(pexelApiUrl, options) //gets json
        .then(response => {
          if(response.ok) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => displayImage(responseJson))
        .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

  function displayQuote(responseJson){ //display random quote
    console.log(responseJson);
    $('#quote').empty();
    $('#quote').append(`<h3><em>"${responseJson.content}"</em></h3><p>By ${responseJson.originator.name}</p>`);
    $('#buttons').append(`<button type="button" class="new-result item">NEW RESULT</button><button type="button" class="restart item">START OVER</button>`);

  }

  function getQuote(){ //fetch json for random quote
    fetch("https://quotes15.p.rapidapi.com/quotes/random/?language_code=en", {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "quotes15.p.rapidapi.com",
      "x-rapidapi-key": "705e8bd70bmshacd70beae417977p178366jsn208efed14c1c"
    }
  })
  .then(response => {
    if(response.ok) {
      return response.json();
    }
      throw new Error(response.statusText);
    })
  .then(responseJson =>
    displayQuote(responseJson))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
  }
 
  //ADVICE SECTION
  function displayAdvice(responseJson){ //display random piece of advice
    console.log(responseJson);
    $('#advice').empty();
    $('#advice').append(`<h2>${responseJson.slip.advice}</h2>`); //puts advice on image
    getQuote(); //calls getQuote function
   
  }

  function getAdvice(){
    fetch(adviceUrl)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error (response.statusText);
      })
      .then(responseJson => displayAdvice(responseJson))
      .catch(err =>{
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  }

  //WATCH FORM
function watchForm(){ //event listener for initial form
  $('#js-form').submit(event => {
    event.preventDefault();
    $('#error').remove()
    store.push($("#js-search").val());
    getImage(store[0]); //calls getImage function with input
  })
}

//BUTTONS
function newResults(){
  $('#buttons').on('click', '.new-result', event => {
    console.log('new result button clicked');
    event.preventDefault();
    $('#buttons').empty();
    getImage(store[0]);
  })
}
function startOver(){
  $('#buttons').on('click', '.restart', event =>{
    console.log('restart button pressed');
      location.reload();
  });
}

//RENDER
function renderRandom(){
  watchForm();
  newResults();
  startOver();
}

$(renderRandom);