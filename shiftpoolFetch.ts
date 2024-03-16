
import { TxnAction } from "@shyft-to/js";
import { Network, ShyftSdk } from "@shyft-to/js"
import { fetch} from "cross-fetch";
import express, {Express,Request, Response} from 'express'

const app: Express = express();
const PORT = 5001;
app.use(express.json())

app.listen(
  PORT, 
  () => console.log(`its live on https://localhost:${PORT}`)
);

app.post("/api/callback", (req: Request, res: Response) => {
    const data = req.body
    console.log(data.signatures[0]);   
 });

 //const RAYDIUM_AMM_ADDRESS = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";

//  const registerCallback = async () => {
//    const shyft = new ShyftSdk({
//      apiKey: 'YMyDOr87OBzT6TWr',
//      network: Network.Mainnet,
//    });
//    await shyft.callback.update({
//      network: Network.Mainnet,
//      id : '65f4bce642338afdbf3d4c08',
//      addresses: [RAYDIUM_AMM_ADDRESS],
//      // The URL of your API that listens for the callback event.
//      // We will be set up in the next step.
//      callbackUrl: `https://probably-suited-possum.ngrok-free.app/api/callback`,
//      // In our tutorial, we are only interested in three events, but you can provide as many events as you like.
//      events: [TxnAction.CREATE_POOL],
//    });
//    console.log("success");
//  };
//  const ACTIONS = [
//      TxnAction.ADD_LIQUIDITY,
//      TxnAction.REMOVE_LIQUIDITY,
//      TxnAction.SWAP,
//      TxnAction.CREATE_POOL,
//    ];
  
// export async function POST(req: NextRequest, res: NextApiResponse) {
//     const body = (await req.json()) as CallbackDataType;
  
//     if (
//       !body.type ||
//       !body.actions ||
//       body.status !== "Success" ||
//       !ACTIONS.includes(body.type as TxnAction)
//     )
//       return res.status(400).json({ message: "Invalid callback data" });
  
//     // You can store the callback data into database for later use.
//     console.log(body, { depth: null });
  
//     return Response.json({ success: true });
//   }
  
// var myHeaders = new Headers();
// myHeaders.append("x-api-key", "YMyDOr87OBzT6TWr");

// var requestOptions : RequestInit = {
//   method: 'GET',
//   headers: myHeaders,
//   redirect: 'follow'
// };

// async function testPost() {
//   const data = await fetch('https://probably-suited-possum.ngrok-free.app/api/callback',
// {
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   },
//   method: "POST",
//   body: JSON.stringify({message:'testing callbacks'})
// })
//   console.log("Working");
//   console.log(data)
// }
// testPost(); 
//registerCallback();