import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type CompraTicket = {
  id: string;
  eventoId: string;
  montoTotal: number;
  metodoPago: string;
  estadoPago: string;
};

type TicketCardProps = {
  compra: CompraTicket;
  onShowQR: (compra: CompraTicket) => void;
};

const statusLabel: Record<string, string> = {
  pagado: "Confirmado",
  pendiente: "Pendiente",
  cancelado: "Cancelado",
};

function getBadgeStyle(estado: string) {
  if (estado === "pagado") return styles.badgePagado;
  if (estado === "pendiente") return styles.badgePendiente;
  if (estado === "cancelado") return styles.badgeCancelado;
  return styles.badgeDefault;
}

export default function TicketCard({ compra, onShowQR }: TicketCardProps) {
  const estado = compra.estadoPago?.toLowerCase() ?? "";
  const canShowQR = estado === "pagado";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.badge, getBadgeStyle(estado)]}>
          {statusLabel[estado] ?? compra.estadoPago}
        </Text>
        <Text style={styles.amount}>S/ {Number(compra.montoTotal).toFixed(2)}</Text>
      </View>

      <Text style={styles.title}>Evento #{compra.eventoId.slice(0, 8)}</Text>

      <Text style={styles.meta}>Método de pago: {compra.metodoPago}</Text>
      <Text style={styles.meta}>Código de compra: {compra.id.slice(0, 12)}</Text>

      <Pressable
        accessibilityRole="button"
        disabled={!canShowQR}
        style={({ pressed }) => [
          styles.button,
          !canShowQR && styles.buttonDisabled,
          pressed && canShowQR && styles.pressed,
        ]}
        onPress={() => onShowQR(compra)}
      >
        <Text style={styles.buttonText}>
          {canShowQR ? "Ver Ticket QR" : "QR no disponible"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "800",
  },
  badgePagado: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },
  badgePendiente: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  badgeCancelado: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  badgeDefault: {
    backgroundColor: "#E2E8F0",
    color: "#334155",
  },
  amount: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  title: {
    marginTop: 12,
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 14,
  },
  button: {
    marginTop: 14,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});
