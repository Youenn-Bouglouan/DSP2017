namespace HelloWebSharper

open System

module PolishSurnames =

    let PolishChars = ['ą';'ć';'ę';'ł';'ń';'ó';'ś';'ż';'ź']
    let PolishDigraphs = ["ch";"cz";"dz";"dż";"dź";"rz";"sz"]
    let PolishEndings = ["wicz";"czyk";"wski";"wska";"ński";"ńska";"ski";"ska";"cki";"cka";"ło";"ła";"ak";"rz"]

    type SurnameOrigin = DefinitelyPolish | ProbablyPolish | NotPolish

    type SurnameStatistics = {
        Surname: string
        Origin: SurnameOrigin
        PolishDensity: float
    }

    let public TryExtractSurname (username:string) =
        let names = username.Split([|' '|], StringSplitOptions.RemoveEmptyEntries)
        match names with
        | [||] -> None
        | [|first|] -> None
        | _ -> Some names.[names.Length-1]
    
    /// Return the number of occurrences of a given char within a word (case-insensitive)
    let public containsCharCI (c:char) word =
        word
        |> Seq.tryFind (fun current -> Char.ToLower current = Char.ToLower c)
        |> Option.isSome

    /// Apply a function to all elements of a list, sum the results and multiply by the number of points
    let public countCharsCI (c:char) word =
        word
        |> Seq.filter (fun current -> Char.ToLower current = Char.ToLower c) 
        |> Seq.length

    /// Return the number of occurrences of a given digraph within a word (case-insensitive)
    /// The function ignores overlaps (countDigraphCI "cc" "cccc" returns 2 and not 3)
    let public countDigraphsCI (digraph:string) (word:string) =
        let wordCI = word.ToLower()
        let digraphCI = digraph.ToLower()

        let rec loop occurrences index =
            if index >= String.length wordCI then occurrences
            else
                match wordCI.IndexOf(digraphCI, index) with
                | -1 -> occurrences // -1 means the substring was not found
                | indexFound -> loop (occurrences + 1) (indexFound + String.length digraphCI)
    
        if String.length word = 0 then 0
        else loop 0 0

    /// Check whether a word has the given ending (case-insensitive)
    let public finishWithCI (suffix:string) (word:string) = word.ToLower().EndsWith(suffix.ToLower())

    /// Apply a function to all elements of a list, sum the results and multiply by the number of points
    let private computePointsFor func elems points word =
        elems
        |> List.map (fun e -> func e word)
        |> List.reduce (+)
        |> (*) points

    /// Apply a list of criteria on a subject and return as soon as one matches the given condition
    let private checkConditions criteria condition subject =
        let rec loop remainingElems = // sub-function, loop over the criteria
            match remainingElems with
            | [] -> (false, None)
            | c::r -> 
                match condition c subject with
                | true -> (true, Some c) // exit as soon as we get a positive result
                | false -> loop r // else loop over the next element
        loop criteria

    // Helper function with pre-baked parameters
    let private checkPolishChars points word =
        computePointsFor countCharsCI PolishChars points word

    /// Apply computePointsFor to our countDigraphsCI function
    let private checkPolishDigraphs points word =
        computePointsFor countDigraphsCI PolishDigraphs points word

    /// Return a certain amount of points if the given word has one of the most common Polish endings
    let private checkPolishEndings points word =
        let success, _ = checkConditions PolishEndings finishWithCI word
        if success then points else 0

    /// Divide the number of points obtained for a given word by the length of the word itself
    let private calculatePolishDensity (word:string, points) =
        match word.Length with
            | 0 -> (word, 0.)
            | len -> (word, float points / float len)

    /// Decide if a word is Polish based on its density
    let private decideIfPolish (word, density) =
        if (density < 0.2) then {Surname = word; Origin = SurnameOrigin.NotPolish; PolishDensity = density }
                else if (density >= 0.2 && density <= 0.8) then {Surname = word; Origin = SurnameOrigin.ProbablyPolish; PolishDensity = density }
        else {Surname = word; Origin = SurnameOrigin.DefinitelyPolish; PolishDensity = density }

    // -----------------------------------------------------------------------------------------------
    // Helper functions to facilitate composition

    let private checkPolishCharsPipe points (word, initialPoints) =
        (word, checkPolishChars points word + initialPoints) 
    
    let private checkPolishEndingsPipe points (word, initialPoints) =
        (word, checkPolishEndings points word + initialPoints)

    let private checkPolishDigraphsPipe points (word, initialPoints) =
        (word, checkPolishDigraphs points word + initialPoints)

    let private checkAllPolishConditions pointsPerChar pointsPerEnding pointsPerDigraph = 
        checkPolishCharsPipe pointsPerChar
        >> checkPolishEndingsPipe pointsPerEnding
        >> checkPolishDigraphsPipe pointsPerDigraph

    // Determine whether the given surname is Polish or not
    let public IsSurnamePolish name =
        (name, 0)
        |> checkAllPolishConditions 1 6 3
        |> calculatePolishDensity
        |> decideIfPolish