'use client';

export default function ModalNota({ isOpen, onClose, nota, onSave }) {
  console.log('ModalNota - isOpen:', isOpen);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{nota ? 'Editar Nota' : 'Nova Nota'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>
        <p>isOpen = {String(isOpen)}</p>
        <button onClick={onClose} className="w-full bg-red-600 text-white py-2 rounded mt-4">Fechar</button>
      </div>
    </div>
  );
}
