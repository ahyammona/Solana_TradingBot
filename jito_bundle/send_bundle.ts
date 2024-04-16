

import {searcherClient} from 'jito-ts/dist/sdk/block-engine/searcher';
import {build_bundle, onBundleResult} from './build_bundle';
import { Wallet } from '@project-serum/anchor';
import { Connection, Keypair } from '@solana/web3.js';

 //export const blockEngineUrl = 'tokyo.mainnet.block-engine.jito.wtf';
export const blockEngineUrl = 'amsterdam.mainnet.block-engine.jito.wtf';
 const privateKey = new Uint8Array([
  228,110,17,108,138,39,103,38,106,160,16,109,222,208,45,94,230,140,168,148,7,166,98,119,236,96,146,0,195,58,217,250,24,236,168,240,15,121,103,31,131,5,134,250,32,85,157,61,17,183,118,63,13,234,77,232,151,30,62,120,119,73,185,174
]);


 const wallet = new Wallet(Keypair.fromSecretKey(privateKey));



 const rpc_https_url = "https://rpc.shyft.to?api_key=y95Oi5qy1j3Ik2w0";
 const connection = new Connection(rpc_https_url, "confirmed");

export async function bull_dozer(swap_ix) {

  console.log('BLOCK_ENGINE_URL:', blockEngineUrl);
  const bundleTransactionLimit = parseInt('3');

  const search = searcherClient(blockEngineUrl, wallet.payer);


  await build_bundle(
    search,
    bundleTransactionLimit,
    swap_ix,
    connection
  );
 const bundle_result = await onBundleResult(search)
return bundle_result

// search.onBundleResult(
//   (bundle) => {
//     console.log(`JITO bundle result: ${JSON.stringify(bundle)}`);
//     return true;
//   },
//   (error) => {
//     console.log(`JITO bundle error: ${error}`);
//     return false;
//   }
// );

}
