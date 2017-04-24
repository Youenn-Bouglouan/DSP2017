open System
open System.Collections.Generic
open BenchmarkDotNet.Running
open BenchmarkDotNet.Attributes
open BenchmarkDotNet.Attributes.Jobs

type Customer = {
    Id: int
    Name: string
    Age: int
    IsVip: bool
    CustomerSince: DateTime
}

let print c =
    printfn "%i, %s, %i, %b, %A" c.Id c.Name c.Age c.IsVip c.CustomerSince

let setVip today customer =
    match (today - customer.CustomerSince).TotalDays > 365. * 2. with
    | true -> { customer with IsVip = true }
    | false -> customer

let names = [|
    "John"; "Albert"; "Tomasz"; "Jean-Pierre"; "Nathalie";
    "Samantha"; "Edward"; "Tanya"; "Michelle"; "Kurt";
    "Justine"; "Christian"; "Christopher"; "Andres"; "Katarzyna";
    "Leon"; "Adrian"; "Sheldon"; "Maxime"; "Monika"
|]

let booleans = [| true; false |]

[<MemoryDiagnoser>]
type PerformanceTests_ImmutableList() =
    
    let mutable _customers : Customer list = [] // Immutable F# linked-list
    member this.GetCustomers() = _customers
   
    [<Setup>]
    member this.FSharp_GenerateCustomers_Immutable() =
        let numberToGenerate = 1000000
        let random = Random(10)
        
        let rec loop customers max current =
            if current > max then
                customers
            else
                let customer = {
                    Id = current
                    Age = random.Next(18, 100)
                    Name = names.[random.Next(0, names.Length)]
                    IsVip = booleans.[random.Next(0, booleans.Length)]
                    CustomerSince = DateTime.Today.AddMonths(-random.Next(0, 121))
                }

                loop (customer::customers) max (current+1)
           
        // Assign the results to our F# immutable list of customers
        _customers <- loop [] numberToGenerate 1

    [<Benchmark>]
    member this.FSharp_ModifyCustomers_Immutable() =
        let today = DateTime.Today

        _customers
        |> List.map (setVip today)
        |> ignore

// ---------------------------------------------------------------------------------------------

[<MemoryDiagnoser>]
type PerformanceTests_MutableList() =
    
    let mutable _customers  = List<Customer>() // Mutable standard .NET list
    member this.GetCustomers() = _customers

    [<Setup>]
    member this.FSharp_GenerateCustomers_Mutable() =
        let numberToGenerate = 100000
        let random = Random(10)
        let customers = List<Customer>()

        for i = 1 to numberToGenerate do
            let customer = {
                    Id = i
                    Age = random.Next(18, 100)
                    Name = names.[random.Next(0, names.Length)]
                    IsVip = booleans.[random.Next(0, booleans.Length)]
                    CustomerSince = DateTime.Today.AddMonths(-random.Next(0, 121))
            }
            customers.Add(customer)
           
        // Assign the results to our C#-like mutable list of customers
        _customers <- customers

    [<Benchmark>]
    member this.FSharp_ModifyCustomers_Mutable() =
        let today = DateTime.Today
    
        let rec loop index (customers:List<Customer>) =
            if index >= customers.Count
            then ignore
            else 
                customers.[index] <- setVip today customers.[index]
                loop (index+1) customers

        loop 0 _customers |> ignore
  
[<EntryPoint>]
let main argv = 
    
    (*    
    printfn "start %A" DateTime.Now
    let perfTests = PerformanceTests()
    perfTests.FSharp_GenerateCustomers() |> ignore
    //perfTests.GetCustomers() |> List.iter print
    //perfTests.GetCustomers2() |> Seq.iter print
    printfn "inter %A" DateTime.Now
    //perfTests.FSharp_ModifyCustomers() |> ignore // |> List.iter print
    perfTests.FSharp_ModifyCustomers2() |> ignore
    //perfTests.GetCustomers2() |> Seq.iter print
    printfn "end %A" DateTime.Now
    *)

    //BenchmarkRunner.Run<PerformanceTests_ImmutableList>() |> printfn "%A"
    BenchmarkRunner.Run<PerformanceTests_MutableList>() |> printfn "%A"
    Console.ReadKey() |> ignore
    0