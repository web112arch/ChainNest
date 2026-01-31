import { useState } from react;
import { View, Text, TextInput, Pressable } from react-native;
import { validateAddress, getEthBalance, getBlockNumber } from ..servicesblockchain;

export default function HomeScreen() {
  const [address, setAddress] = useState();
  const [status, setStatus] = useState(Enter an address to read Base balances.);
  const [eth, setEth] = useState(null);
  const [block, setBlock] = useState(null);

  async function onCheck() {
    const a = address.trim();

    if (!validateAddress(a)) {
      setEth(null);
      setBlock(null);
      setStatus(Invalid address. Please paste a valid 0x… EVM address.);
      return;
    }

    setStatus(Reading onchain data…);
    try {
      const [bal, bn] = await Promise.all([getEthBalance(a), getBlockNumber()]);
      setEth(bal);
      setBlock(bn);
      setStatus(Done.);
    } catch (e) {
      setEth(null);
      setBlock(null);
      setStatus(Error reading RPC. Try again later or change RPC endpoint.);
    }
  }

  return (
    View style={{ flex 1, padding 18, justifyContent center }}
      Text style={{ fontSize 24, fontWeight 700 }}ChainNestText
      Text style={{ marginTop 6, opacity 0.8 }}Read-only Base onchain viewerText

      Text style={{ marginTop 18, fontWeight 600 }}Wallet addressText
      TextInput
        value={address}
        onChangeText={setAddress}
        autoCapitalize=none
        autoCorrect={false}
        placeholder=0x…
        style={{
          marginTop 8,
          borderWidth 1,
          borderColor #ddd,
          borderRadius 10,
          padding 12
        }}
      

      Pressable
        onPress={onCheck}
        style={{
          marginTop 12,
          backgroundColor black,
          paddingVertical 12,
          borderRadius 10,
          alignItems center
        }}
      
        Text style={{ color white, fontWeight 700 }}Check on BaseText
      Pressable

      Text style={{ marginTop 12 }}{status}Text

      {eth !== null && (
        View style={{ marginTop 18 }}
          Text style={{ fontWeight 700 }}ResultsText
          Text style={{ marginTop 8 }}ETH {eth}Text
          TextLatest block {block}Text
        View
      )}
    View
  );
}