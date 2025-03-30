import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import Divider from "./components/Divider/Divider";

export default function App() {
  const [mnemonicOpenned, setMnemonicOpenned] = useState("");
  const [mnemonicToOpen, setMenemonicToOpen] = useState("");
  const [wallets, setWallets] = useState();
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingOpenWallet, setLoadingOpenWallet] = useState(false);
  const [isOpenInsertMnemonic, setIsOpenInsertMnemonic] = useState(false);
  const [totalSupplyChainlink, setTotalSupplyChainlink] = useState();
  const [loadingTotalSupplyChainlink, setLoadingTotalSupplyChainlink] =
    useState(true);

  const generateWallets = async () => {
    try {
      setLoadingGenerate(true);

      const { data } = await axios.get(
        "https://test-crypto-wallet-backend-production.up.railway.app/create-wallet"
      );

      setMnemonicOpenned(data.mnemonic);
      setWallets(data.wallets);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    Alert.alert(
      "Copiado",
      "O conteúdo foi copiado para a área de transferência."
    );
  };

  const openWallets = async () => {
    try {
      setLoadingOpenWallet(true);

      const { data } = await axios.post(
        "https://test-crypto-wallet-backend-production.up.railway.app/open-wallet",
        {
          mnemonic: mnemonicToOpen,
        }
      );

      setMnemonicOpenned(mnemonicToOpen);
      setMenemonicToOpen("");
      setIsOpenInsertMnemonic(false);
      setWallets(data.wallets);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingOpenWallet(false);
    }
  };

  const openInsertMnemonic = () => {
    setIsOpenInsertMnemonic(true);
  };

  // const fetchTotalSupplyTokenChainlink = async () => {
  //   try {
  //     setLoadingTotalSupplyChainlink(true);

  //     const { data } = await axios.get(
  //       "https://test-crypto-wallet-backend-production.up.railway.app/total-supply-token"
  //     );

  //     setTotalSupplyChainlink(data.totalSupply);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoadingTotalSupplyChainlink(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchTotalSupplyTokenChainlink();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={isOpenInsertMnemonic}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Digite seu mnemônico</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o mnemônico aqui"
              value={mnemonicToOpen}
              onChangeText={setMenemonicToOpen}
              multiline={true}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setIsOpenInsertMnemonic(false)}
              />

              <View style={styles.row}>
                <Button title="Abrir" onPress={openWallets} />

                {loadingOpenWallet && (
                  <ActivityIndicator size="large" color="#0000ff" />
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.header}>Gerador de Carteiras com Frase-semente</Text>

      {/* <View style={styles.row}>
        <Text style={styles.header3}>Quantidade Tokens Chainlink:</Text>

        {loadingTotalSupplyChainlink ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.totalSupplyToken}>
            {totalSupplyChainlink || "--"}
          </Text>
        )}
      </View> */}

      <Button title="Gerar Carteiras" onPress={generateWallets} />

      <Button title="Abrir Carteiras" onPress={openInsertMnemonic} />

      {loadingGenerate && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Carregando...</Text>
        </View>
      )}

      {!!wallets && (
        <>
          <View style={styles.row}>
            <Text style={styles.mnemonic}>
              Frase-semente: {mnemonicOpenned}
            </Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(mnemonicOpenned)}
            >
              <Text style={styles.copyButtonText}>Copiar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.walletList}>
            {Object.values(wallets).map((wallet, index) => (
              <View key={index} style={styles.walletCard}>
                {index !== 0 && <Divider />}

                <Text style={styles.walletName}>{wallet.name}</Text>

                <View style={styles.row}>
                  <Text style={styles.walletDefaultItem}>
                    Endereço: {wallet.address}
                  </Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(wallet.address)}
                  >
                    <Text style={styles.copyButtonText}>Copiar</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <Text style={styles.walletPrivateKey}>
                    Chave Privada: {wallet.privateKey}
                  </Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(wallet.privateKey)}
                  >
                    <Text style={styles.copyButtonText}>Copiar</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.walletAddress}>
                  Saldo: {wallet.balance ?? "--"}
                </Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  copyButton: {
    padding: 6,
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  header3: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalSupplyToken: {
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  mnemonic: {
    marginTop: 20,
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  walletList: {
    marginTop: 20,
    width: "100%",
  },
  walletCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    gap: 8,
    maxWidth: "100%",
  },
  walletName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  walletDefaultItem: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
    flex: 1,
  },
  walletPrivateKey: {
    fontSize: 14,
    marginTop: 5,
    color: "#777",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
