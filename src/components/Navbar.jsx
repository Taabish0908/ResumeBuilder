import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOutUser = () => {
    // localStorage.removeItem("token");
    navigate("/");
    dispatch(logout());
  };
  return (
    <div className="shadow bg-black text-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link to="/">
          <img src="/logo1.svg" alt="logo" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden text-white">Hi, {user.name}</p>
          {/* <img
            src={user?.image}
            alt="user"
            className="w-10 h-10 rounded-full"
          /> */}
          <button
            onClick={logOutUser}
            className="px-6 py-2 border ml-2 bg-pink-700 hover:bg-pink-800 active:scale-95 rounded-full text-white ring-offset-0.5 ring-1 ring-pink-400  items-center transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
