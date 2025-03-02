import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: cookbookEntry[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
    recipeName = recipeName.replace(/[-_]/g, " ");
    recipeName = recipeName.replace(/[^A-Za-z ]+/g, "");
    recipeName = recipeName.replace(/\s+/g, " ").trim();
    recipeName = recipeName.toLowerCase();
    recipeName = recipeName.replace(/\b\w/g, (char) => char.toUpperCase());
    return recipeName.length > 0 ? recipeName : null;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
    const entry: any = req.body;
    if (entry.type !== "recipe" && entry.type !== "ingredient") {
        return res.status(400).send("invalid type!");
    } else if (cookbook.some(storedEntry => storedEntry.name === entry.name)) {
        return res.status(400).send("invalid name!");
    } else if (entry.type === "ingredient" && entry.cookTime < 0) {
        return res.status(400).send("invalid cook time!");
    } else if (entry.type === "recipe") {
        const items = new Set();
        for (const item of entry.requiredItems) {
          if (items.has(item.name)) {
            return res.status(400).send("invalid items!!");
          }
          items.add(item.name);
        }
    }

    cookbook.push(entry)

    res.status(200).send({})
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
    // TODO: implement me
    res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
