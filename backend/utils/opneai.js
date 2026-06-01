 import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options
    );

    const data = await response.json();

    console.log("Groq Response:", data);

    return data.choices[0].message.content;
  } catch (err) {
    console.log(err);
    return "Something went wrong!";
  }
};

export default getOpenAIAPIResponse;