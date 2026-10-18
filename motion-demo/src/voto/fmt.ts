export const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const fmt1 = (n: number) => n.toFixed(1).replace(".", ",");
