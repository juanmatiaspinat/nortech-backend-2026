const supabase = require("../config/supabase");
const authModel = require("../models/User");
const { mostrarRolPorId } = require("../models/User");

exports.signUpNewEmail = async (req, res, next) => {
  const {
    idperfil,
    nombre,
    apellido,
    usuario,
    contraseña,
    email,
    dni,
    fechanacimiento,
    telefono,
  } = req.body;

  let supabaseUser;

  try {
    //CREAR usuario confirmado automáticamente
    const { data, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: contraseña,
        email_confirm: true,
        user_metadata: {
          nombre,
          apellido,
          usuario,
        },
      });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: "Error en autenticación",
        error: authError.message,
      });
    }

    supabaseUser = data.user;

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
      eliminado: false,
    });

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      user: {
        ...registeredUser,
        auth_id: supabaseUser.id,
      },
    });
  } catch (error) {
    if (supabaseUser?.id) {
      await supabase.auth.admin
        .deleteUser(supabaseUser.id)
        .catch((err) =>
          console.error("Error al revertir registro:", err)
        );
    }

    console.error("ERROR SIGNUP BACK:", error);
    next(error);
  }
};

exports.signInNewSession = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("SUPABASE LOGIN ERROR:", error);

      return res.status(400).json({
        message: "Error al iniciar sesión",
        error: error.message,
      });
    }

    const userRole = await mostrarRolPorId(data.user.id);

    return res.status(200).json({
      session: {
        access_token: data.session.access_token,
        user: {
          ...data.user,
          role: userRole,
          isAdmin: Number(userRole) === 1,
        },
      },
    });
  } catch (error) {
    console.error("BACK LOGIN CATCH:", error);

    return res.status(500).json({
      message: "Error al obtener el rol del usuario",
      error: error.message,
    });
  }
};

exports.getProfiles = async (req, res, next) => {
  try {
    const result = await authModel.obtenerPerfiles();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
