import { getBalance } from '../lib/utils';
import { useTransactQuery } from '@/hooks/useTransactQuery';
import { useQuery } from '@tanstack/react-query';

type UserBalance = {
  balance: string;
  rawBalance: string;
  decimals: number;
};

export default function useGetUserBalance({
  walletAddress,
  assetId,
}: {
  walletAddress: string;
  assetId: number;
}) {
  const transactionQuery = useTransactQuery();

  return useQuery<UserBalance, Error>({
    queryKey: ['balance', walletAddress, assetId],
    queryFn: async () => getBalance(transactionQuery, walletAddress, assetId),
    enabled:
      !!walletAddress &&
      walletAddress !== '' &&
      !!assetId &&
      !!transactionQuery,
  });
}
