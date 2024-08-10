import Image from "next/image";
import Background from "./Components/Background";
import Pipe from "./Components/Pipe";
import { Silkscreen } from "next/font/google";
import FlappyBird from "./Components/Flappybird";

const silkscreen = Silkscreen({ weight: '400', subsets: ['latin'] });

export default function Home() {
  return (
    <main className="flex max-h-screen flex-col items-center justify-between p-10">
      <div className={silkscreen.className}>
        <h1 className="text-4xl mb-4">Flappy Bird</h1>
      </div>
      <FlappyBird />
    </main>
  );
}