import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

type QRCodeModalProps = {
  visible: boolean;
  value: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
};

export default function QRCodeModal({
  visible,
  value,
  title = "Código QR del Ticket",
  subtitle = "Presenta este código en la entrada del evento.",
  onClose,
}: QRCodeModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={value || "ticket-no-disponible"}
              size={230}
              color="black"
              backgroundColor="white"
            />
          </View>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.pressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "white",
    padding: 24,
  },
  title: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  qrContainer: {
    marginTop: 20,
    borderRadius: 18,
    backgroundColor: "white",
    padding: 16,
  },
  subtitle: {
    marginTop: 16,
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 22,
    width: "100%",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#111827",
    paddingVertical: 13,
  },
  closeButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.85,
  },
});
