import { useAuth } from '@futureverse/auth-react';
import { LoginButton } from './LoginButton';
import { shortAddress } from '@/lib/utils';
import { useAccount } from 'wagmi';
import { LogoutButton } from './LogoutButton';

export default function Wallet() {
  const { userSession } = useAuth();
  const { isConnected } = useAccount();

  if (!userSession || !isConnected) {
    return <LoginButton />;
  }

  return <LogoutButton buttonText={shortAddress(userSession?.futurepass)} />;
}
