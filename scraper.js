const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchUrl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl = 'https://www.imdb.com/title/';

function searchMovies(seacrhTerm){
    return fetch(`${searchUrl}${seacrhTerm}`).
    then(response => response.text())
    .then(body =>{
        const movies = [];
        const $ = cheerio.load(body);
        $('.findResult').each(function(i,element){
            const $element = $(element);
            const $image = $element.find('td a img');
            const $title = $element.find('td.result_text a');
            const imdbID =  $title.attr('href').match(/title\/(.*)\//)[1]
            const movie = {
                image: $image.attr('src'),
                title: $title.text(),
                imdbID
            };
            movies.push(movie);
        });
        return movies;
    });
}

function getMovies(imdbID){
    return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body =>{
        const $ = cheerio.load(body);
        const $title = $('.title_wrapper h1');
        const title = $title.first().contents().filter(function(){
            return this.type === 'text';
        }).text().trim();
        const $director = $('div.credit_summary_item a');
        const director = $director.first().contents().filter(function(){
            return this.type === 'text';
        }).text().trim();
        const release = $('.subtext a:last-of-type').text().trim();
        const rating = $('strong span').text().trim();
        const poster = $('div.poster a img').attr('src');
        const sinopse = $('#titleStoryLine div p span').text().trim();
        const runTime = $('.subtext time').first().contents().filter(function(){
            return this.type === 'text';
        }).text().trim();
        const genres = [];
        $('#titleStoryLine div:nth-of-type(4n) a').each(function(i,element){
            const genre = $(element).text();
            genres.push(genre);
        })

        return {
            title,
            release,
            director,
            rating,
            runTime,
            genres,
            sinopse,
            poster
        }
    })

}


module.exports = {
    searchMovies,getMovies
};

