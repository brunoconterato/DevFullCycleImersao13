import express, { Request, Response } from "express";
const app = express();

app.post("/purchase-ticket", async function (req: Request, res: Response) {
    res.json({
        "status": "paid",
    })
})

app.listen(3000);