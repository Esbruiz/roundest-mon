import { z } from "zod";
import PokeAPI from "pokeapi-typescript";
import { prisma } from "../../db/client";

import { router, publicProcedure } from "../trpc";

export const roundestRouter = router({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const ourPokemon = await prisma.pokemon.findUnique({
        where: { id: input.id },
      });
      if(ourPokemon) return ourPokemon;
        const pokemon =  await PokeAPI.Pokemon.resolve(input.id);
        prisma.pokemon.create({
          data: {
            id: pokemon.id,
            name: pokemon.name,
            spriteUrl: pokemon.sprites.front_default,
          }
        });
        return {
          id: pokemon.id,
          name: pokemon.name,
          sprites: pokemon.sprites,
        }
    }),
  voteForRoundest: publicProcedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
        const voteInDb = await prisma.vote.create({
          data: {
            votedForId: input.votedFor,
            votedAgainstId: input.votedAgainst,
          }
        });
        return {
          success: true,
          vote: voteInDb,
        }
    }),
});
