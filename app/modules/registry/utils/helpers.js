export const parseRegistryEntry = entry => {
  return {
    ethAddress: entry[0],
    username: entry[1]
  };
};
