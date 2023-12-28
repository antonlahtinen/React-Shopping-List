const request = require("supertest");
const app = require("../src/app"); 

describe("Items GET endpoint", () => {
  it("should GET all items", async () => {
    const res = await request(app).get("/api/v1/items");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(3);
  });

  it("should GET item by ID", async () => {
    const res = await request(app).get("/api/v1/items/3");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 3);
    expect(res.body).toHaveProperty("name", "Onion");
    expect(res.body).toHaveProperty("quantity", "3");
  });

  it("should not get item with ID that does not exist", async () => {
    const res = await request(app).get("/api/v1/items/99");
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("Item not found");
  }); 

});

describe('The POST /api/v1/items endpoint', () => { 
    it('should add "Pepper" to shopping list', async() => {
      const newItem = {
        name: "Pepper",
        quantity: 2,
      }
  
      const response = await request(app)
        .post('/api/v1/items')
        .set('Content', 'application/json')
        .send(newItem);
      
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toEqual(newItem.name);
      expect(response.body.quantity).toEqual(newItem.quantity);
    });
  
    it('should fail when NAME is missing', async() => {
      const itemWithoutname = {
        quantity: 2,
      }
  
      const response = await request(app)
        .post('/api/v1/items')
        .set('Content-Type', 'application/json')
        .send(itemWithoutname);
      
      expect(response.statusCode).toBe(400);
      expect(response.text).toContain("\"name\" is required");
  
    });
  });

  describe('The DELETE /api/v1/items/:id endpoint', () => { 

    it('should successfully delete an item', async() => {
      const response = await request(app)
        .delete('/api/v1/items/1') 
        .set('Accept', 'application/json');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body.find(b => b.id === 1)).toBeFalsy();
    });
  
    
    it('should fail when trying to delete a item with a non-existent ID', async() => {
      const response = await request(app)
        .delete('/api/v1/items/99')
        .set('Accept', 'application/json');
      
      expect(response.statusCode).toBe(404);
      expect(response.text).toEqual('Item not found');
    });
  });