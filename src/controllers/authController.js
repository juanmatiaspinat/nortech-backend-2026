const supabase = require("../config/supabase");
const authModel = require("../models/User");
const { mostrarRolPorId } = require("../models/User");
exports.signUpNewEmail = async (req, res, next) => {
    // 1. Validación y preparación de datos
    const requiredFields = ['idperfil', 'nombre', 'apellido', 'usuario', 'contraseña', 'email'];

    let supabaseUser;
    const {
        idperfil,
        nombre,
        apellido,
        usuario,
        contraseña,
        email,
        dni,
        fechanacimiento,
        telefono
    } = req.body;

    try {
        // 1. Registrar en Supabase Auth
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password: contraseña,
            options: {
                data: {
                    nombre,
                    apellido,
                    usuario
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                message: "Error en autenticación",
                error: authError.message
            });
        }

        supabaseUser = data.user; // Asignamos el usuario de Supabase

        // 3. Registrar en PostgreSQL
        // console.log('Datos a insertar en PostgreSQL:', userData);
        const registeredUser = await authModel.registerInPostgreSQL({
            idperfil,
            id_auth_supabase: supabaseUser.id,
            nombre,
            apellido,
            usuario,
            email,
            dni,
            fechanacimiento,
            telefono,
            eliminado: false
        });

        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            user: {
                ...registeredUser,
                auth_id: supabaseUser.id
            }
        });
    } catch (error) {
        // Revertir registro en Supabase si existe
        if (supabaseUser?.id) {
            await supabase.auth.admin.deleteUser(supabaseUser.id)
                .catch(err => console.error('Error al revertir registro:', err));
        }
        next(error);
    }
};

exports.signInNewSession = async (req, res) => {
    const { email, password } = req.body;
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) return res.status(400).json({ message: "Error al iniciar sesión: ", error });
    // res.status(200).json({ session: data.session });

    // 1. Autenticación con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ message: "Error al iniciar sesión", error });

    // 2. Obtener el rol del usuario desde TU tabla de roles
    try {
        const userRole = await mostrarRolPorId(data.user.id); // Usamos tu función existente

        // 3. Devolver respuesta con token + info del usuario + rol
        res.status(200).json({
            session: {
                access_token: data.session.access_token,
                user: {
                    ...data.user,
                    role: userRole, // Envías el rol (ej: 1 para admin, 0 para user)
                    isAdmin: Number(userRole) === 1 // Opcional: booleano para fácil verificación
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener el rol del usuario", error });
    }
}

exports.getProfiles = async (req, res) => {
    try {
        const perfiles = await authModel.obtenerPerfiles();

        return res.status(200).json(perfiles);
    } catch (error) {
        console.error("Error al obtener perfiles:", error);

        return res.status(500).json({
            success: false,
            message: "Error al obtener perfiles",
            error: error.message
        });
    }
};
