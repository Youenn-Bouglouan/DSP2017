namespace HelloWebSharper

open WebSharper.Html.Server
open WebSharper
open WebSharper.Sitelets

type EndPoint =
    | [<EndPoint "GET /">] Home
    | [<EndPoint "GET /templates">] Templates
    | [<EndPoint "/pizzamanager">] PizzaManagerApi of PizzaManagerRestApi.PublicApi

module Templating =
    open System.Web

    type Page = {
        Title : string
        Body : list<Element>
    }

    let MainTemplate =
        Content.Template<Page>("~/Main.html")
            .With("title", fun x -> x.Title)
            .With("body", fun x -> x.Body)

    let Main context endpoint title body : Async<Content<EndPoint>> =
        Content.WithTemplate MainTemplate
            {
                Title = title
                Body = body
            }

module AdvancedTemplating =
    open System.Web
    
    type AdvancedPage = {
        Title: string
        SomeTextHole: string
        SomeDataHole: list<Element>
        ServerSideDataReplaceHole: list<Element>
        ClientSideDataReplaceHole: list<Element>
    }

    let Template =
        Content.Template<AdvancedPage>("~/AdvancedTemplate.html")
            .With("title", fun x -> x.Title)
            .With("sometexthole", fun x -> x.SomeTextHole)
            .With("somedatahole", fun x -> x.SomeDataHole)
            .With("somedatareplacehole", fun x -> x.ServerSideDataReplaceHole)
            .With("someclientdatareplacehole", fun x -> x.ClientSideDataReplaceHole)

    let Main context endpoint title someTextHole someDataHole serverDataReplace clientDataReplace : Async<Content<EndPoint>> =
        Content.WithTemplate Template {
            Title = title
            SomeTextHole = someTextHole
            SomeDataHole = someDataHole
            ServerSideDataReplaceHole = serverDataReplace
            ClientSideDataReplaceHole = clientDataReplace
        }

module Site =

    let HomePage context =
        Templating.Main context EndPoint.Home "Hello WebSharper" [
            H2 [Text "Welcome to Hello WebSharper. What's your name?"]
            Div [ClientSide <@ Client.Main() @>]
        ]

    let TemplatesPage context =
        AdvancedTemplating.Main 
            context
            EndPoint.Templates
            "Templating in WebSharper" // Our title hole
            "Just a test page to play with the HTML templating engine in WebSharper!" // Our sometexthole hole
            // Our server-side data-hole content starts here
            [
                H1 [Text "This is inserted via a data-hole attribute (server-side)"]
                H3 [Text "Let's test a few HTML elements like H3..."]
                H4 [Text "... or unsorted lists:"]
                UL [
                    LI [Text "one item..."]
                    LI [Text "Another item!"]
                    LI [Attr.Class "someStyle"]
                        -< [Text "and yet another "]
                        -< [B [Text "bold item"]]
                        -< [Text " with a style attached"]
                    ]
            ]
            // Our server-side data-replace content starts here
            [
                H1 [Text "This is inserted via a data-replace attribute (server-side)"]
            ]
            // Our client-side data-replace content starts here
            [Div [ClientSide <@ Client.ReplaceDataExample() @>]]

    [<Website>] // Main entry point for our application
    let Main =

        let mainWebsite = Application.MultiPage (fun context action ->
            match action with
            | Home -> HomePage context
            | Templates -> TemplatesPage context
            | PizzaManagerApi _ -> failwith "the routing is handled in PizzaManagerRestApi directly."                
        )

        let pizzaManagerApi = Sitelet.EmbedInUnion <@ EndPoint.PizzaManagerApi @> PizzaManagerRestApi.pizzaManagerSitelet

        // Combine all the below sitelets into one
        Sitelet.Sum [
            pizzaManagerApi
            mainWebsite
        ]

// Run the server as a console application using Owin
module SelfHostedServer =

    open global.Owin
    open Microsoft.Owin.Hosting
    open Microsoft.Owin.StaticFiles
    open Microsoft.Owin.FileSystems
    open WebSharper.Owin
    open System
    open System.Collections.Generic
    open System.Threading.Tasks
//
    type Greeting = { text: string }
    type AppFunc = Func<IDictionary<string, obj>, Task>
    let awaitTask = Async.AwaitIAsyncResult >> Async.Ignore
    
    type Startup() =

        member this.Configuration(app: IAppBuilder) =

            // Log info about incoming requests to the console
            app.Use(fun environment next ->
                printfn "------ New request ------"
                printfn "  Path: %s" (environment.Request.Path.ToString())
                printfn "  Verb: %s" (environment.Request.Method)
                                
                (*
                Those 3 lines were causing the POST method AddPizza to fail
                The reason is explained here: http://websharper.com/question/82758/post-endpoint-with-a-json-body-cannot-be-reached

                use reader = new System.IO.StreamReader(environment.Request.Body)
                //let input = reader.ReadToEnd()
                //printfn "  Body: %s" (input)
                *)

                async { 
                    do! awaitTask <| next.Invoke()
                    printfn "  HTTP Status code: %i" environment.Response.StatusCode

                    if environment.Response.StatusCode <> 200 then 
                        use writer = new System.IO.StreamWriter(environment.Response.Body)
                        writer.WriteLine("an error occurred!")
                        writer.Flush |> ignore

                } |> Async.StartAsTask :> Task) |> ignore

            // Load our site
            app.UseStaticFiles(
                    StaticFileOptions(
                        FileSystem = PhysicalFileSystem("..")))
                .UseSitelet("..", Site.Main)
            |> ignore

    [<EntryPoint>]
    let main argv = 
        let uri = "http://localhost:9000"
        use app = WebApp.Start<Startup>(uri)
        printfn "Serving %s" uri
        Console.ReadKey() |> ignore
        printfn "Stopping %s" uri
        0