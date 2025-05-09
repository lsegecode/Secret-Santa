import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/create">Create Draw</Link>
      </li>
      <li>
        <Link to="/check">Check Assignment</Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;
