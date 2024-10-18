import { Request, Response } from "express";
import Product from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [["id", "ASC"]],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  res.json({ data: products });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
};

export const getProductsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json({ data: product });
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  // Actualizar producto - El update protege de que se actualicen los datos de otros usuarios
  await product.update(req.body);
  await product.save();

  res.json({ data: product });
};

// Actualizar producto - Con patch modificamos partes de un recurso
export const updateAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  // product.availability = req.body.availability;
  // Con el siguiente código no hace falta enviarle un body, ya que cada vez que se le llama
  // cambia el valor de la propiedad de producto, en este caso la disponibilidad que es un booleano
  product.availability = !product.dataValues.availability;
  await product.save();

  res.json({ data: product });
};

export const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  await product.destroy();
  res.json({ data: "Producto eliminado" });
};
