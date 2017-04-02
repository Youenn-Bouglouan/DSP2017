namespace HelloWebSharper

open WebSharper.Html.Server
open WebSharper
open WebSharper.Sitelets

type EndPoint =
    | [<EndPoint "GET /">] Home
    | [<EndPoint "GET /templates">] Templates

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
        Application.MultiPage (fun context action ->
            match action with
            | Home -> HomePage context
            | Templates -> TemplatesPage context
        )

// Run the server as a console application using Owin
module SelfHostedServer =

    open global.Owin
    open Microsoft.Owin.Hosting
    open Microsoft.Owin.StaticFiles
    open Microsoft.Owin.FileSystems
    open WebSharper.Owin

    [<EntryPoint>]
    let Main args =
        let rootDirectory, url =
            match args with
            | [| rootDirectory; url |] -> rootDirectory, url
            | [| url |] -> "..", url
            | [| |] -> "..", "http://localhost:9000/"
            | _ -> eprintfn "Usage: HelloWebSharper ROOT_DIRECTORY URL"; exit 1
        use server = WebApp.Start(url, fun appB ->
            appB.UseStaticFiles(
                    StaticFileOptions(
                        FileSystem = PhysicalFileSystem(rootDirectory)))
                .UseSitelet(rootDirectory, Site.Main)
            |> ignore)

        stdout.WriteLine("Serving {0}", url)
        stdin.ReadLine() |> ignore
        0