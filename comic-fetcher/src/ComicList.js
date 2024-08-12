import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from 'cheerio';
import './ComicList.css';

function ComicList() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const { data } = await axios.get('https://cors-anywhere.herokuapp.com/https://mangakakalot.com/');
        const $ = load(data);
        const comicDetails = [];

        // Adjust this selector to match the HTML structure of the site
        $('.bs').each((index, element) => {
          const title = $(element).find('.bsx > a').attr('title');
          const image = $(element).find('.bsx > a > img').attr('src');
          const url = $(element).find('.bsx > a').attr('href');
          const author = $(element).find('.bsx > .epxs').text();
          const tags = $(element).find('.bsx > .bt > span').text().split(',');

          comicDetails.push({ title, image, author, tags, url });
        });

        setComics(comicDetails);
      } catch (error) {
        console.error('Error fetching and parsing data:', error);
      }
    };

    fetchComics();
  }, []);

  return (
    <div className="comic-list">
      {comics.map((comic, index) => (
        <div key={index} className="comic-item">
          <a href={comic.url}>
            <img src={comic.image} alt={comic.title} />
            <h3>{comic.title}</h3>
          </a>
          <p>Author: {comic.author}</p>
          <p>Tags: {comic.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default ComicList;
