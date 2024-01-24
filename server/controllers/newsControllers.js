import * as cheerio from "cheerio";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const getArticles = async (req, res) => {
  let articles = [];
  const now = Date.now();

  try {
    let html = await axios.get("https://www.channelnewsasia.com/latest-news");
    let $ = cheerio.load(html.data);

    // CNA

    $(".media-object").each((index, element) => {
      const title = $(element).find(".list-object__heading-link").text().trim();
      const url =
        "https://www.channelnewsasia.com" +
        $(element).find(".list-object__heading-link").attr("href").trim();
      const category = $(element).find(".list-object__category").text().trim();
      const timestamp =
        (now -
          $(element)
            .find(".list-object__timestamp")
            .attr("data-lastupdated")
            .trim() *
            1000) /
        1000;

      articles.push({
        provider: "cna",
        title,
        url,
        category,
        timestamp,
      });
    });

    // ST

    const categories = ["singapore", "asia", "world", "business", "sport"];
    for (const category of categories) {
      html = await axios.get(`https://www.straitstimes.com/${category}/latest`);
      $ = cheerio.load(html.data);

      $(".card").each((index, element) => {
        const title = $(element).find(".card-title a").text().trim();
        const url =
          "https://www.straitstimes.com" +
          $(element).find(".card-title a").attr("href").trim();
        const timestamp =
          (now -
            $(element)
              .find(".card-time time")
              .attr("data-created-timestamp")
              .trim() *
              1000) /
          1000;

        articles.push({
          provider: "st",
          title,
          url,
          category,
          timestamp,
        });
      });
    }

    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSummary = async (req, res) => {
  const { provider, url } = req.body;

  try {
    let article = "";

    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    if (provider === "cna") {
      $(".text-long p").each((index, element) => {
        article = article + " " + $(element).text().trim();
      });
    }

    if (provider === "st") {
      $(".field__item p").each((index, element) => {
        article = article + " " + $(element).text().trim();
      });
    }

    // summary

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Summarise in 3 sentences with less than 75 words: ${article}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const content = completion.choices[0].message.content.trim().split(". ");

    res.status(200).json({ content });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { getArticles, getSummary };
