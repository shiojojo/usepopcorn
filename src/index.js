import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import StarRating from './StarRating';

function Test() {
  const [movieRating, setMovieRating] = useState(3);
  const defaultRating = 3;
  return (
    <div>
      <StarRating
        maxRating={5}
        defaultRating={movieRating}
        color="#fcc419"
        size={48}
        className="custom-class"
        onSetRating={setMovieRating}
      />
      <h1>{movieRating}</h1>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} /> */}
    {/* <StarRating maxRating={5} defaultRating={3} color="#fcc419" size={48} /> */}
    {/* <StarRating
      maxRating={5}
      defaultRating={3}
      color="#fcc419"
      size={48}
      messages={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
    /> */}
    {/* <StarRating
      maxRating={5}
      defaultRating={3}
      color="#fcc419"
      size={48}
      className="custom-class"
      onSetRating={rating => console.log(rating)}
    /> */}
    {/* <Test /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
