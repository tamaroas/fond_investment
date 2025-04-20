import Link from "next/link";

export default async function NotFound() {

  return (
    <div className="min-h-screen flex flex-grow items-center justify-center">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">{"404"}</h1>
        <p className="text-gray-600">{"Oops! La page que vous recherchez est introuvable.."}</p>
        <Link href={`/`} className="mt-4 inline-block rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"> {"Retourner à l'accueil"} </Link>
      </div>
    </div>
  );
}