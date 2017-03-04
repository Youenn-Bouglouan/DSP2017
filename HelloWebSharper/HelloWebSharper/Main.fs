namespace HelloWebSharper

open WebSharper.Html.Server
open WebSharper
open WebSharper.Sitelets

type EndPoint =
    | [<EndPoint "GET /">] Home

module Templating =
    open System.Web

    type Page =
        {
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

module Site =

    let HomePage context =
        Templating.Main context EndPoint.Home "Hello WebSharper" [
            H2 [Text "Welcome to Hello WebSharper. What's your name?"]
            Div [ClientSide <@ Client.Main() @>]
        ]

    [<Website>] // Main entry point for our application
    let Main =
        Application.MultiPage (fun context action ->
            match action with
            | Home -> HomePage context
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