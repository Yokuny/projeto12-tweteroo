import express from "express";
import body from "body-parser";
import cors from "cors";
const app = express();
app.use(body.urlencoded({ extended: false }));
app.use(body.json());
app.use(cors());

let user = [
  {
    username: "bobesponja",
    tweet:
      "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png",
  },
];
let tweets = [];

const insertUserAvatar = (obj, avatar) => {
  return obj.map((item) => {
    item.username, avatar, item.tweet;
  });
};
const pictureValidation = async (url) => {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.startsWith("image/")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
const reqValidation = (...data) => {
  data.forEach((info) => {
    if (!info) return true;
    if (info.length < 1) return true;
    if (typeof info !== "string") return true;
  });
  return false;
};

app.post("/sign-up", async (req, res) => {
  const { username, avatar } = req.body;
  if (reqValidation(username, avatar)) return res.status(400).send("Todos os campos são obrigatórios!");
  if ((await pictureValidation(avatar)) && username.length > 3) {
    user.push({ username, avatar });
    res.status(201).send("OK");
  } else {
    res.status(400).send("Todos os campos são obrigatórios!");
    console.log("Todos os campos são obrigatórios!");
  }
});
app.post("/tweets", (req, res) => {
  const { username, tweet } = req.body;
  if (reqValidation(username, tweet)) return res.status(400).send("Todos os campos são obrigatórios!");
  if (user.some((user) => user.username === username)) {
    tweets.push({ username, tweet });
    res.status(201).send("OK");
  } else {
    res.status(401).send("É necessário login!");
    console.log("É necessário login!");
  }
});

app.get("/tweets", (req, res) => {
  let count = 0;
  let firstTen = [];
  for (let i = 0; i < tweets.length; i++) {
    count++;
    if (count <= 10) firstTen.push(tweets[tweets.length - i - 1]);
  }
  res.send(insertUserAvatar(firstTen, user[0].avatar));
});
app.listen(5000, () => {
  console.log("http://localhost:5000/");
});
