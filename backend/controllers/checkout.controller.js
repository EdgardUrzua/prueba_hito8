const create = async (req, res) => {
  try {
    const { cart } = req.body; 
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    const user = req.user; 

    

    return res.json({
      message: "Compra realizada con éxito",
      cart,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const checkoutController = {
  create,
};

