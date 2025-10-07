import Image from "next/image";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden bg-gray-100">
      <div className="relative w-full max-w-sm sm:max-w-xl md:max-w-5xl mx-auto">
        <Image
          src="/thanks.jpg"
          width={1000}
          height={800}
          alt="Closing"
          className="w-full h-auto object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
