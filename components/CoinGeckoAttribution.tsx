import Link from "next/link";

const CoinGeckoAttribution = () => {
  return (
    <div className="flex flex-col items-center mt-2">
      <p className="text-xs">
        <Link href="https://coingecko.com" target="_blank" rel="noopener noreferrer">
          Data provided by CoinGecko
        </Link>
      </p>
    </div>
  );
};

export default CoinGeckoAttribution;
