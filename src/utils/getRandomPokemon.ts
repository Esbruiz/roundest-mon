const MAX_DEX_ID = 493;
export const getRandomPokemon: (notThisOne?: number) => number = (notThisOne) => {
  const pokeDexNumber = Math.floor(Math.random() * (MAX_DEX_ID) + 1);

  if(pokeDexNumber !== notThisOne) return pokeDexNumber;

  return getRandomPokemon(notThisOne);
}

export const getOptionsForVote = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);

  const numbers: [number, number] = [firstId, secondId];

  return numbers;
}
