namespace HelloWebSharper

module PizzaManagerRestApi = 
    open WebSharper
    open WebSharper.Sitelets
    open System.Collections.Generic
    
    type PublicApi =
        /// GET /info
        | [<EndPoint"GET /">] ShowInfo
        /// GET /pizzas/{settings}
        | [<EndPoint"GET /pizzas">] GetPizzas of settings : string
        /// GET /pizza/margarita
        | [<EndPoint"GET /pizza">] GetPizza of name : string
        /// POST /pizza/ + Json content
        | [<EndPoint"POST /pizza"; Json "pizza">] AddPizza of pizza : Pizza

     and
     [<NamedUnionCases"unit">]
     Ingredient =
        | [<Name "u">] Unit of name:string * quantity:int
        | [<Name "g">] Grams of name:string * quantity:int
        | [<Name "ml">] Milliliter of name:string * quantity:int
     
     and Pizza =
        { [<Name"name">] Name : string
          [<Name"price">] Price : decimal
          [<Name"ingredients">] Ingredients : Ingredient array }
    
    [<NamedUnionCases"result">]
    type Result<'T> =
        | [<CompiledName"success">] Success of data:'T
        | [<CompiledName"failure">] Failure of message : string

    /// Fake in-memory database containing all the pizzas
    module private PizzaManagerDb =
        let private pizzas = new Dictionary<string, Pizza>()
        
        let getAll () =
            pizzas
            |> Seq.map (fun (KeyValue(k, v)) -> v)
            |> Seq.toArray
            |> Success

        let getNamesOnly () =
            pizzas.Keys
            |> Seq.toArray
            |> Success

        let get name =
            match pizzas.ContainsKey(name) with
            | false -> Failure(sprintf "Pizza '%s' could not be found!" name)
            | true -> Success (pizzas.Item(name))
        
        let getCI (name:string) =
            let pizza = pizzas.Values |> Seq.tryFind (fun p -> p.Name.ToLower() = name.ToLower())
            match pizza with
            | None -> Failure(sprintf "Pizza '%s' could not be found!" name)
            | Some p -> Success (p)

        let save pizza =
            match pizzas.ContainsKey(pizza.Name) with
            | true -> Failure(sprintf "Pizza '%s' already exists!" pizza.Name)
            | false -> 
                pizzas.Add(pizza.Name, pizza)
                Success pizza
    
    /// Display info about the current API
    type ApiInfo = { sampleUrl : string; description : string }

    let showInfo =
        [|
            { sampleUrl = "/pizzamanager or /pizzamanager/"; description = "Display information about the current API." }
            { sampleUrl = "/pizzamanager/pizzas/names"; description = "List all pizzas available in the database." }
            { sampleUrl = "/pizzamanager/pizzas/ or /pizzamanager/pizzas/all"; description = "Get all pizzas in the database." }
            { sampleUrl = "/pizzamanager/pizza/{pizza_name}"; description = "Get the given pizza (case-insensitive)." }
        |]

    /// Handle additional settings available for /pizzamanager/pizzas/
    type ListSettings =
    | All
    | NamesOny

    let getSettings = function
        | "" | "all" -> Success All
        | "names" -> Success NamesOny
        | notRecognized -> Failure (sprintf "'%s' is not a valid setting!" notRecognized)

    // Implement the API endpoints
    let requestHandler (ctx:Context<PublicApi>) (request:PublicApi) : Async<Content<PublicApi>> =
        match request with
        | ShowInfo -> Content.Json (showInfo)
        | GetPizzas settings -> 
            match (getSettings settings) with
            | Success All -> Content.Json (PizzaManagerDb.getAll())
            | Success NamesOny -> Content.Json (PizzaManagerDb.getNamesOnly())
            | failure -> Content.Json (failure)
        | GetPizza name -> Content.Json (PizzaManagerDb.getCI name)
        | AddPizza pizza -> Content.Json (PizzaManagerDb.save pizza)

    // And let WebSharper infer all the routings based on the request handler above
    let pizzaManagerSitelet = Sitelet.Infer requestHandler

    // Populate the database with a bunch of pizzas for tests purposes.
    let populatePizzas =
        [
            { Name = "Margherita"; Price = 12M; Ingredients = [|
                Milliliter("Tomato Sauce", 30)
                Grams("Mozzarella", 200) |]
            }
            { Name = "Funghi"; Price = 14M; Ingredients = [|
                Milliliter ("Tomato Sauce", 30)
                Grams ("Mushrooms", 100)
                Grams ("Mozzarella", 200) |]
            }
            { Name = "Rucola"; Price = 21M; Ingredients = [|
                Milliliter ("Tomato Sauce", 30)
                Grams ("Parma Ham", 100)
                Grams ("Parmezan", 50)
                Grams ("Rucola", 50)
                Grams ("Mozzarella", 200) |]
            }
            { Name = "Fiorentina"; Price = 18M; Ingredients = [|
                Unit("Egg", 2)
                Grams ("Spinach", 150)
                Grams ("Parmezan", 50)
                Grams ("Mushrooms", 100)
                Milliliter ("Tomato Sauce", 30) |]
            }
        ]
        |> Seq.iter (PizzaManagerDb.save >> ignore)
    
    do populatePizzas