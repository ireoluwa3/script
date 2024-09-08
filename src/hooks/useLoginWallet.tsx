import { useAccount, useDisconnect, useSignMessage, useConnect } from "wagmi";
import { useState } from "react";
import { siweConfig } from "@/utils/siwe";
import { toast } from "sonner";

export const useLoginWallet = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage(); // Use signMessageAsync to handle promises correctly
  const { connect, error } = useConnect();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // State to store the message

  const handleWalletLogin = async (address: string, chainId: number) => {
    setLoading(true);
    try {
      const messageParams = await siweConfig.getMessageParams();
      const nonce = await siweConfig.getNonce();
      const message = siweConfig.createMessage({
        ...messageParams,
        address,
        nonce,
        chainId,
        version: "1",
      });

      // Call signMessageAsync directly to get the signature
      const signature = await signMessageAsync({ message });

      if (!signature) {
        throw new Error("Failed to sign message");
      }

      setSignature(signature);
      setMessage(message);
    } catch (error) {
      console.error(error);
      toast.error("Signing process was cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (connector: any) => {
    setLoading(true);
    try {
      await connect({ connector });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    siweConfig.signOut();
  };

  return {
    isConnected,
    address,
    loading,
    connectWallet,
    disconnectWallet,
    error,
    handleWalletLogin,
    signature,
    message, // Export the message state
  };
};
