import { Link } from "react-router-dom";

import styling from "./MainNav.module.css";

function MainNavigation() {
  return (
    <header className={styling.header}>
      <div className={styling.logo}>LegendaryYT</div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/favorites">Favorites</Link>
          </li>
          <li>
            <Link to="/mostFavoriedVideos">MostFavoriedVideos</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
