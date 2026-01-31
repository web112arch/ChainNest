import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import {
  validateAddress,
  getEthBalance,
  getUsdcBalance,
  getBlockNumber,
  getAddressTransactions,
} from "../services/blockchain";

function shortHash(h) {
  if (!h || typeof h !== "string") return "";
  return `${h.slice(0, 10)}…${h.slice(-8)}`;
}

export default function HomeScreen() {
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Enter an address to read Base data.");
  const [eth, setEth] = useState(null);
  const [usdc, setUsdc] = useState(null);
  const [block, setBlock] = useState(null);
  const [txs, setTxs] = useState([]);

  async function onCheck() {
    const a = address.trim();

    if (!validateAddress(a)) {
      setEth(null);
      setUsdc(null);
      setBlock(null);
      setTxs([]);
      setStatus("Invalid address. Please paste a valid 0x… EVM address.");
      return;
    }

    setStatus("Reading onchain data…");
    try {
      const [bal, usdcBal, bn, latestTxs] = await Promise.all([
        getEthBalance(a),
        getUsdcBalance(a),
        getBlockNumber(),
        getAddressTransactions(a, 10),
      ]);

      setEth(bal);
      setUsdc(usdcBal);
      setBlock(bn);
      setTxs(latestTxs);
      setStatus("Done.");
    } catch (e) {
      setEth(null);
      setUsdc(null);
      setBlock(null);
      setTxs([]);
      setStatus("Error reading RPC / explorer API. Try again later.");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
      <Text style={{ fontSize: 26, fontWeight: "800" }}>ChainNest</Text>
      <Text style={{ marginTop: 6, opacity: 0.8 }}>
        Read-only Base onchain viewer
      </Text>

      <Text style={{ marginTop: 18, fontWeight: "700" }}>Wallet address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="0x…"
        style={{
          marginTop: 8,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          padding: 12,
        }}
      />

      <Pressable
        onPress={onCheck}
        style={{
          marginTop: 12,
          backgroundColor: "black",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>
          Check on Base
        </Text>
      </Pressable>

      <Text style={{ marginTop: 12 }}>{status}</Text>

      {eth !== null && (
        <View style={{ marginTop: 18 }}>
          <Text style={{ fontWeight: "800" }}>Results</Text>
          <Text style={{ marginTop: 8 }}>ETH: {eth}</Text>
          <Text>USDC: {usdc}</Text>
          <Text>Latest block: {block}</Text>
        </View>
      )}

      {txs?.length > 0 && (
        <View style={{ marginTop: 18 }}>
          <Text style={{ fontWeight: "700" }}>Latest transactions</Text>

          {txs.map((tx) => (
            <View
              key={tx.hash}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text numberOfLines={1}>Hash: {shortHash(tx.hash)}</Text>
              <Text numberOfLines={1}>
                From: {tx.from?.hash || tx.from}
              </Text>
              <Text numberOfLines={1}>To: {tx.to?.hash || tx.to}</Text>
              <Text>Value (wei): {tx.value}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}