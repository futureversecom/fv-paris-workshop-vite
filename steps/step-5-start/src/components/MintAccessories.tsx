import {
  CLOTHING_COLLECTION_ID,
  HEAD_COLLECTION_ID,
  NECK_COLLECTION_ID,
  shortAddress,
  GAS_TOKENS,
} from '@/lib/utils';
import { useAuth, useFutureverseSigner } from '@futureverse/auth-react';
import { useCallback, useMemo, useState } from 'react';
import { useTrnApi } from '@futureverse/transact-react';
import {
  type Extrinsic,
  type ExtrinsicPayload,
  type RootTransactionBuilder,
  TransactionBuilder,
} from '@futureverse/transact';
import { getAddress, isAddress } from 'viem';
import type { u128, u32, Vec } from '@polkadot/types';
import Modal from '@/components/Modal';
import { useShouldShowEoa } from '@/hooks/useShouldShowEoa';
import { useGetSftUserTokens } from '@/hooks/useGetSftUserTokens';
import { Button } from '@/components/ui/button';
import type { ITuple } from '@polkadot/types/types';
import SftSelector from '@/components/SftSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

export type TokenType = {
  tokenId: number;
  quantity: number;
  collectionId: number;
};

export type GasProps = {
  gasString: string;
  gasFee: string;
  tokenDecimals: number;
};
export default function MintAccessories() {
  const queryClient = useQueryClient();
  const shouldShowEoa = useShouldShowEoa();

  const { userSession } = useAuth();
  const signer = useFutureverseSigner();
  const { trnApi } = useTrnApi();

  const [selectedTokens, setSelectedTokens] = useState<Array<TokenType> | null>(
    null
  );

  const { data: sftFpClothingTokens, isFetching: isFpClothingFetching } =
    useGetSftUserTokens(CLOTHING_COLLECTION_ID, userSession?.futurepass ?? '');
  const { data: sftEoaClothingTokens, isFetching: isEoaClothingFetching } =
    useGetSftUserTokens(CLOTHING_COLLECTION_ID, userSession?.eoa ?? '');

  const { data: sftFpNeckTokens, isFetching: isFpNeckFetching } =
    useGetSftUserTokens(NECK_COLLECTION_ID, userSession?.futurepass ?? '');
  const { data: sftEoaNeckTokens, isFetching: isEoaNeckFetching } =
    useGetSftUserTokens(NECK_COLLECTION_ID, userSession?.eoa ?? '');

  const { data: sftFpHeadTokens, isFetching: isFpHeadFetching } =
    useGetSftUserTokens(HEAD_COLLECTION_ID, userSession?.futurepass ?? '');
  const { data: sftEoaHeadTokens, isFetching: isEoaHeadFetching } =
    useGetSftUserTokens(HEAD_COLLECTION_ID, userSession?.eoa ?? '');

  const isFetching =
    isFpClothingFetching ||
    isEoaClothingFetching ||
    isFpNeckFetching ||
    isEoaNeckFetching ||
    isFpHeadFetching ||
    isEoaHeadFetching;

  const mergedClothingTokens = useMemo(() => {
    if (!sftFpClothingTokens || !sftEoaClothingTokens) {
      return [];
    }

    const tokens = sftFpClothingTokens.map(token => {
      const eoaToken = sftEoaClothingTokens.find(
        eoaToken => eoaToken.id === token.id
      );

      return {
        id: token.id,
        tokenName: token?.tokenName,
        reservedBalance:
          Number(token?.reservedBalance ?? '0') +
          Number(eoaToken?.reservedBalance ?? '0'),
        freeBalance:
          Number(token?.freeBalance ?? '0') +
          Number(eoaToken?.freeBalance ?? '0'),
      };
    });

    return tokens;
  }, [sftFpClothingTokens, sftEoaClothingTokens]);

  const mergedNeckTokens = useMemo(() => {
    if (!sftFpNeckTokens || !sftEoaNeckTokens) {
      return [];
    }

    const tokens = sftFpNeckTokens.map(token => {
      const eoaToken = sftEoaNeckTokens.find(
        eoaToken => eoaToken.id === token.id
      );

      return {
        id: token.id,
        tokenName: token?.tokenName,
        reservedBalance:
          Number(token?.reservedBalance ?? '0') +
          Number(eoaToken?.reservedBalance ?? '0'),
        freeBalance:
          Number(token?.freeBalance ?? '0') +
          Number(eoaToken?.freeBalance ?? '0'),
      };
    });

    return tokens;
  }, [sftFpNeckTokens, sftEoaNeckTokens]);

  const mergedHeadTokens = useMemo(() => {
    if (!sftFpHeadTokens || !sftEoaHeadTokens) {
      return [];
    }

    const tokens = sftFpHeadTokens.map(token => {
      const eoaToken = sftEoaHeadTokens.find(
        eoaToken => eoaToken.id === token.id
      );

      return {
        id: token.id,
        tokenName: token?.tokenName,
        reservedBalance:
          Number(token?.reservedBalance ?? '0') +
          Number(eoaToken?.reservedBalance ?? '0'),
        freeBalance:
          Number(token?.freeBalance ?? '0') +
          Number(eoaToken?.freeBalance ?? '0'),
      };
    });

    return tokens;
  }, [sftFpHeadTokens, sftEoaHeadTokens]);

  const [gas, setGas] = useState<GasProps>({
    gasString: '',
    gasFee: '',
    tokenDecimals: 0,
  });

  const [payload, setPayload] = useState<null | ExtrinsicPayload>(null);

  const [walletToPayGas, setWalletToPayGas] = useState<'fpass' | 'eoa'>(
    'fpass'
  );
  const [gasTokenId, setGasTokenId] = useState<number>(2);
  const [toSign, setToSign] = useState<string>('');
  const [currentBuilder, setCurrentBuilder] =
    useState<RootTransactionBuilder | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const onSuccessfulMint = useCallback(async () => {
    setSelectedTokens(null);

    void queryClient.invalidateQueries({ queryKey: ['sft-tokens'] });
    void queryClient.invalidateQueries({ queryKey: ['tokens'] });
    void queryClient.invalidateQueries({ queryKey: ['balance'] });
  }, [queryClient]);

  const mintBuilder = useCallback(async () => {
    if (!trnApi || !signer || !userSession) {
      console.log('Missing trnApi, signer or userSession');
      return;
    }

    const addressToSend = getAddress(userSession.futurepass);

    if (isAddress(addressToSend) && parseInt(addressToSend) === 0) {
      throw new Error('Invalid futurepass address');
    }

    const getExtrinsic = async (builder: RootTransactionBuilder) => {
      const gasEstimate = await builder?.getGasFees();
      if (gasEstimate) {
        setGas(gasEstimate);
      }
      const payloads = await builder?.getPayloads();
      if (!payloads) {
        return;
      }
      setPayload(payloads);
      const { ethPayload } = payloads;
      setToSign(ethPayload.toString());
    };

    const getTokensToMint = (
      tokens:
        | { collectionId: number; tokenId: number; quantity: number }[]
        | undefined,
      collectionId: number,
      addressToSend: string
    ) => {
      const tokensToMint =
        tokens && tokens.length > 0
          ? (tokens?.map(t => [t.tokenId, t.quantity]) as unknown as Vec<
              ITuple<[u32, u128]>
            >)
          : undefined;

      return tokensToMint
        ? trnApi.tx.sft.mint(collectionId, tokensToMint, addressToSend)
        : null;
    };

    const headTokens = selectedTokens?.filter(
      token => token.collectionId === HEAD_COLLECTION_ID
    );
    const neckTokens = selectedTokens?.filter(
      token => token.collectionId === NECK_COLLECTION_ID
    );
    const clothingTokens = selectedTokens?.filter(
      token => token.collectionId === CLOTHING_COLLECTION_ID
    );

    const headExtrinsic = getTokensToMint(
      headTokens,
      HEAD_COLLECTION_ID,
      addressToSend
    );
    const neckExtrinsic = getTokensToMint(
      neckTokens,
      NECK_COLLECTION_ID,
      addressToSend
    );
    const clothingExtrinsic = getTokensToMint(
      clothingTokens,
      CLOTHING_COLLECTION_ID,
      addressToSend
    );

    const extrinsics = [headExtrinsic, neckExtrinsic, clothingExtrinsic].filter(
      ex => ex !== null
    ) as Extrinsic[];

    const batch = TransactionBuilder.batch(trnApi, signer, userSession.eoa);
    batch.batchAllWithExtrinsics(extrinsics);

    if (walletToPayGas === 'fpass') {
      if (gasTokenId === 2) {
        await batch.addFuturePass(userSession.futurepass);
      }

      if (gasTokenId !== 2) {
        await batch.addFuturePassAndFeeProxy({
          futurePass: userSession.futurepass,
          assetId: gasTokenId,
          slippage: 5,
        });
      }
    }

    if (walletToPayGas === 'eoa') {
      if (gasTokenId !== 2) {
        await batch.addFeeProxy({
          assetId: gasTokenId,
          slippage: 5,
        });
      }
    }

    await getExtrinsic(batch);
    setCurrentBuilder(batch);
  }, [selectedTokens, trnApi, signer, userSession, walletToPayGas, gasTokenId]);

  useMemo(() => {
    setShowModal(!!toSign);
  }, [toSign]);

  return (
    <>
      <main
        className={`flex min-h-[calc(100dvh-6rem-1rem)] flex-col items-center text-white ${isFetching ? 'fetching' : ''}`}
      >
        <div className="container grid grid-cols-1 gap-16 pb-8">
          <SftSelector
            type="Clothing"
            collectionId={CLOTHING_COLLECTION_ID}
            sftTokens={mergedClothingTokens}
            selectedTokens={selectedTokens}
            setSelectedTokens={setSelectedTokens}
          />
          <SftSelector
            type="Head"
            collectionId={HEAD_COLLECTION_ID}
            sftTokens={mergedHeadTokens}
            selectedTokens={selectedTokens}
            setSelectedTokens={setSelectedTokens}
          />
          <SftSelector
            type="Neck"
            collectionId={NECK_COLLECTION_ID}
            sftTokens={mergedNeckTokens}
            selectedTokens={selectedTokens}
            setSelectedTokens={setSelectedTokens}
          />

          {showModal && (
            <Modal
              setShow={() => setShowModal(false)}
              gas={gas}
              toSign={toSign}
              payload={payload}
              gasTokenId={gasTokenId}
              walletAddress={
                (walletToPayGas === 'fpass'
                  ? userSession?.futurepass
                  : userSession?.eoa) ?? ''
              }
              extrinsicBuilder={currentBuilder}
              // signedCallback={signedCallback}
              resultCallback={onSuccessfulMint}
            />
          )}
        </div>
      </main>
      {selectedTokens && selectedTokens.length > 0 && (
        <div className="sticky bottom-0 w-full p-4">
          <div className="bg-slate-500 backdrop-blur-sm bg-opacity-50 justify-end w-full p-4 flex flex-row rounded-md gap-2 flex-wrap">
            {shouldShowEoa && userSession && (
              <div className="md:col-span-3">
                <Select
                  onValueChange={value =>
                    setWalletToPayGas(value as 'fpass' | 'eoa')
                  }
                  value={walletToPayGas}
                >
                  <SelectTrigger className="  leading-6 p-4 h-12 bg-white text-background">
                    <SelectValue
                      placeholder="Account To Pay Gas"
                      className="font-bold bg-white"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eoa">
                      {shortAddress(userSession?.eoa)}
                    </SelectItem>
                    <SelectItem value="fpass">
                      {shortAddress(userSession?.futurepass)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div
              className={`${!shouldShowEoa ? 'md:col-span-5' : 'md:col-span-2'}`}
            >
              <Select
                onValueChange={value => setGasTokenId(parseInt(value))}
                value={gasTokenId.toString()}
              >
                <SelectTrigger className="leading-6 p-4 h-12 bg-white text-background">
                  <SelectValue
                    placeholder="Select Gas Token"
                    className="font-bold bg-white"
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(GAS_TOKENS).map(key => (
                    <SelectItem
                      key={key}
                      value={GAS_TOKENS[
                        key as keyof typeof GAS_TOKENS
                      ].toString()}
                    >
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="h-12" onClick={mintBuilder}>
              Mint Selected Tokens
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
