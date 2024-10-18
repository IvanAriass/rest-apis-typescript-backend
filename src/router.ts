import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProductById,
  getProducts,
  getProductsById,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The Product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The Product Name
 *           example: Monitor Curvo de 40 pulgadas
 *         price:
 *           type: number
 *           description: The Product Price
 *           example: 300
 *         availability:
 *           type: boolean
 *           description: The Product Availability
 *           example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Products
 *     description: Returns a list of products
 *     responses:
 *       200:
 *         description: Succesful response
 *         content:
 *           application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags:
 *       - Products
 *     description: Returns a product based on its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Succesful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Bad request - Invalid ID
 */
router.get(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numérico"),
  handleInputErrors,
  getProductsById
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     description: Creates a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Monitor Curvo de 40 pulgadas
 *               price:
 *                 type: number
 *                 example: 300
 *     responses:
 *       201:
 *         description: Product created succesfully
 *       400:
 *        description: Bad request - Invalid input data
 */
router.post(
  "/",
  // Validación
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("price")
    .isNumeric()
    .withMessage("El precio debe ser numérico")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .custom((value) => value > 0)
    .withMessage("Precio debe ser mayor a 0"),
  handleInputErrors,
  createProduct
);

// Con put actualizamos todo el producto, remplaza el elemento con lo que le envies

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updates a product with user inputs
 *    tags:
 *      - Products
 *    description: Updates a product with user inputs
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the product to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Monitor Curvo de 40 pulgadas
 *              price:
 *                type: number
 *                example: 300
 *              availability:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Successful Response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad Request - Invalid ID or Invalid Input Data
 *      404:
 *        description: Product Not Found
 */
router.put(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numérico"),
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("price")
    .isNumeric()
    .withMessage("El precio debe ser numérico")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .custom((value) => value > 0)
    .withMessage("Precio debe ser mayor a 0"),
  body("availability")
    .notEmpty()
    .withMessage("Valor para la disponnibilidad no válido"),
  handleInputErrors,
  updateProduct
);

// Con patch modificamos partes de un recurso

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update Product Availability
 *    tags:
 *      - Products
 *    description: Returns the updated availability
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the product to update
 *    responses:
 *      200:
 *        description: Successful Response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad Request - Invalid ID
 *      404:
 *        description: Product Not Found
 */
router.patch(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numérico"),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Delete a product by unique id
 *    tags:
 *      - Products
 *    description: Returns the product deleted
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The ID of the product deleted
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              value: 'Producto Eliminado'
 *      400:
 *        description: Bad Request - Invalid ID
 *      404:
 *        description: Product Not Found
 */
router.delete(
  "/:id",
  param("id").isNumeric().withMessage("El id debe ser numérico"),
  handleInputErrors,
  deleteProductById
);

export default router;
