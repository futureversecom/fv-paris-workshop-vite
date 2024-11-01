import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { authClient, getWagmiConfig, queryClient } from '@/providers/config';

import type { State } from 'wagmi';
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

const customTheme: ThemeConfig = {
  ...DefaultTheme,
  defaultAuthOption: 'custodial',
};

export default function FutureverseProviders({
  children,
  initialWagmiState,
}: {
  children: React.ReactNode;
  initialWagmiState?: State;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <FutureverseWagmiProvider
        getWagmiConfig={getWagmiConfig}
        initialState={initialWagmiState}
      >
        <FutureverseAuthProvider authClient={authClient}>
          <AuthUiProvider themeConfig={customTheme} authClient={authClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthUiProvider>
        </FutureverseAuthProvider>
      </FutureverseWagmiProvider>
    </QueryClientProvider>
  );
}
