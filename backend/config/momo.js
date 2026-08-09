import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = process.env.MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com";
const SUBSCRIPTION_KEY = process.env.MOMO_SUBSCRIPTION_KEY;
const API_USER = process.env.MOMO_API_USER;
const API_KEY = process.env.MOMO_API_KEY;
const TARGET_ENV = process.env.MOMO_TARGET_ENV || "sandbox";

// Gets a short-lived access token from MTN MoMo using API user/key basic auth
async function getAccessToken() {
  const credentials = Buffer.from(`${API_USER}:${API_KEY}`).toString("base64");
  const { data } = await axios.post(
    `${BASE_URL}/collection/token/`,
    {},
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
      },
    }
  );
  return data.access_token;
}

// Initiates a "Request to Pay" push to the customer's MoMo number.
// Returns the referenceId used to check status later.
export async function requestToPay({ amount, phone, externalId }) {
  if (!SUBSCRIPTION_KEY || !API_USER || !API_KEY) {
    throw new Error("MTN MoMo is not configured — missing MOMO_* env vars");
  }
  const referenceId = uuidv4();
  const accessToken = await getAccessToken();

  await axios.post(
    `${BASE_URL}/collection/v1_0/requesttopay`,
    {
      amount: String(amount),
      currency: TARGET_ENV === "sandbox" ? "EUR" : "RWF", // sandbox only accepts EUR
      externalId,
      payer: { partyIdType: "MSISDN", partyId: phone.replace(/\D/g, "") },
      payerMessage: "GIGO Food order payment",
      payeeNote: "GIGO Food order payment",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Reference-Id": referenceId,
        "X-Target-Environment": TARGET_ENV,
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return referenceId;
}

// Checks the status of a previously requested payment: PENDING | SUCCESSFUL | FAILED
export async function checkPaymentStatus(referenceId) {
  const accessToken = await getAccessToken();
  const { data } = await axios.get(
    `${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Target-Environment": TARGET_ENV,
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
      },
    }
  );
  return data.status; // PENDING | SUCCESSFUL | FAILED
}
