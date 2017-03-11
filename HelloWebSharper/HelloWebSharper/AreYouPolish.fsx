// Check out the associated blog post at:
// http://www.ybouglouan.pl/2017/03/are-you-polish-fharp-will-tell-us-probably/

open System

// -----------------------------------------------------------------------------------------------

/// Return the number of occurrences of a given char within a word (case-insensitive)
let countCharCI char word =
    word
    |> Seq.filter (fun current -> Char.ToLower current = Char.ToLower char) 
    |> Seq.length

countCharCI 'c' "ccc" // 3
countCharCI 'c' "cCc" // 3
countCharCI 'c' "" // 0
countCharCI '2' "145" // 0
countCharCI '3' "3f3sdf" // 2

/// Apply a function to all elements of a list, sum the results and multiply by the number of points
let computePointsFor func elems points word =
    elems
    |> List.map (fun pc -> func pc word)
    |> List.reduce (+)
    |> (*) points

let polishChars = ['ą';'ć';'ę';'ł';'ń';'ó';'ś';'ż';'ź']

computePointsFor countCharCI polishChars 1 "Bob Johnson" // 0
computePointsFor countCharCI polishChars 1 "Robert Jonsłon" // 1
computePointsFor countCharCI polishChars 2 "Stanisław Wójcik" // 4
computePointsFor countCharCI polishChars 1 "" // 0

// Helper function with pre-baked parameters
let checkPolishChars points word =
    computePointsFor countCharCI polishChars points word

checkPolishChars 3 "Józef Gwóźdź" // 12

// -----------------------------------------------------------------------------------------------

// A digraph is a combination of letters that represent a single sound!
let polishDigraphs = ["ch";"cz";"dz";"dż";"dź";"rz";"sz"]

/// Return the number of occurrences of a given digraph within a word (case-insensitive)
/// The function ignores overlaps (countDigraphCI "cc" "cccc" returns 2 and not 3)
let countDigraphCI (digraph:string) (word:string) =
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

countDigraphCI "cz" "Szczerba" // 1
countDigraphCI "cz" "szCZerba" // 1
countDigraphCI "sz" "Szczerba" // 1
countDigraphCI "sz" "" // 0
countDigraphCI "cz" "Wieczorkiewicz" // 2

/// Apply computePointsForChars function on a word using Polish characters
let checkPolishDigraphs points word =
    computePointsFor countDigraphCI polishDigraphs points word

checkPolishDigraphs 1 "szczrz" // 3
checkPolishDigraphs 2 "Dziurdź" // 4
checkPolishDigraphs 3 "Szczerba" // 6
checkPolishDigraphs 1 "Błaszczyszyn" // 3

// -----------------------------------------------------------------------------------------------

/// Apply a list of criteria on a subject and return as soon as one matches the given condition
let checkConditions criteria condition subject =
    let rec loop remainingElems = // sub-function, loop over the criteria
        match remainingElems with
        | [] -> (false, None)
        | c::r -> 
            match condition c subject with
            | true -> (true, Some c) // exit as soon as we get a positive result
            | false -> loop r // else loop over the next element
    loop criteria

// -----------------------------------------------------------------------------------------------

/// Check whether a word has the given ending (case-insensitive)
let finishWithCI (suffix:string) (word:string) = word.ToLower().EndsWith(suffix.ToLower())

finishWithCI "ski" "kowalski" // true
finishWithCI "SKi" "kowalsKI" // true
finishWithCI "wicz" "Nowak" // false
finishWithCI "" "Nowak" // true
finishWithCI "" "" // true
finishWithCI "ski" "" // false

let polishEndings = ["wicz";"czyk";"wski";"wska";"ński";"ńska";"ski";"ska";"cki";"cka";"ło";"ła";"ak";"rz"]
checkConditions polishEndings finishWithCI "Kowalski" // (true, Some "ski")

/// Return a certain amount of points if the given word has one of the most common Polish endings
let checkPolishEndings points word =
    let success, _ = checkConditions polishEndings finishWithCI word
    if success then points else 0

// -----------------------------------------------------------------------------------------------
// Helper functions to facilitate composition

let checkPolishCharsPipe points (word, initialPoints) =
    (word, checkPolishChars points word + initialPoints) 
    
let checkPolishEndingsPipe points (word, initialPoints) =
    (word, checkPolishEndings points word + initialPoints)

let checkPolishDigraphsPipe points (word, initialPoints) =
    (word, checkPolishDigraphs points word + initialPoints)

let checkAllPolishConditions pointsPerChar pointsPerEnding pointsPerDigraph = 
    checkPolishCharsPipe pointsPerChar
    >> checkPolishEndingsPipe pointsPerEnding
    >> checkPolishDigraphsPipe pointsPerDigraph

// -----------------------------------------------------------------------------------------------

type NameOrigin = DefinitelyPolish | ProbablyPolish | NotPolish

/// Divide the number of points obtained for a given word by the length of the word itself
let calculatePolishDensity (word:string, points) =
    match word.Length with
        | 0 -> (word, 0.)
        | len -> (word, float points / float len)

/// Decide if a word is Polish based on its density
let decideIfPolish (word, density) =
    if (density < 0.2) then (word, NameOrigin.NotPolish, density)
    else if (density >= 0.2 && density <= 0.8) then (word, NameOrigin.ProbablyPolish, density)
    else (word, NameOrigin.DefinitelyPolish, density)

/// A test method
let getPointsFor name =
    (name, 0)
    |> checkAllPolishConditions 1 7 2

getPointsFor "Młynarczyk" // 10 (1 for ł, 2 for cz, 7 for czyk)
getPointsFor "Włudzik" // 3 (1 for ł, 2 for dz)

// The magic function that decides if the given surname is Polish or not.     
let isNamePolish name =
    (name, 0)
    |> checkAllPolishConditions 1 6 3
    |> calculatePolishDensity
    |> decideIfPolish

isNamePolish "Kowalski" // ProbablyPolish
isNamePolish "Młynarczyk" // DefinitelyPolish
isNamePolish "Lisiewicz" // DefinitelyPolish
isNamePolish "Johnson" // NotPolish
isNamePolish "Nowak" // DefinitelyPolish
isNamePolish "Młynarz" // DefinitelyPolish
isNamePolish "Kozak" // DefinitelyPolish
isNamePolish "Bouglouan" // NotPolish
isNamePolish "Włudzik" // ProbablyPolish
isNamePolish "Urbaniak" // ProbablyPolish
isNamePolish "Brzęczyszczykiewicz" // DefinitelyPolish