// Import logo and the footer links data from assets.js
import { assets, footerLinks } from "../assets/assets";
// Import navigate() from your Context API
import { useAppContext } from "../context/AppContext";
import { scrollToElement, scrollToTop } from "../utils/scroll";

const Footer = () => {
  const { navigate } = useAppContext();

  // ---------- WHAT EACH LINK DOES ----------
  // The key is the link text from footerLinks in assets.js.
  // Any link that is NOT listed here does nothing when clicked.
  const linkActions = {
    // Go to the home page and scroll to the top
    Home: () => {
      navigate("/");
      scrollToTop();
    },
    // Go to the contact page (not built yet) and scroll to the top
    "Contact Us": () => {
      navigate("/contact");
      scrollToTop();
    },
    // Go to the home page, then scroll to the section with id="best-sellers"
    "Best Sellers": () => {
      navigate("/");
      // small delay so the home page is drawn before we scroll
      setTimeout(() => {
        scrollToElement(document.getElementById("best-sellers"), {
          offset: -88,
        });
      }, 100);
    },
  };

  // Runs when a footer link is clicked
  const handleLinkClick = (e, text) => {
    e.preventDefault(); // always stop the browser from jumping to the top
    linkActions[text]?.(); // run the action only if this link has one
  };

  return (
    // Full-width light green background, same side padding as App.jsx
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/10">
      {/* Top part: logo + text on the left, links on the right */}
      {/* Mobile: stacked | md and up: side by side */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 md:py-14 border-b border-gray-500/30 text-gray-500">
        {/* Left side: logo and description */}
        <div>
          <img
            className="w-32 md:w-36"
            src={assets.logo}
            alt="GreenCart logo"
          />
          <p className="max-w-102.5 mt-6 text-base md:text-lg leading-relaxed">
            We deliver fresh groceries and snacks straight to your door. Trusted
            by thousands, we aim to make your shopping experience simple and
            affordable.
          </p>
        </div>

        {/* Right side: 3 link columns (Quick Links, Need help?, Follow Us) */}
        <div className="flex flex-wrap justify-between w-full md:w-[50%] gap-8">
          {/* Repeated columns using .map() */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              {/* Column title */}
              <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-3 md:mb-5">
                {section.title}
              </h3>
              {/* Links inside the column using .map() */}
              <ul className="text-sm md:text-base space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      onClick={(e) => handleLinkClick(e, link.text)}
                      className="hover:underline transition"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom part: copyright text */}
      <p className="py-4 text-center text-sm md:text-base text-gray-600">
        Copyright 2026 © GreatStack.dev All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
