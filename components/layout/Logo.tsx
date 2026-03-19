const Logo = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-gradient-to-br from-[#3B8BEB] to-[#1A5FBF] font-bold text-white font-serif text-[16px]">
        V
      </div>
      <span className="text-[16px] font-semibold tracking-tighter text-[#E8EDF2]">
        <span>Voice </span>
        <span className="text-[#3B8BEB]">2 Invoice</span>
      </span>
    </div>
  )
};

export default Logo;
