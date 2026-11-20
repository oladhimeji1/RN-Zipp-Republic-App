type Listener = (t: ToastMsg) => void;
export interface ToastMsg {
  id: number;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}
let listener: Listener | null = null;
let n = 0;
export const onToast = (l: Listener | null) => {
  listener = l;
};
export const showToast = (text: string, actionLabel?: string, onAction?: () => void) => {
  listener?.({ id: ++n, text, actionLabel, onAction });
};
