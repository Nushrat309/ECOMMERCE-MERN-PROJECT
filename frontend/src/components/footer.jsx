import { Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <div className="flex justify-center items-center gap-2">
        <Phone size={18} />
        <span>
          Hotline:{" "}
          <a
            href="tel:+880122965575"
            className="text-blue-400 hover:underline"
          >
            +880122965575
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
