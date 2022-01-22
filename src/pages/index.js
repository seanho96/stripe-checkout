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
  font-family: "-apple-system, Roboto, sans-serif, serif";
  padding: 96;
  color: "#232129";
  display: flex;
  justify-content: center;
`;

const SuccessHeader = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: darkolivegreen;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
`;

const Button = styled.button`
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  color: #333;
  background-color: blanchedalmond;
`;

// markup
const IndexPage = () => {
  const [status, setStatus] = React.useState("idle");
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
    sku: 12312312,
    quantity: 1,
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();
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

    if (error) {
      console.error(error);
    }
  };

  return (
    <Main>
      {status === "success" ? (
        <SuccessHeader>You have successfully paid for the order.</SuccessHeader>
      ) : (
        <form onSubmit={handleFormSubmission}>
          <Button type="submit">Checkout</Button>
        </form>
      )}
    </Main>
  );
};

export default IndexPage;
