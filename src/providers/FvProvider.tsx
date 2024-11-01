import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { authClient, getWagmiConfig, queryClient } from '@/providers/config';

import type { State } from 'wagmi';
import { TrnApiProvider } from '@futureverse/transact-react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  AuthUiProvider,
  DefaultTheme,
  type ThemeConfig,
} from '@futureverse/auth-ui';

import {
  FutureverseAuthProvider,
  FutureverseWagmiProvider,
} from '@futureverse/auth-react';

import type { NetworkName } from '@therootnetwork/api';
import { AssetRegisterProvider } from './AssetRegisterProvider';

const customTheme: ThemeConfig = {
  ...DefaultTheme,
  defaultAuthOption: 'custodial',
};

const network = (import.meta.env.VITE_NETWORK ?? 'porcini') as
  | NetworkName
  | undefined;

export default function FutureverseProviders({
  children,
  initialWagmiState,
}: {
  children: React.ReactNode;
  initialWagmiState?: State;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TrnApiProvider network={network}>
        <FutureverseWagmiProvider
          getWagmiConfig={getWagmiConfig}
          initialState={initialWagmiState}
        >
          <FutureverseAuthProvider authClient={authClient}>
            <AuthUiProvider themeConfig={customTheme} authClient={authClient}>
              <AssetRegisterProvider>
                {children}

                <ReactQueryDevtools initialIsOpen={false} />
              </AssetRegisterProvider>
            </AuthUiProvider>
          </FutureverseAuthProvider>
        </FutureverseWagmiProvider>
      </TrnApiProvider>
    </QueryClientProvider>
  );
}
