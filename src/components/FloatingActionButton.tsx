import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FloatingActionButtonProps = {
  open: boolean;
  onClick: () => void;
  labelOpen: string;
  labelClose: string;
  colorClassName: string;
  icon: ReactNode;
};

export default function FloatingActionButton({
  open,
  onClick,
  labelOpen,
  labelClose,
  colorClassName,
  icon,
}: FloatingActionButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl transition ${colorClassName}`}
      aria-pressed={open}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        {icon}
      </span>
      <span>{open ? labelClose : labelOpen}</span>
    </motion.button>
  );
}