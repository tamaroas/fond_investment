import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";


export default async function AboutPage({ params }: { params: { lang: Langs } }) {
  const dictionary = await getDictionary(params.lang) as any

    return (
        <div className="mx-auto">
      {/* Start content */}
      <div className="flex flex-col justify-center items-center">
        <div
          className="relative p-10 w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/banier-aboutus.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10 flex flex-col gap-10 items-center justify-center h-full">
            <h1 className="text-5xl font-bold text-white text-center leading-tight">
              {dictionary.about_title1} <span className="text-red-400">Viazy</span>
              <span className="text-[#1fc3ff]">Pay</span>
            </h1>
            <p className="text-lg font-epilogue text-white text-center leading-relaxed max-w-xl">
              {dictionary.about_description1}
            </p>
            <a
              href="/register"
              className="p-1 px-5 text-lg font-serif bg-slate-50 border-custom-blue rounded-3xl whitespace-nowrap lg:p-2 lg:px-5 transition-all hover:bg-[#1fc3ff] hover:text-gray-50"
            >
              {dictionary.register}
            </a>
          </div>
        </div>

        <div className="flex flex-col mx-2 lg:w-[80rem] justify-center items-center gap-5 my-8 bg-gradient-to-r from-sky-100 from-10% via-sky-300 via-30% to-[#1fc3ff] to-90% p-10 rounded-lg lg:flex-row">
          <div className="flex flex-col gap-10 lg:w-96">
            <h1 className="font-bold text-2xl leading-custom text-center">
              {dictionary.about_title2}
            </h1>
            <p className="text-lg font-epilogue text-black text-center leading-relaxed max-w-xl">
              {dictionary.about_description2}
            </p>
          </div>
          <div>
            <img src="/assets/images/image-pay.jpeg" alt="image pay" className="lg:w-[30rem] rounded-lg" />
          </div>
        </div>

        <div className="flex flex-col gap-8 my-8 p-10 justify-center items-center">
          <h1 className="font-bold text-2xl leading-custom text-center">
            {dictionary.aboutTitle3}
          </h1>
          <p className="text-lg font-epilogue text-black self-center text-center leading-relaxed max-w-2xl">
            {dictionary.about_description3}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-5 lg:gap justify-center items-center">
            <div className="flex gap-5 flex-col">
              <h1 className="font-bold text-2xl leading-custom text-center">
                {dictionary.about_total_user}
              </h1>
              <p className="text-md font-epilogue text-black text-center leading-relaxed">
                {dictionary.users}
              </p>
            </div>
            <div className="flex items-center justify-center text-sm space-x-1">
              <hr className="w-40 lg:w-0 lg:h-14 border border-gray-300" />
            </div>
            <div className="flex gap-5 flex-col">
              <h1 className="font-bold text-2xl leading-custom text-center">
                {dictionary.number_costomers_satisfaction}
              </h1>
              <p className="text-md font-epilogue text-black text-center leading-relaxed">
                {dictionary.customers_stisfaction}
              </p>
            </div>
            <div className="flex items-center justify-center text-sm space-x-1">
              <hr className="w-40 lg:w-0 lg:h-14 border border-gray-300" />
            </div>
            <div className="flex gap-5 flex-col">
              <h1 className="font-bold text-2xl leading-custom text-center">
                {dictionary.percant_disponibility}
              </h1>
              <p className="text-md font-epilogue text-black text-center leading-relaxed">
                {dictionary.disponibility}
              </p>
            </div>
            <div className="flex items-center justify-center text-sm space-x-1">
              <hr className="w-40 lg:w-0 lg:h-14 border border-gray-300" />
            </div>
            <div className="flex gap-5 flex-col">
              <h1 className="font-bold text-2xl leading-custom text-center">
                {dictionary.number_languages}
              </h1>
              <p className="text-md font-epilogue text-black text-center leading-relaxed">
                {dictionary.languages}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 justify-center items-center p-10 w-full bg-gradient-to-bl from-red-100 from-10% via-red-100 via-30% to-[#81c3db] to-90%">
          <div className="flex flex-col justify-center items-center gap-10 max-w-[500px]">
            <h1 className="font-bold text-2xl leading-custom text-center">
              Lorem ipsum dolor sit amet
            </h1>
            <p className="text-lg font-epilogue text-black self-center text-center leading-relaxed max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Nullam bibendum euismod nisi, eu feugiat eros. Fusce facilisis, orci ac convallis fermentum, ligula orci interdum orci, a fermentum mauris quam ut lacus. Lorem ipsum dolor um euismod nisi, eu feugiat eros.
            </p>
            <a
              href="/register"
              className="p-1 px-5 text-lg text-center font-serif bg-black text-gray-50 border-custom-blue rounded-3xl whitespace-nowrap lg:p-2 lg:px-5 transition-all hover:bg-[#1fc3ff] hover:text-gray-50"
            >
              {dictionary.register}
            </a>
          </div>
          <div className="flex">
            <img src="/assets/images/img12.jpeg" alt="image pay" className="lg:w-[30rem] rounded-lg" />
          </div>
        </div>
      </div>
      </div>
    );
  }