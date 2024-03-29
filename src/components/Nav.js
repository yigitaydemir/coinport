import { Link, NavLink } from "react-router-dom";
import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import logo from "../media/logo.png"

const Nav = () => {
  const [user, loading] = useAuthState(auth);

  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar fluid rounded className="w-11/12 max-w-screen-xl m-auto border-b-2 border-black rounded-none">
      <Navbar.Brand href="#">
        <Link to="/" className="flex">
          <img alt="Logo" className="mr-3 h-6 sm:h-14" src={logo}></img>
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            CoinPort
          </span>
        </Link>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {!user && <Button onClick={GoogleLogin}>Login</Button>}
        {user && (
          <Dropdown
            inline
            label={<Avatar alt="User settings" img={user.photoURL} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.displayName}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item><Link to="/watchlist">Watchlist</Link></Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => auth.signOut()}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <NavLink to="/" className="text-lg">Home</NavLink>
        <NavLink to="/watchlist" className="text-lg">Watchlist</NavLink>
        <NavLink to="/about" className="text-lg">About</NavLink>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
