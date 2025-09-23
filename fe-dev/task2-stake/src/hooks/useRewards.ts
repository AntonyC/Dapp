import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { useStakeContract } from "./useContract";
import { Pid } from "../utils";
import { addMetaNodeToMetaMask } from "../utils/metamask";
import { retryWithDelay } from "../utils/retry";

export type RewardsData = {
  pendingReward: string;
  stakedAmount: string;
  lastUpdate: number;
};

type UserData = [bigint, bigint, bigint]; // [stAmount, finishedMetaNode, pendingMetaNode]

type PoolData = [string, bigint, bigint, bigint, bigint, bigint, bigint]; // [stTokenAddress, poolWeight, lastRewardBlock, accMetaNodePerST, stTokenAmount, minDepositAmount, unstakeLockedBlocks]

export const useRewards = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const [rewardsData, setRewardsData] = useState<RewardsData>({
    pendingReward: "0",
    stakedAmount: "0",
    lastUpdate: 0,
  });
  const [loading, setLoading] = useState(false);

  const [poolData, setPoolData] = useState<Record<string, string>>({
    poolWeight: "0",
    lastRewardBlock: "0",
    accMetaNodePerShare: "0",
  });

  const [metaNodeAddress, setMetaNodeAddress] = useState<string>("");

  const fetchPoolData = useCallback(async () => {
    if (!stakeContract || !address || !isConnected) return;

    try {
      const pool = await retryWithDelay(
        () => stakeContract.read.pool([Pid]) as Promise<PoolData>
      );

      console.log("poolInfo:::", pool);

      setPoolData({
        poolWeight: formatUnits((pool[1] as bigint) || BigInt(0), 18),
        lastRewardBlock: formatUnits((pool[2] as bigint) || BigInt(0), 18),
        accMetaNodePerShare: formatUnits((pool[3] as bigint) || BigInt(0), 18),
        stTokenAmount: formatUnits((pool[4] as bigint) || BigInt(0), 18),
        minDepositAmount: formatUnits((pool[5] as bigint) || BigInt(0), 18),
        unstakeLockedBlocks: formatUnits((pool[6] as bigint) || BigInt(0), 18),
        stTokenAddress: pool[0] as string,
      });
    } catch (error) {
      console.error("Failed to fetch pool data:", error);
    }
  }, [stakeContract, address, isConnected]);

  // get MetaNode address
  const fetchMetaNodeAddress = useCallback(async () => {
    if (!stakeContract) return;

    try {
      const address = await retryWithDelay(
        () => stakeContract.read.MetaNode() as Promise<string>
      );
      setMetaNodeAddress(address as string);
    } catch (error) {
      console.error("Failed to fetch MetaNode address:", error);
    }
  }, [stakeContract]);

  const fetchRewardsData = useCallback(async () => {
    if (!stakeContract || !address || !isConnected) return;

    try {
      setLoading(true);

      // get user data
      const userData = await retryWithDelay(
        () => stakeContract.read.user([Pid, address]) as Promise<UserData>
      );
      const stakedAmount = await retryWithDelay(
        () =>
          stakeContract.read.stakingBalance([Pid, address]) as Promise<bigint>
      );

      console.log("User data:", userData);
      console.log("Staked amount:", stakedAmount);

      setRewardsData({
        pendingReward: formatUnits(userData[2] || BigInt(0), 18),
        stakedAmount: formatUnits((stakedAmount as bigint) || BigInt(0), 18),
        lastUpdate: Date.now(),
      });
    } catch (error) {
      console.error("Failed to fetch rewards data:", error);
      // set default value
      setRewardsData({
        pendingReward: "0",
        stakedAmount: "0",
        lastUpdate: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  }, [stakeContract, address, isConnected]);

  // init
  useEffect(() => {
    if (isConnected && address) {
      fetchRewardsData();
      fetchPoolData();
      fetchMetaNodeAddress();
    }
  }, [
    isConnected,
    address,
    fetchRewardsData,
    fetchPoolData,
    fetchMetaNodeAddress,
  ]);

  // Refresh（every 60s）
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      fetchRewardsData();
    }, 60000); // 60s

    return () => clearInterval(interval);
  }, [isConnected, address, fetchRewardsData]);

  // refresh
  const refresh = useCallback(() => {
    fetchRewardsData();
  }, [fetchRewardsData]);

  // add MetaNode to MetaMask
  const addMetaNodeToWallet = useCallback(async () => {
    if (!metaNodeAddress) {
      console.error("MetaNode address is not defined");
      return false;
    }

    try {
      return await addMetaNodeToMetaMask(metaNodeAddress);
    } catch (error) {
      console.error("failed to add MetaNode to metamask:", error);
      return false;
    }
  }, [metaNodeAddress]);

  return {
    rewardsData,
    loading,
    poolData,
    metaNodeAddress,
    refresh,
    addMetaNodeToWallet,
    canClaim: parseFloat(rewardsData.pendingReward) > 0,
  };
};
