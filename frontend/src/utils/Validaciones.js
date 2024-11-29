
export const validarNombre = (nombre, setErrores) => {
    if (nombre.trim() === '') {
        setErrores((prev) => ({ ...prev, nombre: 'El nombre es obligatorio.' }));
    } else if (nombre.length < 2) {
        setErrores((prev) => ({ ...prev, nombre: 'El nombre debe tener al menos 2 caracteres.' }));
    } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(nombre)) {
        setErrores((prev) => ({ ...prev, nombre: 'El nombre solo puede contener letras.' }));
    } else {
        setErrores((prev) => ({ ...prev, nombre: '' }));
    }
};

// Validación de apellido
export const validarApellido = (apellido, setErrores) => {
    if (apellido.trim() === '') {
        setErrores((prev) => ({ ...prev, apellido: 'El apellido es obligatorio.' }));
    } else if (apellido.length < 2) {
        setErrores((prev) => ({ ...prev, apellido: 'El apellido debe tener al menos 2 caracteres.' }));
    } else if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(apellido)) {
        setErrores((prev) => ({ ...prev, apellido: 'El apellido solo puede contener letras.' }));
    } else {
        setErrores((prev) => ({ ...prev, apellido: '' }));
    }
};

// Validación de email
export const validarEmail = async (email,id, setErrores) => {
    if (email.trim() === '') {
        setErrores((prev) => ({ ...prev, email: 'El correo electrónico es obligatorio.' }));
    } else {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            setErrores((prev) => ({ ...prev, email: 'El correo electrónico no es válido.' }));
        } else {
            try {
                const response = await fetch("http://localhost:9090/auth/VerificarEmail", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, id  }),
                });

                if (response.status === 409) {
                    setErrores((prev) => ({ ...prev, email: 'El correo electrónico ya está en uso.' }));
                } else if(response.status == 200) {
                    setErrores((prev) => ({ ...prev, email: '' }));

                } else {
                    setErrores((prev) => ({ ...prev, email: 'Error al verificar el correo.' }));
                }

            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setErrores((prev) => ({ ...prev, email: 'Error en la conexión con el servidor.' }));
            }
        }
    }
};


// Validación de DNI
export const validarDni = async (dni,id, setErrores) => {
    if (dni.trim() === '') {
        setErrores((prev) => ({ ...prev, dni: 'El DNI es obligatorio.' }));
    } else if (!/^\d{8}$/.test(dni)) {
        setErrores((prev) => ({ ...prev, dni: 'El DNI debe tener exactamente 8 dígitos numéricos.' }));
    } else {
        try {
            const response = await fetch("http://localhost:9090/auth/VerificarDNI", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dni, id}),
            });

            if (response.status === 410) {
                setErrores((prev) => ({ ...prev, dni: 'DNI ya se encuentra registrado' }));
            } else if (response.status == 200) {
                setErrores((prev) => ({ ...prev, dni: '' }));

            } else {
                setErrores((prev) => ({ ...prev, dni: 'Error al verificar el dni.' }));
            }

            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setErrores((prev) => ({ ...prev, dni: 'Error en la conexión con el servidor.' }));
        }
    }
};

// Validación de teléfono
export const validarTelefono = (telefono, setErrores) => {
    if (telefono.trim() === '') {
        setErrores((prev) => ({ ...prev, telefono: 'El número de teléfono es obligatorio.' }));
    } else if (!/^\d{9}$/.test(telefono)) {
        setErrores((prev) => ({ ...prev, telefono: 'El número de teléfono debe tener 9 dígitos.' }));
    } else {
        setErrores((prev) => ({ ...prev, telefono: '' }));
    }
};

// Validación de fecha de nacimiento
export const validarFechaNacimiento = (fechaNacimiento, setErrores) => {
    if (fechaNacimiento.trim() === '') {
        setErrores((prev) => ({ ...prev, fechaNacimiento: 'La fecha de nacimiento es obligatoria.' }));
    } else {
        const today = new Date();
        const birthDate = new Date(fechaNacimiento);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
        if (birthDate > eighteenYearsAgo) {
            setErrores((prev) => ({ ...prev, fechaNacimiento: 'Debes tener al menos 18 años para registrarte.' }));
        } else {
            setErrores((prev) => ({ ...prev, fechaNacimiento: '' }));
        }
    }
};

// Validación de contraseña
export const validarPassword = (password, setErrores) => {
    if (password.trim() === '') {
        setErrores((prev) => ({ ...prev, password: 'La contraseña es obligatoria.' }));
    } else if (password.length < 5) {
        setErrores((prev) => ({ ...prev, password: 'La contraseña debe tener al menos 5 caracteres.' }));
    } else if (!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
        setErrores((prev) => ({ ...prev, password: 'La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial.' }));
    } else {
        setErrores((prev) => ({ ...prev, password: '' }));
    }
};

// Validación de confirmación de contraseña
export const validarConfirmPassword = (password, confirmPassword, setErrores) => {
    if (confirmPassword.trim() === '') {
        setErrores((prev) => ({ ...prev, confirmPassword: 'La confirmación de la contraseña es obligatoria.' }));
    } else if (password !== confirmPassword) {
        setErrores((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden.' }));
    } else {
        setErrores((prev) => ({ ...prev, confirmPassword: '' }));
    }
};
