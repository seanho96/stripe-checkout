import * as React from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

const Main = styled.main`
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  padding: 96;
  color: "#232129";
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SuccessHeader = styled.h2`
  text-align: center;
  font-size: 1.6rem;
  color: darkolivegreen;
`;

const CanceledHeader = styled.h2`
  text-align: center;
  font-size: 1.6rem;
  color: darksalmon;
`;

const Button = styled.button`
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  color: #333;
  background-color: blanchedalmond;
`;

const Loader = styled.div`
  animation: rotate 2s infinite ease;
  margin: auto;
  width: 40px;
  height: 40px;
  border: 4px solid #cce6f4;
  border-top-color: #003844;
  border-right-color: #ffb100;
  border-bottom-color: #006c67;
  border-left-color: #f194b4;
  border-radius: 50%;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(720deg);
    }
  }
`;

// markup
const IndexPage = () => {
  const [status, setStatus] = React.useState("idle");
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setStatus("success");
    } else if (query.get("canceled")) {
      setStatus("canceled");
    }
  }, []);

  const data = {
    sku: 123,
    quantity: 1,
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    setLoading(true);
    const stripe = await getStripe();

    const response = await fetch("/.netlify/functions/stripe-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());

    const { error } = await stripe.redirectToCheckout({
      sessionId: response.sessionId,
    });

    setLoading(false);

    if (error) {
      console.error(error);
    }
  };

  return (
    <Main>
      {status === "success" && (
        <SuccessHeader>You have successfully paid for the order.</SuccessHeader>
      )}
      {status === "canceled" && (
        <CanceledHeader>
          The payment was cancelled. Please try again.
        </CanceledHeader>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleFormSubmission}>
          {status !== "success" && <Button type="submit">Checkout</Button>}
        </form>
      )}
    </Main>
  );
};

export default IndexPage;
