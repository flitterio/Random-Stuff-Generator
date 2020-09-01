'use strict';

const pexelApiKey = '563492ad6f917000010000011bdc2da76e6344cfa398e5038f23b7a4';
const pexelUrl = "https://api.pexels.com/v1/search";
function formatQueryParams(params){
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson){
  console.log(responseJson);
  const random = Math.floor(Math.random() * Math.floor(14));
  $('#results').empty();
  $('#results').append(`<li><img src=${responseJson.photos[random].src.medium}></li>`);
}

function getImage(query){
    const params ={
      query: query,
    }
    const queryString=
    formatQueryParams(params);
    const url = pexelUrl + "?" + queryString;
    console.log(url);

    const options = {
      headers: new Headers({
        "Authorization": pexelApiKey})
  };
    fetch(url, options)
        .then(response => response.json())
        .then(responseJson => displayResults(responseJson));
}

function watchForm(){
  $('#js-form').submit(event => {
    event.preventDefault();
    const phrase = $("#js-search").val();
    getImage(phrase);
  })
}

$(watchForm);