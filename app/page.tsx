import Image from "next/image";
import Disclaimer from "../components/Disclaimer";
import Calculator from "@/components/Calculator";
import AllowanceForm from "@/components/AllowanceForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <main className="flex flex-col items-center p-24 flex-grow">
      <h1 className="text-4xl font-bold text-center mb-8">degentle</h1>
      <AllowanceForm />
      <Calculator />
      </main>
      <Footer />
    </div>
  );
}
