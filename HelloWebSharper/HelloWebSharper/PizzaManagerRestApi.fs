namespace HelloWebSharper

module PizzaManagerRestApi = 
    open WebSharper
    open WebSharper.Sitelets
    open System.Collections.Generic
    
    type PublicApi =
        /// GET /pizzas
        | [<EndPoint"GET /pizzas">] GetPizzas
        /// GET /pizza/margarita
        | [<EndPoint"GET /pizza">] GetPizza of name : string
        /// POST /pizza/ + Json content
        | [<EndPoint"POST /pizza"; Json "pizza">] AddPizza of pizza : Pizza

     and Quantity =
        | Number of int
        | Grams of int
        | Milliliter of int

     and Ingredient =
        { name : string
          quantity : Quantity option }
     
     and Pizza =
        { name : string
          price : decimal
          ingredients : Ingredient array }
    
    [<NamedUnionCases"result">]
    type Result<'T> =
        | [<CompiledName"success">] Success of 'T
        | [<CompiledName"failure">] Failure of message : string
    
    module private PizzaManagerDb =
        let private pizzas = new Dictionary<string, Pizza>()
        
        let getAll () =
            pizzas
            |> Seq.map (fun (KeyValue(k, v)) -> v)
            |> Seq.toArray
            |> Success

        let get name =
            match pizzas.ContainsKey(name) with
            | false -> Failure(sprintf "Pizza '%s' could not be found!" name)
            | true -> Success (pizzas.Item(name))
        
        let save pizza =
            match pizzas.ContainsKey(pizza.name) with
            | true -> Failure(sprintf "Pizza '%s' already exists!" pizza.name)
            | false -> 
                pizzas.Add(pizza.name, pizza)
                Success pizza
    
    // Implement the API endpoints
    let requestHandler (ctx:Context<PublicApi>) (request:PublicApi) : Async<Content<PublicApi>> =
        match request with
        | GetPizzas -> Content.Json (PizzaManagerDb.getAll())
        | GetPizza name -> Content.Json (PizzaManagerDb.get name)
        | AddPizza pizza -> Content.Json (PizzaManagerDb.save pizza)

    // And let WebSharper infer all the routings based on the request handler above
    let pizzaManagerSitelet = Sitelet.Infer requestHandler

    // Populate the database with a bunch of pizzas for tests purposes.
    let populatePizzas =
        [
            { name = "Margherita"; price = 12M; ingredients = [|
                { name = "Tomato Sauce"; quantity = Some (Milliliter 30) }
                { name = "Mozzarella"; quantity = Some (Grams 200) } |]
            }
            { name = "Funghi"; price = 14M; ingredients = [|
                { name = "Tomato Sauce"; quantity = Some (Milliliter 30) }
                { name = "Mushrooms"; quantity = Some (Grams 100) }
                { name = "Mozzarella"; quantity = Some (Grams 200) } |]
            }
            { name = "Rucola"; price = 21M; ingredients = [|
                { name = "Tomato Sauce"; quantity = Some (Milliliter 30) }
                { name = "Parma Ham"; quantity = Some (Grams 100) }
                { name = "Parmezan"; quantity = Some (Grams 50) }
                { name = "Rucola"; quantity = Some (Grams 30) }
                { name = "Mozzarella"; quantity = Some (Grams 200) } |]
            }
        ]
        |> Seq.iter (PizzaManagerDb.save >> ignore)
    
    do populatePizzas