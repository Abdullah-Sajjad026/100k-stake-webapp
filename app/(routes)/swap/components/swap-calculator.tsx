'use client';

import {useState} from "react";
import Image from "next/image";
import {Card} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import InputWithSelect from "@/components/ui/input-with-select";
import ASSETS from "@/app/assets";
import {SelectOption} from "@/components/ui/select";
import {MarketTokenItem} from "@/app/actions/token-actions";
import axios from 'axios'
import {useWeb3ModalAccount, useWeb3ModalProvider} from "@web3modal/ethers/react";
import {BrowserProvider} from "ethers";

const SwapCalculator = (
  {
                          token1Id, token2Id, setToken1Id, setToken2Id, tokensData
                        }: {
  token1Id: string,
  token2Id: string,
  setToken1Id: (token: string) => void,
  setToken2Id: (token: string) => void,
  tokensData: MarketTokenItem[]
}) => {
  const {address: walletAddress, chainId, isConnected} = useWeb3ModalAccount()

  const [token1Input, setToken1Input] = useState<number>(1);

  const tokensOptions: SelectOption[] = tokensData.map(token => ({
    label: token.name,
    value: token.id,
    icon: token.image
  }));

  const onesPriceInTwo = (token1: string, token2: string) => {
    // we get the usd values of token 1 and token 2 and perform calculations to know
    // how much token 1 like 1eth is worth in token 2 like 1eth ~~ 2 apecoin
    // we can use the tokenData to get the current price of token 1 and token 2

    const token1Price = tokensData.find(token => token.id === token1)?.current_price;
    const token2Price = tokensData.find(token => token.id === token2)?.current_price;

    if (token1Price && token2Price) {
      return token1Price / token2Price
    } else return 0;
  }

  const getPricesString = (token1: string, token2: string) => {
    const token1Symbol = tokensData.find(token => token.id === token1)?.symbol;
    const token2Symbol = tokensData.find(token => token.id === token2)?.symbol;

    if (token1Symbol && token2Symbol) {
      return `1 ${token1Symbol.toUpperCase()} ≈ ${onesPriceInTwo(token1, token2).toFixed(2)} ${token2Symbol.toUpperCase()}`
    }
  }

  const swapCoins = async () => {
    // Check for allowance 1inch
    const allowance = await axios.get(`https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`)

    if(allowance.data.allowance === "0"){

      const approve = await axios.get(`https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`)

      setTxDetails(approve.data);
      console.log("not approved")
      return

    }

    const tx = await axios.get(
      `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenOne.address}&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(tokenOne.decimals+tokenOneAmount.length, '0')}&fromAddress=${address}&slippage=${slippage}`
    )

    let decimals = Number(`1E${tokenTwo.decimals}`)
    setTokenTwoAmount((Number(tx.data.toTokenAmount)/decimals).toFixed(2));

    setTxDetails(tx.data.tx);


  }

  return (
    <Card>
      <Tabs defaultValue="swap">
        <TabsList>
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="limit">Limit</TabsTrigger>
        </TabsList>
        <TabsContent value="swap" className="mt-4">
          <div>
            <InputWithSelect
              label="Your Sell"
              selectOptions={tokensOptions}
              selectProps={{
                value: token1Id,
                onValueChange: (value: string) => setToken1Id(value)

              }}
              inputProps={{
                value: token1Input,
                onChange: (e) => setToken1Input(Number(e.target.value)),
              }}
            />
            <div className="flex justify-between text-muted-foreground text-sm mt-2">
              <span>
                {
                  getPricesString(token1Id, token2Id)
                }
              </span>
            </div>
          </div>


          <div className="my-4 flex justify-center">
            <Image src={ASSETS.icons.swapArrows} alt="Swap Arrows" className={"h-8 w-8"}/>
          </div>

          <div className={"mt-4"}>
            <InputWithSelect
              label="Your Buy"
              selectOptions={tokensOptions}
              selectProps={{
                value: token2Id,
                onValueChange: (value: string) => setToken2Id(value)
              }}
              inputProps={{
                value: token1Input * onesPriceInTwo(token1Id, token2Id),
                readOnly: true
              }}
            />
            <div className="flex justify-between text-muted-foreground text-sm mt-2">
              <span>
                {
                  getPricesString(token2Id, token1Id)
                }
              </span>
            </div>
          </div>

        </TabsContent>

        <TabsContent value="limit">
          <div>
            <InputWithSelect
              label="Your Sell"
              selectOptions={tokensOptions}
              selectProps={{
                value: token1Id,
                onValueChange: (value: string) => setToken1Id(value)
              }}
              inputProps={{
                value: token1Input,
                onChange: (e) => setToken1Input(Number(e.target.value)),

              }}
            />
            <div className="flex justify-between text-muted-foreground text-sm mt-2">
              <span>
                {getPricesString(token1Id, token2Id)}
              </span>
            </div>
          </div>

          <div className="my-4 flex- justify-center">
            <Image src={ASSETS.icons.swapArrows} alt="Swap Arrows" className={"h-8 w-8"}/>
          </div>

          <div className={"mt-4"}>
            <InputWithSelect
              label="Your Buy"
              selectOptions={tokensOptions}
              selectProps={{
                value: token2Id,
                onValueChange: (value: string) => setToken2Id(value)
              }}
              inputProps={{
                value: token1Input * onesPriceInTwo(token1Id, token2Id),
                readOnly: true
              }}
            />
            <div className="flex justify-between text-muted-foreground text-sm mt-2">
              <span>
                {getPricesString(token2Id, token1Id)}
              </span>
            </div>
          </div>

          <div className="mt-4">
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-center">
        {!isConnected ? <w3m-button/> : <Button className="w-full rounded-full">
          Swap
        </Button>}
      </div>

      {/*<Button className="w-full mt-8 rounded-full">Connect Wallet</Button>*/}
      <p className="text-muted-foreground text-center mx-auto mt-4">
        By using the site and creating an exchange, you agree to the Fixed 100K Stake&apos;s Terms of Services and
        Privacy
        Policy
      </p>

    </Card>
  )
}

export default SwapCalculator;
