import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Image src="/logo.svg" alt="Voice 2 Invoice" width={40} height={40} />
      <span className="ml-2 text-lg font-semibold text-blue-400">
        Voice <span className="text-white">2</span> Invoice
      </span>
    </div>
  );
};

export default Logo;
