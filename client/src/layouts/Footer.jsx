import React from "react";

const Footer = () => {
    return (
      <footer className="footer flex-space-around">
        <div className="flex-space-around">
        <form action="">
         <label htmlFor="subscribe">Subscribe to newsletter:</label>
         <input 
           type="email" 
           name="subscribe" 
           id="subscribe"
           placeholder="Your Email address"
           className="footer__input"
         />
         <button type="submit"className="btn-subscribe">subscribe</button>
        </form>
        </div>
        <div>
          <p>&copy; Copyright 2024 express.All rights reserved.</p>
        </div>
      </footer>
    )
}

export default Footer