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
        const $director = $('.plot_summary  div.credit_summary_item:nth-of-type(1n) a');
        const director = $director.first().contents().filter(function(){
            return this.type === 'text';
        }).text().trim();
        const writers = [];
        $('.plot_summary  div.credit_summary_item:nth-of-type(3n) a').each(function(i,element){
            const writer = $(element).text();
            writers.push(writer);
        })
        writers.pop();
        const stars = [];
        $('.plot_summary  div.credit_summary_item:nth-of-type(4n) a').each(function(i,element){
            const star = $(element).text();
            stars.push(star);
        })
        stars.pop();
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
            stars,
            director,
            writers,
            rating,
            runTime,
            genres,
            sinopse,
            poster
        }
    })

}


function getSeries(imdbID){
    return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body =>{
        const $ = cheerio.load(body);
        const $title = $('.title_wrapper h1');
        const title = $title.first().contents().filter(function(){
            return this.type === 'text';
        }).text().trim();
        const $creators = $('.plot_summary  div.credit_summary_item:nth-of-type(1n) a');
        const creator = $creators.first().contents().filter(function(){
            return this.type === 'text';
        }).text().trim();
        const stars = [];
        $('.plot_summary  div.credit_summary_item:nth-of-type(3n) a').each(function(i,element){
            const star = $(element).text();
            stars.push(star);
        })
        stars.pop();
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
            creator,
            stars,
            release,
            rating,
            sinopse,
            genres,
            runTime,
            poster
        }
    })
}


module.exports = {
    searchMovies,getMovies,getSeries
};

