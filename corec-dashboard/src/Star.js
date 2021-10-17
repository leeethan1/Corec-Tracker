import React, { useState } from 'react';

const Star = (props) => {
  const [selected, changeSelected] = useState(props.selected);
  function changeSelectStatus() {
    // let url = ''
    // if (!selected) {
    //   url = '/addFavorite'
    // }
    // else {
    //   url = '/removeFavorite'
    // }
    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     'room': props.room})
    // };
    // fetch(url, requestOptions)
    // .then(res => res.json())
    // .then((response) => {
    //   console.log(response)
    // });
    changeSelected(!selected);
    props.favChange(props.room);
  }
  return (
        <label className={selected ? "star-selected" : "star"} onClick={changeSelectStatus}>
            <svg 
                width="30" 
                height="30" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#393939" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        </label>
  );
}

export default Star;