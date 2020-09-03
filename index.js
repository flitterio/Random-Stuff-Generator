'use strict';

const store =[];

const pexelApiKey = '563492ad6f917000010000011bdc2da76e6344cfa398e5038f23b7a4';
const pexelUrl = "https://api.pexels.com/v1/search";
const quoteUrl = "https://quote-garden.herokuapp.com/api/v2/quotes/random";
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
    $('#results').removeClass('hidden');
  const random = Math.floor(Math.random() * Math.floor(74));
  $('#image').empty();
  $('#image').append(`<img src="${responseJson.photos[random].src.medium}">`);

  getAdvice();
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
    $('#quote').append(`<h3><em>"${responseJson.quote.quoteText}"</em></h3><p>By ${responseJson.quote.quoteAuthor}</p>`);
    $('#buttons').append(`<button type="button" class="new-result item">New Results</button><button type="button" class="restart item">Start Over</button>`);

  }

  function getQuote(){ //fetch json from random quote
    fetch(quoteUrl)
      .then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error (response.statusText);
      })
      .then(responseJson => displayQuote(responseJson))
      .catch(err =>{
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