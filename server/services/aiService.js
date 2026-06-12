const axios = require("axios");

const generateEmail = async (prompt) => {
  try {

    console.log("API KEY =>", process.env.OPENROUTER_API_KEY);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model:
          "openai/gpt-oss-120b:free",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json",
        },
      }
    );

    const generatedText =
      response?.data?.choices?.[0]?.message?.content;

    if (!generatedText) {

      console.log(
        JSON.stringify(response.data, null, 2)
      );

      throw new Error(
        "No AI response received"
      );
    }

    return generatedText;

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    throw new Error(
      "AI Email generation failed"
    );
  }
};

module.exports = generateEmail;