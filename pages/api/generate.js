import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: "https://api.openai.com/v1/chat"
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  try {
    const content = req.body.value || '';

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content}],
    });

    res.status(200).json({ result: completion.data.choices[0] });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

