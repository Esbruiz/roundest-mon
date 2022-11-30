import { RouterOutputs, trpc } from "../utils/trpc";
import Head from "next/head";
import React from "react";
import Link from "next/link";

type ResultsFromServer = RouterOutputs["roundest"]["getResults"];

export const revalidate = 10;

const aggreatePercentage = (pokemon: ResultsFromServer[number]) => {
  const { VoteFor, VoteAgainst } = pokemon._count;
  if(VoteFor === 0 && VoteAgainst === 0) {
    return 0;
  }
  return VoteFor / (VoteFor + VoteAgainst) * 100;
}

const ResultsPage = () => {
  const pokemons = trpc.roundest.getResults.useQuery();
  return (
    <>
      <Head>
        <title>Roundest - Results</title>
        <meta name="description" content="These are the roundest pokemons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-screen h-screen flex-col items-center">
        <div className="container flex flex-col items-center justify-center px-4 py-16 mb-[-5rem] ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[-10rem] text-center">
            These are the <span className="text-[hsl(280,100%,70%)]">Roundest</span> Pokemons
          </h1>
        </div>
          <Link className="text-center pb-12 pt-12 font-medium text-[hsl(280,100%,70%)] hover:underline" href={"/"}>Go and vote!</Link>
        <div className={"flex flex-row justify-around"}>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Percentage
              </th>
            </tr>
            </thead>
            <tbody>
            {pokemons.data?.map((pokemon, index) => (
              <tr
                key={pokemon.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
                  <img className="w-10 h-10 rounded-full" src={`/sprites/${pokemon.id}.png`} alt={pokemon.name} />
                  <div className="pl-3">
                    <div className="text-base font-semibold capitalize">{pokemon.name}</div>
                  </div>
                </th>
                <td className="py-4 px-6">
                  {aggreatePercentage(pokemon)} %
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
);
}

export default ResultsPage;
