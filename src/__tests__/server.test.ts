import db from "../config/db";
import { connectDB } from "../server";

jest.mock("../config/db");

describe("connectDB", () => {
  it("should handle database connection errors", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(
        new Error("Hubo un error conectando a la base de datos")
      );
    const consoleSpy = jest.spyOn(console, "log");

    await connectDB();
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un error conectando a la base de datos")
    );
  });
});
