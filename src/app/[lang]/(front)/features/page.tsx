import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";

export default async function FeaturesPage({ params }: { params: { lang: Langs } }) {
  const dictionary = await getDictionary(params.lang) as any

    return (
      <>
        <div className="flex flex-col justify-center items-center">
  <div
    className="relative p-10 w-full h-96 bg-cover bg-center"
    style={{ backgroundImage: "url('/assets/images/shape02.png')" }}
  >
    <div className="absolute inset-0 bg-[#1fc3ff] opacity-60"></div>
    <div className="relative z-10 flex flex-col gap-10 items-center justify-center h-full">
      <h1 className="text-5xl font-bold text-white text-center leading-tight">
        Fonctionnalités
      </h1>
    </div>
  </div>
  <div className="container m-10 p-5 gap-5 flex flex-col justify-center items-center">
    <h1 className="font-bold text-2xl leading-custom text-center">
      Lorem ipsum dolor sit amet
    </h1>
    <p className="text-lg font-epilogue text-black text-center leading-relaxed max-w-xl">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit
    </p>
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
      <div className="flex gap-2 p-5 justify-center min-w-80 lg:w-96 lg:min-w-96 items-center border border-solid border-[#1fc3ff] rounded-md shadow-md shadow-[#1fc3ff] transition-transform duration-300 ease-in-out transform hover:-translate-y-3 bg-contain bg-no-repeat blur-background">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold text-lg leading-custom text-start">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-start leading-relaxed mr-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
      </div>
      <div className="flex gap-2 p-5 justify-center min-w-80 lg:w-96 lg:min-w-96 items-center border border-solid border-[#1fc3ff] rounded-md shadow-md shadow-[#1fc3ff] transition-transform duration-300 ease-in-out transform hover:-translate-y-3 bg-contain bg-no-repeat blur-background">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold text-lg leading-custom text-start">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-start leading-relaxed mr-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
      </div>
      <div className="flex gap-2 p-5 justify-center min-w-80 lg:w-96 lg:min-w-96 items-center border border-solid border-[#1fc3ff] rounded-md shadow-md shadow-[#1fc3ff] transition-transform duration-300 ease-in-out transform hover:-translate-y-3 bg-contain bg-no-repeat blur-background">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold text-lg leading-custom text-start">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-start leading-relaxed mr-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
      </div>
      <div className="flex gap-2 p-5 justify-center min-w-80 lg:w-96 lg:min-w-96 items-center border border-solid border-[#1fc3ff] rounded-md shadow-md shadow-[#1fc3ff] transition-transform duration-300 ease-in-out transform hover:-translate-y-3 bg-contain bg-no-repeat blur-background">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold text-lg leading-custom text-start">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-start leading-relaxed mr-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
      </div>
    </div>
    <div className="container m-10 p-5 gap-5 flex flex-col justify-center items-center">
      <h1 className="font-bold text-2xl leading-custom text-center">
        Lorem ipsum dolor sit amet
      </h1>
      <p className="text-lg font-epilogue text-black text-center leading-relaxed max-w-xl">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </p>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
        <div className="flex flex-col gap-5 p-10 justify-center items-center border border-solid border-[#1fc3ff] rounded-md transition-transform duration-300 ease-in-out transform hover:-translate-y-3">
          <img src="/assets/images/paiement-securise.png" alt="img1" className="w-20" />
          <h1 className="font-bold text-2xl leading-custom text-center">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-center leading-relaxed mr-10">
            Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
        <div className="flex flex-col gap-5 p-10 justify-center items-center border border-solid border-[#1fc3ff] rounded-md transition-transform duration-300 ease-in-out transform hover:-translate-y-3">
          <img src="/assets/images/paiement-securise.png" alt="img1" className="w-20" />
          <h1 className="font-bold text-2xl leading-custom text-center">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-center leading-relaxed mr-10">
            Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
        <div className="flex flex-col gap-5 p-10 justify-center items-center border border-solid border-[#1fc3ff] rounded-md transition-transform duration-300 ease-in-out transform hover:-translate-y-3">
          <img src="/assets/images/paiement-securise.png" alt="img1" className="w-20" />
          <h1 className="font-bold text-2xl leading-custom text-center">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-center leading-relaxed mr-10">
            Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
        <div className="flex flex-col gap-5 p-10 justify-center items-center border border-solid border-[#1fc3ff] rounded-md transition-transform duration-300 ease-in-out transform hover:-translate-y-3">
          <img src="/assets/images/paiement-securise.png" alt="img1" className="w-20" />
          <h1 className="font-bold text-2xl leading-custom text-center">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-center leading-relaxed mr-10">
            Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
        <div className="flex flex-col gap-5 p-10 justify-center items-center border border-solid border-[#1fc3ff] rounded-md transition-transform duration-300 ease-in-out transform hover:-translate-y-3">
          <img src="/assets/images/paiement-securise.png" alt="img1" className="w-20" />
          <h1 className="font-bold text-2xl leading-custom text-center">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-center leading-relaxed mr-10">
            Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
        <div className="flex flex-col gap-5 p-10 justify-center items-center border border-solid border-[#1fc3ff] rounded-md transition-transform duration-300 ease-in-out transform hover:-translate-y-3">
          <img src="/assets/images/paiement-securise.png" alt="img1" className="w-20" />
          <h1 className="font-bold text-2xl leading-custom text-center">
            Lorem ipsum dolor sit amet
          </h1>
          <p className="text-sm font-epilogue text-black text-center leading-relaxed mr-10">
            Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis
          </p>
        </div>
        {/* Repeat the above block for the other cards */}
      </div>
    </div>
    <div className="container m-10 p-5 gap-5 flex flex-col justify-center items-center">
      <div className="flex gap-5 flex-col justify-center items-center">
        <h1 className="font-bold text-2xl leading-custom text-[#1fc3ff] text-center">
          Notre vision
        </h1>
        <h1 className="font-bold text-2xl leading-custom text-center">
          Lorem ipsum dolor sit amet
        </h1>
        <p className="text-lg font-epilogue text-black text-center leading-relaxed mr-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Nullam bibendum euismod nisi, eu feugiat eros.
        </p>
        <img src="/assets/images/Viazi-PAY.png" alt="logo" className="w-96 lg:w-[50%]" />
      </div>
    </div>
    <div className="container m-10 p-5 gap-5 flex flex-col justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-5 lg:gap justify-center items-center">
        <div className="flex gap-5 flex-col">
          <p className="text-md font-bold text-black text-center leading-relaxed">
            Fondé
          </p>
          <h1 className="font-bold text-4xl text-[#1fc3ff] leading-custom text-center">
            2022
          </h1>
        </div>
        <div className="flex items-center justify-center text-sm space-x-1">
          <hr className="w-40 lg:w-0 lg:h-14 border border-gray-300" />
        </div>
        <div className="flex gap-5 flex-col">
          <p className="text-md font-bold text-black text-center leading-relaxed">
            Membre
          </p>
          <h1 className="font-bold text-4xl text-[#1fc3ff] leading-custom text-center">
            1000+
          </h1>
        </div>
        <div className="flex items-center justify-center text-sm space-x-1">
          <hr className="w-40 lg:w-0 lg:h-14 border border-gray-300" />
        </div>
        <div className="flex gap-5 flex-col">
          <p className="text-md font-bold text-black text-center leading-relaxed">
            utilisateurs
          </p>
          <h1 className="font-bold text-4xl text-[#1fc3ff] leading-custom text-center">
            1M
          </h1>
        </div>
        <div className="flex items-center justify-center text-sm space-x-1">
          <hr className="w-40 lg:w-0 lg:h-14 border border-gray-300" />
        </div>
        <div className="flex gap-5 flex-col">
          <p className="text-md font-bold text-black text-center leading-relaxed">
            Couverture d assurance (XAF)
          </p>
          <h1 className="font-bold text-4xl text-[#1fc3ff] leading-custom text-center">
            2M
          </h1>
        </div>
      </div>
    </div>
  </div>
</div>
``

      </>
    );
  }