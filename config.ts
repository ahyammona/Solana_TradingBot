import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import {
 TxVersion
} from "@raydium-io/raydium-sdk";
import * as bs58 from 'bs58';
import { Wallet } from "@project-serum/anchor";


// define these
//export const blockEngineUrl = 'tokyo.mainnet.block-engine.jito.wtf';
export const blockEngineUrl = 'frankfurt.mainnet.block-engine.jito.wtf';


const privateKey = new Uint8Array([
  228,110,17,108,138,39,103,38,106,160,16,109,222,208,45,94,230,140,168,148,7,166,98,119,236,96,146,0,195,58,217,250,24,236,168,240,15,121,103,31,131,5,134,250,32,85,157,61,17,183,118,63,13,234,77,232,151,30,62,120,119,73,185,174
]);
export const wallet = new Wallet(Keypair.fromSecretKey(privateKey));



export const rpc_https_url = "https://rpc.shyft.to?api_key=y95Oi5qy1j3Ik2w0";



export const lookupTableCache= {}
export const connection = new Connection(rpc_https_url, "confirmed");
export const makeTxVersion = TxVersion.V0 // LEGACY
export const addLookupTableInfo = undefined // only mainnet. other = undefined


