import Swal from 'sweetalert2';

export const AlertaDeEliminacion = async (title = '¿Está seguro?', text = 'Esta acción no se puede deshacer.') => {
    return await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
};

export const AlertaDeExito = (title = 'Éxito', text = 'Operación realizada exitosamente') => {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        timer: 2000,
        showConfirmButton: false,
    });
};

export const AlertaDeError = (title = 'Error', text = 'Ocurrió un error inesperado') => {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: 'Aceptar'
    });
};
