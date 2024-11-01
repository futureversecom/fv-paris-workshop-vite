import type { AssetModel } from '@futureverse/asset-register/models';
import { Skeleton } from './ui/skeleton';

type NftTokenProps = {
  asset: AssetModel;
};

export default function NftToken({ asset }: NftTokenProps) {
  return (
    <>
      <div className="cursor-pointer">
        <div className="aspect-square relative cursor-pointer">
          {asset?.metadata?.properties?.image ? (
            <img
              src={asset?.metadata?.properties?.image}
              alt="alt"
              className="aspect-square relative pointer-events-none cursor-pointer rounded-md overflow-hidden"
            />
          ) : (
            <Skeleton className="aspect-square animate-pulse w-full" />
          )}

          <div className="absolute top-2 left-0 text-left text-sm md:text-base lg:text-lg leading-none font-semibold p-2 bg-slate-400 bg-opacity-50 backdrop-blur-sm">
            {/* @ts-expect-error - Error will be fixed in SDK */}
            Token {asset?.rawData?.tokenId}
          </div>
        </div>
      </div>
    </>
  );
}
