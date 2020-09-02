'use strict';

const pexelApiKey = '563492ad6f917000010000011bdc2da76e6344cfa398e5038f23b7a4';
const pexelUrl = "https://api.pexels.com/v1/search";
const quoteUrl = "https://quote-garden.herokuapp.com/api/v2/quotes/random";

function formatQueryParams(params){ //for pexel api search
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayImage(responseJson){ //display random image from pexel search
  console.log(responseJson);
  const random = Math.floor(Math.random() * Math.floor(14));
  $('#image').empty();
  $('#image').append(`<img src=${responseJson.photos[random].src.medium}>`);

  $(getQuote);
}

function getImage(query){ //retrieve image from json
    $('#js-form').empty(); //empties the form
    const params ={ //gets search term
      query: query,
    }
    const queryString=
    formatQueryParams(params); 
    const pexelApiUrl = pexelUrl + "?" + queryString; //makes pexel api url
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
        .cath(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

  function displayQuote(responseJson){ //display random quote
    console.log(responseJson);
    $('#quote').empty();
    $('#quote').append(`<h2><em>"${responseJson.quote.quoteText}"</em></h2><p>By ${responseJson.quote.quoteAuthor}</p>`);

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

function watchForm(){ //event listener for initial form
  $('#js-form').submit(event => {
    event.preventDefault();
    const phrase = $("#js-search").val();
    getImage(phrase); //calls getImage function with input
  })
}

$(watchForm); //renders the form