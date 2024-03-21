import Image from "next/image";
import Disclaimer from "../components/Disclaimer";
import Calculator from "@/components/Calculator";
import AllowanceForm from "@/components/AllowanceForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">degentle</h1>
      <AllowanceForm />
      <Calculator />
      <Disclaimer />
    </main>
  );
}
