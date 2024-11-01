import { shortAddress } from '@/lib/utils';
import Balance from './Balance';
import { CopyText } from './CopyText';

export default function Account({
  address,
  assetIds,
  type,
}: {
  address: string;
  assetIds: number[];
  type: 'eoa' | 'futurepass';
}) {
  return (
    <div>
      <div className="mr-1 text-[0.6rem] font-extrabold uppercase mb-[2px]">
        {type}
      </div>
      <div className="flex flex-col text-right rounded-md bg-slate-300 bg-opacity-10 p-2">
        <div className="mb-1">
          <div className="text-sm font-extrabold uppercase">
            <CopyText text={address}>{shortAddress(address ?? '')}</CopyText>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          {assetIds.map(assetId => (
            <Balance key={assetId} assetId={assetId} address={address ?? ''} />
          ))}
        </div>
      </div>
    </div>
  );
}
