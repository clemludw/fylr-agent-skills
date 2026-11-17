# golib API index

Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa.
Regenerate with `cd scripts/golib-api && go run .` in the fylr-agents-skills repository; do not edit by hand.

One package, imported as `golib`. Each exported function and type has its own file under
`api/`; constructors and methods are in the file of their type (or of the function that
returns an unexported type). Find a name here, then read only its file.

Many doc comments are a single line: read the source (`go doc -src golib.<Name>` in the
plugin module) before relying on a function.

- [Constants and variables](api/constants.md)

## Functions

- [AbsPathExecutable](api/AbsPathExecutable.md) — AbsPathExecutable prefixes p with the path to the currently running executable if p is not absolute.
- [AddToQuery](api/AddToQuery.md) — AddToQuery adds qv (key, value) to query.
- [AnyToStrSlice](api/AnyToStrSlice.md) — AnyToStrSlice converts a slice of string to slice of interface
- [ArrayContainsStrs](api/ArrayContainsStrs.md) — ArrayContainsStrs returns true if arr contains any of the passed strings
- [AttrByName](api/AttrByName.md)
- [ConcurrentManager](api/ConcurrentManager.md) — ConcurrentManager is used to concurrently execute a func in n workers.
- [ContentDisposition](api/ContentDisposition.md)
- [CutRunes](api/CutRunes.md) — CutRunes works like CutStr but counts runes not bytes
- [CutStr](api/CutStr.md) — CutStr cuts s if is longer than "len" When a string is cut, the suffix is added
- [CutStrInArray](api/CutStrInArray.md) — CutStrInArray cuts each string inside the given array to the given length and adds the suffix is the string was cut.
- [DebugValues](api/DebugValues.md) — DebugValues takes a slice of T and returns and ordered list each item rendered in a comma separated list.
- [DecryptAES](api/DecryptAES.md) — DecryptAES takes a base64 encoded cryptedText and decrypt it to text using provided secretKey.
- [Dump](api/Dump.md)
- [EncryptAES](api/EncryptAES.md) — EncryptAES encrypts text to cryptedText using the secretKey.
- [FileExists](api/FileExists.md)
- [FileMimeType](api/FileMimeType.md) — FileMimeType returns the content-type of a file
- [FilepathAbs](api/FilepathAbs.md) — FilepathAbs returns the file's absolute path, relative to the startDir
- [Float64ToInt64](api/Float64ToInt64.md)
- [FoldStr](api/FoldStr.md) — FoldStr uses ICU folding on s
- [FormatDuration](api/FormatDuration.md)
- [FormatTime](api/FormatTime.md)
- [GenerateNumberOTP](api/GenerateNumberOTP.md)
- [GenerateOTP](api/GenerateOTP.md) — GenerateOTP creates a random string from the given chars
- [GetBool](api/GetBool.md) — GetBool returns bool from a string
- [GetInt](api/GetInt.md) — GetInt returns int64 from a string, default to the given default if 0 or empty
- [HttpRedirect](api/HttpRedirect.md) — Uses stdlib http.Redirect but sets cache header
- [HumanByteSize](api/HumanByteSize.md)
- [IOWriterFromLogger](api/IOWriterFromLogger.md)
- [Int64InArray](api/Int64InArray.md)
- [Int64Intersect](api/Int64Intersect.md) — Int64Intersect intersects a and b.
- [Int64Merge](api/Int64Merge.md) — Int64Merge returns a new slice with all items from a and b merged together, duplicates removed
- [Int64OrString](api/Int64OrString.md) — Int64OrString checks if data is an int or any of the accepted strings.
- [Int64RefFromFloat64](api/Int64RefFromFloat64.md)
- [Int64SliceToInterfaceSlice](api/Int64SliceToInterfaceSlice.md) — Int64SliceToInterfaceSlice converts a slice of int64 to slice of interface
- [IntMax](api/IntMax.md) — Max returns the larger of x or y.
- [IntMin](api/IntMin.md) — Min returns the smaller of x or y.
- [IsDisplayableInBrowser](api/IsDisplayableInBrowser.md)
- [IsInStringSlice](api/IsInStringSlice.md)
- [IsNil](api/IsNil.md)
- [IsUUID](api/IsUUID.md) — IsUUID returns true if id is the same format as NewUUID provides
- [JsonBytes](api/JsonBytes.md)
- [JsonBytesIndent](api/JsonBytesIndent.md)
- [JsonPretty](api/JsonPretty.md)
- [JsonReadFile](api/JsonReadFile.md) — Reads the given file into the given value If the filename ends in ".gz", it is opened using the gzip library.
- [JsonString](api/JsonString.md)
- [JsonStringIndent](api/JsonStringIndent.md)
- [JsonUnmarshal](api/JsonUnmarshal.md)
- [JsonUnmarshalObject](api/JsonUnmarshalObject.md) — JsonUnmarshalObject marshals the source into json and unmarshals it into target
- [JsonUnmarshalQuery](api/JsonUnmarshalQuery.md) — JsonUnmarshalQuery unmarshals a query string into target.
- [JsonUnmarshalReadCloser](api/JsonUnmarshalReadCloser.md)
- [JsonUnmarshalReader](api/JsonUnmarshalReader.md)
- [JsonUnmarshalReaderStrict](api/JsonUnmarshalReaderStrict.md)
- [JsonWriteFile](api/JsonWriteFile.md) — Write the given object into file
- [LangShort](api/LangShort.md) — LangShort cuts the lang returns the first part
- [MD5](api/MD5.md) — MD5 JSONMarshals i and return the MD5 of the marshaled bytes
- [MapKeys](api/MapKeys.md) — Keys returns all map keys
- [MapValues](api/MapValues.md) — MapValues returns the full set of variables optionally starting with matching regexp "re"
- [MarkdownDefault](api/MarkdownDefault.md)
- [MatchBasicAuth](api/MatchBasicAuth.md) — MatchBasicAuth checks if a request contains credentials matched in basicAuth map.
- [MimeTypeReader](api/MimeTypeReader.md) — MimeTypeReader returns the MIME type of input and a new reader containing the whole data from input.
- [MustBuildURL](api/MustBuildURL.md) — MustBuildURL uses "u" as basis and adds given query values Query values must be given as key1, value1, [key2, value2[, ...]] Panics if the URL is not parsable
- [NewUUID](api/NewUUID.md) — NewUUID returns a randomly generated UUID
- [PackZipFile](api/PackZipFile.md) — PackZipFile packs all files from sourceDir as ZIP to writeTo.
- [PadStr](api/PadStr.md) — PadStr returns string s filled to a length of padWidth.
- [ParseForm](api/ParseForm.md) — ParseForm works like http.Request.ParseForm but additionally adds values received in json format to request.Form
- [ParseInt64](api/ParseInt64.md)
- [ParseTime](api/ParseTime.md)
- [Pln](api/Pln.md) — Pln output s + args to os.Stderr.
- [Pretty](api/Pretty.md) — Pretty formats els as json (with indentation) and outputs it to os.Stderr
- [PrintMem](api/PrintMem.md) — PrintMem dumps some mem info to the console
- [PushOntoStringArray](api/PushOntoStringArray.md) — PushOntoStringArray adds str(s) to arr if missing
- [RandStr](api/RandStr.md) — RandStr creates a random string containg of n chars seed with rand.Seed(time.Now().UnixNano())
- [ReadGzipFile](api/ReadGzipFile.md) — ReadGzipFile opens file fn and returns its unpacked bytes.
- [Recover](api/Recover.md) — Recover can be used in defer to execute "f" on recover
- [RegexpMatch](api/RegexpMatch.md) — RegexpMatch uses regexp to match the first key found in m.
- [RenderMarkdown](api/RenderMarkdown.md)
- [RenderTemplate](api/RenderTemplate.md) — RenderTemplate takes bytes and executes it and returns the rendered bytes
- [ReplaceEndless](api/ReplaceEndless.md) — ReplaceEndless replaces old to new in s as long as the string is getting shorter.
- [Route](api/Route.md) — Route returns the route from a Gorilla Mux.
- [SanitizeBaseName](api/SanitizeBaseName.md) — SanitizeBaseName mirrors the Java one-liner: • trims to 255 runes • keeps bad chars by swapping them for '_' (underscore)
- [SetInStruct](api/SetInStruct.md) — SetInStruct uses setMap to set value in passed data.
- [SliceApply](api/SliceApply.md) — SliceApply applies all functions Fs against all items in t and returns t2
- [SliceFilter](api/SliceFilter.md)
- [Snippet](api/Snippet.md) — Snippet returns lines from lineNo-plusMinus to lineNo+plusMinus, prefixed with the line number
- [SortStr](api/SortStr.md)
- [SortStrNumeric](api/SortStrNumeric.md) — SortStrNumeric works like SortStr with collate.Numeric set, using a cached collator.
- [StrInArray](api/StrInArray.md)
- [StringByteChunks](api/StringByteChunks.md) — Split string s into byte chunks of a max size of chunkSize Each string returned has a maximum length of byteChunkSize The split is UTF-8 safe.
- [Subroute](api/Subroute.md) — Subroute returns the subroute form a Gorilla Mux Subrouter.
- [ToAnySlice](api/ToAnySlice.md) — ToAnySlice converts a slice of []T to []any
- [ToString](api/ToString.md)
- [ToValidUTF8](api/ToValidUTF8.md) — ToValidUTF8 checks and converts a string to valid UTF-8, replacing invalid characters.
- [UniqueInt64s](api/UniqueInt64s.md) — UniqueInt64s returns all unique strings
- [UniqueStrings](api/UniqueStrings.md) — UniqueStrings returns all unique strings
- [UnmarshalJsonFile](api/UnmarshalJsonFile.md)
- [UnpackZipFile](api/UnpackZipFile.md) — UnpackZipFile reads zipData and unpacks the contents of the zip into targetDir.
- [XmlAttr](api/XmlAttr.md)
- [XmlAttrAppend](api/XmlAttrAppend.md)
- [XmlAttrInt](api/XmlAttrInt.md)
- [XmlAttrInt64](api/XmlAttrInt64.md)
- [XmlAttrInt64Append](api/XmlAttrInt64Append.md)
- [XmlAttrIntAppend](api/XmlAttrIntAppend.md)
- [XmlEnd](api/XmlEnd.md)
- [XmlSetAttr](api/XmlSetAttr.md)
- [XmlStart](api/XmlStart.md)

