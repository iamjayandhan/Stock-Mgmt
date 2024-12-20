import React from 'react';
import '../styles/404Page.css';

const Page404 = () => {
  return (
    <div className='main_div'>
    <section className="page_404">
      <div className="four_zero_four_bg">
        <h1 className="four_zero_four_text">404</h1>
      </div>
      <div className="contant_box_404">
        <h3 className="h2">Look like you're lost</h3>
        <p>The page you are looking for is not available!</p>
        <a href="/" className="link_404">Go to Home</a>
      </div>
    </section>
    </div>
  );
};

export default Page404;
