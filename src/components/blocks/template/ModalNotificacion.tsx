"use client";

interface ConfirmModalProps {
  open: boolean;
  text: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  text,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[350px] shadow">
        <h2 className="text-lg  mb-4">{text}</h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="w-50 px-4 py-2 text-[#4f4e4e]  cursor-pointer border-r-[1px] border-[#d1d1d1] "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="w-50 px-4 py-2 text-[#000] rounded cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