## Types

- [Accept](api/Accept.md) — Accept is a structure to represent a clause in an HTTP Accept Header. (ParseAccept, .Mediatype)
- [CountWriter](api/CountWriter.md) (NewCountWriter, NewLimitCountWriter, .Count, .Write)
- [Date](api/Date.md)
- [EnvMap](api/EnvMap.md) (GetEnv, .Env)
- [HttpRange](api/HttpRange.md) — HttpRange specifies the byte range to be sent to the client. (ParseRange, .ContentRange, .MimeHeader)
- [IOWriter](api/IOWriter.md) (.Write)
- [Int64Unique](api/Int64Unique.md) (NewInt64Unique, .Add, .Contains, .Count, .MarshalJSON, .Remove)
- [IntArr](api/IntArr.md) (.Add, .AddUnique, .AvgInt64, .Contains, .Diff, .IndexOf, .Join, .Max, .Min, .Remove, .Sort, .StringArr, .Sum)
- [IntDiffMap](api/IntDiffMap.md) (.String)
- [JsonLineWriter](api/JsonLineWriter.md) — JsonLineWriter implements io.Writer and send the data to an Encoder whenever a newline is written After each newline a "," is send to the underlying Writer (NewJsonLineWriter, .Flush, .Write)
- [JsonUnmarshalError](api/JsonUnmarshalError.md) (NewJsonUnmarshalError, .Error, .SourceType, .TargetPropertyName, .TargetType)
- [Language](api/Language.md) (NewLanguage, .Tag)
- [Languages](api/Languages.md) (NewLanguages, .Contains, .Strings, .Tags)
- [LocaParams](api/LocaParams.md)
- [LocaValue](api/LocaValue.md) (.Best, .Copy, .Fill, .MarshalXML, .Scan, .TrimSpace, .Value)
- [Localization](api/Localization.md) (NewLocalization, .Get, .GetLocaValue, .GetLocaValueWithParams, .GetWithParams, .Load, .Merge, .SetDefaultLang, .ToApi)
- [LogInfo](api/LogInfo.md) (LogInfoFromRequest)
- [NullInt64](api/NullInt64.md) (.UnmarshalJSON)
- [OrderedFunc](api/OrderedFunc.md)
- [ReadCounter](api/ReadCounter.md) — It simply forwards the Read() call, while displaying the results from individual calls to it. (NewReadCounter, .Read)
- [Replacer](api/Replacer.md) (.AddEmptyKeyReplacer, .Debug, .Dump, .IntOrReplace, .Repl, .Replace, .Set, .SetInt, .SetInt64)
- [RunFunc](api/RunFunc.md)
- [StringMap](api/StringMap.md)
- [StringMatcher](api/StringMatcher.md) (.Append, .Match, .SortedKeys)
- [StringStack](api/StringStack.md) (.IsEmpty, .Peek, .Pop, .Push)
- [SyncedFunc](api/SyncedFunc.md)
- [UniqueFilename](api/UniqueFilename.md) (NewUniqueFilename, .Add)
- [WriterCounter](api/WriterCounter.md) — WriterCounter is counter for io.Writer (NewWriterCounter, .Count, .Write)
