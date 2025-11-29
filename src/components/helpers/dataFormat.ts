const mes = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function formatFechaArgentina(
  fecha?: Date | string | null,
  tipo: "Mes" | "DMA" = "DMA",
  hora: boolean = false
): string {
  if (!fecha) return "-";

  const dateObj = fecha instanceof Date ? fecha : new Date(fecha);
  if (isNaN(dateObj.getTime())) return "-";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();

  let base =
    tipo === "DMA"
      ? `${day}/${month}/${year}`
      : mes[monthIndex];

  if (hora) {
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const mm = String(dateObj.getMinutes()).padStart(2, "0");
    const ss = String(dateObj.getSeconds()).padStart(2, "0");
    base += ` ${hh}:${mm}:${ss}`;
  }

  return base;
}
