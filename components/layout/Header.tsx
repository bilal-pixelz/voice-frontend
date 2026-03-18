import Logo from "./Logo";
import HelpIcon from "../icons/HelpIcon";
import ThemeIcon from "../icons/ThemeIcon";

const Header = () => {
  return (
    <header className="bg-[#1C2A4E] p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <HelpIcon />
          </button>
          <button className="text-gray-400 hover:text-white">
            <ThemeIcon />
          </button>
          <button className="flex items-center rounded-full bg-gray-700 px-4 py-2 text-white">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            Xero Connected
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
