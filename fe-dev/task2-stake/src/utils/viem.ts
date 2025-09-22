import { sepolia, mainnet } from "viem/chains";
import { type PublicClient, createPublicClient, http } from "viem";

export const viemClients = (chaiId: number): PublicClient => {
  const clients: { [key: number]: PublicClient } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http(
        `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
      ),
    }),
    [mainnet.id]: createPublicClient({
      chain: mainnet,
      transport: http("https://eth.drpc.org"),
    }),
  };
  return clients[chaiId];
};
