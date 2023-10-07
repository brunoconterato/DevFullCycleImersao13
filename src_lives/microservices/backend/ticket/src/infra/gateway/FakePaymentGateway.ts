import PaymentGateway, {
  Input,
  Output,
} from "../../application/gateway/PaymentGatewat";
import crypto from "crypto"

export default class FakePaymentGateway implements PaymentGateway {
  async createTransaction(input: Input): Promise<Output> {
    return {
      tid: crypto.randomUUID(),
      status: "approved",
    };
  }
}
