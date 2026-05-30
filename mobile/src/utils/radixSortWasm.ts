// React Native no soporta .wasm/.zig de forma nativa sin bridges complejos.
// Por eso aquí se mantiene ÚNICAMENTE la versión de respaldo en JavaScript
// (Array.prototype.sort). No se intenta linkear radix_sort.zig.

export async function sortEventsByAforo<T>(
  events: T[],
  ascending = true
): Promise<T[]> {
  const eventsWithIndex = events.map((event, index) => ({
    event,
    aforo: (event as { aforo?: number }).aforo || 0,
    originalIndex: index,
  }));

  eventsWithIndex.sort((a, b) =>
    ascending ? a.aforo - b.aforo : b.aforo - a.aforo
  );

  return eventsWithIndex.map((item) => item.event);
}

export async function sortEventsByPrice<T>(
  events: T[],
  ascending = true
): Promise<T[]> {
  const eventsWithIndex = events.map((event, index) => ({
    event,
    precio: (event as { precioMinimo?: number }).precioMinimo || 0,
    originalIndex: index,
  }));

  eventsWithIndex.sort((a, b) =>
    ascending ? a.precio - b.precio : b.precio - a.precio
  );

  return eventsWithIndex.map((item) => item.event);
}
