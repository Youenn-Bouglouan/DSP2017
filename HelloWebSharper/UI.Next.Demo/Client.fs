namespace UI.Next.Demo

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html

[<JavaScript>]
module Client =   
    
    open WebSharper.JQuery
 
    type IndexTemplate = Templating.Template<"navbar_sample.html">
    type BsNavBarTemplate = Templating.Template<"bootstrap_navbar.html">

    let Main =
        JQuery.Of("#main").Empty().Ignore
        
        let brand = Var.Create "Default brand"
       
        let navBar = 
            BsNavBarTemplate.Doc(
                Brand = brand.View
            )
        
        IndexTemplate.Doc(
            Brand = brand,
            NavBar = [navBar]
        )
        |> Doc.RunById "main"