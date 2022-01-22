require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.URL}/?success=true`,
      cancel_url: `${process.env.URL}?canceled=true`,
      line_items: [
        {
          name: "This Pretty Plant",
          description:
            "Look at this pretty plant. Photo by Galina N on Unsplash.",
          images: [
            "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&h=600&q=80",
          ],
          amount: 1000,
          currency: "MYR",
          quantity: 1,
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionId: session.id,
        publishableKey:
          "sk_test_51KKMFdEcSF9gwTBnhL8TvbBm7VLJyiDqMrSX53cCSeYowa82AFzUneczMW7sL5FQzFEXSW3kMR3yyuPrrh6vBlFz00hO5nj7jk",
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: err,
      }),
    };
  }
};
