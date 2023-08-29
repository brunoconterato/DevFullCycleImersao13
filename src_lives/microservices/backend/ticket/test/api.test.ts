import axios from "axios"

test("Deve comprar um ingresso", async function () {
    const input = {
        event_id: "c5889104-5506-4639-9256-5ed6108c6021",
        email: "brunoconterato@gmail.com",
        creditCardToken: "987654321",
    };
    const response = await axios.post("http://localhost:3000/purchase-ticket", input);
    const output = response.data;
    expect(output.ticketId).toBeDefined();
    expect(output.status).toBe("reserved");
})