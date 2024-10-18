import request from "supertest";
import server from "../../server";

describe("POST of /api/products", () => {
  it("should display validation errors", async () => {
    const res = await request(server).post("/api/products").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(4);

    expect(res.status).not.toBe(404);
    expect(res.body.errors).not.toHaveLength(2);
  });

  it("should create a new product", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Mouse - Testing",
      price: 50,
    });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("errors");
  });

  it("should validate that the price is greater than 0", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: 0,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);

    expect(res.status).not.toBe(404);
    expect(res.body.errors).not.toHaveLength(2);
  });

  it("should validate that the price a number and greater than 0", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: "hola",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(2);

    expect(res.status).not.toBe(404);
    expect(res.body.errors).not.toHaveLength(3);
  });
});

describe("GET of /api/products", () => {
  it("should check if api/products url exists", async () => {
    const res = await request(server).get("/api/products");
    expect(res.status).not.toBe(404);
  });

  it("should return all product in a JSON response", async () => {
    const res = await request(server).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveLength(1);

    expect(res.body).not.toHaveProperty("errors");
  });
});

describe("GET of /api/products/:id", () => {
  it("should return a 404 response for a non-existent product", async () => {
    const productId = 100;
    const res = await request(server).get(`/api/products/${productId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Producto no encontrado");
  });

  it("should check a valid ID in the URL", async () => {
    const res = await request(server).get("/api/products/not-valid-url");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("El id debe ser numérico");
  });

  it("should return a JSON response for a single product", async () => {
    const res = await request(server).get("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("name");
    expect(res.body.data).toHaveProperty("price");
    expect(res.body.data).toHaveProperty("availability");
  });
});

describe("PUT of /api/products/:id", () => {
  it("should return 404 response for a non-existent product", async () => {
    const productID = 1000;
    const res = await request(server).put(`/api/products/${productID}`).send({
      name: "Mouse - Testing",
      price: 300,
      availability: true,
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");
  });

  it("should check a valid ID in the URL", async () => {
    const res = await request(server).put("/api/products/not-valid-url").send({
      name: "Mouse - Testing",
      price: 50,
      availability: true,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("El id debe ser numérico");
  });

  it("should display validation error messages when updating a product", async () => {
    const res = await request(server).put(`/api/products/1`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors).toHaveLength(5);

    expect(res.status).not.toBe(200);
    expect(res.body.errors).not.toHaveProperty("data");
  });

  it("should validate that price is greater than 0", async () => {
    const res = await request(server).put(`/api/products/1`).send({
      name: "Mouse - Testing",
      price: 0,
      availability: true,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("Precio debe ser mayor a 0");

    expect(res.status).not.toBe(200);
    expect(res.body.errors).not.toHaveProperty("data");
  });

  it("should update an existing product with valid data", async () => {
    const res = await request(server).put(`/api/products/1`).send({
      name: "Mouse - Testing",
      price: 300,
      availability: true,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });
});

describe("PATCH of /api/products/:id", () => {
  it("should return 404 response for a non-existent product", async () => {
    const productID = 1000;
    const res = await request(server).patch(`/api/products/${productID}`).send({
      name: "Mouse - Testing",
      price: 300,
      availability: true,
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");
  });

  it("should check a valid ID in the URL", async () => {
    const res = await request(server).patch("/api/products/not-valid-url").send({
      name: "Mouse - Testing",
      price: 50,
      availability: true,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("El id debe ser numérico");
  });

  it("should update an existing product with valid data", async () => {
    const res = await request(server).patch(`/api/products/1`).send({
      name: "Mouse - Testing",
      price: 300,
      availability: true,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });
});

describe("DELETE of /api/products/:id", () => {
  it("should check a valid ID in the URL", async () => {
    const res = await request(server).delete("/api/products/not-valid-url");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("El id debe ser numérico");
  });

  it("should return a 404 response for a non-existent product", async () => {
    const productID = 1000;
    const res = await request(server).delete(`/api/products/${productID}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");

    expect(res.status).not.toBe(200);
  });

  it("should delete a product", async () => {
    const res = await request(server).delete(`/api/products/1`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBe("Producto eliminado");

    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(400);
  });
});