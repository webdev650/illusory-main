
import Link from 'next/link';
import './ShinyText.css';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <Link href="/contact"
      className={`shiny-text ${disabled ? 'disabled' : ''}  ${className}`}
      style={{ animationDuration }}
    >
      {text}
      <span>
        <svg
          className="bg-black p-3 rounded-full transition-all duration-500 ease-out group-hover:bg-[#26E9FF] w-10 h-10 lg:w-12 lg:h-12 group-hover:scale-110 group-active:scale-95 group-hover:shadow-[0_0_20px_rgba(38,233,255,0.4)]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            className="group-hover:fill-black"
            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            fill="white"
          />
        </svg>
      </span>
    </Link>
  );
};

export default ShinyText;