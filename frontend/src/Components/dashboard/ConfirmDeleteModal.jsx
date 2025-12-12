import { Trash2, X } from "lucide-react";

const ConfirmDeleteModal = ({
  show,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar este registro de forma definitiva?",
  onConfirm,
  onClose,
}) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Cerrar"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                <X size={16} className="me-1" />
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                <Trash2 size={16} className="me-1" />
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeleteModal;
