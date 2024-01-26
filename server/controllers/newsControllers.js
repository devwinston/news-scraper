import * as cheerio from "cheerio";
import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const getArticles = async (req, res) => {
  let articles = [];
  const now = Date.now();
  const categories = ["singapore", "asia", "world", "business", "sport"];

  const getLatest = (articles) => {
    articles.sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return a.timestamp - b.timestamp;
    });

    const result = [];
    const categoryMap = new Map();
    categories.forEach((category) => categoryMap.set(category, []));

    articles.forEach((article) => {
      const category = article.category.toLowerCase();
      const categoryArray = categoryMap.get(category);

      if (categoryArray.length < 6) {
        categoryArray.push(article);
        result.push(article);
      }
    });

    return result;
  };

  try {
    // get CNA articles

    let html = await axios.get("https://www.channelnewsasia.com/latest-news");
    let $ = cheerio.load(html.data);

    let cnaArticles = [];

    $(".media-object").each((index, element) => {
      const category = $(element).find(".list-object__category").text().trim();

      if (categories.includes(category.toLowerCase())) {
        const title = $(element)
          .find(".list-object__heading-link")
          .text()
          .trim();
        const url =
          "https://www.channelnewsasia.com" +
          $(element).find(".list-object__heading-link").attr("href").trim();
        const timestamp =
          (now -
            $(element)
              .find(".list-object__timestamp")
              .attr("data-lastupdated")
              .trim() *
              1000) /
          1000;

        cnaArticles.push({
          provider: "cna",
          title,
          url,
          category,
          timestamp,
        });
      }
    });

    articles.push(...getLatest(cnaArticles));

    // get ST articles

    let stArticles = [];

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

        stArticles.push({
          provider: "st",
          title,
          url,
          category,
          timestamp,
        });
      });
    }

    articles.push(...getLatest(stArticles));

    // get article images

    for (let i = 0; i < articles.length; i++) {
      html = await axios.get(articles[i].url);
      $ = cheerio.load(html.data);

      if (articles[i].provider === "cna") {
        const imageUrl = $(".figure img.image").attr("src");
        articles[i]["imageUrl"] = imageUrl;
      }

      if (articles[i].provider === "st") {
        const imageUrl = $(".group-image-frame img").attr("src");
        articles[i]["imageUrl"] = imageUrl;
      }
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
