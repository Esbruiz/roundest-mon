"use client";
import { type NextPage } from "next";
import Head from "next/head";

import { RouterOutputs, trpc } from "../utils/trpc";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Loading from "../utils/circles.svg";

const Home: NextPage = () => {
  const [ids, setIds] = React.useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.roundest.getPokemonById.useQuery({ id: first });
  const secondPokemon = trpc.roundest.getPokemonById.useQuery({ id: second });
  const voteForRoundestMutation = trpc.roundest.voteForRoundest.useMutation();

  const voteForRoundest = (id: number, against: number) => {
    voteForRoundestMutation.mutate({ votedFor: id, votedAgainst: against });
    setIds(getOptionsForVote());
  };

  return (
    <>
      <Head>
        <title>Roundest - Which is the roundest Pokemon?</title>
        <meta name="description" content="Which is the roundest Pokemon?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full h-full">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] text-center pt-16">
              Which pokemon is <span className="text-[hsl(280,100%,70%)]">Rounder</span>?
            </h1>
          </div>
          <div className={"flex flex-row justify-around pt-16 w-1/2"}>
            {firstPokemon.isLoading && secondPokemon.isLoading && (
              <Image loading={"eager"}
                     className={"pt-16"} src={Loading} alt="Loading" width={256} height={256} />
            )}
            {!firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data && (
              <>
                <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first, second)} />
                <Image
                  loading={"eager"}
                  width={64}
                  height={64}
                  style={{
                    imageRendering: "pixelated"
                  }}
                  className={"text-center p-12 w-36 h-36 self-center"}
                  alt={"Versus"}
                  src={"https://comicvine.gamespot.com/a/uploads/original/11140/111409382/7758673-0112870914-daqrp.png"} />
                <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second, first)} />
              </>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 pb-8 justify-center items-center flex w-full">
          <Link className="text-center" href={"/results"}>Results</Link>
        </div>
      </main>
    </>
  );
};

type PokemonFromServer = RouterOutputs["roundest"]["getPokemonById"];

const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = ({ pokemon, vote }) => {
  return <div>
    <Image
      loading={"eager"}
      width={256}
      height={256}
      style={{
        imageRendering: "pixelated"
      }}
      src={`/sprites/${pokemon.id}.png`}
      alt={pokemon.name}
    />
    <div className="flex flex-col items-center justify-center">
      <p className="text-lg capitalize text-center">{pokemon.name}</p>
      <button
        className=" mt-4 bg-[hsl(280,100%,50%)] hover:bg-[hsl(280,100%,70%)] text-white font-bold py-2 px-4 rounded"
        onClick={() => vote()}>Roundest
      </button>
    </div>
  </div>;
};

export default Home;
