import Link from "next/link";

export default function Footer () {
  return (
    <footer className="w-full p-4 bg-yellow-100 border-t-4 border-yellow-500 text-yellow-700 text-xs">
      <p><strong>Disclaimer:</strong> This is not financial advice. We are not affiliated with $degen or Farcaster. We are not responsible for the accuracy of the information. You are responsible for your own decisions, actions, and your losses. We may hold positions in the assets mentioned.</p>
        <div className="mt-4">
        <p>
          made by <Link href="https://kwaji.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">kwaji</Link>
        </p>
      </div>
    </footer>
  );
}