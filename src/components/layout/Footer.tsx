export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-8 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[48px] flex justify-center text-center">
        <p className="text-[14px] text-[#B3B3B3] font-sans">
          Developed and managed by Daniel Okpara &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
