import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardPizza from "../components/CardPizza";

const Home = () => {
  const { pizzaId } = useParams(); // Obtener pizzaId de la URL
  const [pizzas, setPizzas] = useState([]); // Almacena las pizzas
  const [pizza, setPizza] = useState(null); // Almacena la pizza específica
  const [loading, setLoading] = useState(true); // Maneja la carga
  const [error, setError] = useState(null); // Maneja errores

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        let url = "http://localhost:5000/api/pizzas";
        if (pizzaId) {
          url = `http://localhost:5000/api/pizzas/${pizzaId}`; 
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener las pizzas");
        }

        const data = await response.json();
        if (pizzaId) {
          setPizza(data);
        } else {
          setPizzas(data);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPizzas();
  }, [pizzaId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (loading) {
    return <p>Cargando pizzas...</p>;
  }

  if (pizzaId && pizza) {
    return (
      <div className="row">
        <div className="col-md-4 mb-3">
          <CardPizza
            nombre={pizza.name}
            descripcion={pizza.desc}
            precio={pizza.price}
            imagen={pizza.img}
            ingredientes={pizza.ingredients}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {pizzas.map((pizza) => (
        <div key={pizza.id} className="col-md-4 mb-3">
          <CardPizza
            id={pizza.id}
            nombre={pizza.name}
            descripcion={pizza.desc}
            precio={pizza.price}
            imagen={pizza.img}
            ingredientes={pizza.ingredients}
          />
        </div>
      ))}
    </div>
  );
};

export default Home;
