const request = require("supertest");
const app = require("../../../app");
/*
GET /launches
*/
describe("Test GET /launches", () => {
  test("should return 200 statusCode", async () => {
    await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
/*
POST /launches

*/
/*
DELETE /launches

*/
