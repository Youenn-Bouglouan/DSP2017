// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2015 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

try {
    Object.defineProperty(Error.prototype, 'message', { enumerable: true });
} catch (e) { }

var IntelliFactory =
{
    Runtime:
    {
        Class:
            function (p, s) {
                function r() { }
                r.prototype = p;
                for (var f in s) { r[f] = s[f]; }
                return r;
            },

        Define:
            function (a, b) {
                var overwrite = !!this.overwrite;
                function define(a, b) {
                    for (var k in b) {
                        var t1 = typeof a[k];
                        var t2 = typeof b[k];
                        if (t1 == "object" && t2 == "object") {
                            define(a[k], b[k]);
                        } else if (t1 == "undefined" || overwrite) {
                            a[k] = b[k];
                        } else {
                            throw new Error("Name conflict: " + k);
                        }
                    }
                }
                define(a, b);
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === undefined) { delete obj[f]; }
                }
                return obj;
            },

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        GetOptional:
            function (value) {
                return (value === undefined) ? { $: 0 } : { $: 1, $0: value };
            },

        New:		
            function (ctor, fields) {
                var r = new ctor();
                for (var f in fields) {
                    if (!(f in r)) {
                        r[f] = fields[f];
                    }
                }
                return r
            },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        OnInit:
            function (f) {
                if (!("init" in this)) {
                    this.init = [];
                }
                this.init.push(f);
            },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Inherit:
            function (a, b) {
		if (typeof b !== "function") return;
                var p = a.prototype;
                a.prototype = new b();
                for (var f in p) {
                    a.prototype[f] = p[f];
                }
            },

        Safe:
            function (x) {
                if (x === undefined) return {};
                return x;
            },

        SetOptional:
            function (obj, field, value) {
                if (value.$ == 0) {
                    delete obj[field];
                } else {
                    obj[field] = value.$0;
                }
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },

        Bind:
            function (f, obj) {
                return function () { return f.apply(this, arguments) }
            },

        CreateFuncWithArgs:
            function (f) {
                return function () { return f(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithOnlyThis:
            function (f) {
                return function () { return f(this); }
            },

        CreateFuncWithThis:
            function (f) {
                return function () { return f(this).apply(null, arguments); }
            },

        CreateFuncWithThisArgs:
            function (f) {
                return function () { return f(this)(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithRest:
            function (length, f) {
                return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])); }
            },

        CreateFuncWithArgsRest:
            function (length, f) {
                return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]); }
            },

        UnionByType:
            function (types, value, optional) {
                var vt = typeof value;
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    if (typeof t == "number") {
                        if (Array.isArray(value) && (t == 0 || value.length == t)) {
                            return { $: i, $0: value };
                        }
                    } else {
                        if (t == vt) {
                            return { $: i, $0: value };
                        }
                    }
                }
                if (!optional) {
                    throw new Error("Type not expected for creating Choice value.");
                }
            }
    }
};

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

if (!Math.trunc) {
    Math.trunc = function (x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }
}
;
var JSON;JSON||(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i)),typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return r("",{"":i})}),typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),e.lastIndex=0,e.test(n)&&(n=n.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Array,Arrays,Operators,List,Enumerator,T,Enumerable,Seq,Seq1,Arrays1,Ref,Activator,document,jQuery,Json,JSON,JavaScript,JSModule,AggregateException,Exception,ArgumentException,Number,IndexOutOfRangeException,List1,Arrays2D,Concurrency,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,OperationCanceledException,Date,console,TimeoutException,Scheduler,HtmlContentExtensions,SingleNode,InvalidOperationException,T1,MatchFailureException,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,AjaxRemotingProvider,window,String,RegExp;
 Runtime.Define(Global,{
  Arrays:{
   contains:function(item,arr)
   {
    var c,i,l;
    c=true;
    i=0;
    l=arr.length;
    while(c?i<l:false)
     {
      Unchecked.Equals(arr[i],item)?c=false:i=i+1;
     }
    return!c;
   },
   mapFold:function(f,zero,arr)
   {
    var r,acc,i,patternInput,b,a;
    r=Array(arr.length);
    acc=zero;
    for(i=0;i<=arr.length-1;i++){
     patternInput=(f(acc))(Arrays.get(arr,i));
     b=patternInput[1];
     a=patternInput[0];
     Arrays.set(r,i,a);
     acc=b;
    }
    return[r,acc];
   },
   mapFoldBack:function(f,arr,zero)
   {
    var r,acc,len,j,i,patternInput,b,a;
    r=Array(arr.length);
    acc=zero;
    len=arr.length;
    for(j=1;j<=len;j++){
     i=len-j;
     patternInput=(f(Arrays.get(arr,i)))(acc);
     b=patternInput[1];
     a=patternInput[0];
     Arrays.set(r,i,a);
     acc=b;
    }
    return[r,acc];
   },
   sortInPlaceByDescending:function(f,arr)
   {
    return arr.sort(function(x,y)
    {
     return-Operators.Compare(f(x),f(y));
    });
   },
   splitInto:function(count,arr)
   {
    var len,_,count1,res,minChunkSize,startIndex,i,i1;
    count<=0?Operators.FailWith("Count must be positive"):null;
    len=Arrays.length(arr);
    if(len===0)
     {
      _=[];
     }
    else
     {
      count1=Operators.Min(count,len);
      res=Array(count1);
      minChunkSize=len/count1>>0;
      startIndex=0;
      for(i=0;i<=len%count1-1;i++){
       Arrays.set(res,i,Arrays.sub(arr,startIndex,minChunkSize+1));
       startIndex=startIndex+minChunkSize+1;
      }
      for(i1=len%count1;i1<=count1-1;i1++){
       Arrays.set(res,i1,Arrays.sub(arr,startIndex,minChunkSize));
       startIndex=startIndex+minChunkSize;
      }
      _=res;
     }
    return _;
   },
   tryFindBack:function(f,arr)
   {
    var res,i;
    res={
     $:0
    };
    i=arr.length-1;
    while(i>0?res.$==0:false)
     {
      f(Arrays.get(arr,i))?res={
       $:1,
       $0:Arrays.get(arr,i)
      }:null;
      i=i-1;
     }
    return res;
   },
   tryFindIndexBack:function(f,arr)
   {
    var res,i;
    res={
     $:0
    };
    i=arr.length-1;
    while(i>0?res.$==0:false)
     {
      f(Arrays.get(arr,i))?res={
       $:1,
       $0:i
      }:null;
      i=i-1;
     }
    return res;
   }
  },
  List:{
   map3:function(f,l1,l2,l3)
   {
    var array;
    array=Arrays.map2(function(func)
    {
     return function(arg1)
     {
      return func(arg1);
     };
    },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
    return List.ofArray(array);
   },
   skip:function(i,l)
   {
    var res,j,_,t;
    res=l;
    for(j=1;j<=i;j++){
     if(res.$==0)
      {
       _=Operators.FailWith("Input list too short.");
      }
     else
      {
       t=res.$1;
       _=res=t;
      }
    }
    return res;
   },
   skipWhile:function(predicate,list)
   {
    var rest;
    rest=list;
    while(!(rest.$==0)?predicate(List.head(rest)):false)
     {
      rest=List.tail(rest);
     }
    return rest;
   }
  },
  Seq:{
   chunkBySize:function(size,s)
   {
    var getEnumerator;
    size<=0?Operators.FailWith("Chunk size must be positive"):null;
    getEnumerator=function()
    {
     var _enum,dispose,next;
     _enum=Enumerator.Get(s);
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,res,value;
      if(_enum.MoveNext())
       {
        res=[_enum.get_Current()];
        while(Arrays.length(res)<size?_enum.MoveNext():false)
         {
          value=res.push(_enum.get_Current());
         }
        e.c=res;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   compareWith:function(f,s1,s2)
   {
    var e1,_,e2,_1,r,loop,matchValue;
    e1=Enumerator.Get(s1);
    try
    {
     e2=Enumerator.Get(s2);
     try
     {
      r=0;
      loop=true;
      while(loop?r===0:false)
       {
        matchValue=[e1.MoveNext(),e2.MoveNext()];
        matchValue[0]?matchValue[1]?r=(f(e1.get_Current()))(e2.get_Current()):r=1:matchValue[1]?r=-1:loop=false;
       }
      _1=r;
     }
     finally
     {
      e2.Dispose!=undefined?e2.Dispose():null;
     }
     _=_1;
    }
    finally
    {
     e1.Dispose!=undefined?e1.Dispose():null;
    }
    return _;
   },
   contains:function(el,s)
   {
    var e,_,r;
    e=Enumerator.Get(s);
    try
    {
     r=false;
     while(!r?e.MoveNext():false)
      {
       r=Unchecked.Equals(e.get_Current(),el);
      }
     _=r;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   countBy:function(f,s)
   {
    var generator;
    generator=function()
    {
     var d,e,_,keys,k,h,_1,mapping,array,x;
     d={};
     e=Enumerator.Get(s);
     try
     {
      keys=[];
      while(e.MoveNext())
       {
        k=f(e.get_Current());
        h=Unchecked.Hash(k);
        if(d.hasOwnProperty(h))
         {
          _1=void(d[h]=d[h]+1);
         }
        else
         {
          keys.push(k);
          _1=void(d[h]=1);
         }
       }
      mapping=function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      };
      array=keys.slice(0);
      x=Arrays.map(mapping,array);
      _=x;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    };
    return Seq.delay(generator);
   },
   distinct:function(s)
   {
    return Seq1.distinctBy(function(x)
    {
     return x;
    },s);
   },
   distinctBy:function(f,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var _enum,seen,add,dispose,next;
     _enum=Enumerator.Get(s);
     seen=Array.prototype.constructor.apply(Array,[]);
     add=function(c)
     {
      var k,h,cont,_,_1,value;
      k=f(c);
      h=Unchecked.Hash(k);
      cont=seen[h];
      if(Unchecked.Equals(cont,undefined))
       {
        seen[h]=[k];
        _=true;
       }
      else
       {
        if(Arrays1.contains(k,cont))
         {
          _1=false;
         }
        else
         {
          value=cont.push(k);
          _1=true;
         }
        _=_1;
       }
      return _;
     };
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,cur,has,_1;
      if(_enum.MoveNext())
       {
        cur=_enum.get_Current();
        has=add(cur);
        while(!has?_enum.MoveNext():false)
         {
          cur=_enum.get_Current();
          has=add(cur);
         }
        if(has)
         {
          e.c=cur;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   except:function(itemsToExclude,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var _enum,seen,add,enumerator,_2,i,value1,dispose,next;
     _enum=Enumerator.Get(s);
     seen=Array.prototype.constructor.apply(Array,[]);
     add=function(c)
     {
      var h,cont,_,_1,value;
      h=Unchecked.Hash(c);
      cont=seen[h];
      if(Unchecked.Equals(cont,undefined))
       {
        seen[h]=[c];
        _=true;
       }
      else
       {
        if(Arrays1.contains(c,cont))
         {
          _1=false;
         }
        else
         {
          value=cont.push(c);
          _1=true;
         }
        _=_1;
       }
      return _;
     };
     enumerator=Enumerator.Get(itemsToExclude);
     try
     {
      while(enumerator.MoveNext())
       {
        i=enumerator.get_Current();
        value1=add(i);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     dispose=function()
     {
      return _enum.Dispose();
     };
     next=function(e)
     {
      var _,cur,has,_1;
      if(_enum.MoveNext())
       {
        cur=_enum.get_Current();
        has=add(cur);
        while(!has?_enum.MoveNext():false)
         {
          cur=_enum.get_Current();
          has=add(cur);
         }
        if(has)
         {
          e.c=cur;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      else
       {
        _=false;
       }
      return _;
     };
     return T.New(null,null,next,dispose);
    };
    return Enumerable.Of(getEnumerator);
   },
   groupBy:function(f,s)
   {
    return Seq.delay(function()
    {
     var d,d1,keys,e,_,c,k,h;
     d={};
     d1={};
     keys=[];
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        c=e.get_Current();
        k=f(c);
        h=Unchecked.Hash(k);
        !d.hasOwnProperty(h)?keys.push(k):null;
        d1[h]=k;
        d.hasOwnProperty(h)?d[h].push(c):void(d[h]=[c]);
       }
      _=Arrays.map(function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      },keys);
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    });
   },
   insufficient:function()
   {
    return Operators.FailWith("The input sequence has an insufficient number of elements.");
   },
   last:function(s)
   {
    var e,_,value,_1;
    e=Enumerator.Get(s);
    try
    {
     value=e.MoveNext();
     if(!value)
      {
       _1=Seq1.insufficient();
      }
     else
      {
       while(e.MoveNext())
        {
        }
       _1=e.get_Current();
      }
     _=_1;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   nonNegative:function()
   {
    return Operators.FailWith("The input must be non-negative.");
   },
   pairwise:function(s)
   {
    var mapping,source;
    mapping=function(x)
    {
     return[Arrays.get(x,0),Arrays.get(x,1)];
    };
    source=Seq1.windowed(2,s);
    return Seq.map(mapping,source);
   },
   truncate:function(n,s)
   {
    return Seq.delay(function()
    {
     return Seq.enumUsing(Enumerator.Get(s),function(e)
     {
      var i;
      i=[0];
      return Seq.enumWhile(function()
      {
       return e.MoveNext()?i[0]<n:false;
      },Seq.delay(function()
      {
       Ref.incr(i);
       return[e.get_Current()];
      }));
     });
    });
   },
   tryHead:function(s)
   {
    var e,_;
    e=Enumerator.Get(s);
    try
    {
     _=e.MoveNext()?{
      $:1,
      $0:e.get_Current()
     }:{
      $:0
     };
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   tryItem:function(i,s)
   {
    var _,j,e,_1,go;
    if(i<0)
     {
      _={
       $:0
      };
     }
    else
     {
      j=0;
      e=Enumerator.Get(s);
      try
      {
       go=true;
       while(go?j<=i:false)
        {
         e.MoveNext()?j=j+1:go=false;
        }
       _1=go?{
        $:1,
        $0:e.get_Current()
       }:{
        $:0
       };
      }
      finally
      {
       e.Dispose!=undefined?e.Dispose():null;
      }
      _=_1;
     }
    return _;
   },
   tryLast:function(s)
   {
    var e,_,_1;
    e=Enumerator.Get(s);
    try
    {
     if(e.MoveNext())
      {
       while(e.MoveNext())
        {
        }
       _1={
        $:1,
        $0:e.get_Current()
       };
      }
     else
      {
       _1={
        $:0
       };
      }
     _=_1;
    }
    finally
    {
     e.Dispose!=undefined?e.Dispose():null;
    }
    return _;
   },
   unfold:function(f,s)
   {
    var getEnumerator;
    getEnumerator=function()
    {
     var next;
     next=function(e)
     {
      var matchValue,_,t,s1;
      matchValue=f(e.s);
      if(matchValue.$==0)
       {
        _=false;
       }
      else
       {
        t=matchValue.$0[0];
        s1=matchValue.$0[1];
        e.c=t;
        e.s=s1;
        _=true;
       }
      return _;
     };
     return T.New(s,null,next,function()
     {
     });
    };
    return Enumerable.Of(getEnumerator);
   },
   windowed:function(windowSize,s)
   {
    windowSize<=0?Operators.FailWith("The input must be positive."):null;
    return Seq.delay(function()
    {
     return Seq.enumUsing(Enumerator.Get(s),function(e)
     {
      var q;
      q=[];
      return Seq.append(Seq.enumWhile(function()
      {
       return q.length<windowSize?e.MoveNext():false;
      },Seq.delay(function()
      {
       q.push(e.get_Current());
       return Seq.empty();
      })),Seq.delay(function()
      {
       return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
       {
        return Seq.enumWhile(function()
        {
         return e.MoveNext();
        },Seq.delay(function()
        {
         q.shift();
         q.push(e.get_Current());
         return[q.slice(0)];
        }));
       })):Seq.empty();
      }));
     });
    });
   }
  },
  WebSharper:{
   Activator:{
    Activate:Runtime.Field(function()
    {
     var _,meta;
     if(Activator.hasDocument())
      {
       meta=document.getElementById("websharper-data");
       _=meta?jQuery(document).ready(function()
       {
        var text,obj,action,array;
        text=meta.getAttribute("content");
        obj=Json.Activate(JSON.parse(text));
        action=function(tupledArg)
        {
         var k,v,p,old;
         k=tupledArg[0];
         v=tupledArg[1];
         p=v.get_Body();
         old=document.getElementById(k);
         return p.ReplaceInDom(old);
        };
        array=JSModule.GetFields(obj);
        return Arrays.iter(action,array);
       }):null;
      }
     else
      {
       _=null;
      }
     return _;
    }),
    hasDocument:function()
    {
     var $0=this,$this=this;
     return typeof Global.document!=="undefined";
    }
   },
   AggregateException:Runtime.Class({},{
    New:function(innerExceptions)
    {
     return Runtime.New(this,AggregateException.New1("One or more errors occurred.",innerExceptions));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   ArgumentException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,ArgumentException.New1("Value does not fall within the expected range."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Arrays:{
    average:function(arr)
    {
     return Number(Arrays.sum(arr))/Number(arr.length);
    },
    averageBy:function(f,arr)
    {
     return Number(Arrays.sumBy(f,arr))/Number(arr.length);
    },
    blit:function(arr1,start1,arr2,start2,length)
    {
     var i;
     Arrays.checkRange(arr1,start1,length);
     Arrays.checkRange(arr2,start2,length);
     for(i=0;i<=length-1;i++){
      Arrays.set(arr2,start2+i,Arrays.get(arr1,start1+i));
     }
     return;
    },
    checkBounds:function(arr,n)
    {
     return(n<0?true:n>=arr.length)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    checkBounds2D:function(arr,n1,n2)
    {
     return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(IndexOutOfRangeException.New()):null;
    },
    checkLength:function(arr1,arr2)
    {
     return arr1.length!==arr2.length?Operators.FailWith("Arrays differ in length."):null;
    },
    checkRange:function(arr,start,size)
    {
     return((size<0?true:start<0)?true:arr.length<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    choose:function(f,arr)
    {
     var q,i,matchValue,_,x;
     q=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=f(Arrays.get(arr,i));
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        x=matchValue.$0;
        _=q.push(x);
       }
     }
     return q;
    },
    chunkBySize:function(size,array)
    {
     var source;
     source=Seq1.chunkBySize(size,array);
     return Seq.toArray(source);
    },
    collect:function(f,x)
    {
     return Array.prototype.concat.apply([],Arrays.map(f,x));
    },
    compareWith:function(f,a1,a2)
    {
     return Seq1.compareWith(f,a1,a2);
    },
    concat:function(xs)
    {
     return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
    },
    contains:function(el,a)
    {
     return Seq1.contains(el,a);
    },
    countBy:function(f,a)
    {
     var source;
     source=Seq1.countBy(f,a);
     return Seq.toArray(source);
    },
    create:function(size,value)
    {
     var r,i;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,value);
     }
     return r;
    },
    create2D:function(rows)
    {
     var mapping,source1,x;
     mapping=function(source)
     {
      return Arrays.ofSeq(source);
     };
     source1=Seq.map(mapping,rows);
     x=Arrays.ofSeq(source1);
     x.dims=2;
     return x;
    },
    distinct:function(l)
    {
     var source;
     source=Seq1.distinct(l);
     return Seq.toArray(source);
    },
    distinctBy:function(f,a)
    {
     var source;
     source=Seq1.distinctBy(f,a);
     return Seq.toArray(source);
    },
    exactlyOne:function(ar)
    {
     return Arrays.length(ar)===1?Arrays.get(ar,0):Operators.FailWith("The input does not have precisely one element.");
    },
    except:function(itemsToExclude,a)
    {
     var source;
     source=Seq1.except(itemsToExclude,a);
     return Seq.toArray(source);
    },
    exists2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.exists2(f,arr1,arr2);
    },
    fill:function(arr,start,length,value)
    {
     var i;
     Arrays.checkRange(arr,start,length);
     for(i=start;i<=start+length-1;i++){
      Arrays.set(arr,i,value);
     }
     return;
    },
    filter:function(f,arr)
    {
     var r,i;
     r=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?r.push(Arrays.get(arr,i)):null;
     }
     return r;
    },
    find:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFind(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findINdex:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFindIndex(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,zero,arr)
    {
     var acc,i;
     acc=zero;
     for(i=0;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    fold2:function(f,zero,arr1,arr2)
    {
     var accum,i;
     Arrays.checkLength(arr1,arr2);
     accum=zero;
     for(i=0;i<=arr1.length-1;i++){
      accum=((f(accum))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return accum;
    },
    foldBack:function(f,arr,zero)
    {
     var acc,len,i;
     acc=zero;
     len=arr.length;
     for(i=1;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    foldBack2:function(f,arr1,arr2,zero)
    {
     var len,accum,i;
     Arrays.checkLength(arr1,arr2);
     len=arr1.length;
     accum=zero;
     for(i=1;i<=len;i++){
      accum=((f(Arrays.get(arr1,len-i)))(Arrays.get(arr2,len-i)))(accum);
     }
     return accum;
    },
    forall2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.forall2(f,arr1,arr2);
    },
    get:function(arr,n)
    {
     Arrays.checkBounds(arr,n);
     return arr[n];
    },
    get2D:function(arr,n1,n2)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     return arr[n1][n2];
    },
    groupBy:function(f,a)
    {
     var mapping,source,array;
     mapping=function(tupledArg)
     {
      var k,s;
      k=tupledArg[0];
      s=tupledArg[1];
      return[k,Seq.toArray(s)];
     };
     source=Seq1.groupBy(f,a);
     array=Seq.toArray(source);
     return Arrays.map(mapping,array);
    },
    head:function(ar)
    {
     return List.head(List.ofArray(ar));
    },
    indexed:function(ar)
    {
     return Arrays.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },ar);
    },
    init:function(size,f)
    {
     var r,i;
     size<0?Operators.FailWith("Negative size given."):null;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,f(i));
     }
     return r;
    },
    iter:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i));
     }
     return;
    },
    iter2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      (f(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    iteri:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      (f(i))(Arrays.get(arr,i));
     }
     return;
    },
    iteri2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      ((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    last:function(ar)
    {
     return Seq1.last(ar);
    },
    length:function(arr)
    {
     var matchValue;
     matchValue=arr.dims;
     return matchValue===2?arr.length*arr.length:arr.length;
    },
    map:function(f,arr)
    {
     var r,i;
     r=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(r,i,f(Arrays.get(arr,i)));
     }
     return r;
    },
    map2:function(f,arr1,arr2)
    {
     var r,i;
     Arrays.checkLength(arr1,arr2);
     r=Array(arr2.length);
     for(i=0;i<=arr2.length-1;i++){
      Arrays.set(r,i,(f(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return r;
    },
    map3:function(f,l1,l2,l3)
    {
     var list;
     list=List1.map3(f,List.ofArray(l1),List.ofArray(l2),List.ofArray(l3));
     return Arrays.ofSeq(list);
    },
    mapi:function(f,arr)
    {
     var y,i;
     y=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(y,i,(f(i))(Arrays.get(arr,i)));
     }
     return y;
    },
    mapi2:function(f,arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return res;
    },
    max:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },x);
    },
    maxBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },arr);
    },
    min:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },x);
    },
    minBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },arr);
    },
    nonEmpty:function(arr)
    {
     return arr.length===0?Operators.FailWith("The input array was empty."):null;
    },
    ofSeq:function(xs)
    {
     var q,_enum,_;
     q=[];
     _enum=Enumerator.Get(xs);
     try
     {
      while(_enum.MoveNext())
       {
        q.push(_enum.get_Current());
       }
      _=q;
     }
     finally
     {
      _enum.Dispose!=undefined?_enum.Dispose():null;
     }
     return _;
    },
    pairwise:function(a)
    {
     var source;
     source=Seq1.pairwise(a);
     return Seq.toArray(source);
    },
    partition:function(f,arr)
    {
     var ret1,ret2,i;
     ret1=[];
     ret2=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?ret1.push(Arrays.get(arr,i)):ret2.push(Arrays.get(arr,i));
     }
     return[ret1,ret2];
    },
    permute:function(f,arr)
    {
     var ret,i;
     ret=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,f(i),Arrays.get(arr,i));
     }
     return ret;
    },
    pick:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryPick(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    reduce:function(f,arr)
    {
     var acc,i;
     Arrays.nonEmpty(arr);
     acc=Arrays.get(arr,0);
     for(i=1;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    reduceBack:function(f,arr)
    {
     var len,acc,i;
     Arrays.nonEmpty(arr);
     len=arr.length;
     acc=Arrays.get(arr,len-1);
     for(i=2;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    replicate:function(size,value)
    {
     return Arrays.create(size,value);
    },
    reverse:function(array,offset,length)
    {
     var a;
     a=Arrays.sub(array,offset,length).slice().reverse();
     return Arrays.blit(a,0,array,offset,Arrays.length(a));
    },
    scan:function(f,zero,arr)
    {
     var ret,i;
     ret=Array(1+arr.length);
     Arrays.set(ret,0,zero);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,i+1,(f(Arrays.get(ret,i)))(Arrays.get(arr,i)));
     }
     return ret;
    },
    scanBack:function(f,arr,zero)
    {
     var len,ret,i;
     len=arr.length;
     ret=Array(1+len);
     Arrays.set(ret,len,zero);
     for(i=0;i<=len-1;i++){
      Arrays.set(ret,len-i-1,(f(Arrays.get(arr,len-i-1)))(Arrays.get(ret,len-i)));
     }
     return ret;
    },
    set:function(arr,n,x)
    {
     Arrays.checkBounds(arr,n);
     arr[n]=x;
     return;
    },
    set2D:function(arr,n1,n2,x)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     arr[n1][n2]=x;
     return;
    },
    setSub:function(arr,start,len,src)
    {
     var i;
     for(i=0;i<=len-1;i++){
      Arrays.set(arr,start+i,Arrays.get(src,i));
     }
     return;
    },
    setSub2D:function(dst,src1,src2,len1,len2,src)
    {
     var i,j;
     for(i=0;i<=len1-1;i++){
      for(j=0;j<=len2-1;j++){
       Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
      }
     }
     return;
    },
    skip:function(i,ar)
    {
     return i<0?Seq1.nonNegative():i>Arrays.length(ar)?Seq1.insufficient():ar.slice(i);
    },
    skipWhile:function(predicate,ar)
    {
     var len,i;
     len=Arrays.length(ar);
     i=0;
     while(i<len?predicate(Arrays.get(ar,i)):false)
      {
       i=i+1;
      }
     return ar.slice(i);
    },
    sort:function(arr)
    {
     return Arrays.sortBy(function(x)
     {
      return x;
     },arr);
    },
    sortBy:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortByDescending:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return-Operators.Compare(f(x),f(y));
     });
    },
    sortDescending:function(arr)
    {
     return Arrays.sortByDescending(function(x)
     {
      return x;
     },arr);
    },
    sortInPlace:function(arr)
    {
     return Arrays.sortInPlaceBy(function(x)
     {
      return x;
     },arr);
    },
    sortInPlaceBy:function(f,arr)
    {
     return arr.sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlaceWith:function(comparer,arr)
    {
     return arr.sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sortWith:function(comparer,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    splitAt:function(n,ar)
    {
     return[Arrays.take(n,ar),Arrays.skip(n,ar)];
    },
    sub:function(arr,start,length)
    {
     Arrays.checkRange(arr,start,length);
     return arr.slice(start,start+length);
    },
    sub2D:function(src,src1,src2,len1,len2)
    {
     var len11,len21,dst,i,j;
     len11=len1<0?0:len1;
     len21=len2<0?0:len2;
     dst=Arrays.zeroCreate2D(len11,len21);
     for(i=0;i<=len11-1;i++){
      for(j=0;j<=len21-1;j++){
       Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
      }
     }
     return dst;
    },
    sum:function($arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$arr[i];
     return sum;
    },
    sumBy:function($f,$arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$f($arr[i]);
     return sum;
    },
    tail:function(ar)
    {
     return Arrays.skip(1,ar);
    },
    take:function(n,ar)
    {
     return n<0?Seq1.nonNegative():n>Arrays.length(ar)?Seq1.insufficient():ar.slice(0,n);
    },
    takeWhile:function(predicate,ar)
    {
     var len,i;
     len=Arrays.length(ar);
     i=0;
     while(i<len?predicate(Arrays.get(ar,i)):false)
      {
       i=i+1;
      }
     return ar.slice(0,i);
    },
    truncate:function(n,ar)
    {
     return ar.slice(n);
    },
    tryFind:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:Arrays.get(arr,i)
       }:null;
       i=i+1;
      }
     return res;
    },
    tryFindIndex:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:i
       }:null;
       i=i+1;
      }
     return res;
    },
    tryHead:function(arr)
    {
     return Arrays.length(arr)===0?{
      $:0
     }:{
      $:1,
      $0:arr[0]
     };
    },
    tryItem:function(i,arr)
    {
     return(Arrays.length(arr)<=i?true:i<0)?{
      $:0
     }:{
      $:1,
      $0:arr[i]
     };
    },
    tryLast:function(arr)
    {
     var len;
     len=Arrays.length(arr);
     return len===0?{
      $:0
     }:{
      $:1,
      $0:arr[len-1]
     };
    },
    tryPick:function(f,arr)
    {
     var res,i,matchValue;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       matchValue=f(Arrays.get(arr,i));
       matchValue.$==1?res=matchValue:null;
       i=i+1;
      }
     return res;
    },
    unfold:function(f,s)
    {
     var source;
     source=Seq1.unfold(f,s);
     return Seq.toArray(source);
    },
    unzip:function(arr)
    {
     var x,y,i,patternInput,b,a;
     x=[];
     y=[];
     for(i=0;i<=arr.length-1;i++){
      patternInput=Arrays.get(arr,i);
      b=patternInput[1];
      a=patternInput[0];
      x.push(a);
      y.push(b);
     }
     return[x,y];
    },
    unzip3:function(arr)
    {
     var x,y,z,i,matchValue,c,b,a;
     x=[];
     y=[];
     z=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=Arrays.get(arr,i);
      c=matchValue[2];
      b=matchValue[1];
      a=matchValue[0];
      x.push(a);
      y.push(b);
      z.push(c);
     }
     return[x,y,z];
    },
    windowed:function(windowSize,s)
    {
     var source;
     source=Seq1.windowed(windowSize,s);
     return Seq.toArray(source);
    },
    zeroCreate2D:function(n,m)
    {
     var arr;
     arr=Arrays.init(n,function()
     {
      return Array(m);
     });
     arr.dims=2;
     return arr;
    },
    zip:function(arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i)]);
     }
     return res;
    },
    zip3:function(arr1,arr2,arr3)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     Arrays.checkLength(arr2,arr3);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i),Arrays.get(arr3,i)]);
     }
     return res;
    }
   },
   Arrays2D:{
    copy:function(array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return Arrays.get2D(array,i,j);
      };
     });
    },
    init:function(n,m,f)
    {
     var array,i,j;
     array=Arrays.zeroCreate2D(n,m);
     for(i=0;i<=n-1;i++){
      for(j=0;j<=m-1;j++){
       Arrays.set2D(array,i,j,(f(i))(j));
      }
     }
     return array;
    },
    iter:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       f(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    iteri:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       ((f(i))(j))(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    map:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return f(Arrays.get2D(array,i,j));
      };
     });
    },
    mapi:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return((f(i))(j))(Arrays.get2D(array,i,j));
      };
     });
    }
   },
   AsyncProxy:Runtime.Class({},{
    get_CancellationToken:function()
    {
     return Concurrency.GetCT();
    },
    get_DefaultCancellationToken:function()
    {
     return(Concurrency.defCTS())[0];
    }
   }),
   CancellationTokenSource:Runtime.Class({
    Cancel:function()
    {
     var _,chooser,array,errors;
     if(!this.c)
      {
       this.c=true;
       chooser=function(a)
       {
        var _1,e;
        try
        {
         a(null);
         _1={
          $:0
         };
        }
        catch(e)
        {
         _1={
          $:1,
          $0:e
         };
        }
        return _1;
       };
       array=this.r;
       errors=Arrays.choose(chooser,array);
       _=Arrays.length(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
      }
     else
      {
       _=null;
      }
     return _;
    },
    Cancel1:function(throwOnFirstException)
    {
     var _,_1,action,array;
     if(!throwOnFirstException)
      {
       _=this.Cancel();
      }
     else
      {
       if(!this.c)
        {
         this.c=true;
         action=function(a)
         {
          return a(null);
         };
         array=this.r;
         _1=Arrays.iter(action,array);
        }
       else
        {
         _1=null;
        }
       _=_1;
      }
     return _;
    },
    CancelAfter:function(delay)
    {
     var _,option,arg0,_this=this;
     if(!this.c)
      {
       option=this.pending;
       Option.iter(function(handle)
       {
        return clearTimeout(handle);
       },option);
       arg0=setTimeout(function()
       {
        return _this.Cancel();
       },delay);
       _=void(this.pending={
        $:1,
        $0:arg0
       });
      }
     else
      {
       _=null;
      }
     return _;
    },
    get_IsCancellationRequested:function()
    {
     return this.c;
    }
   },{
    CreateLinkedTokenSource:function(t1,t2)
    {
     return CancellationTokenSource.CreateLinkedTokenSource1([t1,t2]);
    },
    CreateLinkedTokenSource1:function(tokens)
    {
     var cts,action;
     cts=CancellationTokenSource.New();
     action=function(t)
     {
      var value;
      value=Concurrency.Register(t,function()
      {
       return function()
       {
        return cts.Cancel();
       }();
      });
      return;
     };
     return Arrays.iter(action,tokens);
    },
    New:function()
    {
     var r;
     r=Runtime.New(this,{});
     r.c=false;
     r.pending={
      $:0
     };
     r.r=[];
     return r;
    }
   }),
   Char:Runtime.Class({},{
    GetNumericValue:function(c)
    {
     return(c>=48?c<=57:false)?Number(c)-Number(48):-1;
    },
    IsControl:function(c)
    {
     return(c>=0?c<=31:false)?true:c>=128?c<=159:false;
    },
    IsDigit:function(c)
    {
     return c>=48?c<=57:false;
    },
    IsLetter:function(c)
    {
     return(c>=65?c<=90:false)?true:c>=97?c<=122:false;
    },
    IsLetterOrDigit:function(c)
    {
     return Char.IsLetter(c)?true:Char.IsDigit(c);
    },
    IsLower:function(c)
    {
     return c>=97?c<=122:false;
    },
    IsUpper:function(c)
    {
     return c>=65?c<=90:false;
    },
    IsWhiteSpace:function($c)
    {
     var $0=this,$this=this;
     return Global.String.fromCharCode($c).match(/\s/)!==null;
    },
    Parse:function(s)
    {
     return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
    }
   }),
   Concurrency:{
    AwaitEvent:function(e,ca)
    {
     var r;
     r=function(c)
     {
      var sub,sub1,creg,creg1,sub2,creg2;
      sub=function()
      {
       return Util.subscribeTo(e,function(x)
       {
        var action;
        Lazy.Force(sub1).Dispose();
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:x
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      sub1=Lazy.Create(sub);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var _,ca1,action;
        if(ca.$==1)
         {
          ca1=ca.$0;
          _=ca1(null);
         }
        else
         {
          Lazy.Force(sub1).Dispose();
          action=function()
          {
           return c.k.call(null,{
            $:2,
            $0:OperationCanceledException.New()
           });
          };
          _=Concurrency.scheduler().Fork(action);
         }
        return _;
       });
      };
      creg1=Lazy.Create(creg);
      sub2=Lazy.Force(sub1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Bind:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,action,action1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          action=function()
          {
           var _1,e;
           try
           {
            _1=(f(x))(c);
           }
           catch(e)
           {
            _1=c.k.call(null,{
             $:1,
             $0:e
            });
           }
           return _1;
          };
          _=Concurrency.scheduler().Fork(action);
         }
        else
         {
          action1=function()
          {
           return c.k.call(null,_arg1);
          };
          _=Concurrency.scheduler().Fork(action1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Catch:function(r)
    {
     var r1;
     r1=function(c)
     {
      var _,e1;
      try
      {
       _=r({
        k:function(_arg1)
        {
         var _1,x,e;
         if(_arg1.$==0)
          {
           x=_arg1.$0;
           _1=c.k.call(null,{
            $:0,
            $0:{
             $:0,
             $0:x
            }
           });
          }
         else
          {
           if(_arg1.$==1)
            {
             e=_arg1.$0;
             _1=c.k.call(null,{
              $:0,
              $0:{
               $:1,
               $0:e
              }
             });
            }
           else
            {
             _1=c.k.call(null,_arg1);
            }
          }
         return _1;
        },
        ct:c.ct
       });
      }
      catch(e1)
      {
       _=c.k.call(null,{
        $:0,
        $0:{
         $:1,
         $0:e1
        }
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r1);
    },
    Combine:function(a,b)
    {
     return Concurrency.Bind(a,function()
     {
      return b;
     });
    },
    Delay:function(mk)
    {
     var r;
     r=function(c)
     {
      var _,e;
      try
      {
       _=(mk(null))(c);
      }
      catch(e)
      {
       _=c.k.call(null,{
        $:1,
        $0:e
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r);
    },
    For:function(s,b)
    {
     return Concurrency.Using(Enumerator.Get(s),function(ie)
     {
      return Concurrency.While(function()
      {
       return ie.MoveNext();
      },Concurrency.Delay(function()
      {
       return b(ie.get_Current());
      }));
     });
    },
    FromContinuations:function(subscribe)
    {
     var r;
     r=function(c)
     {
      var continued,once;
      continued=[false];
      once=function(cont)
      {
       var _;
       if(continued[0])
        {
         _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
        }
       else
        {
         continued[0]=true;
         _=Concurrency.scheduler().Fork(cont);
        }
       return _;
      };
      return subscribe([function(a)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:0,
         $0:a
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:1,
         $0:e
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:2,
         $0:e
        });
       });
      }]);
     };
     return Concurrency.checkCancel(r);
    },
    GetCT:Runtime.Field(function()
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    }),
    Ignore:function(r)
    {
     return Concurrency.Bind(r,function()
     {
      return Concurrency.Return(null);
     });
    },
    OnCancel:function(action)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:Concurrency.Register(c.ct,action)
      });
     };
     return Concurrency.checkCancel(r);
    },
    Parallel:function(cs)
    {
     var cs1,_,r;
     cs1=Arrays.ofSeq(cs);
     if(Arrays.length(cs1)===0)
      {
       _=Concurrency.Return([]);
      }
     else
      {
       r=function(c)
       {
        var n,o,a,accept;
        n=cs1.length;
        o=[n];
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
          matchValue=[o[0],x];
          if(matchValue[0]===0)
           {
            _1=null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==0)
               {
                x1=matchValue[1].$0;
                Arrays.set(a,i,x1);
                o[0]=0;
                _2=c.k.call(null,{
                 $:0,
                 $0:a
                });
               }
              else
               {
                matchValue[0];
                res=matchValue[1];
                o[0]=0;
                _2=c.k.call(null,res);
               }
              _1=_2;
             }
            else
             {
              if(matchValue[1].$==0)
               {
                x2=matchValue[1].$0;
                n1=matchValue[0];
                Arrays.set(a,i,x2);
                _3=void(o[0]=n1-1);
               }
              else
               {
                matchValue[0];
                res1=matchValue[1];
                o[0]=0;
                _3=c.k.call(null,res1);
               }
              _1=_3;
             }
           }
          return _1;
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(run)
         {
          var action;
          action=function()
          {
           return run({
            k:accept(i),
            ct:c.ct
           });
          };
          return Concurrency.scheduler().Fork(action);
         };
        },cs1);
       };
       _=Concurrency.checkCancel(r);
      }
     return _;
    },
    Register:function(ct,callback)
    {
     var i;
     i=ct.r.push(callback)-1;
     return{
      Dispose:function()
      {
       return Arrays.set(ct.r,i,function()
       {
       });
      }
     };
    },
    Return:function(x)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:x
      });
     };
     return Concurrency.checkCancel(r);
    },
    Scheduler:Runtime.Class({
     Fork:function(action)
     {
      var _,value,_this=this;
      this.robin.push(action);
      if(this.idle)
       {
        this.idle=false;
        value=setTimeout(function()
        {
         return _this.tick();
        },0);
        _=void value;
       }
      else
       {
        _=null;
       }
      return _;
     },
     tick:function()
     {
      var t,loop,matchValue,_,_1,value,_this=this;
      t=Date.now();
      loop=true;
      while(loop)
       {
        matchValue=this.robin.length;
        if(matchValue===0)
         {
          this.idle=true;
          _=loop=false;
         }
        else
         {
          (this.robin.shift())(null);
          if(Date.now()-t>40)
           {
            value=setTimeout(function()
            {
             return _this.tick();
            },0);
            _1=loop=false;
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
       }
      return;
     }
    },{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.idle=true;
      r.robin=[];
      return r;
     }
    }),
    Sleep:function(ms)
    {
     var r;
     r=function(c)
     {
      var pending,pending1,creg,creg1,pending2,creg2;
      pending=function()
      {
       return setTimeout(function()
       {
        var action;
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:null
         });
        };
        return Concurrency.scheduler().Fork(action);
       },ms);
      };
      pending1=Lazy.Create(pending);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        clearTimeout(Lazy.Force(pending1));
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      pending2=Lazy.Force(pending1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Start:function(c,ctOpt)
    {
     return Concurrency.StartWithContinuations(c,function()
     {
     },function(exn)
     {
      var ps;
      ps=[exn];
      return console?console.log.apply(console,["WebSharper: Uncaught asynchronous exception"].concat(ps)):undefined;
     },function()
     {
     },ctOpt);
    },
    StartChild:function(r,t)
    {
     var r1;
     r1=function(c)
     {
      var inTime,cached,queue,tReg,_,timeout,arg0,action,r3,r21;
      inTime=[true];
      cached=[{
       $:0
      }];
      queue=[];
      if(t.$==1)
       {
        timeout=t.$0;
        arg0=setTimeout(function()
        {
         var err;
         inTime[0]=false;
         err={
          $:1,
          $0:TimeoutException.New()
         };
         while(queue.length>0)
          {
           (queue.shift())(err);
          }
         return;
        },timeout);
        _={
         $:1,
         $0:arg0
        };
       }
      else
       {
        _={
         $:0
        };
       }
      tReg=_;
      action=function()
      {
       return r({
        k:function(res)
        {
         var _1,_2,r2;
         if(inTime[0])
          {
           cached[0]={
            $:1,
            $0:res
           };
           if(tReg.$==1)
            {
             r2=tReg.$0;
             _2=clearTimeout(r2);
            }
           else
            {
             _2=null;
            }
           while(queue.length>0)
            {
             (queue.shift())(res);
            }
          }
         else
          {
           _1=null;
          }
         return _1;
        },
        ct:c.ct
       });
      };
      Concurrency.scheduler().Fork(action);
      r3=function(c2)
      {
       var _1,matchValue,_2,x;
       if(inTime[0])
        {
         matchValue=cached[0];
         if(matchValue.$==0)
          {
           _2=queue.push(c2.k);
          }
         else
          {
           x=matchValue.$0;
           _2=c2.k.call(null,x);
          }
         _1=_2;
        }
       else
        {
         _1=c2.k.call(null,{
          $:1,
          $0:TimeoutException.New()
         });
        }
       return _1;
      };
      r21=Concurrency.checkCancel(r3);
      return c.k.call(null,{
       $:0,
       $0:r21
      });
     };
     return Concurrency.checkCancel(r1);
    },
    StartWithContinuations:function(c,s,f,cc,ctOpt)
    {
     var ct,action;
     ct=Operators.DefaultArg(ctOpt,(Concurrency.defCTS())[0]);
     action=function()
     {
      return c({
       k:function(_arg1)
       {
        var _,e,e1,x;
        if(_arg1.$==1)
         {
          e=_arg1.$0;
          _=f(e);
         }
        else
         {
          if(_arg1.$==2)
           {
            e1=_arg1.$0;
            _=cc(e1);
           }
          else
           {
            x=_arg1.$0;
            _=s(x);
           }
         }
        return _;
       },
       ct:ct
      });
     };
     return Concurrency.scheduler().Fork(action);
    },
    TryCancelled:function(run,comp)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(_arg1)
       {
        var _,e;
        if(_arg1.$==2)
         {
          e=_arg1.$0;
          comp(e);
          _=c.k.call(null,_arg1);
         }
        else
         {
          _=c.k.call(null,_arg1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryFinally:function(run,f)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(r1)
       {
        var _,e;
        try
        {
         f(null);
         _=c.k.call(null,r1);
        }
        catch(e)
        {
         _=c.k.call(null,{
          $:1,
          $0:e
         });
        }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryWith:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,e,_1,e1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          _=c.k.call(null,{
           $:0,
           $0:x
          });
         }
        else
         {
          if(_arg1.$==1)
           {
            e=_arg1.$0;
            try
            {
             _1=(f(e))(c);
            }
            catch(e1)
            {
             _1=c.k.call(null,_arg1);
            }
            _=_1;
           }
          else
           {
            _=c.k.call(null,_arg1);
           }
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Using:function(x,f)
    {
     return Concurrency.TryFinally(f(x),function()
     {
      return x.Dispose();
     });
    },
    While:function(g,c)
    {
     return g(null)?Concurrency.Bind(c,function()
     {
      return Concurrency.While(g,c);
     }):Concurrency.Return(null);
    },
    checkCancel:function(r)
    {
     return function(c)
     {
      return c.ct.c?c.k.call(null,{
       $:2,
       $0:OperationCanceledException.New()
      }):r(c);
     };
    },
    defCTS:Runtime.Field(function()
    {
     return[CancellationTokenSource.New()];
    }),
    scheduler:Runtime.Field(function()
    {
     return Scheduler.New();
    })
   },
   Control:{
    createEvent:function(add,remove,create)
    {
     return{
      AddHandler:add,
      RemoveHandler:remove,
      Subscribe:function(r)
      {
       var h;
       h=create(function()
       {
        return function(args)
        {
         return r.OnNext.call(null,args);
        };
       });
       add(h);
       return{
        Dispose:function()
        {
         return remove(h);
        }
       };
      }
     };
    }
   },
   DateTimeHelpers:{
    AddMonths:function(d,months)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    AddYears:function(d,years)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    DatePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
    },
    LongDate:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleDateString({},{
      year:"numeric",
      month:"long",
      day:"numeric",
      weekday:"long"
     });
    },
    LongTime:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleTimeString({},{
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
      hour12:false
     });
    },
    Parse:function(s)
    {
     var d;
     d=Date.parse(s);
     return Global.isNaN(d)?Operators.FailWith("Failed to parse date string."):d;
    },
    ShortTime:function($d)
    {
     var $0=this,$this=this;
     return(new Global.Date($d)).toLocaleTimeString({},{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false
     });
    },
    TimePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
    }
   },
   Enumerable:{
    Of:function(getEnumerator)
    {
     return{
      GetEnumerator:getEnumerator
     };
    }
   },
   Enumerator:{
    Get:function(x)
    {
     return x instanceof Global.Array?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<Arrays.length(x))
       {
        e.c=Arrays.get(x,i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },function()
     {
     }):Unchecked.Equals(typeof x,"string")?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<x.length)
       {
        e.c=x.charCodeAt(i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },function()
     {
     }):x.GetEnumerator();
    },
    T:Runtime.Class({
     Dispose:function()
     {
      return this.d.call(null,this);
     },
     MoveNext:function()
     {
      return this.n.call(null,this);
     },
     get_Current:function()
     {
      return this.c;
     }
    },{
     New:function(s,c,n,d)
     {
      var r;
      r=Runtime.New(this,{});
      r.s=s;
      r.c=c;
      r.n=n;
      r.d=d;
      return r;
     }
    })
   },
   Exception:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,Exception.New1("Exception of type 'System.Exception' was thrown."));
    },
    New1:function($message)
    {
     var $0=this,$this=this;
     return new Global.Error($message);
    }
   }),
   Guid:Runtime.Class({},{
    NewGuid:function()
    {
     var $0=this,$this=this;
     return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c)
     {
      var r=Global.Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;
      return v.toString(16);
     });
    }
   }),
   HtmlContentExtensions:{
    "IControlBody.SingleNode.Static":function(node)
    {
     return SingleNode.New(node);
    },
    SingleNode:Runtime.Class({
     ReplaceInDom:function(old)
     {
      var value;
      value=this.node.parentNode.replaceChild(this.node,old);
      return;
     }
    },{
     New:function(node)
     {
      var r;
      r=Runtime.New(this,{});
      r.node=node;
      return r;
     }
    })
   },
   IndexOutOfRangeException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,IndexOutOfRangeException.New1("Index was outside the bounds of the array."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   InvalidOperationException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,InvalidOperationException.New1("Operation is not valid due to the current state of the object."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   JavaScript:{
    JSModule:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFieldNames:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push(k);
      return r;
     },
     GetFieldValues:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push($o[k]);
      return r;
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     },
     LogMore:function($args)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log.apply(Global.console,$args);
     }
    },
    Pervasives:{
     NewFromList:function(fields)
     {
      var r,enumerator,_,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      try
      {
       while(enumerator.MoveNext())
        {
         forLoopVar=enumerator.get_Current();
         v=forLoopVar[1];
         k=forLoopVar[0];
         r[k]=v;
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }
   },
   Json:{
    Activate:function(json)
    {
     var types,i,decode;
     types=json.$TYPES;
     for(i=0;i<=Arrays.length(types)-1;i++){
      Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
     }
     decode=function(x)
     {
      var _,matchValue,_1,_2,o,ti,_3,r;
      if(Unchecked.Equals(x,null))
       {
        _=x;
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          if(x instanceof Global.Array)
           {
            _2=Json.shallowMap(decode,x);
           }
          else
           {
            o=Json.shallowMap(decode,x.$V);
            ti=x.$T;
            if(Unchecked.Equals(typeof ti,"undefined"))
             {
              _3=o;
             }
            else
             {
              r=new(Arrays.get(types,ti))();
              JSModule.ForEach(o,function(k)
              {
               r[k]=o[k];
               return false;
              });
              _3=r;
             }
            _2=_3;
           }
          _1=_2;
         }
        else
         {
          _1=x;
         }
        _=_1;
       }
      return _;
     };
     return decode(json.$DATA);
    },
    lookup:function(x)
    {
     var k,r,i,n,rn,_;
     k=Arrays.length(x);
     r=Global;
     i=0;
     while(i<k)
      {
       n=Arrays.get(x,i);
       rn=r[n];
       if(!Unchecked.Equals(typeof rn,undefined))
        {
         r=rn;
         _=i=i+1;
        }
       else
        {
         _=Operators.FailWith("Invalid server reply. Failed to find type: "+n);
        }
      }
     return r;
    },
    shallowMap:function(f,x)
    {
     var _,matchValue,_1,r;
     if(x instanceof Global.Array)
      {
       _=Arrays.map(f,x);
      }
     else
      {
       matchValue=typeof x;
       if(matchValue==="object")
        {
         r={};
         JSModule.ForEach(x,function(y)
         {
          r[y]=f(x[y]);
          return false;
         });
         _1=r;
        }
       else
        {
         _1=x;
        }
       _=_1;
      }
     return _;
    }
   },
   Lazy:{
    Create:function(f)
    {
     var x,get;
     x={
      value:undefined,
      created:false,
      eval:f
     };
     get=function()
     {
      var _;
      if(x.created)
       {
        _=x.value;
       }
      else
       {
        x.created=true;
        x.value=f(null);
        _=x.value;
       }
      return _;
     };
     x.eval=get;
     return x;
    },
    CreateFromValue:function(v)
    {
     return{
      value:v,
      created:true,
      eval:function()
      {
       return v;
      },
      eval:function()
      {
       return v;
      }
     };
    },
    Force:function(x)
    {
     return x.eval.call(null,null);
    }
   },
   List:{
    T:Runtime.Class({
     GetEnumerator:function()
     {
      return T.New(this,null,function(e)
      {
       var matchValue,_,xs,x;
       matchValue=e.s;
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         e.c=x;
         e.s=xs;
         _=true;
        }
       return _;
      },function()
      {
      });
     },
     GetSlice:function(start,finish)
     {
      var matchValue,_,_1,i,j,count,source,source1,i1,_2,j1,count1,source2;
      matchValue=[start,finish];
      if(matchValue[0].$==1)
       {
        if(matchValue[1].$==1)
         {
          i=matchValue[0].$0;
          j=matchValue[1].$0;
          count=j-i+1;
          source=List1.skip(i,this);
          source1=Seq.take(count,source);
          _1=List.ofSeq(source1);
         }
        else
         {
          i1=matchValue[0].$0;
          _1=List1.skip(i1,this);
         }
        _=_1;
       }
      else
       {
        if(matchValue[1].$==1)
         {
          j1=matchValue[1].$0;
          count1=j1+1;
          source2=Seq.take(count1,this);
          _2=List.ofSeq(source2);
         }
        else
         {
          _2=this;
         }
        _=_2;
       }
      return _;
     },
     get_Item:function(x)
     {
      return Seq.nth(x,this);
     },
     get_Length:function()
     {
      return Seq.length(this);
     }
    }),
    append:function(x,y)
    {
     return List.ofSeq(Seq.append(x,y));
    },
    choose:function(f,l)
    {
     return List.ofSeq(Seq.choose(f,l));
    },
    chunkBySize:function(size,list)
    {
     var mapping,source,list1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     source=Seq1.chunkBySize(size,list);
     list1=Seq.toList(source);
     return List.map(mapping,list1);
    },
    collect:function(f,l)
    {
     return List.ofSeq(Seq.collect(f,l));
    },
    compareWith:function(f,l1,l2)
    {
     return Seq1.compareWith(f,l1,l2);
    },
    concat:function(s)
    {
     return List.ofSeq(Seq.concat(s));
    },
    contains:function(el,l)
    {
     return Seq1.contains(el,l);
    },
    countBy:function(f,l)
    {
     var source;
     source=Seq1.countBy(f,l);
     return Seq.toList(source);
    },
    distinct:function(l)
    {
     var source;
     source=Seq1.distinct(l);
     return Seq.toList(source);
    },
    distinctBy:function(f,l)
    {
     var source;
     source=Seq1.distinctBy(f,l);
     return Seq.toList(source);
    },
    exactlyOne:function(list)
    {
     var _,_1,head;
     if(list.$==1)
      {
       if(list.$1.$==0)
        {
         head=list.$0;
         _1=head;
        }
       else
        {
         _1=Operators.FailWith("The input does not have precisely one element.");
        }
       _=_1;
      }
     else
      {
       _=Operators.FailWith("The input does not have precisely one element.");
      }
     return _;
    },
    except:function(itemsToExclude,l)
    {
     var source;
     source=Seq1.except(itemsToExclude,l);
     return Seq.toList(source);
    },
    exists2:function(p,l1,l2)
    {
     return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    filter:function(p,l)
    {
     return List.ofSeq(Seq.filter(p,l));
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=List.tryFindBack(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold2:function(f,s,l1,l2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    foldBack:function(f,l,s)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(l),s);
    },
    foldBack2:function(f,l1,l2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
    },
    forall2:function(p,l1,l2)
    {
     return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    groupBy:function(f,l)
    {
     var mapping,source,list;
     mapping=function(tupledArg)
     {
      var k,s;
      k=tupledArg[0];
      s=tupledArg[1];
      return[k,Seq.toList(s)];
     };
     source=Seq1.groupBy(f,l);
     list=Seq.toList(source);
     return List.map(mapping,list);
    },
    head:function(l)
    {
     var _,h;
     if(l.$==1)
      {
       h=l.$0;
       _=h;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    indexed:function(list)
    {
     return List.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },list);
    },
    init:function(s,f)
    {
     return List.ofArray(Arrays.init(s,f));
    },
    iter2:function(f,l1,l2)
    {
     return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    iteri2:function(f,l1,l2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    last:function(list)
    {
     return Seq1.last(list);
    },
    map:function(f,l)
    {
     return List.ofSeq(Seq.map(f,l));
    },
    map2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    mapFold:function(f,zero,list)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFold(f,zero,Arrays.ofSeq(list));
     x=tupledArg[0];
     y=tupledArg[1];
     return[List.ofArray(x),y];
    },
    mapFoldBack:function(f,list,zero)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFoldBack(f,Arrays.ofSeq(list),zero);
     x=tupledArg[0];
     y=tupledArg[1];
     return[List.ofArray(x),y];
    },
    mapi:function(f,l)
    {
     return List.ofSeq(Seq.mapi(f,l));
    },
    mapi2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    max:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },l);
    },
    maxBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },l);
    },
    min:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },l);
    },
    minBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },l);
    },
    ofArray:function(arr)
    {
     var r,i;
     r=Runtime.New(T1,{
      $:0
     });
     for(i=0;i<=Arrays.length(arr)-1;i++){
      r=Runtime.New(T1,{
       $:1,
       $0:Arrays.get(arr,Arrays.length(arr)-i-1),
       $1:r
      });
     }
     return r;
    },
    ofSeq:function(s)
    {
     var res,last,e,_,next;
     res=Runtime.New(T1,{
      $:0
     });
     last=res;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        last.$=1;
        next=Runtime.New(T1,{
         $:0
        });
        last.$0=e.get_Current();
        last.$1=next;
        last=next;
       }
      last.$=0;
      _=res;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    pairwise:function(l)
    {
     var source;
     source=Seq1.pairwise(l);
     return Seq.toList(source);
    },
    partition:function(p,l)
    {
     var patternInput,b,a;
     patternInput=Arrays.partition(p,Arrays.ofSeq(l));
     b=patternInput[1];
     a=patternInput[0];
     return[List.ofArray(a),List.ofArray(b)];
    },
    permute:function(f,l)
    {
     return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
    },
    reduceBack:function(f,l)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(l));
    },
    replicate:function(size,value)
    {
     return List.ofArray(Arrays.create(size,value));
    },
    rev:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     a.reverse();
     return List.ofArray(a);
    },
    scan:function(f,s,l)
    {
     return List.ofSeq(Seq.scan(f,s,l));
    },
    scanBack:function(f,l,s)
    {
     return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
    },
    singleton:function(x)
    {
     return List.ofArray([x]);
    },
    sort:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlace(a);
     return List.ofArray(a);
    },
    sortBy:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortByDescending:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return-Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortDescending:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays1.sortInPlaceByDescending(function(x)
     {
      return x;
     },a);
     return List.ofArray(a);
    },
    sortWith:function(f,l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlaceWith(f,a);
     return List.ofArray(a);
    },
    splitAt:function(n,list)
    {
     return[List.ofSeq(Seq.take(n,list)),List1.skip(n,list)];
    },
    splitInto:function(count,list)
    {
     var mapping,array1,list1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     array1=Arrays1.splitInto(count,Arrays.ofSeq(list));
     list1=List.ofArray(array1);
     return List.map(mapping,list1);
    },
    tail:function(l)
    {
     var _,t;
     if(l.$==1)
      {
       t=l.$1;
       _=t;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    tryFindBack:function(ok,l)
    {
     return Arrays1.tryFindBack(ok,Arrays.ofSeq(l));
    },
    tryHead:function(list)
    {
     var _,head;
     if(list.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       head=list.$0;
       _={
        $:1,
        $0:head
       };
      }
     return _;
    },
    tryItem:function(n,list)
    {
     return Seq1.tryItem(n,list);
    },
    tryLast:function(list)
    {
     return Seq1.tryLast(list);
    },
    unfold:function(f,s)
    {
     var source;
     source=Seq1.unfold(f,s);
     return Seq.toList(source);
    },
    unzip:function(l)
    {
     var x,y,enumerator,_,forLoopVar,b,a;
     x=[];
     y=[];
     enumerator=Enumerator.Get(l);
     try
     {
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
    },
    unzip3:function(l)
    {
     var x,y,z,enumerator,_,forLoopVar,c,b,a;
     x=[];
     y=[];
     z=[];
     enumerator=Enumerator.Get(l);
     try
     {
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        c=forLoopVar[2];
        b=forLoopVar[1];
        a=forLoopVar[0];
        x.push(a);
        y.push(b);
        z.push(c);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
    },
    windowed:function(windowSize,s)
    {
     var mapping,source,source1;
     mapping=function(array)
     {
      return List.ofArray(array);
     };
     source=Seq1.windowed(windowSize,s);
     source1=Seq.map(mapping,source);
     return Seq.toList(source1);
    },
    zip:function(l1,l2)
    {
     return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    zip3:function(l1,l2,l3)
    {
     return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
    }
   },
   MatchFailureException:Runtime.Class({},{
    New:function(message,line,column)
    {
     return Runtime.New(this,Exception.New1(message+" at "+Global.String(line)+":"+Global.String(column)));
    }
   }),
   Nullable:{
    get:function(x)
    {
     return x==null?Operators.FailWith("Nullable object must have a value."):x;
    },
    getOrValue:function(x,v)
    {
     return x==null?v:x;
    }
   },
   OperationCanceledException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,OperationCanceledException.New1("The operation was canceled."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Operators:{
    Compare:function(a,b)
    {
     return Unchecked.Compare(a,b);
    },
    DefaultArg:function(x,d)
    {
     var _,x1;
     if(x.$==0)
      {
       _=d;
      }
     else
      {
       x1=x.$0;
       _=x1;
      }
     return _;
    },
    FailWith:function(msg)
    {
     return Operators.Raise(Exception.New1(msg));
    },
    KeyValue:function(kvp)
    {
     return[kvp.K,kvp.V];
    },
    Max:function(a,b)
    {
     return Unchecked.Compare(a,b)===1?a:b;
    },
    Min:function(a,b)
    {
     return Unchecked.Compare(a,b)===-1?a:b;
    },
    Pown:function(a,n)
    {
     var p;
     p=function(n1)
     {
      var _,_1,b;
      if(n1===1)
       {
        _=a;
       }
      else
       {
        if(n1%2===0)
         {
          b=p(n1/2>>0);
          _1=b*b;
         }
        else
         {
          _1=a*p(n1-1);
         }
        _=_1;
       }
      return _;
     };
     return p(n);
    },
    Raise:function($e)
    {
     var $0=this,$this=this;
     throw $e;
    },
    Sign:function(x)
    {
     return x===0?0:x<0?-1:1;
    },
    Truncate:function(x)
    {
     return x<0?Math.ceil(x):Math.floor(x);
    },
    Using:function(t,f)
    {
     var _;
     try
     {
      _=f(t);
     }
     finally
     {
      t.Dispose();
     }
     return _;
    },
    range:function(min,max)
    {
     var count;
     count=1+max-min;
     return count<=0?Seq.empty():Seq.init(count,function(x)
     {
      return x+min;
     });
    },
    step:function(min,step,max)
    {
     var s,predicate,source,x;
     s=Operators.Sign(step);
     predicate=function(k)
     {
      return s*(max-k)>=0;
     };
     source=Seq.initInfinite(function(k)
     {
      return min+k*step;
     });
     x=Seq.takeWhile(predicate,source);
     return x;
    }
   },
   Option:{
    bind:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _=f(x1);
      }
     return _;
    },
    exists:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=false;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    filter:function(f,o)
    {
     var _,v;
     if(o.$==1)
      {
       v=o.$0;
       _=f(v)?{
        $:1,
        $0:v
       }:{
        $:0
       };
      }
     else
      {
       _={
        $:0
       };
      }
     return _;
    },
    fold:function(f,s,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(s))(x1);
      }
     return _;
    },
    foldBack:function(f,x,s)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(x1))(s);
      }
     return _;
    },
    forall:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=true;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    iter:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=null;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    map:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _={
        $:1,
        $0:f(x1)
       };
      }
     return _;
    },
    ofObj:function(o)
    {
     return o==null?{
      $:0
     }:{
      $:1,
      $0:o
     };
    },
    toArray:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=[];
      }
     else
      {
       x1=x.$0;
       _=[x1];
      }
     return _;
    },
    toList:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=Runtime.New(T1,{
        $:0
       });
      }
     else
      {
       x1=x.$0;
       _=List.ofArray([x1]);
      }
     return _;
    },
    toObj:function(o)
    {
     var _,v;
     if(o.$==0)
      {
      }
     else
      {
       v=o.$0;
       _=v;
      }
     return _;
    }
   },
   PrintfHelpers:{
    padNumLeft:function(s,l)
    {
     var f;
     f=Arrays.get(s,0);
     return((f===" "?true:f==="+")?true:f==="-")?f+Strings.PadLeftWith(s.substr(1),l-1,48):Strings.PadLeftWith(s,l,48);
    },
    plusForPos:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    prettyPrint:function(o)
    {
     var printObject,t,_1,_2,_3,mapping1,strings1;
     printObject=function(o1)
     {
      var s,_,mapping,array,strings;
      s=Global.String(o1);
      if(s==="[object Object]")
       {
        mapping=function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return k+" = "+PrintfHelpers.prettyPrint(v);
        };
        array=JSModule.GetFields(o1);
        strings=Arrays.map(mapping,array);
        _="{"+Strings.concat("; ",strings)+"}";
       }
      else
       {
        _=s;
       }
      return _;
     };
     t=typeof o;
     if(t=="string")
      {
       _1="\""+o+"\"";
      }
     else
      {
       if(t=="object")
        {
         if(o instanceof Global.Array)
          {
           mapping1=function(o1)
           {
            return PrintfHelpers.prettyPrint(o1);
           };
           strings1=Arrays.map(mapping1,o);
           _3="[|"+Strings.concat("; ",strings1)+"|]";
          }
         else
          {
           _3=printObject(o);
          }
         _2=_3;
        }
       else
        {
         _2=Global.String(o);
        }
       _1=_2;
      }
     return _1;
    },
    printArray:function(p,o)
    {
     var strings;
     strings=Arrays.map(p,o);
     return"[|"+Strings.concat("; ",strings)+"|]";
    },
    printArray2D:function(p,o)
    {
     var strings;
     strings=Seq.delay(function()
     {
      var l2;
      l2=o.length?o[0].length:0;
      return Seq.map(function(i)
      {
       var strings1;
       strings1=Seq.delay(function()
       {
        return Seq.map(function(j)
        {
         return p(Arrays.get2D(o,i,j));
        },Operators.range(0,l2-1));
       });
       return Strings.concat("; ",strings1);
      },Operators.range(0,o.length-1));
     });
     return"[["+Strings.concat("][",strings)+"]]";
    },
    printList:function(p,o)
    {
     var strings;
     strings=Seq.map(p,o);
     return"["+Strings.concat("; ",strings)+"]";
    },
    spaceForPos:function(n,s)
    {
     return 0<=n?" "+s:s;
    },
    toSafe:function(s)
    {
     return s==null?"":s;
    }
   },
   Queue:{
    Clear:function(a)
    {
     return a.splice(0,Arrays.length(a));
    },
    Contains:function(a,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },a);
    },
    CopyTo:function(a,array,index)
    {
     return Arrays.blit(a,0,array,index,Arrays.length(a));
    }
   },
   Random:Runtime.Class({
    Next:function()
    {
     return Math.floor(Math.random()*2147483648);
    },
    Next1:function(maxValue)
    {
     return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
    },
    Next2:function(minValue,maxValue)
    {
     var _,maxValue1;
     if(minValue>maxValue)
      {
       _=Operators.FailWith("'minValue' cannot be greater than maxValue.");
      }
     else
      {
       maxValue1=maxValue-minValue;
       _=minValue+Math.floor(Math.random()*maxValue1);
      }
     return _;
    },
    NextBytes:function(buffer)
    {
     var i;
     for(i=0;i<=Arrays.length(buffer)-1;i++){
      Arrays.set(buffer,i,Math.floor(Math.random()*256));
     }
     return;
    }
   },{
    New:function()
    {
     return Runtime.New(this,{});
    }
   }),
   Ref:{
    decr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]--);
    },
    incr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]++);
    }
   },
   Remoting:{
    AjaxProvider:Runtime.Field(function()
    {
     return XhrProvider.New();
    }),
    AjaxRemotingProvider:Runtime.Class({},{
     Async:function(m,data)
     {
      var headers,payload;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      return Concurrency.Delay(function()
      {
       var x;
       x=AsyncProxy.get_CancellationToken();
       return Concurrency.Bind(x,function(_arg1)
       {
        return Concurrency.FromContinuations(function(tupledArg)
        {
         var ok,err,cc,waiting,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting=[true];
         reg=Concurrency.Register(_arg1,function()
         {
          return function()
          {
           var _;
           if(waiting[0])
            {
             waiting[0]=false;
             _=cc(OperationCanceledException.New());
            }
           else
            {
             _=null;
            }
           return _;
          }();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=ok(Json.Activate(JSON.parse(x1)));
           }
          else
           {
            _=null;
           }
          return _;
         };
         err1=function(e)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=err(e);
           }
          else
           {
            _=null;
           }
          return _;
         };
         arg00=Remoting.EndPoint();
         return Remoting.AjaxProvider().Async(arg00,headers,payload,ok1,err1);
        });
       });
      });
     },
     Send:function(m,data)
     {
      return Concurrency.Start(Concurrency.Ignore(AjaxRemotingProvider.Async(m,data)),{
       $:0
      });
     },
     Sync:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     }
    }),
    EndPoint:Runtime.Field(function()
    {
     return"?";
    }),
    UseHttps:function()
    {
     var _,_1,_2,matchValue;
     try
     {
      if(!Strings.StartsWith(window.location.href,"https://"))
       {
        _2=Strings.Replace(window.location.href,"http://","https://");
        Remoting.EndPoint=function()
        {
         return _2;
        };
        _1=true;
       }
      else
       {
        _1=false;
       }
      _=_1;
     }
     catch(matchValue)
     {
      _=false;
     }
     return _;
    },
    XhrProvider:Runtime.Class({
     Async:function(url,headers,data,ok,err)
     {
      return Remoting.ajax(true,url,headers,data,ok,err,function()
      {
       return Remoting.ajax(true,url,headers,data,ok,err,undefined);
      });
     },
     Sync:function(url,headers,data)
     {
      var res;
      res=[undefined];
      Remoting.ajax(false,url,headers,data,function(x)
      {
       res[0]=x;
      },function(e)
      {
       return Operators.Raise(e);
      },function()
      {
       return Remoting.ajax(false,url,headers,data,function(x)
       {
        res[0]=x;
       },function(e)
       {
        return Operators.Raise(e);
       },undefined);
      });
      return res[0];
     }
    },{
     New:function()
     {
      return Runtime.New(this,{});
     }
    }),
    ajax:function($async,$url,$headers,$data,$ok,$err,$csrf)
    {
     var $0=this,$this=this;
     var xhr=new Global.XMLHttpRequest();
     var csrf=Global.document.cookie.replace(new Global.RegExp("(?:(?:^|.*;)\\s*csrftoken\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1");
     xhr.open("POST",$url,$async);
     if($async==true)
      {
       xhr.withCredentials=true;
      }
     for(var h in $headers){
      xhr.setRequestHeader(h,$headers[h]);
     }
     if(csrf)
      {
       xhr.setRequestHeader("x-csrftoken",csrf);
      }
     function k()
     {
      if(xhr.status==200)
       {
        $ok(xhr.responseText);
       }
      else
       if($csrf&&xhr.status==403&&xhr.responseText=="CSRF")
        {
         $csrf();
        }
       else
        {
         var msg="Response status is not 200: ";
         $err(new Global.Error(msg+xhr.status));
        }
     }
     if("onload"in xhr)
      {
       xhr.onload=xhr.onerror=xhr.onabort=k;
      }
     else
      {
       xhr.onreadystatechange=function()
       {
        if(xhr.readyState==4)
         {
          k();
         }
       };
      }
     xhr.send($data);
    },
    makeHeaders:function(m)
    {
     var headers;
     headers={};
     headers["content-type"]="application/json";
     headers["x-websharper-rpc"]=m;
     return headers;
    },
    makePayload:function(data)
    {
     return JSON.stringify(data);
    }
   },
   Seq:{
    append:function(s1,s2)
    {
     return Enumerable.Of(function()
     {
      var e1,first;
      e1=Enumerator.Get(s1);
      first=[true];
      return T.New(e1,null,function(x)
      {
       var _,x1,_1,_2;
       if(x.s.MoveNext())
        {
         x.c=x.s.get_Current();
         _=true;
        }
       else
        {
         x1=x.s;
         !Unchecked.Equals(x1,null)?x1.Dispose():null;
         x.s=null;
         if(first[0])
          {
           first[0]=false;
           x.s=Enumerator.Get(s2);
           if(x.s.MoveNext())
            {
             x.c=x.s.get_Current();
             _2=true;
            }
           else
            {
             x.s.Dispose();
             x.s=null;
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      },function(x)
      {
       var x1;
       x1=x.s;
       return!Unchecked.Equals(x1,null)?x1.Dispose():null;
      });
     });
    },
    average:function(s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+x];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    averageBy:function(f,s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+f(x)];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    cache:function(s)
    {
     var cache,_enum,getEnumerator;
     cache=[];
     _enum=[Enumerator.Get(s)];
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var _,en,_1,_2;
       if(e.s+1<cache.length)
        {
         e.s=e.s+1;
         e.c=cache[e.s];
         _=true;
        }
       else
        {
         en=_enum[0];
         if(Unchecked.Equals(en,null))
          {
           _1=false;
          }
         else
          {
           if(en.MoveNext())
            {
             e.s=e.s+1;
             e.c=en.get_Current();
             cache.push(e.get_Current());
             _2=true;
            }
           else
            {
             en.Dispose();
             _enum[0]=null;
             _2=false;
            }
           _1=_2;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next,function()
      {
      });
     };
     return Enumerable.Of(getEnumerator);
    },
    choose:function(f,s)
    {
     var mapping;
     mapping=function(x)
     {
      var matchValue,_,v;
      matchValue=f(x);
      if(matchValue.$==0)
       {
        _=Runtime.New(T1,{
         $:0
        });
       }
      else
       {
        v=matchValue.$0;
        _=List.ofArray([v]);
       }
      return _;
     };
     return Seq.collect(mapping,s);
    },
    collect:function(f,s)
    {
     return Seq.concat(Seq.map(f,s));
    },
    concat:function(ss)
    {
     return Enumerable.Of(function()
     {
      var outerE,next;
      outerE=Enumerator.Get(ss);
      next=function(st)
      {
       var matchValue,_,_1,_2;
       matchValue=st.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(outerE.MoveNext())
          {
           st.s=Enumerator.Get(outerE.get_Current());
           _1=next(st);
          }
         else
          {
           outerE.Dispose();
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           st.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           st.Dispose();
           st.s=null;
           _2=next(st);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next,function(st)
      {
       var x;
       x=st.s;
       !Unchecked.Equals(x,null)?x.Dispose():null;
       return!Unchecked.Equals(outerE,null)?outerE.Dispose():null;
      });
     });
    },
    delay:function(f)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(f(null));
     });
    },
    empty:function()
    {
     return[];
    },
    enumFinally:function(s,f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,_,e,dispose,next;
      try
      {
       _=Enumerator.Get(s);
      }
      catch(e)
      {
       f(null);
       _=Operators.Raise(e);
      }
      _enum=_;
      dispose=function()
      {
       _enum.Dispose();
       return f(null);
      };
      next=function(e1)
      {
       var _1;
       if(_enum.MoveNext())
        {
         e1.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    enumUsing:function(x,f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,_,e,dispose,next;
      try
      {
       _=Enumerator.Get(f(x));
      }
      catch(e)
      {
       x.Dispose();
       _=Operators.Raise(e);
      }
      _enum=_;
      dispose=function()
      {
       _enum.Dispose();
       return x.Dispose();
      };
      next=function(e1)
      {
       var _1;
       if(_enum.MoveNext())
        {
         e1.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    enumWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var next;
      next=function(en)
      {
       var matchValue,_,_1,_2;
       matchValue=en.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(f(null))
          {
           en.s=Enumerator.Get(s);
           _1=next(en);
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           en.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           matchValue.Dispose();
           en.s=null;
           _2=next(en);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next,function(en)
      {
       var x;
       x=en.s;
       return!Unchecked.Equals(x,null)?x.Dispose():null;
      });
     });
    },
    exists:function(p,s)
    {
     var e,_,r;
     e=Enumerator.Get(s);
     try
     {
      r=false;
      while(!r?e.MoveNext():false)
       {
        r=p(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    exists2:function(p,s1,s2)
    {
     var e1,_,e2,_1,r;
     e1=Enumerator.Get(s1);
     try
     {
      e2=Enumerator.Get(s2);
      try
      {
       r=false;
       while((!r?e1.MoveNext():false)?e2.MoveNext():false)
        {
         r=(p(e1.get_Current()))(e2.get_Current());
        }
       _1=r;
      }
      finally
      {
       e2.Dispose!=undefined?e2.Dispose():null;
      }
      _=_1;
     }
     finally
     {
      e1.Dispose!=undefined?e1.Dispose():null;
     }
     return _;
    },
    filter:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,dispose,next;
      _enum=Enumerator.Get(s);
      dispose=function()
      {
       return _enum.Dispose();
      };
      next=function(e)
      {
       var loop,c,res,_;
       loop=_enum.MoveNext();
       c=_enum.get_Current();
       res=false;
       while(loop)
        {
         if(f(c))
          {
           e.c=c;
           res=true;
           _=loop=false;
          }
         else
          {
           _=_enum.MoveNext()?c=_enum.get_Current():loop=false;
          }
        }
       return res;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    find:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFind(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndex:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFindIndex(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndexBack:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Arrays1.tryFindIndexBack(p,Arrays.ofSeq(s));
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,x,s)
    {
     var r,e,_;
     r=x;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        r=(f(r))(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    fold2:function(f,s,s1,s2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(s1),Arrays.ofSeq(s2));
    },
    foldBack:function(f,s,state)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(s),state);
    },
    foldBack2:function(f,s1,s2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(s1),Arrays.ofSeq(s2),s);
    },
    forall:function(p,s)
    {
     return!Seq.exists(function(x)
     {
      return!p(x);
     },s);
    },
    forall2:function(p,s1,s2)
    {
     return!Seq.exists2(function(x)
     {
      return function(y)
      {
       return!(p(x))(y);
      };
     },s1,s2);
    },
    head:function(s)
    {
     var e,_;
     e=Enumerator.Get(s);
     try
     {
      _=e.MoveNext()?e.get_Current():Seq1.insufficient();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    indexed:function(s)
    {
     return Seq.mapi(function(a)
     {
      return function(b)
      {
       return[a,b];
      };
     },s);
    },
    init:function(n,f)
    {
     return Seq.take(n,Seq.initInfinite(f));
    },
    initInfinite:function(f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       e.c=f(e.s);
       e.s=e.s+1;
       return true;
      };
      return T.New(0,null,next,function()
      {
      });
     };
     return Enumerable.Of(getEnumerator);
    },
    isEmpty:function(s)
    {
     var e,_;
     e=Enumerator.Get(s);
     try
     {
      _=!e.MoveNext();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    iter:function(p,s)
    {
     return Seq.iteri(function()
     {
      return function(x)
      {
       return p(x);
      };
     },s);
    },
    iter2:function(p,s1,s2)
    {
     var e1,_,e2,_1;
     e1=Enumerator.Get(s1);
     try
     {
      e2=Enumerator.Get(s2);
      try
      {
       while(e1.MoveNext()?e2.MoveNext():false)
        {
         (p(e1.get_Current()))(e2.get_Current());
        }
      }
      finally
      {
       e2.Dispose!=undefined?e2.Dispose():null;
      }
      _=_1;
     }
     finally
     {
      e1.Dispose!=undefined?e1.Dispose():null;
     }
     return _;
    },
    iteri:function(p,s)
    {
     var i,e,_;
     i=0;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        (p(i))(e.get_Current());
        i=i+1;
       }
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    iteri2:function(f,s1,s2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(s1),Arrays.ofSeq(s2));
    },
    length:function(s)
    {
     var i,e,_;
     i=0;
     e=Enumerator.Get(s);
     try
     {
      while(e.MoveNext())
       {
        i=i+1;
       }
      _=i;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    map:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,dispose,next;
      en=Enumerator.Get(s);
      dispose=function()
      {
       return en.Dispose();
      };
      next=function(e)
      {
       var _;
       if(en.MoveNext())
        {
         e.c=f(en.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    map2:function(f,s1,s2)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,dispose,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      dispose=function()
      {
       e1.Dispose();
       return e2.Dispose();
      };
      next=function(e)
      {
       var _;
       if(e1.MoveNext()?e2.MoveNext():false)
        {
         e.c=(f(e1.get_Current()))(e2.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    map3:function(f,s1,s2,s3)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,e3,dispose,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      e3=Enumerator.Get(s3);
      dispose=function()
      {
       e1.Dispose();
       e2.Dispose();
       return e3.Dispose();
      };
      next=function(e)
      {
       var _;
       if((e1.MoveNext()?e2.MoveNext():false)?e3.MoveNext():false)
        {
         e.c=((f(e1.get_Current()))(e2.get_Current()))(e3.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    mapFold:function(f,zero,s)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFold(f,zero,Seq.toArray(s));
     x=tupledArg[0];
     y=tupledArg[1];
     return[x,y];
    },
    mapFoldBack:function(f,s,zero)
    {
     var tupledArg,x,y;
     tupledArg=Arrays1.mapFoldBack(f,Seq.toArray(s),zero);
     x=tupledArg[0];
     y=tupledArg[1];
     return[x,y];
    },
    mapi:function(f,s)
    {
     return Seq.map2(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s);
    },
    mapi2:function(f,s1,s2)
    {
     return Seq.map3(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s1,s2);
    },
    max:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)>=0?x:y;
      };
     },s);
    },
    maxBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))>=0?x:y;
      };
     },s);
    },
    min:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)<=0?x:y;
      };
     },s);
    },
    minBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))<=0?x:y;
      };
     },s);
    },
    nth:function(index,s)
    {
     var pos,e,_;
     index<0?Operators.FailWith("negative index requested"):null;
     pos=-1;
     e=Enumerator.Get(s);
     try
     {
      while(pos<index)
       {
        !e.MoveNext()?Seq1.insufficient():null;
        pos=pos+1;
       }
      _=e.get_Current();
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    permute:function(f,s)
    {
     return Seq.delay(function()
     {
      return Arrays.permute(f,Arrays.ofSeq(s));
     });
    },
    pick:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryPick(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    readOnly:function(s)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(s);
     });
    },
    reduce:function(f,source)
    {
     var e,_,r;
     e=Enumerator.Get(source);
     try
     {
      !e.MoveNext()?Operators.FailWith("The input sequence was empty"):null;
      r=e.get_Current();
      while(e.MoveNext())
       {
        r=(f(r))(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    reduceBack:function(f,s)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(s));
    },
    replicate:function(size,value)
    {
     size<0?Seq1.nonNegative():null;
     return Seq.delay(function()
     {
      return Seq.map(function()
      {
       return value;
      },Operators.range(0,size-1));
     });
    },
    rev:function(s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Seq.toArray(s).slice().reverse();
      return array;
     });
    },
    scan:function(f,x,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,dispose,next;
      en=Enumerator.Get(s);
      dispose=function()
      {
       return en.Dispose();
      };
      next=function(e)
      {
       var _,_1;
       if(e.s)
        {
         if(en.MoveNext())
          {
           e.c=(f(e.get_Current()))(en.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         e.c=x;
         e.s=true;
         _=true;
        }
       return _;
      };
      return T.New(false,null,next,dispose);
     };
     return Enumerable.Of(getEnumerator);
    },
    scanBack:function(f,l,s)
    {
     return Seq.delay(function()
     {
      return Arrays.scanBack(f,Arrays.ofSeq(l),s);
     });
    },
    skip:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var _enum;
      _enum=Enumerator.Get(s);
      return T.New(true,null,function(e)
      {
       var _,i,_1;
       if(e.s)
        {
         for(i=1;i<=n;i++){
          !_enum.MoveNext()?Seq1.insufficient():null;
         }
         _=void(e.s=false);
        }
       else
        {
         _=null;
        }
       if(_enum.MoveNext())
        {
         e.c=_enum.get_Current();
         _1=true;
        }
       else
        {
         _1=false;
        }
       return _1;
      },function()
      {
       return _enum.Dispose();
      });
     });
    },
    skipWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var _enum;
      _enum=Enumerator.Get(s);
      return T.New(true,null,function(e)
      {
       var _,go,empty,_1,_2,_3;
       if(e.s)
        {
         go=true;
         empty=false;
         while(go)
          {
           if(_enum.MoveNext())
            {
             _1=!f(_enum.get_Current())?go=false:null;
            }
           else
            {
             go=false;
             _1=empty=true;
            }
          }
         e.s=false;
         if(empty)
          {
           _2=false;
          }
         else
          {
           e.c=_enum.get_Current();
           _2=true;
          }
         _=_2;
        }
       else
        {
         if(_enum.MoveNext())
          {
           e.c=_enum.get_Current();
           _3=true;
          }
         else
          {
           _3=false;
          }
         _=_3;
        }
       return _;
      },function()
      {
       return _enum.Dispose();
      });
     });
    },
    sort:function(s)
    {
     return Seq.sortBy(function(x)
     {
      return x;
     },s);
    },
    sortBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays.sortInPlaceBy(f,array);
      return array;
     });
    },
    sortByDescending:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays1.sortInPlaceByDescending(f,array);
      return array;
     });
    },
    sortDescending:function(s)
    {
     return Seq.sortByDescending(function(x)
     {
      return x;
     },s);
    },
    sortWith:function(f,s)
    {
     return Seq.delay(function()
     {
      var a;
      a=Arrays.ofSeq(s);
      Arrays.sortInPlaceWith(f,a);
      return a;
     });
    },
    splitInto:function(count,s)
    {
     count<=0?Operators.FailWith("Count must be positive"):null;
     return Seq.delay(function()
     {
      var source;
      source=Arrays1.splitInto(count,Arrays.ofSeq(s));
      return source;
     });
    },
    sum:function(s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+x;
      };
     },0,s);
    },
    sumBy:function(f,s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+f(x);
      };
     },0,s);
    },
    tail:function(s)
    {
     return Seq.skip(1,s);
    },
    take:function(n,s)
    {
     n<0?Seq1.nonNegative():null;
     return Enumerable.Of(function()
     {
      var e;
      e=[Enumerator.Get(s)];
      return T.New(0,null,function(_enum)
      {
       var _,en,_1,_2,_3;
       _enum.s=_enum.s+1;
       if(_enum.s>n)
        {
         _=false;
        }
       else
        {
         en=e[0];
         if(Unchecked.Equals(en,null))
          {
           _1=Seq1.insufficient();
          }
         else
          {
           if(en.MoveNext())
            {
             _enum.c=en.get_Current();
             if(_enum.s===n)
              {
               en.Dispose();
               _3=void(e[0]=null);
              }
             else
              {
               _3=null;
              }
             _2=true;
            }
           else
            {
             en.Dispose();
             e[0]=null;
             _2=Seq1.insufficient();
            }
           _1=_2;
          }
         _=_1;
        }
       return _;
      },function()
      {
       var x;
       x=e[0];
       return!Unchecked.Equals(x,null)?x.Dispose():null;
      });
     });
    },
    takeWhile:function(f,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?f(e.get_Current()):false;
       },Seq.delay(function()
       {
        return[e.get_Current()];
       }));
      });
     });
    },
    toArray:function(s)
    {
     var q,enumerator,_,e;
     q=[];
     enumerator=Enumerator.Get(s);
     try
     {
      while(enumerator.MoveNext())
       {
        e=enumerator.get_Current();
        q.push(e);
       }
     }
     finally
     {
      enumerator.Dispose!=undefined?enumerator.Dispose():null;
     }
     return q.slice(0);
    },
    toList:function(s)
    {
     return List.ofSeq(s);
    },
    tryFind:function(ok,s)
    {
     var e,_,r,x;
     e=Enumerator.Get(s);
     try
     {
      r={
       $:0
      };
      while(r.$==0?e.MoveNext():false)
       {
        x=e.get_Current();
        ok(x)?r={
         $:1,
         $0:x
        }:null;
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    tryFindIndex:function(ok,s)
    {
     var e,_,loop,i,x;
     e=Enumerator.Get(s);
     try
     {
      loop=true;
      i=0;
      while(loop?e.MoveNext():false)
       {
        x=e.get_Current();
        ok(x)?loop=false:i=i+1;
       }
      _=loop?{
       $:0
      }:{
       $:1,
       $0:i
      };
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    tryPick:function(f,s)
    {
     var e,_,r;
     e=Enumerator.Get(s);
     try
     {
      r={
       $:0
      };
      while(Unchecked.Equals(r,{
       $:0
      })?e.MoveNext():false)
       {
        r=f(e.get_Current());
       }
      _=r;
     }
     finally
     {
      e.Dispose!=undefined?e.Dispose():null;
     }
     return _;
    },
    zip:function(s1,s2)
    {
     return Seq.map2(function(x)
     {
      return function(y)
      {
       return[x,y];
      };
     },s1,s2);
    },
    zip3:function(s1,s2,s3)
    {
     return Seq.map2(function(x)
     {
      return function(tupledArg)
      {
       var y,z;
       y=tupledArg[0];
       z=tupledArg[1];
       return[x,y,z];
      };
     },s1,Seq.zip(s2,s3));
    }
   },
   Slice:{
    array:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1=[];
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    },
    array2D:function(arr,start1,finish1,start2,finish2)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3,len1,len2;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=arr.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(arr.length?arr[0].length:0)-1;
      }
     finish21=_3;
     len1=finish11-start11+1;
     len2=finish21-start21+1;
     return Arrays.sub2D(arr,start11,start21,len1,len2);
    },
    array2Dfix1:function(arr,fixed1,start2,finish2)
    {
     var start21,_,n,finish21,_1,n1,len2,dst,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(arr.length?arr[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     dst=Array(len2);
     for(j=0;j<=len2-1;j++){
      Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start21+j));
     }
     return dst;
    },
    array2Dfix2:function(arr,start1,finish1,fixed2)
    {
     var start11,_,n,finish11,_1,n1,len1,dst,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=arr.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     dst=Array(len1);
     for(i=0;i<=len1-1;i++){
      Arrays.set(dst,i,Arrays.get2D(arr,start11+i,fixed2));
     }
     return dst;
    },
    setArray:function(dst,start,finish,src)
    {
     var start1,_,n,finish1,_1,n1;
     if(start.$==1)
      {
       n=start.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start1=_;
     if(finish.$==1)
      {
       n1=finish.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish1=_1;
     return Arrays.setSub(dst,start1,finish1-start1+1,src);
    },
    setArray2D:function(dst,start1,finish1,start2,finish2,src)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=dst.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(dst.length?dst[0].length:0)-1;
      }
     finish21=_3;
     return Arrays.setSub2D(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
    },
    setArray2Dfix1:function(dst,fixed1,start2,finish2,src)
    {
     var start21,_,n,finish21,_1,n1,len2,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(dst.length?dst[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     for(j=0;j<=len2-1;j++){
      Arrays.set2D(dst,fixed1,start21+j,Arrays.get(src,j));
     }
     return;
    },
    setArray2Dfix2:function(dst,start1,finish1,fixed2,src)
    {
     var start11,_,n,finish11,_1,n1,len1,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     for(i=0;i<=len1-1;i++){
      Arrays.set2D(dst,start11+i,fixed2,Arrays.get(src,i));
     }
     return;
    },
    string:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1="";
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    }
   },
   Stack:{
    Clear:function(stack)
    {
     return stack.splice(0,Arrays.length(stack));
    },
    Contains:function(stack,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },stack);
    },
    CopyTo:function(stack,array,index)
    {
     return Arrays.blit(array,0,array,index,Arrays.length(stack));
    }
   },
   Strings:{
    Compare:function(x,y)
    {
     return Operators.Compare(x,y);
    },
    CopyTo:function(s,o,d,off,ct)
    {
     return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
    },
    EndsWith:function($x,$s)
    {
     var $0=this,$this=this;
     return $x.substring($x.length-$s.length)==$s;
    },
    Filter:function(f,s)
    {
     var chooser,source;
     chooser=function(c)
     {
      return f(c)?{
       $:1,
       $0:String.fromCharCode(c)
      }:{
       $:0
      };
     };
     source=Seq.choose(chooser,s);
     return Arrays.ofSeq(source).join("");
    },
    IndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.indexOf(Global.String.fromCharCode($c),$i);
    },
    Insert:function($x,$index,$s)
    {
     var $0=this,$this=this;
     return $x.substring(0,$index-1)+$s+$x.substring($index);
    },
    IsNullOrEmpty:function($x)
    {
     var $0=this,$this=this;
     return $x==null||$x=="";
    },
    IsNullOrWhiteSpace:function($x)
    {
     var $0=this,$this=this;
     return $x==null||(/^\s*$/).test($x);
    },
    Join:function($sep,$values)
    {
     var $0=this,$this=this;
     return $values.join($sep);
    },
    LastIndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
    },
    PadLeft:function(s,n)
    {
     return Strings.PadLeftWith(s,n,32);
    },
    PadLeftWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $n>$s.length?Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c))+$s:$s;
    },
    PadRight:function(s,n)
    {
     return Strings.PadRightWith(s,n,32);
    },
    PadRightWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $n>$s.length?$s+Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c)):$s;
    },
    RegexEscape:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    },
    Remove:function($x,$ix,$ct)
    {
     var $0=this,$this=this;
     return $x.substring(0,$ix)+$x.substring($ix+$ct);
    },
    Replace:function(subject,search,replace)
    {
     var replaceLoop;
     replaceLoop=function(subj)
     {
      var index,_,replaced,nextStartIndex;
      index=subj.indexOf(search);
      if(index!==-1)
       {
        replaced=Strings.ReplaceOnce(subj,search,replace);
        nextStartIndex=index+replace.length;
        _=Strings.Substring(replaced,0,index+replace.length)+replaceLoop(replaced.substring(nextStartIndex));
       }
      else
       {
        _=subj;
       }
      return _;
     };
     return replaceLoop(subject);
    },
    ReplaceChar:function(s,oldC,newC)
    {
     return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
    },
    ReplaceOnce:function($string,$search,$replace)
    {
     var $0=this,$this=this;
     return $string.replace($search,$replace);
    },
    Split:function(s,pat,opts)
    {
     var res;
     res=Strings.SplitWith(s,pat);
     return opts===1?Arrays.filter(function(x)
     {
      return x!=="";
     },res):res;
    },
    SplitChars:function(s,sep,opts)
    {
     var re;
     re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitStrings:function(s,sep,opts)
    {
     var re;
     re=Strings.concat("|",Arrays.map(function(s1)
     {
      return Strings.RegexEscape(s1);
     },sep));
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitWith:function($str,$pat)
    {
     var $0=this,$this=this;
     return $str.split($pat);
    },
    StartsWith:function($t,$s)
    {
     var $0=this,$this=this;
     return $t.substring(0,$s.length)==$s;
    },
    Substring:function($s,$ix,$ct)
    {
     var $0=this,$this=this;
     return $s.substr($ix,$ct);
    },
    ToCharArray:function(s)
    {
     return Arrays.init(s.length,function(x)
     {
      return s.charCodeAt(x);
     });
    },
    ToCharArrayRange:function(s,startIndex,length)
    {
     return Arrays.init(length,function(i)
     {
      return s.charCodeAt(startIndex+i);
     });
    },
    Trim:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"").replace(/\s+$/,"");
    },
    TrimEnd:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/\s+$/,"");
    },
    TrimStart:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"");
    },
    collect:function(f,s)
    {
     return Arrays.init(s.length,function(i)
     {
      return f(s.charCodeAt(i));
     }).join("");
    },
    concat:function(separator,strings)
    {
     return Seq.toArray(strings).join(separator);
    },
    exists:function(f,s)
    {
     return Seq.exists(f,Strings.protect(s));
    },
    forall:function(f,s)
    {
     return Seq.forall(f,Strings.protect(s));
    },
    init:function(count,f)
    {
     return Arrays.init(count,f).join("");
    },
    iter:function(f,s)
    {
     return Seq.iter(f,Strings.protect(s));
    },
    iteri:function(f,s)
    {
     return Seq.iteri(f,Strings.protect(s));
    },
    length:function(s)
    {
     return Strings.protect(s).length;
    },
    map:function(f,s)
    {
     return Strings.collect(function(x)
     {
      return String.fromCharCode(f(x));
     },Strings.protect(s));
    },
    mapi:function(f,s)
    {
     return Seq.toArray(Seq.mapi(function(i)
     {
      return function(x)
      {
       return String.fromCharCode((f(i))(x));
      };
     },s)).join("");
    },
    protect:function(s)
    {
     return s===null?"":s;
    },
    replicate:function(count,s)
    {
     return Strings.init(count,function()
     {
      return s;
     });
    }
   },
   TimeoutException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,TimeoutException.New1("The operation has timed out."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Unchecked:{
    Compare:function(a,b)
    {
     var objCompare,_2,matchValue,_3,matchValue1;
     objCompare=function(a1)
     {
      return function(b1)
      {
       var cmp;
       cmp=[0];
       JSModule.ForEach(a1,function(k)
       {
        var _,_1;
        if(!a1.hasOwnProperty(k))
         {
          _=false;
         }
        else
         {
          if(!b1.hasOwnProperty(k))
           {
            cmp[0]=1;
            _1=true;
           }
          else
           {
            cmp[0]=Unchecked.Compare(a1[k],b1[k]);
            _1=cmp[0]!==0;
           }
          _=_1;
         }
        return _;
       });
       cmp[0]===0?JSModule.ForEach(b1,function(k)
       {
        var _,_1;
        if(!b1.hasOwnProperty(k))
         {
          _=false;
         }
        else
         {
          if(!a1.hasOwnProperty(k))
           {
            cmp[0]=-1;
            _1=true;
           }
          else
           {
            _1=false;
           }
          _=_1;
         }
        return _;
       }):null;
       return cmp[0];
      };
     };
     if(a===b)
      {
       _2=0;
      }
     else
      {
       matchValue=typeof a;
       if(matchValue==="function")
        {
         _3=Operators.FailWith("Cannot compare function values.");
        }
       else
        {
         if(matchValue==="boolean")
          {
           _3=a<b?-1:1;
          }
         else
          {
           if(matchValue==="number")
            {
             _3=a<b?-1:1;
            }
           else
            {
             if(matchValue==="string")
              {
               _3=a<b?-1:1;
              }
             else
              {
               if(matchValue==="object")
                {
                 _3=a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):(objCompare(a))(b);
                }
               else
                {
                 matchValue1=typeof b;
                 _3=matchValue1==="undefined"?0:-1;
                }
              }
            }
          }
        }
       _2=_3;
      }
     return _2;
    },
    Equals:function(a,b)
    {
     var objEquals,_,matchValue;
     objEquals=function(a1)
     {
      return function(b1)
      {
       var eqR;
       eqR=[true];
       JSModule.ForEach(a1,function(k)
       {
        eqR[0]=!a1.hasOwnProperty(k)?true:b1.hasOwnProperty(k)?Unchecked.Equals(a1[k],b1[k]):false;
        return!eqR[0];
       });
       eqR[0]?JSModule.ForEach(b1,function(k)
       {
        eqR[0]=!b1.hasOwnProperty(k)?true:a1.hasOwnProperty(k);
        return!eqR[0];
       }):null;
       return eqR[0];
      };
     };
     if(a===b)
      {
       _=true;
      }
     else
      {
       matchValue=typeof a;
       _=matchValue==="object"?(((a===null?true:a===undefined)?true:b===null)?true:b===undefined)?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):(objEquals(a))(b):false;
      }
     return _;
    },
    Hash:function(o)
    {
     var matchValue;
     matchValue=typeof o;
     return matchValue==="function"?0:matchValue==="boolean"?o?1:0:matchValue==="number"?o:matchValue==="string"?Unchecked.hashString(o):matchValue==="object"?o==null?0:o instanceof Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
    },
    arrayEquals:function(a,b)
    {
     var _,eq,i;
     if(Arrays.length(a)===Arrays.length(b))
      {
       eq=true;
       i=0;
       while(eq?i<Arrays.length(a):false)
        {
         !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:null;
         i=i+1;
        }
       _=eq;
      }
     else
      {
       _=false;
      }
     return _;
    },
    compareArrays:function(a,b)
    {
     var _,_1,cmp,i;
     if(Arrays.length(a)<Arrays.length(b))
      {
       _=-1;
      }
     else
      {
       if(Arrays.length(a)>Arrays.length(b))
        {
         _1=1;
        }
       else
        {
         cmp=0;
         i=0;
         while(cmp===0?i<Arrays.length(a):false)
          {
           cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
           i=i+1;
          }
         _1=cmp;
        }
       _=_1;
      }
     return _;
    },
    compareDates:function(a,b)
    {
     return Operators.Compare(a.getTime(),b.getTime());
    },
    dateEquals:function(a,b)
    {
     return a.getTime()===b.getTime();
    },
    hashArray:function(o)
    {
     var h,i;
     h=-34948909;
     for(i=0;i<=Arrays.length(o)-1;i++){
      h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
     }
     return h;
    },
    hashMix:function(x,y)
    {
     return(x<<5)+x+y;
    },
    hashObject:function(o)
    {
     var _,op_PlusPlus,h;
     if("GetHashCode"in o)
      {
       _=o.GetHashCode();
      }
     else
      {
       op_PlusPlus=function(x,y)
       {
        return Unchecked.hashMix(x,y);
       };
       h=[0];
       JSModule.ForEach(o,function(key)
       {
        h[0]=op_PlusPlus(op_PlusPlus(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
        return false;
       });
       _=h[0];
      }
     return _;
    },
    hashString:function(s)
    {
     var _,hash,i;
     if(s===null)
      {
       _=0;
      }
     else
      {
       hash=5381;
       for(i=0;i<=s.length-1;i++){
        hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
       }
       _=hash;
      }
     return _;
    }
   },
   Util:{
    addListener:function(event,h)
    {
     event.Subscribe(Util.observer(h));
    },
    observer:function(h)
    {
     return{
      OnCompleted:function()
      {
      },
      OnError:function()
      {
      },
      OnNext:h
     };
    },
    subscribeTo:function(event,h)
    {
     return event.Subscribe(Util.observer(h));
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Array=Runtime.Safe(Global.Array);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  List=Runtime.Safe(Global.WebSharper.List);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  T=Runtime.Safe(Enumerator.T);
  Enumerable=Runtime.Safe(Global.WebSharper.Enumerable);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Seq1=Runtime.Safe(Global.Seq);
  Arrays1=Runtime.Safe(Global.Arrays);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Activator=Runtime.Safe(Global.WebSharper.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(Global.WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  AggregateException=Runtime.Safe(Global.WebSharper.AggregateException);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  ArgumentException=Runtime.Safe(Global.WebSharper.ArgumentException);
  Number=Runtime.Safe(Global.Number);
  IndexOutOfRangeException=Runtime.Safe(Global.WebSharper.IndexOutOfRangeException);
  List1=Runtime.Safe(Global.List);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(Global.WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  OperationCanceledException=Runtime.Safe(Global.WebSharper.OperationCanceledException);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  TimeoutException=Runtime.Safe(Global.WebSharper.TimeoutException);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  HtmlContentExtensions=Runtime.Safe(Global.WebSharper.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  InvalidOperationException=Runtime.Safe(Global.WebSharper.InvalidOperationException);
  T1=Runtime.Safe(List.T);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(Global.WebSharper.AsyncProxy);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  window=Runtime.Safe(Global.window);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(AggregateException,Exception);
  Runtime.Inherit(ArgumentException,Exception);
  Runtime.Inherit(IndexOutOfRangeException,Exception);
  Runtime.Inherit(InvalidOperationException,Exception);
  Runtime.Inherit(MatchFailureException,Exception);
  Runtime.Inherit(OperationCanceledException,Exception);
  Runtime.Inherit(TimeoutException,Exception);
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Concurrency.scheduler();
  Concurrency.defCTS();
  Concurrency.GetCT();
  Activator.Activate();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Collections,BalancedTree,Operators,Arrays,Seq,List,T,Seq1,JavaScript,JSModule,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSetUtil,HashSetProxy,LinkedList,E,T1,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  WebSharper:{
   Collections:{
    BalancedTree:{
     Add:function(x,t)
     {
      return BalancedTree.Put(function()
      {
       return function(x1)
       {
        return x1;
       };
      },x,t);
     },
     Branch:function(node,left,right)
     {
      return{
       Node:node,
       Left:left,
       Right:right,
       Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
       Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
      };
     },
     Build:function(data,min,max)
     {
      var sz,_,center,left,right;
      sz=max-min+1;
      if(sz<=0)
       {
        _=null;
       }
      else
       {
        center=(min+max)/2>>0;
        left=BalancedTree.Build(data,min,center-1);
        right=BalancedTree.Build(data,center+1,max);
        _=BalancedTree.Branch(Arrays.get(data,center),left,right);
       }
      return _;
     },
     Contains:function(v,t)
     {
      return!((BalancedTree.Lookup(v,t))[0]==null);
     },
     Enumerate:function(flip,t)
     {
      var gen;
      gen=function(tupledArg)
      {
       var t1,spine,_,_1,t2,spine1,other;
       t1=tupledArg[0];
       spine=tupledArg[1];
       if(t1==null)
        {
         if(spine.$==1)
          {
           t2=spine.$0[0];
           spine1=spine.$1;
           other=spine.$0[1];
           _1={
            $:1,
            $0:[t2,[other,spine1]]
           };
          }
         else
          {
           _1={
            $:0
           };
          }
         _=_1;
        }
       else
        {
         _=flip?gen([t1.Right,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Left],
          $1:spine
         })]):gen([t1.Left,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Right],
          $1:spine
         })]);
        }
       return _;
      };
      return Seq.unfold(gen,[t,Runtime.New(T,{
       $:0
      })]);
     },
     Lookup:function(k,t)
     {
      var spine,t1,loop,_,matchValue,_1;
      spine=[];
      t1=t;
      loop=true;
      while(loop)
       {
        if(t1==null)
         {
          _=loop=false;
         }
        else
         {
          matchValue=Operators.Compare(k,t1.Node);
          if(matchValue===0)
           {
            _1=loop=false;
           }
          else
           {
            if(matchValue===1)
             {
              spine.unshift([true,t1.Node,t1.Left]);
              _1=t1=t1.Right;
             }
            else
             {
              spine.unshift([false,t1.Node,t1.Right]);
              _1=t1=t1.Left;
             }
           }
          _=_1;
         }
       }
      return[t1,spine];
     },
     OfSeq:function(data)
     {
      var data1;
      data1=Arrays.sort(Seq1.toArray(Seq.distinct(data)));
      return BalancedTree.Build(data1,0,data1.length-1);
     },
     Put:function(combine,k,t)
     {
      var patternInput,t1,spine;
      patternInput=BalancedTree.Lookup(k,t);
      t1=patternInput[0];
      spine=patternInput[1];
      return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
     },
     Rebuild:function(spine,t)
     {
      var h,t1,i,matchValue,_,x1,l,_1,_2,m,x2,r,_3,_4,m1;
      h=function(x)
      {
       return x==null?0:x.Height;
      };
      t1=t;
      for(i=0;i<=Arrays.length(spine)-1;i++){
       matchValue=Arrays.get(spine,i);
       if(matchValue[0])
        {
         x1=matchValue[1];
         l=matchValue[2];
         if(h(t1)>h(l)+1)
          {
           if(h(t1.Left)===h(t1.Right)+1)
            {
             m=t1.Left;
             _2=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
            }
           else
            {
             _2=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
            }
           _1=_2;
          }
         else
          {
           _1=BalancedTree.Branch(x1,l,t1);
          }
         _=_1;
        }
       else
        {
         x2=matchValue[1];
         r=matchValue[2];
         if(h(t1)>h(r)+1)
          {
           if(h(t1.Right)===h(t1.Left)+1)
            {
             m1=t1.Right;
             _4=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
            }
           else
            {
             _4=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
            }
           _3=_4;
          }
         else
          {
           _3=BalancedTree.Branch(x2,t1,r);
          }
         _=_3;
        }
       t1=_;
      }
      return t1;
     },
     Remove:function(k,src)
     {
      var patternInput,t,spine,_,_1,_2,source,data,t1;
      patternInput=BalancedTree.Lookup(k,src);
      t=patternInput[0];
      spine=patternInput[1];
      if(t==null)
       {
        _=src;
       }
      else
       {
        if(t.Right==null)
         {
          _1=BalancedTree.Rebuild(spine,t.Left);
         }
        else
         {
          if(t.Left==null)
           {
            _2=BalancedTree.Rebuild(spine,t.Right);
           }
          else
           {
            source=Seq1.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right));
            data=Seq1.toArray(source);
            t1=BalancedTree.Build(data,0,data.length-1);
            _2=BalancedTree.Rebuild(spine,t1);
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     },
     TryFind:function(v,t)
     {
      var x;
      x=(BalancedTree.Lookup(v,t))[0];
      return x==null?{
       $:0
      }:{
       $:1,
       $0:x.Node
      };
     }
    },
    Dictionary:Runtime.Class({
     Add:function(k,v)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        _=Operators.FailWith("An item with the same key has already been added.");
       }
      else
       {
        this.data[h]={
         K:k,
         V:v
        };
        _=void(this.count=this.count+1);
       }
      return _;
     },
     Clear:function()
     {
      this.data={};
      this.count=0;
      return;
     },
     ContainsKey:function(k)
     {
      return this.data.hasOwnProperty(this.hash.call(null,k));
     },
     GetEnumerator:function()
     {
      var s;
      s=JSModule.GetFieldValues(this.data);
      return Enumerator.Get(s);
     },
     Remove:function(k)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        JSModule.Delete(this.data,h);
        this.count=this.count-1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },
     get_Item:function(k)
     {
      var k1,_,x;
      k1=this.hash.call(null,k);
      if(this.data.hasOwnProperty(k1))
       {
        x=this.data[k1];
        _=x.V;
       }
      else
       {
        _=DictionaryUtil.notPresent();
       }
      return _;
     },
     set_Item:function(k,v)
     {
      var h;
      h=this.hash.call(null,k);
      !this.data.hasOwnProperty(h)?void(this.count=this.count+1):null;
      this.data[h]={
       K:k,
       V:v
      };
      return;
     }
    },{
     New:function(dictionary)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(dictionary,comparer)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function(capacity,comparer)
     {
      return Runtime.New(this,Dictionary.New3(comparer));
     },
     New12:function()
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function()
     {
      return Runtime.New(this,Dictionary.New12());
     },
     New3:function(comparer)
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New4:function(init,equals,hash)
     {
      var r,enumerator,_,x,x1;
      r=Runtime.New(this,{});
      r.hash=hash;
      r.count=0;
      r.data={};
      enumerator=Enumerator.Get(init);
      try
      {
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         x1=x.K;
         r.data[r.hash.call(null,x1)]=x.V;
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }),
    DictionaryUtil:{
     notPresent:function()
     {
      return Operators.FailWith("The given key was not present in the dictionary.");
     }
    },
    FSharpMap:Runtime.Class({
     Add:function(k,v)
     {
      var x,x1;
      x=this.tree;
      x1=Runtime.New(Pair,{
       Key:k,
       Value:v
      });
      return FSharpMap.New(BalancedTree.Add(x1,x));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(x,y);
       };
      },this,other);
     },
     ContainsKey:function(k)
     {
      var x,v;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return BalancedTree.Contains(v,x);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq1.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var mapping,source,s;
      mapping=function(kv)
      {
       return{
        K:kv.Key,
        V:kv.Value
       };
      };
      source=BalancedTree.Enumerate(false,this.tree);
      s=Seq1.map(mapping,source);
      return Enumerator.Get(s);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(Seq1.toArray(this));
     },
     Remove:function(k)
     {
      var x,k1;
      x=this.tree;
      k1=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return FSharpMap.New(BalancedTree.Remove(k1,x));
     },
     TryFind:function(k)
     {
      var x,v,mapping,option;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      mapping=function(kv)
      {
       return kv.Value;
      };
      option=BalancedTree.TryFind(v,x);
      return Option.map(mapping,option);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_Item:function(k)
     {
      var matchValue,_,v;
      matchValue=this.TryFind(k);
      if(matchValue.$==0)
       {
        _=Operators.FailWith("The given key was not present in the dictionary.");
       }
      else
       {
        v=matchValue.$0;
        _=v;
       }
      return _;
     },
     get_Tree:function()
     {
      return this.tree;
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpMap.New(MapUtil.fromSeq(s)));
     }
    }),
    FSharpSet:Runtime.Class({
     Add:function(x)
     {
      return FSharpSet.New1(BalancedTree.Add(x,this.tree));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(e1)
      {
       return function(e2)
       {
        return Operators.Compare(e1,e2);
       };
      },this,other);
     },
     Contains:function(v)
     {
      return BalancedTree.Contains(v,this.tree);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq1.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
     },
     GetHashCode:function()
     {
      return-1741749453+Unchecked.Hash(Seq1.toArray(this));
     },
     IsProperSubsetOf:function(s)
     {
      return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
     },
     IsProperSupersetOf:function(s)
     {
      return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
     },
     IsSubsetOf:function(s)
     {
      return Seq1.forall(function(arg00)
      {
       return s.Contains(arg00);
      },this);
     },
     IsSupersetOf:function(s)
     {
      var _this=this;
      return Seq1.forall(function(arg00)
      {
       return _this.Contains(arg00);
      },s);
     },
     Remove:function(v)
     {
      return FSharpSet.New1(BalancedTree.Remove(v,this.tree));
     },
     add:function(x)
     {
      return FSharpSet.New1(BalancedTree.OfSeq(Seq1.append(this,x)));
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_MaximumElement:function()
     {
      return Seq1.head(BalancedTree.Enumerate(true,this.tree));
     },
     get_MinimumElement:function()
     {
      return Seq1.head(BalancedTree.Enumerate(false,this.tree));
     },
     get_Tree:function()
     {
      return this.tree;
     },
     sub:function(x)
     {
      return SetModule.Filter(function(x1)
      {
       return!x.Contains(x1);
      },this);
     }
    },{
     New:function(s)
     {
      return Runtime.New(this,FSharpSet.New1(SetUtil.ofSeq(s)));
     },
     New1:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     }
    }),
    HashSetProxy:Runtime.Class({
     Add:function(item)
     {
      return this.add(item);
     },
     Clear:function()
     {
      this.data=Array.prototype.constructor.apply(Array,[]);
      this.count=0;
      return;
     },
     Contains:function(item)
     {
      var arr;
      arr=this.data[this.hash.call(null,item)];
      return arr==null?false:this.arrContains(item,arr);
     },
     CopyTo:function(arr)
     {
      var i,all,i1;
      i=0;
      all=HashSetUtil.concat(this.data);
      for(i1=0;i1<=all.length-1;i1++){
       Arrays.set(arr,i1,all[i1]);
      }
      return;
     },
     ExceptWith:function(xs)
     {
      var enumerator,_,item,value;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Remove(item);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(HashSetUtil.concat(this.data));
     },
     IntersectWith:function(xs)
     {
      var other,all,i,item,value,_,value1;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       value=other.Contains(item);
       if(!value)
        {
         value1=this.Remove(item);
         _=void value1;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     IsProperSubsetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count<Arrays.length(other)?this.IsSubsetOf(other):false;
     },
     IsProperSupersetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count>Arrays.length(other)?this.IsSupersetOf(other):false;
     },
     IsSubsetOf:function(xs)
     {
      var other,predicate,array;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      predicate=function(arg00)
      {
       return other.Contains(arg00);
      };
      array=HashSetUtil.concat(this.data);
      return Seq1.forall(predicate,array);
     },
     IsSupersetOf:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq1.forall(predicate,xs);
     },
     Overlaps:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq1.exists(predicate,xs);
     },
     Remove:function(item)
     {
      var h,arr,_,_1;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        _=false;
       }
      else
       {
        if(this.arrRemove(item,arr))
         {
          this.count=this.count-1;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      return _;
     },
     RemoveWhere:function(cond)
     {
      var all,i,item,_,value;
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       if(cond(item))
        {
         value=this.Remove(item);
         _=void value;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     SetEquals:function(xs)
     {
      var other;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      return this.get_Count()===other.get_Count()?this.IsSupersetOf(other):false;
     },
     SymmetricExceptWith:function(xs)
     {
      var enumerator,_,item,_1,value,value1;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         if(this.Contains(item))
          {
           value=this.Remove(item);
           _1=void value;
          }
         else
          {
           value1=this.Add(item);
           _1=void value1;
          }
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     UnionWith:function(xs)
     {
      var enumerator,_,item,value;
      enumerator=Enumerator.Get(xs);
      try
      {
       while(enumerator.MoveNext())
        {
         item=enumerator.get_Current();
         value=this.Add(item);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return _;
     },
     add:function(item)
     {
      var h,arr,_,_1,value;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        this.data[h]=[item];
        this.count=this.count+1;
        _=true;
       }
      else
       {
        if(this.arrContains(item,arr))
         {
          _1=false;
         }
        else
         {
          value=arr.push(item);
          this.count=this.count+1;
          _1=true;
         }
        _=_1;
       }
      return _;
     },
     arrContains:function(item,arr)
     {
      var c,i,l;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        (this.equals.call(null,arr[i]))(item)?c=false:i=i+1;
       }
      return!c;
     },
     arrRemove:function(item,arr)
     {
      var c,i,l,_,start,ps,value;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        if((this.equals.call(null,arr[i]))(item))
         {
          start=i;
          ps=[];
          value=arr.splice.apply(arr,[start,1].concat(ps));
          _=c=false;
         }
        else
         {
          _=i=i+1;
         }
       }
      return!c;
     },
     get_Count:function()
     {
      return this.count;
     }
    },{
     New:function(init)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(Seq1.empty(),function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function()
     {
      return Runtime.New(this,HashSetProxy.New3(Seq1.empty(),function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function(init,comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New3:function(init,equals,hash)
     {
      var r,enumerator,_,x,value;
      r=Runtime.New(this,{});
      r.equals=equals;
      r.hash=hash;
      r.data=Array.prototype.constructor.apply(Array,[]);
      r.count=0;
      enumerator=Enumerator.Get(init);
      try
      {
       while(enumerator.MoveNext())
        {
         x=enumerator.get_Current();
         value=r.add(x);
        }
      }
      finally
      {
       enumerator.Dispose!=undefined?enumerator.Dispose():null;
      }
      return r;
     }
    }),
    HashSetUtil:{
     concat:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o){
       r.push.apply(r,$o[k]);
      }
      ;
      return r;
     }
    },
    LinkedList:{
     E:Runtime.Class({
      Dispose:function()
      {
       return null;
      },
      MoveNext:function()
      {
       this.c=this.c.n;
       return!Unchecked.Equals(this.c,null);
      },
      get_Current:function()
      {
       return this.c.v;
      }
     },{
      New:function(l)
      {
       var r;
       r=Runtime.New(this,{});
       r.c=l;
       return r;
      }
     }),
     T:Runtime.Class({
      AddAfter:function(after,value)
      {
       var before,node,_;
       before=after.n;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(after.n,null)?void(this.p=node):null;
       after.n=node;
       if(!Unchecked.Equals(before,null))
        {
         before.p=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddBefore:function(before,value)
      {
       var after,node,_;
       after=before.p;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(before.p,null)?void(this.n=node):null;
       before.p=node;
       if(!Unchecked.Equals(after,null))
        {
         after.n=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddFirst:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddBefore(this.n,value);
        }
       return _;
      },
      AddLast:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddAfter(this.p,value);
        }
       return _;
      },
      Clear:function()
      {
       this.c=0;
       this.n=null;
       this.p=null;
       return;
      },
      Contains:function(value)
      {
       var found,node;
       found=false;
       node=this.n;
       while(!Unchecked.Equals(node,null)?!found:false)
        {
         node.v==value?found=true:node=node.n;
        }
       return found;
      },
      Find:function(value)
      {
       var node,notFound;
       node=this.n;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.n;
        }
       return notFound?null:node;
      },
      FindLast:function(value)
      {
       var node,notFound;
       node=this.p;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.p;
        }
       return notFound?null:node;
      },
      GetEnumerator:function()
      {
       return E.New(this);
      },
      Remove:function(node)
      {
       var before,after,_,_1;
       before=node.p;
       after=node.n;
       if(Unchecked.Equals(before,null))
        {
         _=void(this.n=after);
        }
       else
        {
         before.n=after;
         _=after;
        }
       if(Unchecked.Equals(after,null))
        {
         _1=void(this.p=before);
        }
       else
        {
         after.p=before;
         _1=before;
        }
       this.c=this.c-1;
       return;
      },
      Remove1:function(value)
      {
       var node,_;
       node=this.Find(value);
       if(Unchecked.Equals(node,null))
        {
         _=false;
        }
       else
        {
         this.Remove(node);
         _=true;
        }
       return _;
      },
      RemoveFirst:function()
      {
       return this.Remove(this.n);
      },
      RemoveLast:function()
      {
       return this.Remove(this.p);
      },
      get_Count:function()
      {
       return this.c;
      },
      get_First:function()
      {
       return this.n;
      },
      get_Last:function()
      {
       return this.p;
      }
     },{
      New:function()
      {
       return Runtime.New(this,T1.New1(Seq1.empty()));
      },
      New1:function(coll)
      {
       var r,ie,_,node;
       r=Runtime.New(this,{});
       r.c=0;
       r.n=null;
       r.p=null;
       ie=Enumerator.Get(coll);
       if(ie.MoveNext())
        {
         r.n={
          p:null,
          n:null,
          v:ie.get_Current()
         };
         r.p=r.n;
         _=void(r.c=1);
        }
       else
        {
         _=null;
        }
       while(ie.MoveNext())
        {
         node={
          p:r.p,
          n:null,
          v:ie.get_Current()
         };
         r.p.n=node;
         r.p=node;
         r.c=r.c+1;
        }
       return r;
      }
     })
    },
    MapModule:{
     Exists:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.exists(predicate,m);
     },
     Filter:function(f,m)
     {
      var predicate,source,source1,data,t;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      source1=Seq1.filter(predicate,source);
      data=Seq1.toArray(source1);
      t=BalancedTree.Build(data,0,data.length-1);
      return FSharpMap.New(t);
     },
     FindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq1.pick(chooser,m);
     },
     Fold:function(f,s,m)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(s1))(kv.Key))(kv.Value);
       };
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq1.fold(folder,s,source);
     },
     FoldBack:function(f,m,s)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(kv.Key))(kv.Value))(s1);
       };
      };
      source=BalancedTree.Enumerate(true,m.get_Tree());
      return Seq1.fold(folder,s,source);
     },
     ForAll:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.forall(predicate,m);
     },
     Iterate:function(f,m)
     {
      var action;
      action=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.iter(action,m);
     },
     Map:function(f,m)
     {
      var mapping,source,data,t;
      mapping=function(kv)
      {
       return Runtime.New(Pair,{
        Key:kv.Key,
        Value:(f(kv.Key))(kv.Value)
       });
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      data=Seq1.map(mapping,source);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     OfArray:function(a)
     {
      var mapping,data,t;
      mapping=function(tupledArg)
      {
       var k,v;
       k=tupledArg[0];
       v=tupledArg[1];
       return Runtime.New(Pair,{
        Key:k,
        Value:v
       });
      };
      data=Seq1.map(mapping,a);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     Partition:function(f,m)
     {
      var predicate,array,patternInput,y,x;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      array=Seq1.toArray(BalancedTree.Enumerate(false,m.get_Tree()));
      patternInput=Arrays.partition(predicate,array);
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpMap.New(BalancedTree.Build(x,0,x.length-1)),FSharpMap.New(BalancedTree.Build(y,0,y.length-1))];
     },
     Pick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.pick(chooser,m);
     },
     ToSeq:function(m)
     {
      var mapping,source;
      mapping=function(kv)
      {
       return[kv.Key,kv.Value];
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq1.map(mapping,source);
     },
     TryFind:function(k,m)
     {
      return m.TryFind(k);
     },
     TryFindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq1.tryPick(chooser,m);
     },
     TryPick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq1.tryPick(chooser,m);
     }
    },
    MapUtil:{
     fromSeq:function(s)
     {
      var a;
      a=Seq1.toArray(Seq1.delay(function()
      {
       return Seq1.collect(function(matchValue)
       {
        var v,k;
        v=matchValue[1];
        k=matchValue[0];
        return[Runtime.New(Pair,{
         Key:k,
         Value:v
        })];
       },Seq.distinctBy(function(tuple)
       {
        return tuple[0];
       },s));
      }));
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    },
    Pair:Runtime.Class({
     CompareTo:function(other)
     {
      return Operators.Compare(this.Key,other.Key);
     },
     Equals:function(other)
     {
      return Unchecked.Equals(this.Key,other.Key);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(this.Key);
     }
    }),
    ResizeArray:{
     ResizeArrayProxy:Runtime.Class({
      Add:function(x)
      {
       return this.arr.push(x);
      },
      AddRange:function(x)
      {
       var _this=this;
       return Seq1.iter(function(arg00)
       {
        return _this.Add(arg00);
       },x);
      },
      Clear:function()
      {
       var value;
       value=ResizeArray.splice(this.arr,0,Arrays.length(this.arr),[]);
       return;
      },
      CopyTo:function(arr)
      {
       return this.CopyTo1(arr,0);
      },
      CopyTo1:function(arr,offset)
      {
       return this.CopyTo2(0,arr,offset,this.get_Count());
      },
      CopyTo2:function(index,target,offset,count)
      {
       return Arrays.blit(this.arr,index,target,offset,count);
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(this.arr);
      },
      GetRange:function(index,count)
      {
       return ResizeArrayProxy.New11(Arrays.sub(this.arr,index,count));
      },
      Insert:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,[items]);
       return;
      },
      InsertRange:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,Seq1.toArray(items));
       return;
      },
      RemoveAt:function(x)
      {
       var value;
       value=ResizeArray.splice(this.arr,x,1,[]);
       return;
      },
      RemoveRange:function(index,count)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,count,[]);
       return;
      },
      Reverse:function()
      {
       return this.arr.reverse();
      },
      Reverse1:function(index,count)
      {
       return Arrays.reverse(this.arr,index,count);
      },
      ToArray:function()
      {
       return this.arr.slice();
      },
      get_Count:function()
      {
       return Arrays.length(this.arr);
      },
      get_Item:function(x)
      {
       return Arrays.get(this.arr,x);
      },
      set_Item:function(x,v)
      {
       return Arrays.set(this.arr,x,v);
      }
     },{
      New:function(el)
      {
       return Runtime.New(this,ResizeArrayProxy.New11(Seq1.toArray(el)));
      },
      New1:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      },
      New11:function(arr)
      {
       var r;
       r=Runtime.New(this,{});
       r.arr=arr;
       return r;
      },
      New2:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      }
     }),
     splice:function($arr,$index,$howMany,$items)
     {
      var $0=this,$this=this;
      return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
     }
    },
    SetModule:{
     Filter:function(f,s)
     {
      var data;
      data=Seq1.toArray(Seq1.filter(f,s));
      return FSharpSet.New1(BalancedTree.Build(data,0,data.length-1));
     },
     FoldBack:function(f,a,s)
     {
      return Seq1.fold(function(s1)
      {
       return function(x)
       {
        return(f(x))(s1);
       };
      },s,BalancedTree.Enumerate(true,a.get_Tree()));
     },
     Partition:function(f,a)
     {
      var patternInput,y,x;
      patternInput=Arrays.partition(f,Seq1.toArray(a));
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpSet.New1(BalancedTree.OfSeq(x)),FSharpSet.New1(BalancedTree.OfSeq(y))];
     }
    },
    SetUtil:{
     ofSeq:function(s)
     {
      var a;
      a=Seq1.toArray(s);
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.Seq);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  Seq1=Runtime.Safe(Global.WebSharper.Seq);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(Global.WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSetUtil=Runtime.Safe(Collections.HashSetUtil);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  E=Runtime.Safe(LinkedList.E);
  T1=Runtime.Safe(LinkedList.T);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Json,Provider,Date,List,Arrays,Unchecked,Operators,Collections,FSharpSet,BalancedTree,Dictionary,JavaScript,JSModule,FSharpMap,Seq,Enumerator,MapModule,Internals,window;
 Runtime.Define(Global,{
  WebSharper:{
   Json:{
    Internals:{
     Provider:Runtime.Field(function()
     {
      return Provider.New();
     })
    },
    Provider:Runtime.Class({
     DecodeArray:function(decEl)
     {
      return this.EncodeArray(decEl);
     },
     DecodeDateTime:function()
     {
      return function()
      {
       return function(x)
       {
        return(new Date(x)).getTime();
       };
      };
     },
     DecodeList:function(decEl)
     {
      return function()
      {
       return function(a)
       {
        var decEl1;
        decEl1=decEl(null);
        return List.init(Arrays.length(a),function(i)
        {
         return decEl1(Arrays.get(a,i));
        });
       };
      };
     },
     DecodeRecord:function(t,fields)
     {
      return function()
      {
       return function(x)
       {
        var o,action;
        o=t===undefined?{}:new t();
        action=function(tupledArg)
        {
         var name,dec,kind;
         name=tupledArg[0];
         dec=tupledArg[1];
         kind=tupledArg[2];
         return Unchecked.Equals(kind,0)?void(o[name]=(dec(null))(x[name])):Unchecked.Equals(kind,1)?void(o[name]=x.hasOwnProperty(name)?{
          $:1,
          $0:(dec(null))(x[name])
         }:{
          $:0
         }):Unchecked.Equals(kind,2)?x.hasOwnProperty(name)?void(o[name]=(dec(null))(x[name])):null:Operators.FailWith("Invalid field option kind");
        };
        Arrays.iter(action,fields);
        return o;
       };
      };
     },
     DecodeSet:function(decEl)
     {
      return function()
      {
       return function(a)
       {
        var decEl1;
        decEl1=decEl(null);
        return FSharpSet.New1(BalancedTree.OfSeq(Arrays.map(decEl1,a)));
       };
      };
     },
     DecodeStringDictionary:function(decEl)
     {
      return function()
      {
       return function(o)
       {
        var d;
        d=Dictionary.New12();
        decEl(null);
        JSModule.ForEach(o,function(k)
        {
         d.set_Item(k,o[k]);
         return false;
        });
        return d;
       };
      };
     },
     DecodeStringMap:function(decEl)
     {
      return function()
      {
       return function(o)
       {
        var m;
        m=[FSharpMap.New1([])];
        decEl(null);
        JSModule.ForEach(o,function(k)
        {
         m[0]=m[0].Add(k,o[k]);
         return false;
        });
        return m[0];
       };
      };
     },
     DecodeTuple:function(decs)
     {
      return this.EncodeTuple(decs);
     },
     DecodeUnion:function(t,discr,cases)
     {
      return function()
      {
       return function(x)
       {
        var _,o,tag,_1,tagName,predicate,r,tuple,x1,action;
        if(typeof x==="object")
         {
          o=t===undefined?{}:new t();
          if(Unchecked.Equals(typeof discr,"string"))
           {
            tagName=x[discr];
            predicate=function(tupledArg)
            {
             var name;
             name=tupledArg[0];
             tupledArg[1];
             return name===tagName;
            };
            _1=Arrays.findINdex(predicate,cases);
           }
          else
           {
            r=[undefined];
            JSModule.ForEach(discr,function(k)
            {
             var _2;
             if(x.hasOwnProperty(k))
              {
               r[0]=discr[k];
               _2=true;
              }
             else
              {
               _2=false;
              }
             return _2;
            });
            _1=r[0];
           }
          tag=_1;
          o.$=tag;
          tuple=Arrays.get(cases,tag);
          x1=tuple[1];
          action=function(tupledArg)
          {
           var from,to,dec,kind;
           from=tupledArg[0];
           to=tupledArg[1];
           dec=tupledArg[2];
           kind=tupledArg[3];
           return from===null?void(o.$0=(dec(null))(x)):Unchecked.Equals(kind,0)?void(o[from]=(dec(null))(x[to])):Unchecked.Equals(kind,1)?void(o[from]=x.hasOwnProperty(to)?{
            $:1,
            $0:(dec(null))(x[to])
           }:{
            $:0
           }):Operators.FailWith("Invalid field option kind");
          };
          Arrays.iter(action,x1);
          _=o;
         }
        else
         {
          _=x;
         }
        return _;
       };
      };
     },
     EncodeArray:function(encEl)
     {
      return function()
      {
       return function(a)
       {
        var encEl1;
        encEl1=encEl(null);
        return Arrays.map(encEl1,a);
       };
      };
     },
     EncodeDateTime:function()
     {
      return function()
      {
       return function(x)
       {
        return(new Date(x)).toISOString();
       };
      };
     },
     EncodeList:function(encEl)
     {
      return function()
      {
       return function(l)
       {
        var a,encEl1,action;
        a=[];
        encEl1=encEl(null);
        action=function(x)
        {
         var value;
         value=a.push(encEl1(x));
         return;
        };
        Seq.iter(action,l);
        return a;
       };
      };
     },
     EncodeRecord:function(_arg1,fields)
     {
      return function()
      {
       return function(x)
       {
        var o,action;
        o={};
        action=function(tupledArg)
        {
         var name,enc,kind,_,matchValue,_1,x1;
         name=tupledArg[0];
         enc=tupledArg[1];
         kind=tupledArg[2];
         if(Unchecked.Equals(kind,0))
          {
           _=void(o[name]=(enc(null))(x[name]));
          }
         else
          {
           if(Unchecked.Equals(kind,1))
            {
             matchValue=x[name];
             if(matchValue.$==0)
              {
               _1=null;
              }
             else
              {
               x1=matchValue.$0;
               _1=void(o[name]=(enc(null))(x1));
              }
             _=_1;
            }
           else
            {
             _=Unchecked.Equals(kind,2)?x.hasOwnProperty(name)?void(o[name]=(enc(null))(x[name])):null:Operators.FailWith("Invalid field option kind");
            }
          }
         return _;
        };
        Arrays.iter(action,fields);
        return o;
       };
      };
     },
     EncodeSet:function(encEl)
     {
      return function()
      {
       return function(s)
       {
        var a,encEl1,action;
        a=[];
        encEl1=encEl(null);
        action=function(x)
        {
         var value;
         value=a.push(encEl1(x));
         return;
        };
        Seq.iter(action,s);
        return a;
       };
      };
     },
     EncodeStringDictionary:function(encEl)
     {
      return function()
      {
       return function(d)
       {
        var o,encEl1,enumerator,_,forLoopVar,activePatternResult,v,k;
        o={};
        encEl1=encEl(null);
        enumerator=Enumerator.Get(d);
        try
        {
         while(enumerator.MoveNext())
          {
           forLoopVar=enumerator.get_Current();
           activePatternResult=Operators.KeyValue(forLoopVar);
           v=activePatternResult[1];
           k=activePatternResult[0];
           o[k]=encEl1(v);
          }
        }
        finally
        {
         enumerator.Dispose!=undefined?enumerator.Dispose():null;
        }
        return o;
       };
      };
     },
     EncodeStringMap:function(encEl)
     {
      return function()
      {
       return function(m)
       {
        var o,encEl1,action;
        o={};
        encEl1=encEl(null);
        action=function(k)
        {
         return function(v)
         {
          o[k]=encEl1(v);
         };
        };
        MapModule.Iterate(action,m);
        return o;
       };
      };
     },
     EncodeTuple:function(encs)
     {
      return function()
      {
       return function(args)
       {
        return Arrays.map2(function(f)
        {
         return function(x)
         {
          return(f(null))(x);
         };
        },encs,args);
       };
      };
     },
     EncodeUnion:function(_arg2,discr,cases)
     {
      return function()
      {
       return function(x)
       {
        var _,o,tag,patternInput,tagName,fields,action;
        if(typeof x==="object")
         {
          o={};
          tag=x.$;
          patternInput=Arrays.get(cases,tag);
          tagName=patternInput[0];
          fields=patternInput[1];
          Unchecked.Equals(typeof discr,"string")?void(o[discr]=tagName):null;
          action=function(tupledArg)
          {
           var from,to,enc,kind,_1,record,_2,matchValue,_3,x1;
           from=tupledArg[0];
           to=tupledArg[1];
           enc=tupledArg[2];
           kind=tupledArg[3];
           if(from===null)
            {
             record=(enc(null))(x.$0);
             _1=JSModule.ForEach(record,function(f)
             {
              o[f]=record[f];
              return false;
             });
            }
           else
            {
             if(Unchecked.Equals(kind,0))
              {
               _2=void(o[to]=(enc(null))(x[from]));
              }
             else
              {
               if(Unchecked.Equals(kind,1))
                {
                 matchValue=x[from];
                 if(matchValue.$==0)
                  {
                   _3=null;
                  }
                 else
                  {
                   x1=matchValue.$0;
                   _3=void(o[to]=(enc(null))(x1));
                  }
                 _2=_3;
                }
               else
                {
                 _2=Operators.FailWith("Invalid field option kind");
                }
              }
             _1=_2;
            }
           return _1;
          };
          Arrays.iter(action,fields);
          _=o;
         }
        else
         {
          _=x;
         }
        return _;
       };
      };
     }
    },{
     Id:function()
     {
      return function(x)
      {
       return x;
      };
     },
     New:function()
     {
      return Runtime.New(this,{});
     },
     get_Default:function()
     {
      return Internals.Provider();
     }
    })
   },
   Web:{
    InlineControl:Runtime.Class({
     get_Body:function()
     {
      var f;
      f=Arrays.fold(function(obj)
      {
       return function(field)
       {
        return obj[field];
       };
      },window,this.funcName);
      return f.apply(null,this.args);
     }
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  Json=Runtime.Safe(Global.WebSharper.Json);
  Provider=Runtime.Safe(Json.Provider);
  Date=Runtime.Safe(Global.Date);
  List=Runtime.Safe(Global.WebSharper.List);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  MapModule=Runtime.Safe(Collections.MapModule);
  Internals=Runtime.Safe(Json.Internals);
  return window=Runtime.Safe(Global.window);
 });
 Runtime.OnLoad(function()
 {
  Internals.Provider();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Concurrency,Array,Arrays,Seq,UI,Next,Abbrev,Fresh,Collections,HashSetProxy,HashSet,Slot1,Unchecked,An,AppendList1,Anims,requestAnimationFrame,Trans,Option,View,Lazy,Array1,Attrs,DomUtility,AttrModule,AttrProxy,List,AnimatedAttrNode,Trans1,DynamicAttrNode,View1,document,Doc,Elt,Seq1,Docs,String,CheckedInput,Mailbox,Operators,T,jQuery,NodeSet,DocElemNode,DomNodes,Easing,Easings,Var,Var1,RegExp,FlowBuilder,Flow,Input,DoubleInterpolation,Key,ListModels,RefImpl1,ListModel1,Storage1,ListModel,Dictionary,Model1,Model,encodeURIComponent,Strings,Route,decodeURIComponent,Routing,Router,Trie1,window,Snap1,Async,Ref,ArrayStorage,LocalStorageBackend,JSON,Char,Submitter,Enumerator,ResizeArray,ResizeArrayProxy,MapModule,FSharpMap,RefImpl;
 Runtime.Define(Global,{
  WebSharper:{
   UI:{
    Next:{
     Abbrev:{
      Async:{
       Schedule:function(f)
       {
        var arg00;
        arg00=Concurrency.Delay(function()
        {
         return Concurrency.Return(f(null));
        });
        return Concurrency.Start(arg00,{
         $:0
        });
       },
       StartTo:function(comp,k)
       {
        return Concurrency.StartWithContinuations(comp,k,function()
        {
        },function()
        {
        },{
         $:0
        });
       }
      },
      Dict:{
       ToKeyArray:function(d)
       {
        var arr,action;
        arr=Array(d.count);
        action=function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.K);
         };
        };
        Seq.iteri(action,d);
        return arr;
       },
       ToValueArray:function(d)
       {
        var arr,action;
        arr=Array(d.count);
        action=function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.V);
         };
        };
        Seq.iteri(action,d);
        return arr;
       }
      },
      Fresh:{
       Id:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return"uid"+Global.String(Fresh.counter());
       },
       Int:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return Fresh.counter();
       },
       counter:Runtime.Field(function()
       {
        return 0;
       })
      },
      HashSet:{
       Except:function(excluded,included)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(included));
        set.ExceptWith(HashSet.ToArray(excluded));
        return set;
       },
       Filter:function(ok,set)
       {
        var array;
        array=HashSet.ToArray(set);
        return HashSetProxy.New(Arrays.filter(ok,array));
       },
       Intersect:function(a,b)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(a));
        set.IntersectWith(HashSet.ToArray(b));
        return set;
       },
       ToArray:function(set)
       {
        var arr;
        arr=Array(set.get_Count());
        set.CopyTo(arr);
        return arr;
       }
      },
      Mailbox:{
       StartProcessor:function(proc)
       {
        var mail,isActive,work,start,post;
        mail=[];
        isActive=[false];
        work=Concurrency.Delay(function()
        {
         return Concurrency.Combine(Concurrency.While(function()
         {
          return mail.length>0;
         },Concurrency.Delay(function()
         {
          var msg;
          msg=mail.shift();
          return Concurrency.Bind(proc(msg),function()
          {
           return Concurrency.Return(null);
          });
         })),Concurrency.Delay(function()
         {
          return Concurrency.Return(void(isActive[0]=false));
         }));
        });
        start=function()
        {
         var _;
         if(!isActive[0])
          {
           isActive[0]=true;
           _=Concurrency.Start(work,{
            $:0
           });
          }
         else
          {
           _=null;
          }
         return _;
        };
        post=function(msg)
        {
         mail.push(msg);
         return start(null);
        };
        return post;
       }
      },
      Slot:Runtime.Class({},{
       Create:function(key,value)
       {
        return Slot1.New(key,value);
       }
      }),
      Slot1:Runtime.Class({
       Equals:function(o)
       {
        return Unchecked.Equals(this.key.call(null,this.value),this.key.call(null,o.get_Value()));
       },
       GetHashCode:function()
       {
        return Unchecked.Hash(this.key.call(null,this.value));
       },
       get_Value:function()
       {
        return this.value;
       }
      },{
       New:function(key,value)
       {
        var r;
        r=Runtime.New(this,{});
        r.key=key;
        r.value=value;
        return r;
       }
      })
     },
     An:Runtime.Class({},{
      Append:function(_arg2,_arg1)
      {
       var a,b;
       a=_arg2.$0;
       b=_arg1.$0;
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Append(a,b)
       });
      },
      Concat:function(xs)
      {
       var _arg00_,arg0;
       _arg00_=Seq.map(function(_arg00_1)
       {
        return Anims.List(_arg00_1);
       },xs);
       arg0=AppendList1.Concat(_arg00_);
       return Runtime.New(An,{
        $:0,
        $0:arg0
       });
      },
      Const:function(v)
      {
       return Anims.Const(v);
      },
      Delayed:function(inter,easing,dur,delay,x,y)
      {
       var Duration;
       Duration=dur+delay;
       return{
        Compute:function(t)
        {
         var _,normalisedTime;
         if(t<=delay)
          {
           _=x;
          }
         else
          {
           normalisedTime=easing.TransformTime.call(null,(t-delay)/dur);
           _=inter.Interpolate(normalisedTime,x,y);
          }
         return _;
        },
        Duration:Duration
       };
      },
      Map:function(f,anim)
      {
       var f1;
       f1=anim.Compute;
       return Anims.Def(anim.Duration,function(x)
       {
        return f(f1(x));
       });
      },
      Pack:function(anim)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:1,
         $0:anim
        })
       });
      },
      Play:function(anim)
      {
       return Concurrency.Delay(function()
       {
        var arg00,arg10;
        arg00=function()
        {
        };
        arg10=Anims.Actions(anim);
        return Concurrency.Bind(An.Run(arg00,arg10),function()
        {
         return Concurrency.Return(Anims.Finalize(anim));
        });
       });
      },
      Run:function(k,anim)
      {
       var dur,arg00;
       dur=anim.Duration;
       arg00=function(tupledArg)
       {
        var ok,_arg1,_arg2,loop,value1;
        ok=tupledArg[0];
        _arg1=tupledArg[1];
        _arg2=tupledArg[2];
        loop=function(start,now)
        {
         var t,_,value;
         t=now-start;
         k(anim.Compute.call(null,t));
         if(t<=dur)
          {
           value=requestAnimationFrame(function(t1)
           {
            return loop(start,t1);
           });
           _=void value;
          }
         else
          {
           _=ok(null);
          }
         return _;
        };
        value1=requestAnimationFrame(function(t)
        {
         return loop(t,t);
        });
        return;
       };
       return Concurrency.FromContinuations(arg00);
      },
      Simple:function(inter,easing,dur,x,y)
      {
       return{
        Compute:function(t)
        {
         var t1;
         t1=easing.TransformTime.call(null,t/dur);
         return inter.Interpolate(t1,x,y);
        },
        Duration:dur
       };
      },
      WhenDone:function(f,main)
      {
       var arg00;
       arg00=Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:0,
         $0:f
        })
       });
       return An.Append(arg00,main);
      },
      get_Empty:function()
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Empty()
       });
      }
     }),
     AnimatedAttrNode:Runtime.Class({
      GetChangeAnim:function(parent)
      {
       var matchValue,arg00,a=this,arg10,_,_1,_2,l,v,arg001,arg002,arg101,x;
       matchValue=[this.visible,this.logical];
       arg00=function()
       {
        return a.sync(parent);
       };
       if(matchValue[0].$==1)
        {
         if(matchValue[1].$==1)
          {
           matchValue[0].$0;
           matchValue[1].$0;
           if(a.dirty)
            {
             l=matchValue[1].$0;
             v=matchValue[0].$0;
             arg001=a.tr;
             arg002=function(v1)
             {
              return a.pushVisible(parent,v1);
             };
             arg101=Trans.AnimateChange(arg001,v,l);
             x=An.Map(arg002,arg101);
             _2=An.Pack(x);
            }
           else
            {
             _2=An.get_Empty();
            }
           _1=_2;
          }
         else
          {
           _1=An.get_Empty();
          }
         _=_1;
        }
       else
        {
         _=An.get_Empty();
        }
       arg10=_;
       return An.WhenDone(arg00,arg10);
      },
      GetEnterAnim:function(parent)
      {
       var matchValue,arg00,a=this,arg10,_,_1,_2,lo,vi,arg001,arg002,arg101,x,_3,_4,lo1,arg003,arg004,arg102,x1,_5,_6,lo2,arg005,arg006,arg103,x2,_7,_8,lo3,arg007,arg008,arg104,x3;
       matchValue=[this.visible,this.logical];
       arg00=function()
       {
        return a.sync(parent);
       };
       if(matchValue[0].$==1)
        {
         if(matchValue[1].$==1)
          {
           matchValue[0].$0;
           matchValue[1].$0;
           if(a.dirty)
            {
             lo=matchValue[1].$0;
             vi=matchValue[0].$0;
             arg001=a.tr;
             arg002=function(v)
             {
              return a.pushVisible(parent,v);
             };
             arg101=Trans.AnimateChange(arg001,vi,lo);
             x=An.Map(arg002,arg101);
             _2=An.Pack(x);
            }
           else
            {
             if(matchValue[0].$==0)
              {
               if(matchValue[1].$==1)
                {
                 lo1=matchValue[1].$0;
                 arg003=a.tr;
                 arg004=function(v)
                 {
                  return a.pushVisible(parent,v);
                 };
                 arg102=Trans.AnimateEnter(arg003,lo1);
                 x1=An.Map(arg004,arg102);
                 _4=An.Pack(x1);
                }
               else
                {
                 _4=An.get_Empty();
                }
               _3=_4;
              }
             else
              {
               _3=An.get_Empty();
              }
             _2=_3;
            }
           _1=_2;
          }
         else
          {
           if(matchValue[0].$==0)
            {
             if(matchValue[1].$==1)
              {
               lo2=matchValue[1].$0;
               arg005=a.tr;
               arg006=function(v)
               {
                return a.pushVisible(parent,v);
               };
               arg103=Trans.AnimateEnter(arg005,lo2);
               x2=An.Map(arg006,arg103);
               _6=An.Pack(x2);
              }
             else
              {
               _6=An.get_Empty();
              }
             _5=_6;
            }
           else
            {
             _5=An.get_Empty();
            }
           _1=_5;
          }
         _=_1;
        }
       else
        {
         if(matchValue[0].$==0)
          {
           if(matchValue[1].$==1)
            {
             lo3=matchValue[1].$0;
             arg007=a.tr;
             arg008=function(v)
             {
              return a.pushVisible(parent,v);
             };
             arg104=Trans.AnimateEnter(arg007,lo3);
             x3=An.Map(arg008,arg104);
             _8=An.Pack(x3);
            }
           else
            {
             _8=An.get_Empty();
            }
           _7=_8;
          }
         else
          {
           _7=An.get_Empty();
          }
         _=_7;
        }
       arg10=_;
       return An.WhenDone(arg00,arg10);
      },
      GetExitAnim:function(parent)
      {
       var matchValue,arg00,a=this,arg10,_,cur,arg001,arg002,arg101,x;
       matchValue=this.visible;
       arg00=function()
       {
        a.dirty=true;
        a.visible={
         $:0
        };
        return;
       };
       if(matchValue.$==1)
        {
         cur=matchValue.$0;
         arg001=a.tr;
         arg002=function(v)
         {
          return a.pushVisible(parent,v);
         };
         arg101=Trans.AnimateExit(arg001,cur);
         x=An.Map(arg002,arg101);
         _=An.Pack(x);
        }
       else
        {
         _=An.get_Empty();
        }
       arg10=_;
       return An.WhenDone(arg00,arg10);
      },
      Init:function()
      {
       return null;
      },
      Sync:function()
      {
       return null;
      },
      get_Changed:function()
      {
       return this.updates;
      },
      pushVisible:function(el,v)
      {
       this.visible={
        $:1,
        $0:v
       };
       this.dirty=true;
       return(this.push.call(null,el))(v);
      },
      sync:function(p)
      {
       var _;
       if(this.dirty)
        {
         Option.iter(this.push.call(null,p),this.logical);
         this.visible=this.logical;
         _=void(this.dirty=false);
        }
       else
        {
         _=null;
        }
       return _;
      }
     },{
      New:function(tr,view,push)
      {
       var r,arg00;
       r=Runtime.New(this,{});
       r.tr=tr;
       r.push=push;
       r.logical={
        $:0
       };
       r.visible={
        $:0
       };
       r.dirty=true;
       arg00=function(x)
       {
        r.logical={
         $:1,
         $0:x
        };
        r.dirty=true;
        return;
       };
       r.updates=View.Map(arg00,view);
       return r;
      }
     }),
     Anims:{
      Actions:function(_arg1)
      {
       var all,chooser,array,xs;
       all=_arg1.$0;
       chooser=function(_arg2)
       {
        var _,w;
        if(_arg2.$==1)
         {
          w=_arg2.$0;
          _={
           $:1,
           $0:w
          };
         }
        else
         {
          _={
           $:0
          };
         }
        return _;
       };
       array=AppendList1.ToArray(all);
       xs=Arrays.choose(chooser,array);
       return Anims.ConcatActions(xs);
      },
      ConcatActions:function(xs)
      {
       var xs1,matchValue,_,mapping,source,dur,xs2;
       xs1=Seq.toArray(xs);
       matchValue=Arrays.length(xs1);
       if(matchValue===0)
        {
         _=Anims.Const(null);
        }
       else
        {
         if(matchValue===1)
          {
           _=Arrays.get(xs1,0);
          }
         else
          {
           mapping=function(anim)
           {
            return anim.Duration;
           };
           source=Seq.map(mapping,xs1);
           dur=Seq.max(source);
           xs2=Arrays.map(function(anim)
           {
            return Anims.Prolong(dur,anim);
           },xs1);
           _=Anims.Def(dur,function(t)
           {
            return Arrays.iter(function(anim)
            {
             return anim.Compute.call(null,t);
            },xs2);
           });
          }
        }
       return _;
      },
      Const:function(v)
      {
       return Anims.Def(0,function()
       {
        return v;
       });
      },
      Def:function(d,f)
      {
       return{
        Compute:f,
        Duration:d
       };
      },
      Finalize:function(_arg1)
      {
       var all,action,array;
       all=_arg1.$0;
       action=function(_arg2)
       {
        var _,f;
        if(_arg2.$==0)
         {
          f=_arg2.$0;
          _=f(null);
         }
        else
         {
          _=null;
         }
        return _;
       };
       array=AppendList1.ToArray(all);
       return Arrays.iter(action,array);
      },
      List:function(_arg1)
      {
       var xs;
       xs=_arg1.$0;
       return xs;
      },
      Prolong:function(nextDuration,anim)
      {
       var comp,dur,last,compute;
       comp=anim.Compute;
       dur=anim.Duration;
       last=Lazy.Create(function()
       {
        return anim.Compute.call(null,anim.Duration);
       });
       compute=function(t)
       {
        return t>=dur?last.eval():comp(t);
       };
       return{
        Compute:compute,
        Duration:nextDuration
       };
      }
     },
     AppendList1:{
      Append:function(x,y)
      {
       var matchValue,_,x1,_1,x2;
       matchValue=[x,y];
       if(matchValue[0].$==0)
        {
         x1=matchValue[1];
         _=x1;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           x2=matchValue[0];
           _1=x2;
          }
         else
          {
           _1={
            $:2,
            $0:x,
            $1:y
           };
          }
         _=_1;
        }
       return _;
      },
      Concat:function(xs)
      {
       var x,f,z,re;
       x=Seq.toArray(xs);
       f=function(x1)
       {
        return x1;
       };
       z=AppendList1.Empty();
       re=function(_arg00_)
       {
        return function(_arg10_)
        {
         return AppendList1.Append(_arg00_,_arg10_);
        };
       };
       return Array1.MapTreeReduce(f,z,re,x);
      },
      Empty:function()
      {
       return{
        $:0
       };
      },
      FromArray:function(xs)
      {
       var matchValue;
       matchValue=xs.length;
       return matchValue===0?{
        $:0
       }:matchValue===1?{
        $:1,
        $0:Arrays.get(xs,0)
       }:{
        $:3,
        $0:xs.slice()
       };
      },
      Single:function(x)
      {
       return{
        $:1,
        $0:x
       };
      },
      ToArray:function(xs)
      {
       var out,loop;
       out=[];
       loop=function(xs1)
       {
        var _,x,y,x1,xs2;
        if(xs1.$==1)
         {
          x=xs1.$0;
          _=out.push(x);
         }
        else
         {
          if(xs1.$==2)
           {
            y=xs1.$1;
            x1=xs1.$0;
            loop(x1);
            _=loop(y);
           }
          else
           {
            if(xs1.$==3)
             {
              xs2=xs1.$0;
              _=Arrays.iter(function(v)
              {
               return out.push(v);
              },xs2);
             }
            else
             {
              _=null;
             }
           }
         }
        return _;
       };
       loop(xs);
       return out.slice(0);
      }
     },
     Array:{
      MapTreeReduce:function(f,z,re,a)
      {
       var loop;
       loop=function(off,len)
       {
        var _,_1,_2,l2,a1,b,l21,a2,b1;
        if(len<=0)
         {
          _=z;
         }
        else
         {
          if(len===1)
           {
            if(off>=0?off<Arrays.length(a):false)
             {
              _2=f(Arrays.get(a,off));
             }
            else
             {
              l2=len/2>>0;
              a1=loop(off,l2);
              b=loop(off+l2,len-l2);
              _2=(re(a1))(b);
             }
            _1=_2;
           }
          else
           {
            l21=len/2>>0;
            a2=loop(off,l21);
            b1=loop(off+l21,len-l21);
            _1=(re(a2))(b1);
           }
          _=_1;
         }
        return _;
       };
       return loop(0,Arrays.length(a));
      }
     },
     AttrModule:{
      Animated:function(name,tr,view,attr)
      {
       return Attrs.Animated(tr,view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetAttr(el,name,attr(v));
        };
       });
      },
      AnimatedStyle:function(name,tr,view,attr)
      {
       return Attrs.Animated(tr,view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetStyle(el,name,attr(v));
        };
       });
      },
      Class:function(name)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.AddClass(el,name);
       });
      },
      ContentEditableHtml:function(_var)
      {
       var x,arg00;
       x=AttrModule.CustomVar(_var,function(e)
       {
        return function(v)
        {
         e.innerHTML=v;
        };
       },function(e)
       {
        return{
         $:1,
         $0:e.innerHTML
        };
       });
       arg00=AttrProxy.Create("contenteditable","true");
       return AttrProxy.Append(arg00,x);
      },
      ContentEditableText:function(_var)
      {
       var x,arg00;
       x=AttrModule.CustomVar(_var,function(e)
       {
        return function(v)
        {
         e.textContent=v;
        };
       },function(e)
       {
        return{
         $:1,
         $0:e.textContent
        };
       });
       arg00=AttrProxy.Create("contenteditable","true");
       return AttrProxy.Append(arg00,x);
      },
      CustomValue:function(_var,toString,fromString)
      {
       return AttrModule.CustomVar(_var,function(e)
       {
        return function(v)
        {
         e.value=toString(v);
        };
       },function(e)
       {
        return fromString(e.value);
       });
      },
      CustomVar:function(_var,set,get)
      {
       var onChange,set1;
       onChange=function(el)
       {
        return function()
        {
         return _var.UpdateMaybe(function(v)
         {
          var matchValue,_,x,_1;
          matchValue=get(el);
          if(matchValue.$==1)
           {
            x=matchValue.$0;
            if(!Unchecked.Equals(x,v))
             {
              matchValue.$0;
              _1=matchValue;
             }
            else
             {
              _1={
               $:0
              };
             }
            _=_1;
           }
          else
           {
            _={
             $:0
            };
           }
          return _;
         });
        };
       };
       set1=function(e)
       {
        return function(v)
        {
         var matchValue,_,x,_1;
         matchValue=get(e);
         if(matchValue.$==1)
          {
           x=matchValue.$0;
           if(Unchecked.Equals(x,v))
            {
             matchValue.$0;
             _1=null;
            }
           else
            {
             _1=(set(e))(v);
            }
           _=_1;
          }
         else
          {
           _=(set(e))(v);
          }
         return _;
        };
       };
       return AttrProxy.Concat(List.ofArray([AttrModule.Handler("change",onChange),AttrModule.Handler("input",onChange),AttrModule.Handler("keypress",onChange),AttrModule.DynamicCustom(set1,_var.get_View())]));
      },
      Dynamic:function(name,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         return DomUtility.SetAttr(el,name,v);
        };
       });
      },
      DynamicClass:function(name,view,ok)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         return ok(v)?DomUtility.AddClass(el,name):DomUtility.RemoveClass(el,name);
        };
       });
      },
      DynamicCustom:function(set,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },set);
      },
      DynamicPred:function(name,predView,valView)
      {
       var viewFn,arg00,tupleView;
       viewFn=function(el)
       {
        return function(tupledArg)
        {
         var p,v;
         p=tupledArg[0];
         v=tupledArg[1];
         return p?DomUtility.SetAttr(el,name,v):DomUtility.RemoveAttr(el,name);
        };
       };
       arg00=function(pred)
       {
        return function(value)
        {
         return[pred,value];
        };
       };
       tupleView=View.Map2(arg00,predView,valView);
       return Attrs.Dynamic(tupleView,function()
       {
       },viewFn);
      },
      DynamicProp:function(name,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         el[name]=v;
        };
       });
      },
      DynamicStyle:function(name,view)
      {
       return Attrs.Dynamic(view,function()
       {
       },function(el)
       {
        return function(v)
        {
         return DomUtility.SetStyle(el,name,v);
        };
       });
      },
      Handler:function(name,callback)
      {
       return Attrs.Static(function(el)
       {
        return el.addEventListener(name,callback(el),false);
       });
      },
      HandlerView:function(name,view,callback)
      {
       var id,init,cb;
       id=Fresh.Id();
       init=function(el)
       {
        var callback1;
        callback1=callback(el);
        return el.addEventListener(name,function(ev)
        {
         return(callback1(ev))(el[id]);
        },false);
       };
       cb=function(el)
       {
        return function(x)
        {
         el[id]=x;
        };
       };
       return Attrs.Dynamic(view,init,cb);
      },
      OnAfterRender:function(callback)
      {
       return Attrs.Mk(0,{
        $:4,
        $0:callback
       });
      },
      OnAfterRenderView:function(v,callback)
      {
       var id,arg00,arg10;
       id=Fresh.Id();
       arg00=AttrModule.OnAfterRender(function(el)
       {
        return(callback(el))(el[id]);
       });
       arg10=AttrModule.DynamicCustom(function(el)
       {
        return function(x)
        {
         el[id]=x;
        };
       },v);
       return AttrProxy.Append(arg00,arg10);
      },
      Style:function(name,value)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.SetStyle(el,name,value);
       });
      },
      ValidateForm:function()
      {
       return AttrModule.OnAfterRender(function(e)
       {
        return Global.H5F?Global.H5F.setup(e):undefined;
       });
      },
      Value:function(_var)
      {
       return AttrModule.CustomValue(_var,function(x)
       {
        return x;
       },function(x)
       {
        return{
         $:1,
         $0:x
        };
       });
      }
     },
     AttrProxy:Runtime.Class({},{
      Append:function(a,b)
      {
       return Attrs.Mk(a.Flags|b.Flags,Attrs.AppendTree(a.Tree,b.Tree));
      },
      Concat:function(xs)
      {
       var x,f,z,re;
       x=Seq.toArray(xs);
       f=function(x1)
       {
        return x1;
       };
       z=AttrProxy.get_Empty();
       re=function(arg00)
       {
        return function(arg10)
        {
         return AttrProxy.Append(arg00,arg10);
        };
       };
       return Array1.MapTreeReduce(f,z,re,x);
      },
      Create:function(name,value)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.SetAttr(el,name,value);
       });
      },
      Handler:function(event,q)
      {
       return Attrs.Static(function(el)
       {
        return el.addEventListener(event,q(el),false);
       });
      },
      get_Empty:function()
      {
       return Attrs.EmptyAttr();
      }
     }),
     Attrs:{
      Animated:function(tr,view,set)
      {
       var node,flags;
       node=AnimatedAttrNode.New(tr,view,set);
       flags=4;
       Trans1.CanAnimateEnter(tr)?flags=flags|1:null;
       Trans1.CanAnimateExit(tr)?flags=flags|2:null;
       return Attrs.Mk(flags,{
        $:1,
        $0:node
       });
      },
      AppendTree:function(a,b)
      {
       var matchValue,_,x,_1,x1;
       matchValue=[a,b];
       if(matchValue[0].$==0)
        {
         x=matchValue[1];
         _=x;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           x1=matchValue[0];
           _1=x1;
          }
         else
          {
           _1={
            $:2,
            $0:a,
            $1:b
           };
          }
         _=_1;
        }
       return _;
      },
      Dynamic:function(view,init,set)
      {
       var tree;
       tree={
        $:1,
        $0:DynamicAttrNode.New(view,init,set)
       };
       return Attrs.Mk(0,tree);
      },
      EmptyAttr:Runtime.Field(function()
      {
       return Attrs.Mk(0,{
        $:0
       });
      }),
      GetAnim:function(dyn,f)
      {
       var mapping,array,arg00;
       mapping=function(n)
       {
        return(f(n))(dyn.DynElem);
       };
       array=dyn.DynNodes;
       arg00=Arrays.map(mapping,array);
       return An.Concat(arg00);
      },
      GetChangeAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetChangeAnim(arg00);
        };
       });
      },
      GetEnterAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetEnterAnim(arg00);
        };
       });
      },
      GetExitAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetExitAnim(arg00);
        };
       });
      },
      HasChangeAnim:function(attr)
      {
       return(attr.DynFlags&4)!==0;
      },
      HasEnterAnim:function(attr)
      {
       return(attr.DynFlags&1)!==0;
      },
      HasExitAnim:function(attr)
      {
       return(attr.DynFlags&2)!==0;
      },
      Insert:function(elem,tree)
      {
       var nodes,oar,loop,arr;
       nodes=[];
       oar=[];
       loop=function(node)
       {
        var _,n,b,a,mk,cb;
        if(node.$==1)
         {
          n=node.$0;
          n.Init(elem);
          _=nodes.push(n);
         }
        else
         {
          if(node.$==2)
           {
            b=node.$1;
            a=node.$0;
            loop(a);
            _=loop(b);
           }
          else
           {
            if(node.$==3)
             {
              mk=node.$0;
              _=mk(elem);
             }
            else
             {
              if(node.$==4)
               {
                cb=node.$0;
                _=oar.push(cb);
               }
              else
               {
                _=null;
               }
             }
           }
         }
        return _;
       };
       loop(tree.Tree);
       arr=nodes.slice(0);
       return Runtime.DeleteEmptyFields({
        DynElem:elem,
        DynFlags:tree.Flags,
        DynNodes:arr,
        OnAfterRender:(oar.length===0?{
         $:0
        }:{
         $:1,
         $0:function(el)
         {
          return Seq.iter(function(f)
          {
           return f(el);
          },oar);
         }
        }).$0
       },["OnAfterRender"]);
      },
      Mk:function(flags,tree)
      {
       return Runtime.New(AttrProxy,{
        Flags:flags,
        Tree:tree
       });
      },
      Static:function(attr)
      {
       return Attrs.Mk(0,{
        $:3,
        $0:attr
       });
      },
      Sync:function(elem,dyn)
      {
       var action,array;
       action=function(d)
       {
        return d.Sync(elem);
       };
       array=dyn.DynNodes;
       return Arrays.iter(action,array);
      },
      Updates:function(dyn)
      {
       var p,x1,f,z;
       p=function(x)
       {
        return function(y)
        {
         var arg00;
         arg00=function()
         {
          return function()
          {
           return null;
          };
         };
         return View.Map2(arg00,x,y);
        };
       };
       x1=dyn.DynNodes;
       f=function(x)
       {
        return x.get_Changed();
       };
       z=View1.Const(null);
       return Array1.MapTreeReduce(f,z,p,x1);
      }
     },
     CheckedInput:Runtime.Class({
      get_Input:function()
      {
       var _,x,x1,x2;
       if(this.$==1)
        {
         x=this.$0;
         _=x;
        }
       else
        {
         if(this.$==2)
          {
           x1=this.$0;
           _=x1;
          }
         else
          {
           x2=this.$1;
           _=x2;
          }
        }
       return _;
      }
     }),
     Doc:Runtime.Class({
      ReplaceInDom:function(elt)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=elt.parentNode.replaceChild(rdelim,elt);
       return Doc.RunBefore(rdelim,this);
      },
      get_DocNode:function()
      {
       return this.docNode;
      },
      get_Updates:function()
      {
       return this.updates;
      }
     },{
      Append:function(a,b)
      {
       var arg00,arg10,arg20,x,arg001;
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg10=a.get_Updates();
       arg20=b.get_Updates();
       x=View.Map2(arg00,arg10,arg20);
       arg001={
        $:0,
        $0:a.get_DocNode(),
        $1:b.get_DocNode()
       };
       return Doc.Mk(arg001,x);
      },
      Async:function(a)
      {
       var arg00,arg10,arg001;
       arg00=function(x)
       {
        return x;
       };
       arg10=View1.Const(a);
       arg001=View.MapAsync(arg00,arg10);
       return Doc.EmbedView(arg001);
      },
      BindView:function(f,view)
      {
       return Doc.EmbedView(View.Map(f,view));
      },
      Button:function(caption,attrs,action)
      {
       var attrs1,el,arg20;
       attrs1=AttrProxy.Concat(attrs);
       el=Doc.Clickable("button",action);
       arg20=Doc.TextNode(caption);
       return Elt.New(el,attrs1,arg20);
      },
      ButtonView:function(caption,attrs,view,action)
      {
       var evAttr,attrs1,arg00,arg20;
       evAttr=AttrModule.HandlerView("click",view,function()
       {
        return function()
        {
         return action;
        };
       });
       attrs1=AttrProxy.Concat(Seq.append([evAttr],attrs));
       arg00=DomUtility.CreateElement("button");
       arg20=Doc.TextNode(caption);
       return Elt.New(arg00,attrs1,arg20);
      },
      CheckBox:function(attrs,chk)
      {
       var el,onClick,attrs1,arg20;
       el=DomUtility.CreateElement("input");
       onClick=function()
       {
        return chk.Set(el.checked);
       };
       el.addEventListener("click",onClick,false);
       attrs1=AttrProxy.Concat(Seq.toList(Seq.delay(function()
       {
        return Seq.append(attrs,Seq.delay(function()
        {
         return Seq.append([AttrProxy.Create("type","checkbox")],Seq.delay(function()
         {
          return[AttrModule.DynamicProp("checked",chk.get_View())];
         }));
        }));
       })));
       arg20=Doc.get_Empty();
       return Elt.New(el,attrs1,arg20);
      },
      CheckBoxGroup:function(attrs,item,chk)
      {
       var rvi,updateList,predicate,arg00,checkedView,arg001,arg10,arg101,attrs1,el,onClick,arg20;
       rvi=chk.get_View();
       updateList=function(chkd)
       {
        return chk.Update(function(obs)
        {
         var obs1,source;
         obs1=chkd?List.append(obs,List.ofArray([item])):List.filter(function(x)
         {
          return!Unchecked.Equals(x,item);
         },obs);
         source=Seq1.distinct(obs1);
         return Seq.toList(source);
        });
       };
       predicate=function(x)
       {
        return Unchecked.Equals(x,item);
       };
       arg00=function(list)
       {
        return Seq.exists(predicate,list);
       };
       checkedView=View.Map(arg00,rvi);
       arg10=chk.get_Id();
       arg101=Fresh.Id();
       arg001=List.append(List.ofArray([AttrProxy.Create("type","checkbox"),AttrProxy.Create("name",arg10),AttrProxy.Create("value",arg101),AttrModule.DynamicProp("checked",checkedView)]),List.ofSeq(attrs));
       attrs1=AttrProxy.Concat(arg001);
       el=DomUtility.CreateElement("input");
       onClick=function()
       {
        var chkd;
        chkd=el.checked;
        return updateList(chkd);
       };
       el.addEventListener("click",onClick,false);
       arg20=Doc.get_Empty();
       return Elt.New(el,attrs1,arg20);
      },
      Clickable:function(elem,action)
      {
       var el;
       el=DomUtility.CreateElement(elem);
       el.addEventListener("click",function(ev)
       {
        ev.preventDefault();
        return action(null);
       },false);
       return el;
      },
      Concat:function(xs)
      {
       var x,f,z,re;
       x=Seq.toArray(xs);
       f=function(x1)
       {
        return x1;
       };
       z=Doc.get_Empty();
       re=function(arg00)
       {
        return function(arg10)
        {
         return Doc.Append(arg00,arg10);
        };
       };
       return Array1.MapTreeReduce(f,z,re,x);
      },
      Convert:function(render,view)
      {
       var arg00;
       arg00=View.MapSeqCached(render,view);
       return Doc.Flatten(arg00);
      },
      ConvertBy:function(key,render,view)
      {
       var arg00;
       arg00=View.MapSeqCachedBy(key,render,view);
       return Doc.Flatten(arg00);
      },
      ConvertSeq:function(render,view)
      {
       var arg00;
       arg00=View.MapSeqCachedView(render,view);
       return Doc.Flatten(arg00);
      },
      ConvertSeqBy:function(key,render,view)
      {
       var arg00;
       arg00=View.MapSeqCachedViewBy(key,render,view);
       return Doc.Flatten(arg00);
      },
      Element:function(name,attr,children)
      {
       var attr1,children1,arg00;
       attr1=AttrProxy.Concat(attr);
       children1=Doc.Concat(children);
       arg00=DomUtility.CreateElement(name);
       return Elt.New(arg00,attr1,children1);
      },
      EmbedView:function(view)
      {
       var node,arg00,arg001,arg10,x,arg002;
       node=Docs.CreateEmbedNode();
       arg00=function(doc)
       {
        Docs.UpdateEmbedNode(node,doc.get_DocNode());
        return doc.get_Updates();
       };
       arg001=function()
       {
       };
       arg10=View1.Bind(arg00,view);
       x=View.Map(arg001,arg10);
       arg002={
        $:2,
        $0:node
       };
       return Doc.Mk(arg002,x);
      },
      Flatten:function(view)
      {
       var arg00,arg002;
       arg00=function(arg001)
       {
        return Doc.Concat(arg001);
       };
       arg002=View.Map(arg00,view);
       return Doc.EmbedView(arg002);
      },
      FloatInput:function(attr,_var)
      {
       var parseCheckedFloat,arg10;
       parseCheckedFloat=function(el)
       {
        return function(s)
        {
         var arg0,_,i;
         if(String.isBlank(s))
          {
           _=(el.checkValidity?el.checkValidity():true)?Runtime.New(CheckedInput,{
            $:2,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:1,
            $0:s
           });
          }
         else
          {
           i=+s;
           _=Global.isNaN(i)?Runtime.New(CheckedInput,{
            $:1,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:0,
            $0:i,
            $1:s
           });
          }
         arg0=_;
         return{
          $:1,
          $0:arg0
         };
        };
       };
       arg10=function(el)
       {
        return Seq.append(attr,[AttrModule.CustomValue(_var,function(i)
        {
         return i.get_Input();
        },parseCheckedFloat(el)),AttrProxy.Create("type","number")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      FloatInputUnchecked:function(attr,_var)
      {
       var parseFloat,arg10;
       parseFloat=function(s)
       {
        var _,pd;
        if(String.isBlank(s))
         {
          _={
           $:1,
           $0:0
          };
         }
        else
         {
          pd=+s;
          _=Global.isNaN(pd)?{
           $:0
          }:{
           $:1,
           $0:pd
          };
         }
        return _;
       };
       arg10=function()
       {
        return Seq.append(attr,[_var.Get()===0?AttrProxy.Create("value","0"):AttrProxy.get_Empty(),AttrModule.CustomValue(_var,function(value)
        {
         return Global.String(value);
        },parseFloat),AttrProxy.Create("type","number")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      Input:function(attr,_var)
      {
       var arg10;
       arg10=function()
       {
        return Seq.append(attr,[AttrModule.Value(_var)]);
       };
       return Doc.InputInternal("input",arg10);
      },
      InputArea:function(attr,_var)
      {
       var arg10;
       arg10=function()
       {
        return Seq.append(attr,[AttrModule.Value(_var)]);
       };
       return Doc.InputInternal("textarea",arg10);
      },
      InputInternal:function(elemTy,attr)
      {
       var el,arg10,arg20;
       el=DomUtility.CreateElement(elemTy);
       arg10=AttrProxy.Concat(attr(el));
       arg20=Doc.get_Empty();
       return Elt.New(el,arg10,arg20);
      },
      IntInput:function(attr,_var)
      {
       var parseCheckedInt,arg10;
       parseCheckedInt=function(el)
       {
        return function(s)
        {
         var arg0,_,i;
         if(String.isBlank(s))
          {
           _=(el.checkValidity?el.checkValidity():true)?Runtime.New(CheckedInput,{
            $:2,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:1,
            $0:s
           });
          }
         else
          {
           i=+s;
           _=Global.isNaN(i)?Runtime.New(CheckedInput,{
            $:1,
            $0:s
           }):Runtime.New(CheckedInput,{
            $:0,
            $0:i,
            $1:s
           });
          }
         arg0=_;
         return{
          $:1,
          $0:arg0
         };
        };
       };
       arg10=function(el)
       {
        return Seq.append(attr,[AttrModule.CustomValue(_var,function(i)
        {
         return i.get_Input();
        },parseCheckedInt(el)),AttrProxy.Create("type","number"),AttrProxy.Create("step","1")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      IntInputUnchecked:function(attr,_var)
      {
       var parseInt,arg10;
       parseInt=function(s)
       {
        var _,pd;
        if(String.isBlank(s))
         {
          _={
           $:1,
           $0:0
          };
         }
        else
         {
          pd=+s;
          _=pd!==pd>>0?{
           $:0
          }:{
           $:1,
           $0:pd
          };
         }
        return _;
       };
       arg10=function()
       {
        return Seq.append(attr,[_var.Get()===0?AttrProxy.Create("value","0"):AttrProxy.get_Empty(),AttrModule.CustomValue(_var,function(value)
        {
         return Global.String(value);
        },parseInt),AttrProxy.Create("type","number"),AttrProxy.Create("step","1")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      Link:function(caption,attrs,action)
      {
       var x,arg00,attrs1,el,arg20;
       x=AttrProxy.Concat(attrs);
       arg00=AttrProxy.Create("href","#");
       attrs1=AttrProxy.Append(arg00,x);
       el=Doc.Clickable("a",action);
       arg20=Doc.TextNode(caption);
       return Elt.New(el,attrs1,arg20);
      },
      LinkView:function(caption,attrs,view,action)
      {
       var evAttr,attrs1,arg00,arg20;
       evAttr=AttrModule.HandlerView("click",view,function()
       {
        return function()
        {
         return action;
        };
       });
       attrs1=AttrProxy.Concat(Seq.append([evAttr,AttrProxy.Create("href","#")],attrs));
       arg00=DomUtility.CreateElement("a");
       arg20=Doc.TextNode(caption);
       return Elt.New(arg00,attrs1,arg20);
      },
      Mk:function(node,updates)
      {
       return Doc.New(node,updates);
      },
      New:function(docNode,updates)
      {
       var r;
       r=Runtime.New(this,{});
       r.docNode=docNode;
       r.updates=updates;
       return r;
      },
      PasswordBox:function(attr,_var)
      {
       var arg10;
       arg10=function()
       {
        return Seq.append(attr,[AttrModule.Value(_var),AttrProxy.Create("type","password")]);
       };
       return Doc.InputInternal("input",arg10);
      },
      Radio:function(attrs,value,_var)
      {
       var el,arg00,arg10,predView,valAttr,op_EqualsEqualsGreater,arg001,attr,arg20;
       el=DomUtility.CreateElement("input");
       el.addEventListener("click",function()
       {
        return _var.Set(value);
       },false);
       arg00=function(x)
       {
        return Unchecked.Equals(x,value);
       };
       arg10=_var.get_View();
       predView=View.Map(arg00,arg10);
       valAttr=AttrModule.DynamicProp("checked",predView);
       op_EqualsEqualsGreater=function(k,v)
       {
        return AttrProxy.Create(k,v);
       };
       arg001=List.append(List.ofArray([op_EqualsEqualsGreater("type","radio"),op_EqualsEqualsGreater("name",_var.get_Id()),valAttr]),List.ofSeq(attrs));
       attr=AttrProxy.Concat(arg001);
       arg20=Doc.get_Empty();
       return Elt.New(el,attr,arg20);
      },
      Run:function(parent,doc)
      {
       var d,st,p,arg10;
       d=doc.get_DocNode();
       Docs.LinkElement(parent,d);
       st=Docs.CreateRunState(parent,d);
       p=Mailbox.StartProcessor(function()
       {
        return Docs.PerformAnimatedUpdate(st,d);
       });
       arg10=doc.get_Updates();
       return View1.Sink(p,arg10);
      },
      RunAfter:function(ldelim,doc)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=ldelim.parentNode.insertBefore(rdelim,ldelim.nextSibling);
       return Doc.RunBetween(ldelim,rdelim,doc);
      },
      RunAfterById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunAfter(matchValue,doc);
      },
      RunAppend:function(parent,doc)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=parent.appendChild(rdelim);
       return Doc.RunBefore(rdelim,doc);
      },
      RunAppendById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunAppend(matchValue,doc);
      },
      RunBefore:function(rdelim,doc)
      {
       var ldelim,value;
       ldelim=document.createTextNode("");
       value=rdelim.parentNode.insertBefore(ldelim,rdelim);
       return Doc.RunBetween(ldelim,rdelim,doc);
      },
      RunBeforeById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunBefore(matchValue,doc);
      },
      RunBetween:function(ldelim,rdelim,doc)
      {
       var st,p,arg10;
       Docs.LinkPrevElement(rdelim,doc.get_DocNode());
       st=Docs.CreateDelimitedRunState(ldelim,rdelim,doc.get_DocNode());
       p=Mailbox.StartProcessor(function()
       {
        return Docs.PerformAnimatedUpdate(st,doc.get_DocNode());
       });
       arg10=doc.get_Updates();
       return View1.Sink(p,arg10);
      },
      RunById:function(id,tr)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.Run(matchValue,tr);
      },
      RunPrepend:function(parent,doc)
      {
       var rdelim,value;
       rdelim=document.createTextNode("");
       value=parent.insertBefore(rdelim,parent.firstChild);
       return Doc.RunBefore(rdelim,doc);
      },
      RunPrependById:function(id,doc)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.RunPrepend(matchValue,doc);
      },
      Select:function(attrs,show,options,current)
      {
       var arg20;
       arg20=View1.Const(options);
       return Doc.SelectDyn(attrs,show,arg20,current);
      },
      SelectDyn:function(attrs,show,vOptions,current)
      {
       var options,getIndex,getSelectedItem,itemIndex,setSelectedItem,el1,value,selectedItemAttr,onChange,arg00,x2,arg001,optionElements,arg102,x3,arg002,attrs1;
       options=[Runtime.New(T,{
        $:0
       })];
       getIndex=function(el)
       {
        return el.selectedIndex;
       };
       getSelectedItem=function(el)
       {
        var i;
        i=getIndex(el);
        return options[0].get_Item(i);
       };
       itemIndex=function(x)
       {
        return Seq.findIndex(function(y)
        {
         return Unchecked.Equals(x,y);
        },options[0]);
       };
       setSelectedItem=function(el)
       {
        return function(item)
        {
         var i;
         i=itemIndex(item);
         el.selectedIndex=i;
         return;
        };
       };
       el1=DomUtility.CreateElement("select");
       value=current.get_View();
       selectedItemAttr=AttrModule.DynamicCustom(setSelectedItem,value);
       onChange=function()
       {
        return current.UpdateMaybe(function(x1)
        {
         var y;
         y=getSelectedItem(el1);
         return Unchecked.Equals(x1,y)?{
          $:0
         }:{
          $:1,
          $0:y
         };
        });
       };
       el1.addEventListener("change",onChange,false);
       arg00=function(l)
       {
        var mapping;
        options[0]=l;
        mapping=function(i)
        {
         return function(x)
         {
          return[i,x];
         };
        };
        return Seq.mapi(mapping,l);
       };
       x2=View.Map(arg00,vOptions);
       arg001=function(tupledArg)
       {
        var i,o,t,arg10,arg101,arg20;
        i=tupledArg[0];
        o=tupledArg[1];
        t=Doc.TextNode(show(o));
        arg101=Global.String(i);
        arg10=List.ofArray([AttrProxy.Create("value",arg101)]);
        arg20=List.ofArray([t]);
        return Doc.Element("option",arg10,arg20);
       };
       optionElements=Doc.Convert(arg001,x2);
       arg102=AttrProxy.Concat(attrs);
       x3=AttrProxy.Append(selectedItemAttr,arg102);
       arg002=AttrModule.OnAfterRender(function(el)
       {
        return(setSelectedItem(el))(current.Get());
       });
       attrs1=AttrProxy.Append(arg002,x3);
       return Elt.New(el1,attrs1,optionElements);
      },
      SelectDynOptional:function(attrs,noneText,show,vOptions,current)
      {
       var arg10,arg00,arg20;
       arg10=function(_arg2)
       {
        var _,x;
        if(_arg2.$==1)
         {
          x=_arg2.$0;
          _=show(x);
         }
        else
         {
          _=noneText;
         }
        return _;
       };
       arg00=function(options)
       {
        return Runtime.New(T,{
         $:1,
         $0:{
          $:0
         },
         $1:List.map(function(arg0)
         {
          return{
           $:1,
           $0:arg0
          };
         },options)
        });
       };
       arg20=View.Map(arg00,vOptions);
       return Doc.SelectDyn(attrs,arg10,arg20,current);
      },
      SelectOptional:function(attrs,noneText,show,options,current)
      {
       var arg10,arg20;
       arg10=function(_arg1)
       {
        var _,x;
        if(_arg1.$==1)
         {
          x=_arg1.$0;
          _=show(x);
         }
        else
         {
          _=noneText;
         }
        return _;
       };
       arg20=Runtime.New(T,{
        $:1,
        $0:{
         $:0
        },
        $1:List.map(function(arg0)
        {
         return{
          $:1,
          $0:arg0
         };
        },options)
       });
       return Doc.Select(attrs,arg10,arg20,current);
      },
      Static:function(el)
      {
       var arg10,arg20;
       arg10=AttrProxy.get_Empty();
       arg20=Doc.get_Empty();
       return Elt.New(el,arg10,arg20);
      },
      SvgElement:function(name,attr,children)
      {
       var attr1,children1,arg00;
       attr1=AttrProxy.Concat(attr);
       children1=Doc.Concat(children);
       arg00=DomUtility.CreateSvgElement(name);
       return Elt.New(arg00,attr1,children1);
      },
      TextNode:function(v)
      {
       var arg00,arg10;
       arg00={
        $:5,
        $0:DomUtility.CreateText(v)
       };
       arg10=View1.Const(null);
       return Doc.Mk(arg00,arg10);
      },
      TextView:function(txt)
      {
       var node,arg00,x,arg001;
       node=Docs.CreateTextNode();
       arg00=function(t)
       {
        return Docs.UpdateTextNode(node,t);
       };
       x=View.Map(arg00,txt);
       arg001={
        $:4,
        $0:node
       };
       return Doc.Mk(arg001,x);
      },
      Verbatim:function(html)
      {
       var matchValue,a,elem,append,es,arg10;
       matchValue=jQuery.parseHTML(html);
       a=Unchecked.Equals(matchValue,null)?[]:matchValue;
       elem=function(e)
       {
        return{
         $:1,
         $0:Docs.CreateElemNode(e,AttrProxy.get_Empty(),{
          $:3
         })
        };
       };
       append=function(x)
       {
        return function(y)
        {
         return{
          $:0,
          $0:x,
          $1:y
         };
        };
       };
       es=Array1.MapTreeReduce(elem,{
        $:3
       },append,a);
       arg10=View1.Const(null);
       return Doc.Mk(es,arg10);
      },
      get_Empty:function()
      {
       var arg00,arg10;
       arg00={
        $:3
       };
       arg10=View1.Const(null);
       return Doc.Mk(arg00,arg10);
      }
     }),
     DocElemNode:Runtime.Class({
      Equals:function(o)
      {
       return this.ElKey===o.ElKey;
      },
      GetHashCode:function()
      {
       return this.ElKey;
      }
     }),
     Docs:{
      ComputeChangeAnim:function(st,cur)
      {
       var arg00,relevant,arg001,arg101,arg002,mapping,array,x;
       arg00=function(n)
       {
        return Attrs.HasChangeAnim(n.Attr);
       };
       relevant=function(arg10)
       {
        return NodeSet.Filter(arg00,arg10);
       };
       arg001=relevant(st.PreviousNodes);
       arg101=relevant(cur);
       arg002=NodeSet.Intersect(arg001,arg101);
       mapping=function(n)
       {
        return Attrs.GetChangeAnim(n.Attr);
       };
       array=NodeSet.ToArray(arg002);
       x=Arrays.map(mapping,array);
       return An.Concat(x);
      },
      ComputeEnterAnim:function(st,cur)
      {
       var arg00,arg001,arg10,arg002,mapping,array,x;
       arg00=function(n)
       {
        return Attrs.HasEnterAnim(n.Attr);
       };
       arg001=st.PreviousNodes;
       arg10=NodeSet.Filter(arg00,cur);
       arg002=NodeSet.Except(arg001,arg10);
       mapping=function(n)
       {
        return Attrs.GetEnterAnim(n.Attr);
       };
       array=NodeSet.ToArray(arg002);
       x=Arrays.map(mapping,array);
       return An.Concat(x);
      },
      ComputeExitAnim:function(st,cur)
      {
       var arg00,mapping,arg10,arg101,arg001,array,arg002;
       arg00=function(n)
       {
        return Attrs.HasExitAnim(n.Attr);
       };
       mapping=function(n)
       {
        return Attrs.GetExitAnim(n.Attr);
       };
       arg10=st.PreviousNodes;
       arg101=NodeSet.Filter(arg00,arg10);
       arg001=NodeSet.Except(cur,arg101);
       array=NodeSet.ToArray(arg001);
       arg002=Arrays.map(mapping,array);
       return An.Concat(arg002);
      },
      CreateDelimitedElemNode:function(ldelim,rdelim,attr,children)
      {
       var el,attr1;
       el=ldelim.parentNode;
       Docs.LinkPrevElement(rdelim,children);
       attr1=Attrs.Insert(el,attr);
       return Runtime.New(DocElemNode,Runtime.DeleteEmptyFields({
        Attr:attr1,
        Children:children,
        Delimiters:[ldelim,rdelim],
        El:el,
        ElKey:Fresh.Int(),
        Render:Runtime.GetOptional(attr1.OnAfterRender).$0
       },["Render"]));
      },
      CreateDelimitedRunState:function(ldelim,rdelim,doc)
      {
       return{
        PreviousNodes:NodeSet.get_Empty(),
        Top:Docs.CreateDelimitedElemNode(ldelim,rdelim,AttrProxy.get_Empty(),doc)
       };
      },
      CreateElemNode:function(el,attr,children)
      {
       var attr1;
       Docs.LinkElement(el,children);
       attr1=Attrs.Insert(el,attr);
       return Runtime.New(DocElemNode,Runtime.DeleteEmptyFields({
        Attr:attr1,
        Children:children,
        El:el,
        ElKey:Fresh.Int(),
        Render:Runtime.GetOptional(attr1.OnAfterRender).$0
       },["Render"]));
      },
      CreateEmbedNode:function()
      {
       return{
        Current:{
         $:3
        },
        Dirty:false
       };
      },
      CreateRunState:function(parent,doc)
      {
       return{
        PreviousNodes:NodeSet.get_Empty(),
        Top:Docs.CreateElemNode(parent,AttrProxy.get_Empty(),doc)
       };
      },
      CreateTextNode:function()
      {
       return{
        Text:DomUtility.CreateText(""),
        Dirty:false,
        Value:""
       };
      },
      DoSyncElement:function(el)
      {
       var parent,ins,ch,arg00,arg10,arg101,parent1,arg001,arg102,matchValue,pos1,_2,rdelim,value;
       parent=el.El;
       ins=function(doc,pos)
       {
        var _,e,d,_1,t,t1,b,a;
        if(doc.$==1)
         {
          e=doc.$0;
          _={
           $:1,
           $0:e.El
          };
         }
        else
         {
          if(doc.$==2)
           {
            d=doc.$0;
            if(d.Dirty)
             {
              d.Dirty=false;
              _1=Docs.InsertDoc(parent,d.Current,pos);
             }
            else
             {
              _1=ins(d.Current,pos);
             }
            _=_1;
           }
          else
           {
            if(doc.$==3)
             {
              _=pos;
             }
            else
             {
              if(doc.$==4)
               {
                t=doc.$0;
                _={
                 $:1,
                 $0:t.Text
                };
               }
              else
               {
                if(doc.$==5)
                 {
                  t1=doc.$0;
                  _={
                   $:1,
                   $0:t1
                  };
                 }
                else
                 {
                  b=doc.$1;
                  a=doc.$0;
                  _=ins(a,ins(b,pos));
                 }
               }
             }
           }
         }
        return _;
       };
       ch=DomNodes.DocChildren(el);
       arg00=el.El;
       arg10=Runtime.GetOptional(el.Delimiters);
       arg101=DomNodes.Children(arg00,arg10);
       parent1=el.El;
       arg001=function(el1)
       {
        return DomUtility.RemoveNode(parent1,el1);
       };
       arg102=DomNodes.Except(ch,arg101);
       DomNodes.Iter(arg001,arg102);
       matchValue=Runtime.GetOptional(el.Delimiters);
       if(matchValue.$==1)
        {
         rdelim=matchValue.$0[1];
         _2={
          $:1,
          $0:rdelim
         };
        }
       else
        {
         _2={
          $:0
         };
        }
       pos1=_2;
       value=ins(el.Children,pos1);
       return;
      },
      DomNodes:Runtime.Class({},{
       Children:function(elem,delims)
       {
        var _,rdelim,ldelim,a,n,value,objectArg;
        if(delims.$==1)
         {
          rdelim=delims.$0[1];
          ldelim=delims.$0[0];
          a=Array.prototype.constructor.apply(Array,[]);
          n=ldelim.nextSibling;
          while(n!==rdelim)
           {
            value=a.push(n);
            n=n.nextSibling;
           }
          _=Runtime.New(DomNodes,{
           $:0,
           $0:a
          });
         }
        else
         {
          objectArg=elem.childNodes;
          _=Runtime.New(DomNodes,{
           $:0,
           $0:Arrays.init(elem.childNodes.length,function(arg00)
           {
            return objectArg[arg00];
           })
          });
         }
        return _;
       },
       DocChildren:function(node)
       {
        var q,loop;
        q=[];
        loop=function(doc)
        {
         var _,d,e,tn,t,b,a;
         if(doc.$==2)
          {
           d=doc.$0;
           _=loop(d.Current);
          }
         else
          {
           if(doc.$==1)
            {
             e=doc.$0;
             _=q.push(e.El);
            }
           else
            {
             if(doc.$==3)
              {
               _=null;
              }
             else
              {
               if(doc.$==5)
                {
                 tn=doc.$0;
                 _=q.push(tn);
                }
               else
                {
                 if(doc.$==4)
                  {
                   t=doc.$0;
                   _=q.push(t.Text);
                  }
                 else
                  {
                   b=doc.$1;
                   a=doc.$0;
                   loop(a);
                   _=loop(b);
                  }
                }
              }
            }
          }
         return _;
        };
        loop(node.Children);
        return Runtime.New(DomNodes,{
         $:0,
         $0:q.slice(0)
        });
       },
       Except:function(_arg2,_arg1)
       {
        var excluded,included,predicate,arg0;
        excluded=_arg2.$0;
        included=_arg1.$0;
        predicate=function(n)
        {
         var predicate1;
         predicate1=function(k)
         {
          return!(n===k);
         };
         return Seq.forall(predicate1,excluded);
        };
        arg0=Arrays.filter(predicate,included);
        return Runtime.New(DomNodes,{
         $:0,
         $0:arg0
        });
       },
       FoldBack:function(f,_arg4,z)
       {
        var ns;
        ns=_arg4.$0;
        return Arrays.foldBack(f,ns,z);
       },
       Iter:function(f,_arg3)
       {
        var ns;
        ns=_arg3.$0;
        return Arrays.iter(f,ns);
       }
      }),
      InsertDoc:function(parent,doc,pos)
      {
       var _,e,d,t,t1,b,a;
       if(doc.$==1)
        {
         e=doc.$0;
         _=Docs.InsertNode(parent,e.El,pos);
        }
       else
        {
         if(doc.$==2)
          {
           d=doc.$0;
           d.Dirty=false;
           _=Docs.InsertDoc(parent,d.Current,pos);
          }
         else
          {
           if(doc.$==3)
            {
             _=pos;
            }
           else
            {
             if(doc.$==4)
              {
               t=doc.$0;
               _=Docs.InsertNode(parent,t.Text,pos);
              }
             else
              {
               if(doc.$==5)
                {
                 t1=doc.$0;
                 _=Docs.InsertNode(parent,t1,pos);
                }
               else
                {
                 b=doc.$1;
                 a=doc.$0;
                 _=Docs.InsertDoc(parent,a,Docs.InsertDoc(parent,b,pos));
                }
              }
            }
          }
        }
       return _;
      },
      InsertNode:function(parent,node,pos)
      {
       DomUtility.InsertAt(parent,pos,node);
       return{
        $:1,
        $0:node
       };
      },
      LinkElement:function(el,children)
      {
       var value;
       value=Docs.InsertDoc(el,children,{
        $:0
       });
       return;
      },
      LinkPrevElement:function(el,children)
      {
       var value;
       value=Docs.InsertDoc(el.parentNode,children,{
        $:1,
        $0:el
       });
       return;
      },
      NodeSet:Runtime.Class({},{
       Except:function(_arg3,_arg2)
       {
        var excluded,included;
        excluded=_arg3.$0;
        included=_arg2.$0;
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Except(excluded,included)
        });
       },
       Filter:function(f,_arg1)
       {
        var set;
        set=_arg1.$0;
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Filter(f,set)
        });
       },
       FindAll:function(doc)
       {
        var q,loop;
        q=[];
        loop=function(node)
        {
         var _,b,a,el,em;
         if(node.$==0)
          {
           b=node.$1;
           a=node.$0;
           loop(a);
           _=loop(b);
          }
         else
          {
           if(node.$==1)
            {
             el=node.$0;
             q.push(el);
             _=loop(el.Children);
            }
           else
            {
             if(node.$==2)
              {
               em=node.$0;
               _=loop(em.Current);
              }
             else
              {
               _=null;
              }
            }
          }
         return _;
        };
        loop(doc);
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSetProxy.New(q.slice(0))
        });
       },
       Intersect:function(_arg5,_arg4)
       {
        var a,b;
        a=_arg5.$0;
        b=_arg4.$0;
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Intersect(a,b)
        });
       },
       IsEmpty:function(_arg6)
       {
        var ns;
        ns=_arg6.$0;
        return ns.get_Count()===0;
       },
       ToArray:function(_arg7)
       {
        var ns;
        ns=_arg7.$0;
        return HashSet.ToArray(ns);
       },
       get_Empty:function()
       {
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSetProxy.New11()
        });
       }
      }),
      PerformAnimatedUpdate:function(st,doc)
      {
       return Concurrency.Delay(function()
       {
        var cur,change,enter,exit;
        cur=NodeSet.FindAll(doc);
        change=Docs.ComputeChangeAnim(st,cur);
        enter=Docs.ComputeEnterAnim(st,cur);
        exit=Docs.ComputeExitAnim(st,cur);
        return Concurrency.Bind(An.Play(An.Append(change,exit)),function()
        {
         Docs.SyncElemNode(st.Top);
         return Concurrency.Bind(An.Play(enter),function()
         {
          return Concurrency.Return(void(st.PreviousNodes=cur));
         });
        });
       });
      },
      Sync:function(doc)
      {
       var sync;
       sync=function(doc1)
       {
        var _,el,n,d,_1,b,a;
        if(doc1.$==1)
         {
          el=doc1.$0;
          Docs.SyncElement(el);
          _=sync(el.Children);
         }
        else
         {
          if(doc1.$==2)
           {
            n=doc1.$0;
            _=sync(n.Current);
           }
          else
           {
            if(doc1.$==3)
             {
              _=null;
             }
            else
             {
              if(doc1.$==5)
               {
                _=null;
               }
              else
               {
                if(doc1.$==4)
                 {
                  d=doc1.$0;
                  if(d.Dirty)
                   {
                    d.Text.nodeValue=d.Value;
                    _1=void(d.Dirty=false);
                   }
                  else
                   {
                    _1=null;
                   }
                  _=_1;
                 }
                else
                 {
                  b=doc1.$1;
                  a=doc1.$0;
                  sync(a);
                  _=sync(b);
                 }
               }
             }
           }
         }
        return _;
       };
       return sync(doc);
      },
      SyncElemNode:function(el)
      {
       Docs.SyncElement(el);
       return Docs.Sync(el.Children);
      },
      SyncElement:function(el)
      {
       var hasDirtyChildren,matchValue,_1,f;
       hasDirtyChildren=function(el1)
       {
        var dirty;
        dirty=function(doc)
        {
         var _,b,a,d;
         if(doc.$==0)
          {
           b=doc.$1;
           a=doc.$0;
           _=dirty(a)?true:dirty(b);
          }
         else
          {
           if(doc.$==2)
            {
             d=doc.$0;
             _=d.Dirty?true:dirty(d.Current);
            }
           else
            {
             _=false;
            }
          }
         return _;
        };
        return dirty(el1.Children);
       };
       Attrs.Sync(el.El,el.Attr);
       hasDirtyChildren(el)?Docs.DoSyncElement(el):null;
       matchValue=Runtime.GetOptional(el.Render);
       if(matchValue.$==1)
        {
         f=matchValue.$0;
         f(el.El);
         _1=void(delete el.Render);
        }
       else
        {
         _1=null;
        }
       return _1;
      },
      UpdateEmbedNode:function(node,upd)
      {
       node.Current=upd;
       node.Dirty=true;
       return;
      },
      UpdateTextNode:function(n,t)
      {
       n.Value=t;
       n.Dirty=true;
       return;
      }
     },
     DomUtility:{
      AddClass:function(element,cl)
      {
       var value;
       value=jQuery(element).addClass(cl);
       return;
      },
      AppendTo:function(ctx,node)
      {
       var value;
       value=ctx.appendChild(node);
       return;
      },
      Clear:function(ctx)
      {
       var value;
       while(ctx.hasChildNodes())
        {
         value=ctx.removeChild(ctx.firstChild);
        }
       return;
      },
      ClearAttrs:function(ctx)
      {
       var value;
       while(ctx.hasAttributes())
        {
         value=ctx.removeAttributeNode(ctx.attributes.item(0));
        }
       return;
      },
      CreateAttr:function(name,value)
      {
       var a;
       a=DomUtility.Doc().createAttribute(name);
       a.value=value;
       return a;
      },
      CreateElement:function(name)
      {
       return DomUtility.Doc().createElement(name);
      },
      CreateSvgElement:function(name)
      {
       return DomUtility.Doc().createElementNS("http://www.w3.org/2000/svg",name);
      },
      CreateText:function(s)
      {
       return DomUtility.Doc().createTextNode(s);
      },
      Doc:Runtime.Field(function()
      {
       return document;
      }),
      InsertAt:function(parent,pos,node)
      {
       var currentPos,canSkip,_,p2,matchValue1,_1,_2,n1,n2,_3,_4,marker,value,value1;
       currentPos=function(node1)
       {
        var matchValue;
        matchValue=node1.nextSibling;
        return Unchecked.Equals(matchValue,null)?{
         $:0
        }:{
         $:1,
         $0:matchValue
        };
       };
       if(node.parentNode===parent)
        {
         p2=currentPos(node);
         matchValue1=[pos,p2];
         if(matchValue1[0].$==1)
          {
           if(matchValue1[1].$==1)
            {
             n1=matchValue1[0].$0;
             n2=matchValue1[1].$0;
             _2=n1===n2;
            }
           else
            {
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=matchValue1[1].$==0?true:false;
          }
         _=_1;
        }
       else
        {
         _=false;
        }
       canSkip=_;
       if(!canSkip)
        {
         if(pos.$==1)
          {
           marker=pos.$0;
           value=parent.insertBefore(node,marker);
           _4=void value;
          }
         else
          {
           value1=parent.appendChild(node);
           _4=void value1;
          }
         _3=_4;
        }
       else
        {
         _3=null;
        }
       return _3;
      },
      RemoveAttr:function(el,attrName)
      {
       return el.removeAttribute(attrName);
      },
      RemoveClass:function(element,cl)
      {
       var value;
       value=jQuery(element).removeClass(cl);
       return;
      },
      RemoveNode:function(parent,el)
      {
       var _,value;
       if(el.parentNode===parent)
        {
         value=parent.removeChild(el);
         _=void value;
        }
       else
        {
         _=null;
        }
       return _;
      },
      SetAttr:function(el,name,value)
      {
       return el.setAttribute(name,value);
      },
      SetProperty:function($target,$name,$value)
      {
       var $0=this,$this=this;
       return $target.setProperty($name,$value);
      },
      SetStyle:function(el,name,value)
      {
       return DomUtility.SetProperty(el.style,name,value);
      }
     },
     DoubleInterpolation:Runtime.Class({
      Interpolate:function(t,x,y)
      {
       return x+t*(y-x);
      }
     }),
     DynamicAttrNode:Runtime.Class({
      GetChangeAnim:function()
      {
       return An.get_Empty();
      },
      GetEnterAnim:function()
      {
       return An.get_Empty();
      },
      GetExitAnim:function()
      {
       return An.get_Empty();
      },
      Init:function(parent)
      {
       return this.init.call(null,parent);
      },
      Sync:function(parent)
      {
       var _;
       if(this.dirty)
        {
         (this.push.call(null,parent))(this.value);
         _=void(this.dirty=false);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Changed:function()
      {
       return this.updates;
      }
     },{
      New:function(view,init,push)
      {
       var r,arg00;
       r=Runtime.New(this,{});
       r.init=init;
       r.push=push;
       r.value=undefined;
       r.dirty=true;
       arg00=function(x)
       {
        r.value=x;
        r.dirty=true;
        return;
       };
       r.updates=View.Map(arg00,view);
       return r;
      }
     }),
     Easing:Runtime.Class({},{
      Custom:function(f)
      {
       return Runtime.New(Easing,{
        TransformTime:f
       });
      },
      get_CubicInOut:function()
      {
       return Easings.CubicInOut();
      }
     }),
     Easings:{
      CubicInOut:Runtime.Field(function()
      {
       var f;
       f=function(t)
       {
        var t2,t3;
        t2=t*t;
        t3=t2*t;
        return 3*t2-2*t3;
       };
       return Runtime.New(Easing,{
        TransformTime:f
       });
      })
     },
     Elt:Runtime.Class({
      AddClass:function($cls)
      {
       var $this=this;
       return $this.elt.className+=" "+$cls;
      },
      Append:function(doc)
      {
       var e,v,arg00,arg10,arg20,value;
       e=this.get_DocElemNode();
       e.Children={
        $:0,
        $0:e.Children,
        $1:doc.get_DocNode()
       };
       v=this.rvUpdates;
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg10=Var.Get(this.rvUpdates);
       arg20=doc.get_Updates();
       Var1.Set(v,View.Map2(arg00,arg10,arg20));
       value=Docs.InsertDoc(this.elt,doc.get_DocNode(),{
        $:0
       });
       return;
      },
      Clear:function()
      {
       var value;
       this.get_DocElemNode().Children={
        $:3
       };
       Var1.Set(this.rvUpdates,View1.Const(null));
       while(this.elt.hasChildNodes())
        {
         value=this.elt.removeChild(this.elt.firstChild);
        }
       return;
      },
      GetAttribute:function(name)
      {
       return this.elt.getAttribute(name);
      },
      GetProperty:function(name)
      {
       return this.elt[name];
      },
      GetText:function()
      {
       return this.elt.textContent;
      },
      GetValue:function()
      {
       return this.elt.value;
      },
      HasAttribute:function(name)
      {
       return this.elt.hasAttribute(name);
      },
      HasClass:function(cls)
      {
       return(new RegExp("(\\s|^)"+cls+"(\\s|$)")).test(this.elt.className);
      },
      Html:function()
      {
       return this.elt.outerHTML;
      },
      Id:function()
      {
       return this.elt.id;
      },
      OnAfterRender:function(cb)
      {
       var matchValue,_,f;
       matchValue=Runtime.GetOptional(this.get_DocElemNode().Render);
       if(matchValue.$==1)
        {
         f=matchValue.$0;
         _={
          $:1,
          $0:function(el)
          {
           f(el);
           return cb(el);
          }
         };
        }
       else
        {
         _={
          $:1,
          $0:cb
         };
        }
       Runtime.SetOptional(this.get_DocElemNode(),"Render",_);
       return this;
      },
      OnAfterRenderView:function(view,cb)
      {
       var id,arg00,_this=this;
       id=Fresh.Id();
       arg00=function(x)
       {
        (_this.get_Element())[id]=x;
        return Doc.get_Empty();
       };
       this.Append(Doc.BindView(arg00,view));
       return _this.OnAfterRender(function(e)
       {
        return(cb(e))(e[id]);
       });
      },
      Prepend:function(doc)
      {
       var e,v,arg00,arg10,arg20,matchValue,pos,value;
       e=this.get_DocElemNode();
       e.Children={
        $:0,
        $0:doc.get_DocNode(),
        $1:e.Children
       };
       v=this.rvUpdates;
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg10=Var.Get(this.rvUpdates);
       arg20=doc.get_Updates();
       Var1.Set(v,View.Map2(arg00,arg10,arg20));
       matchValue=this.elt.firstChild;
       pos=Unchecked.Equals(matchValue,null)?{
        $:0
       }:{
        $:1,
        $0:matchValue
       };
       value=Docs.InsertDoc(this.elt,doc.get_DocNode(),pos);
       return;
      },
      RemoveAttribute:function(name)
      {
       return this.elt.removeAttribute(name);
      },
      RemoveClass:function(cls)
      {
       this.elt.className=this.elt.className.replace(new RegExp("(\\s|^)"+cls+"(\\s|$)")," ");
      },
      SetAttribute:function(name,value)
      {
       return this.elt.setAttribute(name,value);
      },
      SetProperty:function(name,value)
      {
       this.elt[name]=value;
      },
      SetStyle:function(style,value)
      {
       this.elt.style[style]=value;
      },
      SetText:function(v)
      {
       this.get_DocElemNode().Children={
        $:3
       };
       Var1.Set(this.rvUpdates,View1.Const(null));
       this.elt.textContent=v;
       return;
      },
      SetValue:function(v)
      {
       this.elt.value=v;
      },
      get_DocElemNode:function()
      {
       var matchValue,_,e;
       matchValue=this.docNode1;
       if(matchValue.$==1)
        {
         e=matchValue.$0;
         _=e;
        }
       else
        {
         _=Operators.FailWith("Elt: Invalid docNode");
        }
       return _;
      },
      get_Element:function()
      {
       return this.elt;
      },
      on:function(ev,cb)
      {
       this.elt.addEventListener(ev,cb(this.elt),false);
       return this;
      },
      onView:function(ev,view,cb)
      {
       var id,arg00,_this=this;
       id=Fresh.Id();
       arg00=function(x)
       {
        (_this.get_Element())[id]=x;
        return Doc.get_Empty();
       };
       this.Append(Doc.BindView(arg00,view));
       _this.elt.addEventListener(ev,function(ev1)
       {
        return((cb(_this.elt))(ev1))(_this.elt[id]);
       },false);
       return _this;
      }
     },{
      New:function(el,attr,children)
      {
       var node,rvUpdates,attrUpdates,arg00,arg001,arg10,updates;
       node=Docs.CreateElemNode(el,attr,children.get_DocNode());
       rvUpdates=Var.Create(children.get_Updates());
       attrUpdates=Attrs.Updates(node.Attr);
       arg00=function()
       {
        return function()
        {
         return null;
        };
       };
       arg001=function(arg20)
       {
        return View.Map2(arg00,attrUpdates,arg20);
       };
       arg10=rvUpdates.get_View();
       updates=View1.Bind(arg001,arg10);
       return Elt.New1({
        $:1,
        $0:node
       },updates,el,rvUpdates,attrUpdates);
      },
      New1:function(docNode,updates,elt,rvUpdates)
      {
       var r;
       r=Runtime.New(this,Doc.New(docNode,updates));
       r.docNode1=docNode;
       r.elt=elt;
       r.rvUpdates=rvUpdates;
       return r;
      }
     }),
     Flow:Runtime.Class({},{
      Bind:function(m,k)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(m.Render.call(null,_var))(function(r)
          {
           return(k(r).Render.call(null,_var))(cont);
          });
         };
        }
       };
      },
      Map:function(f,x)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(x.Render.call(null,_var))(function(r)
          {
           return cont(f(r));
          });
         };
        }
       };
      },
      Return:function(x)
      {
       return{
        Render:function()
        {
         return function(cont)
         {
          return cont(x);
         };
        }
       };
      },
      get_Do:function()
      {
       return FlowBuilder.New();
      }
     }),
     Flow1:Runtime.Class({},{
      Define:function(f)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          var arg10;
          arg10=f(cont);
          return Var1.Set(_var,arg10);
         };
        }
       };
      },
      Embed:function(fl)
      {
       var _var;
       _var=Var.Create(Doc.get_Empty());
       (fl.Render.call(null,_var))(function()
       {
       });
       return Doc.EmbedView(_var.get_View());
      },
      Static:function(doc)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          Var1.Set(_var,doc);
          return cont(null);
         };
        }
       };
      }
     }),
     FlowBuilder:Runtime.Class({
      Bind:function(comp,func)
      {
       return Flow.Bind(comp,func);
      },
      Return:function(value)
      {
       return Flow.Return(value);
      },
      ReturnFrom:function(inner)
      {
       return inner;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Html:{
      attr:Runtime.Class({},{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     Input:{
      ActivateButtonListener:Runtime.Field(function()
      {
       var _buttonListener_39_1,_1;
       _buttonListener_39_1=function(evt,down)
       {
        var matchValue,_,arg00,arg001,arg002;
        matchValue=evt.button;
        if(matchValue===0)
         {
          arg00=Input.MouseBtnSt1().Left;
          _=Var1.Set(arg00,down);
         }
        else
         {
          if(matchValue===1)
           {
            arg001=Input.MouseBtnSt1().Middle;
            _=Var1.Set(arg001,down);
           }
          else
           {
            if(matchValue===2)
             {
              arg002=Input.MouseBtnSt1().Right;
              _=Var1.Set(arg002,down);
             }
            else
             {
              _=null;
             }
           }
         }
        return _;
       };
       if(!Input.MouseBtnSt1().Active)
        {
         Input.MouseBtnSt1().Active=true;
         document.addEventListener("mousedown",function(evt)
         {
          return _buttonListener_39_1(evt,true);
         },false);
         _1=document.addEventListener("mouseup",function(evt)
         {
          return _buttonListener_39_1(evt,false);
         },false);
        }
       else
        {
         _1=null;
        }
       return _1;
      }),
      ActivateKeyListener:Runtime.Field(function()
      {
       var _,value,value1;
       if(!Input.KeyListenerState().KeyListenerActive)
        {
         value=jQuery(document).keydown(function(evt)
         {
          var keyCode,arg00,xs;
          keyCode=evt.which;
          arg00=Input.KeyListenerState().LastPressed;
          Var1.Set(arg00,keyCode);
          xs=Var.Get(Input.KeyListenerState().KeysPressed);
          return!Seq.exists(function(x)
          {
           return x===keyCode;
          },xs)?Var1.Set(Input.KeyListenerState().KeysPressed,List.append(xs,List.ofArray([keyCode]))):null;
         });
         value1=jQuery(document).keyup(function(evt)
         {
          var keyCode,arg00,predicate,arg10;
          keyCode=evt.which;
          arg00=Input.KeyListenerState().KeysPressed;
          predicate=function(x)
          {
           return x!==keyCode;
          };
          arg10=function(list)
          {
           return List.filter(predicate,list);
          };
          return Var1.Update(arg00,arg10);
         });
         _=void value1;
        }
       else
        {
         _=null;
        }
       return _;
      }),
      KeyListenerState:Runtime.Field(function()
      {
       return{
        KeysPressed:Var.Create(Runtime.New(T,{
         $:0
        })),
        KeyListenerActive:false,
        LastPressed:Var.Create(-1)
       };
      }),
      Keyboard:Runtime.Class({},{
       IsPressed:function(key)
       {
        var predicate;
        Input.ActivateKeyListener();
        predicate=function(x)
        {
         return x===key;
        };
        return View.Map(function(list)
        {
         return Seq.exists(predicate,list);
        },Input.KeyListenerState().KeysPressed.get_View());
       },
       get_KeysPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().KeysPressed.get_View();
       },
       get_LastPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().LastPressed.get_View();
       }
      }),
      Mouse:Runtime.Class({},{
       get_LeftPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Left.get_View();
       },
       get_MiddlePressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Middle.get_View();
       },
       get_MousePressed:function()
       {
        Input.ActivateButtonListener();
        return View1.Apply(View1.Apply(View1.Apply(View1.Const(function(l)
        {
         return function(m)
         {
          return function(r)
          {
           return(l?true:m)?true:r;
          };
         };
        }),Input.MouseBtnSt1().Left.get_View()),Input.MouseBtnSt1().Middle.get_View()),Input.MouseBtnSt1().Right.get_View());
       },
       get_Position:function()
       {
        var onMouseMove,_;
        onMouseMove=function(evt)
        {
         var arg00,arg10;
         arg00=Input.MousePosSt1().PosV;
         arg10=[evt.clientX,evt.clientY];
         return Var1.Set(arg00,arg10);
        };
        if(!Input.MousePosSt1().Active)
         {
          document.addEventListener("mousemove",onMouseMove,false);
          _=void(Input.MousePosSt1().Active=true);
         }
        else
         {
          _=null;
         }
        return Input.MousePosSt1().PosV.get_View();
       },
       get_RightPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Right.get_View();
       }
      }),
      MouseBtnSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        Left:Var.Create(false),
        Middle:Var.Create(false),
        Right:Var.Create(false)
       };
      }),
      MousePosSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        PosV:Var.Create([0,0])
       };
      })
     },
     Interpolation1:Runtime.Class({},{
      get_Double:function()
      {
       return Runtime.New(DoubleInterpolation,{
        $:0
       });
      }
     }),
     Key:Runtime.Class({},{
      Fresh:function()
      {
       return Runtime.New(Key,{
        $:0,
        $0:Fresh.Int()
       });
      }
     }),
     ListModel:Runtime.Class({
      Add:function(item)
      {
       var v,_,objectArg,index,m=this,objectArg1;
       v=this.Var.get_Value();
       if(!ListModels.Contains(this.get_Key(),item,v))
        {
         objectArg=this.Storage;
         _=this.Var.set_Value(objectArg.Add(item,v));
        }
       else
        {
         index=Arrays.findINdex(function(it)
         {
          return Unchecked.Equals((m.get_Key())(it),(m.get_Key())(item));
         },v);
         objectArg1=m.Storage;
         _=m.Var.set_Value(objectArg1.SetAt(index,item,v));
        }
       return _;
      },
      Clear:function()
      {
       return this.Var.set_Value(this.Storage.Set(Seq.empty()));
      },
      ContainsKey:function(key)
      {
       var m=this;
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },m.Var.get_Value());
      },
      ContainsKeyAsView:function(key)
      {
       var predicate,m=this,arg00,arg10;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       arg00=function(array)
       {
        return Seq.exists(predicate,array);
       };
       arg10=m.Var.get_View();
       return View.Map(arg00,arg10);
      },
      Find:function(pred)
      {
       return Arrays.find(pred,this.Var.get_Value());
      },
      FindAsView:function(pred)
      {
       var arg00,arg10;
       arg00=function(array)
       {
        return Arrays.find(pred,array);
       };
       arg10=this.Var.get_View();
       return View.Map(arg00,arg10);
      },
      FindByKey:function(key)
      {
       var m=this;
       return Arrays.find(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },m.Var.get_Value());
      },
      FindByKeyAsView:function(key)
      {
       var predicate,m=this,arg00,arg10;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       arg00=function(array)
       {
        return Arrays.find(predicate,array);
       };
       arg10=m.Var.get_View();
       return View.Map(arg00,arg10);
      },
      Iter:function(fn)
      {
       return Arrays.iter(fn,this.Var.get_Value());
      },
      Lens:function(key)
      {
       var arg00,arg10;
       arg00=function(x)
       {
        return x;
       };
       arg10=function()
       {
        return function(x)
        {
         return x;
        };
       };
       return this.LensInto(arg00,arg10,key);
      },
      LensInto:function(get,update,key)
      {
       return RefImpl1.New(this,key,get,update);
      },
      Remove:function(item)
      {
       var v,_,keyFn,k,objectArg,arg00;
       v=this.Var.get_Value();
       if(ListModels.Contains(this.key,item,v))
        {
         keyFn=this.key;
         k=keyFn(item);
         objectArg=this.Storage;
         arg00=function(i)
         {
          return!Unchecked.Equals(keyFn(i),k);
         };
         _=this.Var.set_Value(objectArg.RemoveIf(arg00,v));
        }
       else
        {
         _=null;
        }
       return _;
      },
      RemoveBy:function(f)
      {
       var objectArg,arg00,arg10;
       objectArg=this.Storage;
       arg00=function(x)
       {
        var value;
        value=f(x);
        return!value;
       };
       arg10=this.Var.get_Value();
       return this.Var.set_Value(objectArg.RemoveIf(arg00,arg10));
      },
      RemoveByKey:function(key)
      {
       var objectArg,arg00,m=this,arg10;
       objectArg=this.Storage;
       arg00=function(i)
       {
        return!Unchecked.Equals((m.get_Key())(i),key);
       };
       arg10=m.Var.get_Value();
       return this.Var.set_Value(objectArg.RemoveIf(arg00,arg10));
      },
      Set:function(lst)
      {
       return this.Var.set_Value(this.Storage.Set(lst));
      },
      TryFind:function(pred)
      {
       return Arrays.tryFind(pred,this.Var.get_Value());
      },
      TryFindAsView:function(pred)
      {
       var arg00,arg10;
       arg00=function(array)
       {
        return Arrays.tryFind(pred,array);
       };
       arg10=this.Var.get_View();
       return View.Map(arg00,arg10);
      },
      TryFindByKey:function(key)
      {
       var m=this;
       return Arrays.tryFind(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },m.Var.get_Value());
      },
      TryFindByKeyAsView:function(key)
      {
       var predicate,m=this,arg00,arg10;
       predicate=function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       };
       arg00=function(array)
       {
        return Arrays.tryFind(predicate,array);
       };
       arg10=m.Var.get_View();
       return View.Map(arg00,arg10);
      },
      UpdateAll:function(fn)
      {
       var objectArg,arg00,m=this;
       objectArg=this.Var;
       arg00=function(a)
       {
        var action;
        action=function(i)
        {
         return function(x)
         {
          var action1,option;
          action1=function(y)
          {
           return Arrays.set(a,i,y);
          };
          option=fn(x);
          return Option.iter(action1,option);
         };
        };
        Arrays.iteri(action,a);
        return m.Storage.Set(a);
       };
       return objectArg.Update(arg00);
      },
      UpdateBy:function(fn,key)
      {
       var v,matchValue,m=this,_,index,matchValue1,_1,value,objectArg;
       v=this.Var.get_Value();
       matchValue=Arrays.tryFindIndex(function(it)
       {
        return Unchecked.Equals(m.key.call(null,it),key);
       },v);
       if(matchValue.$==1)
        {
         index=matchValue.$0;
         matchValue1=fn(Arrays.get(v,index));
         if(matchValue1.$==1)
          {
           value=matchValue1.$0;
           objectArg=m.Storage;
           _1=m.Var.set_Value(objectArg.SetAt(index,value,v));
          }
         else
          {
           _1=null;
          }
         _=_1;
        }
       else
        {
         _=null;
        }
       return _;
      },
      Wrap:function(extract,wrap,update)
      {
       return ListModel1.Wrap(this,extract,wrap,update);
      },
      get_Key:function()
      {
       return this.key;
      },
      get_Length:function()
      {
       return Arrays.length(this.Var.get_Value());
      },
      get_LengthAsView:function()
      {
       var arg00,arg10;
       arg00=function(arr)
       {
        return Arrays.length(arr);
       };
       arg10=this.Var.get_View();
       return View.Map(arg00,arg10);
      },
      get_View:function()
      {
       return this.view;
      }
     },{
      Create:function(key,init)
      {
       var _arg00_,arg10;
       _arg00_=Seq.toArray(init);
       arg10=Storage1.InMemory(_arg00_);
       return ListModel.CreateWithStorage(key,arg10);
      },
      CreateWithStorage:function(key,storage)
      {
       var source,arg00,_var,arg001,arg10,view;
       source=Seq1.distinctBy(key,storage.Init());
       arg00=Seq.toArray(source);
       _var=Var.Create(arg00);
       arg001=function(x)
       {
        var value;
        value=storage.Set(x);
        return x.slice();
       };
       arg10=_var.get_View();
       view=View.Map(arg001,arg10);
       return Runtime.New(ListModel,{
        key:key,
        Var:_var,
        Storage:storage,
        view:view
       });
      }
     }),
     ListModel1:Runtime.Class({},{
      FromSeq:function(init)
      {
       var arg00;
       arg00=function(x)
       {
        return x;
       };
       return ListModel.Create(arg00,init);
      },
      Key:function(m)
      {
       return m.key;
      },
      View:function(m)
      {
       return m.view;
      },
      Wrap:function(underlying,extract,createItem,updateItem)
      {
       var state,mapping,array,init,objectArg,arg00,arg10,_var,g;
       state=[Dictionary.New12()];
       mapping=function(u)
       {
        var t;
        t=createItem(u);
        state[0].set_Item((underlying.get_Key())(u),t);
        return t;
       };
       array=underlying.Var.get_Value();
       init=Arrays.map(mapping,array);
       objectArg=underlying.Var;
       arg00=function(us)
       {
        var newState,mapping1,ts;
        newState=Dictionary.New12();
        mapping1=function(u)
        {
         var k,t;
         k=(underlying.get_Key())(u);
         t=state[0].ContainsKey(k)?(updateItem(state[0].get_Item(k)))(u):createItem(u);
         newState.set_Item(k,t);
         return t;
        };
        ts=Arrays.map(mapping1,us);
        state[0]=newState;
        return ts;
       };
       arg10=function()
       {
        return function(ts)
        {
         var newState,mapping1,us1;
         newState=Dictionary.New12();
         mapping1=function(t)
         {
          var u;
          u=extract(t);
          newState.set_Item((underlying.get_Key())(u),t);
          return u;
         };
         us1=Arrays.map(mapping1,ts);
         state[0]=newState;
         return us1;
        };
       };
       _var=Var1.Lens(objectArg,arg00,arg10);
       g=underlying.get_Key();
       return Runtime.New(ListModel,{
        key:function(x)
        {
         return g(extract(x));
        },
        Var:_var,
        Storage:Storage1.InMemory(init),
        view:View.Map(function(source)
        {
         return source;
        },_var.get_View())
       });
      }
     }),
     ListModels:{
      Contains:function(keyFn,item,xs)
      {
       var t;
       t=keyFn(item);
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(keyFn(it),t);
       },xs);
      }
     },
     Model:Runtime.Class({
      get_View:function()
      {
       return Model1.View(this);
      }
     },{
      Create:function(proj,init)
      {
       var _var,arg10,view;
       _var=Var.Create(init);
       arg10=_var.get_View();
       view=View.Map(proj,arg10);
       return Runtime.New(Model,{
        $:0,
        $0:_var,
        $1:view
       });
      },
      Update:function(update,_arg1)
      {
       var _var,arg10;
       _var=_arg1.$0;
       arg10=function(x)
       {
        update(x);
        return x;
       };
       return Var1.Update(_var,arg10);
      }
     }),
     Model1:Runtime.Class({},{
      View:function(_arg2)
      {
       var view;
       view=_arg2.$1;
       return view;
      }
     }),
     ReactiveExtensions:Runtime.Class({},{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     RefImpl:Runtime.Class({
      Get:function()
      {
       return this.get.call(null,this.baseRef.Get());
      },
      Set:function(v)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(v);
       });
      },
      Update:function(f)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(f(_this.get.call(null,t)));
       });
      },
      UpdateMaybe:function(f)
      {
       var _this=this;
       return this.baseRef.UpdateMaybe(function(t)
       {
        return Option.map(_this.update.call(null,t),f(_this.get.call(null,t)));
       });
      },
      get_Id:function()
      {
       return this.id;
      },
      get_Value:function()
      {
       return this.get.call(null,this.baseRef.Get());
      },
      get_View:function()
      {
       var arg00,arg10;
       arg00=this.get;
       arg10=this.baseRef.get_View();
       return View.Map(arg00,arg10);
      },
      set_Value:function(v)
      {
       var _this=this;
       return this.baseRef.Update(function(t)
       {
        return(_this.update.call(null,t))(v);
       });
      }
     },{
      New:function(baseRef,get,update)
      {
       var r;
       r=Runtime.New(this,{});
       r.baseRef=baseRef;
       r.get=get;
       r.update=update;
       r.id=Fresh.Id();
       return r;
      }
     }),
     RefImpl1:Runtime.Class({
      Get:function()
      {
       return this.get.call(null,this.m.FindByKey(this.key));
      },
      Set:function(v)
      {
       var objectArg,arg00,r=this,arg10;
       objectArg=this.m;
       arg00=function(i)
       {
        return{
         $:1,
         $0:(r.update.call(null,i))(v)
        };
       };
       arg10=r.key;
       return objectArg.UpdateBy(arg00,arg10);
      },
      Update:function(f)
      {
       var objectArg,arg00,r=this,arg10;
       objectArg=this.m;
       arg00=function(i)
       {
        return{
         $:1,
         $0:(r.update.call(null,i))(f(r.get.call(null,i)))
        };
       };
       arg10=r.key;
       return objectArg.UpdateBy(arg00,arg10);
      },
      UpdateMaybe:function(f)
      {
       var objectArg,arg00,r=this,arg10;
       objectArg=this.m;
       arg00=function(i)
       {
        return Option.map(r.update.call(null,i),f(r.get.call(null,i)));
       };
       arg10=r.key;
       return objectArg.UpdateBy(arg00,arg10);
      },
      get_Id:function()
      {
       return this.id;
      },
      get_Value:function()
      {
       return this.Get();
      },
      get_View:function()
      {
       var arg00,arg10;
       arg00=this.get;
       arg10=this.m.FindByKeyAsView(this.key);
       return View.Map(arg00,arg10);
      },
      set_Value:function(v)
      {
       return this.Set(v);
      }
     },{
      New:function(m,key,get,update)
      {
       var r;
       r=Runtime.New(this,{});
       r.m=m;
       r.key=key;
       r.get=get;
       r.update=update;
       r.id=Fresh.Id();
       return r;
      }
     }),
     Route:{
      Append:function(_arg2,_arg1)
      {
       var a,b;
       a=_arg2.$0;
       b=_arg1.$0;
       return{
        $:0,
        $0:AppendList1.Append(a,b)
       };
      },
      FromList:function(xs)
      {
       var _arg00_,arg0;
       _arg00_=Arrays.ofSeq(xs);
       arg0=AppendList1.FromArray(_arg00_);
       return{
        $:0,
        $0:arg0
       };
      },
      MakeHash:function(_arg1)
      {
       var x,array,strings;
       x=_arg1.$0;
       array=AppendList1.ToArray(x);
       strings=Arrays.map(function(x1)
       {
        return encodeURIComponent(x1);
       },array);
       return Strings.concat("/",strings);
      },
      NoHash:function(s)
      {
       return Strings.StartsWith(s,"#")?s.substring(1):s;
      },
      ParseHash:function(hash)
      {
       var array,_arg00_,arg0;
       array=Strings.SplitChars(Route.NoHash(hash),[47],1);
       _arg00_=Arrays.map(function(x)
       {
        return decodeURIComponent(x);
       },array);
       arg0=AppendList1.FromArray(_arg00_);
       return{
        $:0,
        $0:arg0
       };
      },
      SameHash:function(a,b)
      {
       return Route.NoHash(a)===Route.NoHash(b);
      },
      ToList:function(_arg1)
      {
       var rt,array;
       rt=_arg1.$0;
       array=AppendList1.ToArray(rt);
       return List.ofArray(array);
      }
     },
     RouteMap1:Runtime.Class({},{
      Create:function(ser,des)
      {
       return{
        Des:des,
        Ser:ser
       };
      },
      Install:function(map)
      {
       return Routing.InstallMap(map);
      }
     }),
     Router:Runtime.Class({},{
      Dir:function(prefix,sites)
      {
       var arg10;
       arg10=Router.Merge(sites);
       return Router.Prefix(prefix,arg10);
      },
      Install:function(key,site)
      {
       return Routing.Install(key,site);
      },
      Merge:function(sites)
      {
       return Routing.MergeRouters(sites);
      },
      Prefix:function(prefix,_arg1)
      {
       var va,tree;
       va=_arg1.$0;
       tree=_arg1.$1;
       return{
        $:0,
        $0:va,
        $1:Trie1.Prefix(prefix,tree)
       };
      }
     }),
     Router1:Runtime.Class({},{
      Route:function(r,init,render)
      {
       return Routing.DefineRoute(r,init,render);
      }
     }),
     Routing:{
      ComputeBodies:function(trie)
      {
       var d,action,array;
       d=Dictionary.New12();
       action=function(body)
       {
        return d.set_Item(body.RouteId,body);
       };
       array=Trie1.ToArray(trie);
       Arrays.iter(action,array);
       return d;
      },
      DefineRoute:function(r,init,render)
      {
       var state,id,site,t;
       state=Var.Create(init);
       id=Fresh.Int();
       site=(render({
        $:0,
        $0:id
       }))(state);
       t=Trie1.Leaf({
        $:0,
        $0:id,
        $1:function(ctx)
        {
         var arg00,arg10;
         arg00=function(va)
         {
          return ctx.UpdateRoute.call(null,Routing.DoLink(r,va));
         };
         arg10=state.get_View();
         View1.Sink(arg00,arg10);
         return{
          OnRouteChanged:function(route)
          {
           return Var1.Set(state,Routing.DoRoute(r,route));
          },
          OnSelect:function()
          {
           return ctx.UpdateRoute.call(null,Routing.DoLink(r,Var.Get(state)));
          },
          RouteId:id,
          RouteValue:site
         };
        }
       });
       return{
        $:0,
        $0:{
         $:1,
         $0:site
        },
        $1:t
       };
      },
      DoLink:function(map,va)
      {
       return Route.FromList(map.Ser.call(null,va));
      },
      DoRoute:function(map,route)
      {
       return map.Des.call(null,Route.ToList(route));
      },
      Install:function(key,_arg1)
      {
       var va,site,currentRoute,state,_arg00_1,siteTrie,parseRoute,matchValue,glob,_,site1,arg00,_1,v,arg001,arg10,updateRoute,arg101;
       va=_arg1.$0;
       site=_arg1.$1;
       currentRoute=Routing.InstallMap({
        Des:function(xs)
        {
         return Route.FromList(xs);
        },
        Ser:function(_arg00_)
        {
         return Route.ToList(_arg00_);
        }
       });
       state={
        Bodies:undefined,
        CurrentRoute:currentRoute,
        CurrentSite:0,
        Selection:undefined
       };
       _arg00_1=function(prefix)
       {
        return function(_arg11)
        {
         var init,id;
         init=_arg11.$1;
         id=_arg11.$0;
         return init({
          UpdateRoute:function(rest)
          {
           return Routing.OnInternalSiteUpdate(state,id,prefix,rest);
          }
         });
        };
       };
       siteTrie=Trie1.Map(_arg00_1,site);
       state.Bodies=Routing.ComputeBodies(siteTrie);
       parseRoute=function(route)
       {
        return Trie1.Lookup(siteTrie,Route.ToList(route));
       };
       matchValue=parseRoute(Var.Get(currentRoute));
       if(matchValue.$==0)
        {
         site1=matchValue.$0;
         matchValue.$1;
         state.CurrentSite=site1.RouteId;
         _=Var.Create(site1.RouteValue);
        }
       else
        {
         if(va.$==1)
          {
           v=va.$0;
           _1=v;
          }
         else
          {
           _1=Operators.FailWith("Site.Install fails on empty site");
          }
         arg00=_1;
         _=Var.Create(arg00);
        }
       glob=_;
       state.Selection=glob;
       arg001=function(site2)
       {
        return Routing.OnSelectSite(state,key(site2));
       };
       arg10=glob.get_View();
       View1.Sink(arg001,arg10);
       updateRoute=function(route)
       {
        var matchValue1,_2,site2,rest,rest1;
        matchValue1=parseRoute(route);
        if(matchValue1.$==1)
         {
          _2=null;
         }
        else
         {
          site2=matchValue1.$0;
          rest=matchValue1.$1;
          rest1=Route.FromList(rest);
          _2=Routing.OnGlobalRouteChange(state,site2,rest1);
         }
        return _2;
       };
       updateRoute(Var.Get(currentRoute));
       arg101=currentRoute.get_View();
       View1.Sink(updateRoute,arg101);
       return glob;
      },
      InstallMap:function(rt)
      {
       var cur,_var,set,onUpdate,arg00,arg10;
       cur=function()
       {
        var _arg00_;
        _arg00_=Route.ParseHash(window.location.hash);
        return rt.Des.call(null,Route.ToList(_arg00_));
       };
       _var=Var.Create(cur(null));
       set=function(value)
       {
        var a;
        a=Var.Get(_var);
        return!Unchecked.Equals(rt.Ser.call(null,a),rt.Ser.call(null,value))?Var1.Set(_var,value):null;
       };
       onUpdate=function()
       {
        return set(cur(null));
       };
       window.onpopstate=onUpdate;
       window.onhashchange=onUpdate;
       arg00=function(loc)
       {
        var ha;
        ha=Route.MakeHash(Route.FromList(rt.Ser.call(null,loc)));
        return!Route.SameHash(window.location.hash,ha)?void(window.location.hash=ha):null;
       };
       arg10=_var.get_View();
       View1.Sink(arg00,arg10);
       return _var;
      },
      MergeRouters:function(sites)
      {
       var sites1,mapping,_arg00_,merged,chooser,value,_,t1;
       sites1=Seq.toArray(sites);
       mapping=function(_arg1)
       {
        var t;
        t=_arg1.$1;
        return t;
       };
       _arg00_=Seq.map(mapping,sites1);
       merged=Trie1.Merge(_arg00_);
       chooser=function(_arg2)
       {
        var x;
        x=_arg2.$0;
        return x;
       };
       value=Seq.tryPick(chooser,sites1);
       if(merged.$==1)
        {
         t1=merged.$0;
         _={
          $:0,
          $0:value,
          $1:t1
         };
        }
       else
        {
         _=Operators.FailWith("Invalid Site.Merge: need more prefix disambiguation");
        }
       return _;
      },
      OnGlobalRouteChange:function(state,site,rest)
      {
       var _;
       if(state.CurrentSite!==site.RouteId)
        {
         state.CurrentSite=site.RouteId;
         _=Var1.Set(state.Selection,site.RouteValue);
        }
       else
        {
         _=null;
        }
       return site.OnRouteChanged.call(null,rest);
      },
      OnInternalSiteUpdate:function(state,ix,prefix,rest)
      {
       var _,route;
       if(state.CurrentSite===ix)
        {
         route=Route.Append(Route.FromList(prefix),rest);
         _=Routing.SetCurrentRoute(state,route);
        }
       else
        {
         _=null;
        }
       return _;
      },
      OnSelectSite:function(state,_arg1)
      {
       var id,_;
       id=_arg1.$0;
       if(state.CurrentSite!==id)
        {
         state.CurrentSite=id;
         _=state.Bodies.get_Item(id).OnSelect.call(null,null);
        }
       else
        {
         _=null;
        }
       return _;
      },
      SetCurrentRoute:function(state,route)
      {
       return!Unchecked.Equals(Var.Get(state.CurrentRoute),route)?Var1.Set(state.CurrentRoute,route):null;
      }
     },
     Snap1:{
      Bind:function(f,snap)
      {
       var res,onObs,onReady;
       res=Snap1.Create();
       onObs=function()
       {
        return Snap1.MarkObsolete(res);
       };
       onReady=function(x)
       {
        var y;
        y=f(x);
        return Snap1.When(y,function(v)
        {
         return(Snap1.IsForever(y)?Snap1.IsForever(snap):false)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
        },onObs);
       };
       Snap1.When(snap,onReady,onObs);
       return res;
      },
      Create:function()
      {
       return Snap1.Make({
        $:3,
        $0:[],
        $1:[]
       });
      },
      CreateForever:function(v)
      {
       return Snap1.Make({
        $:0,
        $0:v
       });
      },
      CreateForeverAsync:function(a)
      {
       var o,arg00;
       o=Snap1.Make({
        $:3,
        $0:[],
        $1:[]
       });
       arg00=Concurrency.Delay(function()
       {
        return Concurrency.Bind(a,function(_arg1)
        {
         return Concurrency.Return(Snap1.MarkForever(o,_arg1));
        });
       });
       Concurrency.Start(arg00,{
        $:0
       });
       return o;
      },
      CreateWithValue:function(v)
      {
       return Snap1.Make({
        $:2,
        $0:v,
        $1:[]
       });
      },
      IsForever:function(snap)
      {
       var matchValue;
       matchValue=snap.State;
       return matchValue.$==0?true:false;
      },
      IsObsolete:function(snap)
      {
       var matchValue;
       matchValue=snap.State;
       return matchValue.$==1?true:false;
      },
      Make:function(st)
      {
       return{
        State:st
       };
      },
      Map:function(fn,sn)
      {
       var matchValue,_,x,res;
       matchValue=sn.State;
       if(matchValue.$==0)
        {
         x=matchValue.$0;
         _=Snap1.CreateForever(fn(x));
        }
       else
        {
         res=Snap1.Create();
         Snap1.When(sn,function(x1)
         {
          var v;
          v=fn(x1);
          return Snap1.MarkDone(res,sn,v);
         },function()
         {
          return Snap1.MarkObsolete(res);
         });
         _=res;
        }
       return _;
      },
      Map2:function(fn,sn1,sn2)
      {
       var matchValue,_,_1,x,y,x1,_2,y1,res,v1,v2,obs,cont;
       matchValue=[sn1.State,sn2.State];
       if(matchValue[0].$==0)
        {
         if(matchValue[1].$==0)
          {
           x=matchValue[0].$0;
           y=matchValue[1].$0;
           _1=Snap1.CreateForever((fn(x))(y));
          }
         else
          {
           x1=matchValue[0].$0;
           _1=Snap1.Map(fn(x1),sn2);
          }
         _=_1;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           y1=matchValue[1].$0;
           _2=Snap1.Map(function(x2)
           {
            return(fn(x2))(y1);
           },sn1);
          }
         else
          {
           res=Snap1.Create();
           v1=[{
            $:0
           }];
           v2=[{
            $:0
           }];
           obs=function()
           {
            v1[0]={
             $:0
            };
            v2[0]={
             $:0
            };
            return Snap1.MarkObsolete(res);
           };
           cont=function()
           {
            var matchValue1,_3,_4,x2,y2;
            matchValue1=[v1[0],v2[0]];
            if(matchValue1[0].$==1)
             {
              if(matchValue1[1].$==1)
               {
                x2=matchValue1[0].$0;
                y2=matchValue1[1].$0;
                _4=(Snap1.IsForever(sn1)?Snap1.IsForever(sn2):false)?Snap1.MarkForever(res,(fn(x2))(y2)):Snap1.MarkReady(res,(fn(x2))(y2));
               }
              else
               {
                _4=null;
               }
              _3=_4;
             }
            else
             {
              _3=null;
             }
            return _3;
           };
           Snap1.When(sn1,function(x2)
           {
            v1[0]={
             $:1,
             $0:x2
            };
            return cont(null);
           },obs);
           Snap1.When(sn2,function(y2)
           {
            v2[0]={
             $:1,
             $0:y2
            };
            return cont(null);
           },obs);
           _2=res;
          }
         _=_2;
        }
       return _;
      },
      Map3:function(fn,sn1,sn2,sn3)
      {
       var matchValue,_,_1,_2,x,y,z,x1,y1,_3,x2,z2,x3,_4,_5,y3,z3,y4,_6,z4,res,v1,v2,v3,obs,cont;
       matchValue=[sn1.State,sn2.State,sn3.State];
       if(matchValue[0].$==0)
        {
         if(matchValue[1].$==0)
          {
           if(matchValue[2].$==0)
            {
             x=matchValue[0].$0;
             y=matchValue[1].$0;
             z=matchValue[2].$0;
             _2=Snap1.CreateForever(((fn(x))(y))(z));
            }
           else
            {
             x1=matchValue[0].$0;
             y1=matchValue[1].$0;
             _2=Snap1.Map(function(z1)
             {
              return((fn(x1))(y1))(z1);
             },sn3);
            }
           _1=_2;
          }
         else
          {
           if(matchValue[2].$==0)
            {
             x2=matchValue[0].$0;
             z2=matchValue[2].$0;
             _3=Snap1.Map(function(y2)
             {
              return((fn(x2))(y2))(z2);
             },sn2);
            }
           else
            {
             x3=matchValue[0].$0;
             _3=Snap1.Map2(function(y2)
             {
              return function(z1)
              {
               return((fn(x3))(y2))(z1);
              };
             },sn2,sn3);
            }
           _1=_3;
          }
         _=_1;
        }
       else
        {
         if(matchValue[1].$==0)
          {
           if(matchValue[2].$==0)
            {
             y3=matchValue[1].$0;
             z3=matchValue[2].$0;
             _5=Snap1.Map(function(x4)
             {
              return((fn(x4))(y3))(z3);
             },sn1);
            }
           else
            {
             y4=matchValue[1].$0;
             _5=Snap1.Map2(function(x4)
             {
              return function(z1)
              {
               return((fn(x4))(y4))(z1);
              };
             },sn1,sn3);
            }
           _4=_5;
          }
         else
          {
           if(matchValue[2].$==0)
            {
             z4=matchValue[2].$0;
             _6=Snap1.Map2(function(x4)
             {
              return function(y2)
              {
               return((fn(x4))(y2))(z4);
              };
             },sn1,sn2);
            }
           else
            {
             res=Snap1.Create();
             v1=[{
              $:0
             }];
             v2=[{
              $:0
             }];
             v3=[{
              $:0
             }];
             obs=function()
             {
              v1[0]={
               $:0
              };
              v2[0]={
               $:0
              };
              v3[0]={
               $:0
              };
              return Snap1.MarkObsolete(res);
             };
             cont=function()
             {
              var matchValue1,_7,_8,_9,x4,y2,z1;
              matchValue1=[v1[0],v2[0],v3[0]];
              if(matchValue1[0].$==1)
               {
                if(matchValue1[1].$==1)
                 {
                  if(matchValue1[2].$==1)
                   {
                    x4=matchValue1[0].$0;
                    y2=matchValue1[1].$0;
                    z1=matchValue1[2].$0;
                    _9=((Snap1.IsForever(sn1)?Snap1.IsForever(sn2):false)?Snap1.IsForever(sn3):false)?Snap1.MarkForever(res,((fn(x4))(y2))(z1)):Snap1.MarkReady(res,((fn(x4))(y2))(z1));
                   }
                  else
                   {
                    _9=null;
                   }
                  _8=_9;
                 }
                else
                 {
                  _8=null;
                 }
                _7=_8;
               }
              else
               {
                _7=null;
               }
              return _7;
             };
             Snap1.When(sn1,function(x4)
             {
              v1[0]={
               $:1,
               $0:x4
              };
              return cont(null);
             },obs);
             Snap1.When(sn2,function(y2)
             {
              v2[0]={
               $:1,
               $0:y2
              };
              return cont(null);
             },obs);
             Snap1.When(sn3,function(z1)
             {
              v3[0]={
               $:1,
               $0:z1
              };
              return cont(null);
             },obs);
             _6=res;
            }
           _4=_6;
          }
         _=_4;
        }
       return _;
      },
      MapAsync:function(fn,snap)
      {
       var res;
       res=Snap1.Create();
       Snap1.When(snap,function(v)
       {
        return Async.StartTo(fn(v),function(v1)
        {
         return Snap1.MarkDone(res,snap,v1);
        });
       },function()
       {
        return Snap1.MarkObsolete(res);
       });
       return res;
      },
      MapCached:function(prev,fn,sn)
      {
       var fn1;
       fn1=function(x)
       {
        var matchValue,_,_x_,_1,y,y1,y2;
        matchValue=prev[0];
        if(matchValue.$==1)
         {
          matchValue.$0[1];
          _x_=matchValue.$0[0];
          if(Unchecked.Equals(x,_x_))
           {
            matchValue.$0[0];
            y=matchValue.$0[1];
            _1=y;
           }
          else
           {
            y1=fn(x);
            prev[0]={
             $:1,
             $0:[x,y1]
            };
            _1=y1;
           }
          _=_1;
         }
        else
         {
          y2=fn(x);
          prev[0]={
           $:1,
           $0:[x,y2]
          };
          _=y2;
         }
        return _;
       };
       return Snap1.Map(fn1,sn);
      },
      MarkDone:function(res,sn,v)
      {
       return Snap1.IsForever(sn)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
      },
      MarkForever:function(sn,v)
      {
       var matchValue,_,q;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q=matchValue.$0;
         sn.State={
          $:0,
          $0:v
         };
         _=Seq.iter(function(k)
         {
          return k(v);
         },q);
        }
       else
        {
         _=null;
        }
       return _;
      },
      MarkObsolete:function(sn)
      {
       var matchValue,_,ks,ks1;
       matchValue=sn.State;
       if(matchValue.$==1)
        {
         _=null;
        }
       else
        {
         if(matchValue.$==2)
          {
           ks=matchValue.$1;
           sn.State={
            $:1
           };
           _=Seq.iter(function(k)
           {
            return k(null);
           },ks);
          }
         else
          {
           if(matchValue.$==3)
            {
             ks1=matchValue.$1;
             sn.State={
              $:1
             };
             _=Seq.iter(function(k)
             {
              return k(null);
             },ks1);
            }
           else
            {
             _=null;
            }
          }
        }
       return _;
      },
      MarkReady:function(sn,v)
      {
       var matchValue,_,q2,q1;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q2=matchValue.$1;
         q1=matchValue.$0;
         sn.State={
          $:2,
          $0:v,
          $1:q2
         };
         _=Seq.iter(function(k)
         {
          return k(v);
         },q1);
        }
       else
        {
         _=null;
        }
       return _;
      },
      Sequence:function(snaps)
      {
       var _,res,snaps1,c,d,vs,obs,cont,action;
       if(Seq.isEmpty(snaps))
        {
         _=Snap1.CreateForever(Seq.empty());
        }
       else
        {
         res=Snap1.Create();
         snaps1=Arrays.ofSeq(snaps);
         c=Arrays.length(snaps1);
         d=[0];
         vs=[[]];
         obs=function()
         {
          d[0]=0;
          vs[0]=[];
          return Snap1.MarkObsolete(res);
         };
         cont=function()
         {
          return d[0]===c?Seq.forall(function(x)
          {
           return Snap1.IsForever(x);
          },snaps1)?Snap1.MarkForever(res,vs[0]):Snap1.MarkReady(res,vs[0]):null;
         };
         action=function(i)
         {
          return function(s)
          {
           return Snap1.When(s,function(x)
           {
            vs[0][i]=x;
            Ref.incr(d);
            return cont(null);
           },obs);
          };
         };
         Arrays.iteri(action,snaps1);
         _=res;
        }
       return _;
      },
      SnapshotOn:function(sn1,sn2)
      {
       var res,v,triggered,obs,cont;
       res=Snap1.Create();
       v=[{
        $:0
       }];
       triggered=[false];
       obs=function()
       {
        v[0]={
         $:0
        };
        return Snap1.MarkObsolete(res);
       };
       cont=function()
       {
        var _,matchValue,_1,_2,y,_3,y1,_4,y2;
        if(triggered[0])
         {
          matchValue=v[0];
          if(matchValue.$==1)
           {
            matchValue.$0;
            if(Snap1.IsForever(sn1))
             {
              y=matchValue.$0;
              _2=Snap1.MarkForever(res,y);
             }
            else
             {
              if(matchValue.$==1)
               {
                y1=matchValue.$0;
                _3=Snap1.MarkReady(res,y1);
               }
              else
               {
                _3=null;
               }
              _2=_3;
             }
            _1=_2;
           }
          else
           {
            if(matchValue.$==1)
             {
              y2=matchValue.$0;
              _4=Snap1.MarkReady(res,y2);
             }
            else
             {
              _4=null;
             }
            _1=_4;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       Snap1.When(sn1,function()
       {
        triggered[0]=true;
        return cont(null);
       },obs);
       Snap1.When(sn2,function(y)
       {
        v[0]={
         $:1,
         $0:y
        };
        return cont(null);
       },function()
       {
       });
       return res;
      },
      When:function(snap,avail,obsolete)
      {
       var matchValue,_,v,q,q2,q1,v1;
       matchValue=snap.State;
       if(matchValue.$==1)
        {
         _=obsolete(null);
        }
       else
        {
         if(matchValue.$==2)
          {
           v=matchValue.$0;
           q=matchValue.$1;
           q.push(obsolete);
           _=avail(v);
          }
         else
          {
           if(matchValue.$==3)
            {
             q2=matchValue.$1;
             q1=matchValue.$0;
             q1.push(avail);
             _=q2.push(obsolete);
            }
           else
            {
             v1=matchValue.$0;
             _=avail(v1);
            }
          }
        }
       return _;
      }
     },
     Storage1:{
      ArrayStorage:Runtime.Class({
       Add:function(i,arr)
       {
        var value;
        value=arr.push(i);
        return arr;
       },
       Init:function()
       {
        return this.init;
       },
       RemoveIf:function(pred,arr)
       {
        return Arrays.filter(pred,arr);
       },
       Set:function(coll)
       {
        return Seq.toArray(coll);
       },
       SetAt:function(idx,elem,arr)
       {
        Arrays.set(arr,idx,elem);
        return arr;
       }
      },{
       New:function(init)
       {
        var r;
        r=Runtime.New(this,{});
        r.init=init;
        return r;
       }
      }),
      InMemory:function(init)
      {
       return ArrayStorage.New(init);
      },
      LocalStorage:function(id,serializer)
      {
       return LocalStorageBackend.New(id,serializer);
      },
      LocalStorageBackend:Runtime.Class({
       Add:function(i,arr)
       {
        var value;
        value=arr.push(i);
        return this.set(arr);
       },
       Init:function()
       {
        var item,_,_1,x,mapping,matchValue;
        item=this.storage.getItem(this.id);
        if(item===null)
         {
          _=[];
         }
        else
         {
          try
          {
           x=JSON.parse(item);
           mapping=this.serializer.Decode;
           _1=Arrays.map(mapping,x);
          }
          catch(matchValue)
          {
           _1=[];
          }
          _=_1;
         }
        return _;
       },
       RemoveIf:function(pred,arr)
       {
        var arr1;
        arr1=Arrays.filter(pred,arr);
        return this.set(arr1);
       },
       Set:function(coll)
       {
        var arr;
        arr=Seq.toArray(coll);
        return this.set(arr);
       },
       SetAt:function(idx,elem,arr)
       {
        Arrays.set(arr,idx,elem);
        return this.set(arr);
       },
       clear:function()
       {
        return this.storage.removeItem(this.id);
       },
       set:function(arr)
       {
        var mapping,_arg00_;
        mapping=this.serializer.Encode;
        _arg00_=Arrays.map(mapping,arr);
        this.storage.setItem(this.id,JSON.stringify(_arg00_));
        return arr;
       }
      },{
       New:function(id,serializer)
       {
        var r;
        r=Runtime.New(this,{});
        r.id=id;
        r.serializer=serializer;
        r.storage=window.localStorage;
        return r;
       }
      })
     },
     String:{
      isBlank:function(s)
      {
       return Strings.forall(function(arg00)
       {
        return Char.IsWhiteSpace(arg00);
       },s);
      }
     },
     Submitter:Runtime.Class({
      Trigger:function()
      {
       return Var1.Set(this["var"],null);
      },
      get_Input:function()
      {
       return this.input;
      },
      get_View:function()
      {
       return this.view;
      }
     },{
      Create:function(input,init)
      {
       return Submitter.New(input,init);
      },
      New:function(input,init)
      {
       var r,arg10,arg20;
       r=Runtime.New(this,{});
       r.input=input;
       r["var"]=Var.Create(null);
       arg10=r["var"].get_View();
       arg20=r.input;
       r.view=View.SnapshotOn(init,arg10,arg20);
       return r;
      }
     }),
     Submitter1:Runtime.Class({},{
      CreateOption:function(input)
      {
       var arg00;
       arg00=function(arg0)
       {
        return{
         $:1,
         $0:arg0
        };
       };
       return Submitter.New(View.Map(arg00,input),{
        $:0
       });
      },
      Input:function(s)
      {
       return s.get_Input();
      },
      Trigger:function(s)
      {
       return s.Trigger();
      },
      View:function(s)
      {
       return s.get_View();
      }
     }),
     Trans:Runtime.Class({},{
      AnimateChange:function(tr,x,y)
      {
       return(tr.TChange.call(null,x))(y);
      },
      AnimateEnter:function(tr,x)
      {
       return tr.TEnter.call(null,x);
      },
      AnimateExit:function(tr,x)
      {
       return tr.TExit.call(null,x);
      }
     }),
     Trans1:Runtime.Class({},{
      CanAnimateChange:function(tr)
      {
       return(tr.TFlags&1)!==0;
      },
      CanAnimateEnter:function(tr)
      {
       return(tr.TFlags&2)!==0;
      },
      CanAnimateExit:function(tr)
      {
       return(tr.TFlags&4)!==0;
      },
      Change:function(ch,tr)
      {
       var TFlags;
       TFlags=tr.TFlags|1;
       return{
        TChange:ch,
        TEnter:tr.TEnter,
        TExit:tr.TExit,
        TFlags:TFlags
       };
      },
      Create:function(ch)
      {
       return{
        TChange:ch,
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:1
       };
      },
      Enter:function(f,tr)
      {
       var TFlags;
       TFlags=tr.TFlags|2;
       return{
        TChange:tr.TChange,
        TEnter:f,
        TExit:tr.TExit,
        TFlags:TFlags
       };
      },
      Exit:function(f,tr)
      {
       var TFlags;
       TFlags=tr.TFlags|4;
       return{
        TChange:tr.TChange,
        TEnter:tr.TEnter,
        TExit:f,
        TFlags:TFlags
       };
      },
      Trivial:function()
      {
       return{
        TChange:function()
        {
         return function(y)
         {
          return An.Const(y);
         };
        },
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:0
       };
      }
     }),
     Trie1:{
      AllSome:function(xs)
      {
       var e,r,ok,matchValue,_,x;
       e=Enumerator.Get(xs);
       r=ResizeArrayProxy.New2();
       ok=true;
       while(ok?e.MoveNext():false)
        {
         matchValue=e.get_Current();
         if(matchValue.$==1)
          {
           x=matchValue.$0;
           _=r.Add(x);
          }
         else
          {
           _=ok=false;
          }
        }
       return ok?{
        $:1,
        $0:r.ToArray()
       }:{
        $:0
       };
      },
      Empty:function()
      {
       return{
        $:1
       };
      },
      IsLeaf:function(t)
      {
       return t.$==2?true:false;
      },
      Leaf:function(v)
      {
       return{
        $:2,
        $0:v
       };
      },
      Look:function(key,trie)
      {
       var matchValue,_,v,_1,k,ks,map,matchValue1,_2,trie1;
       matchValue=[trie,key];
       if(matchValue[0].$==2)
        {
         v=matchValue[0].$0;
         _={
          $:0,
          $0:v,
          $1:key
         };
        }
       else
        {
         if(matchValue[0].$==0)
          {
           if(matchValue[1].$==1)
            {
             k=matchValue[1].$0;
             ks=matchValue[1].$1;
             map=matchValue[0].$0;
             matchValue1=MapModule.TryFind(k,map);
             if(matchValue1.$==0)
              {
               _2={
                $:1
               };
              }
             else
              {
               trie1=matchValue1.$0;
               _2=Trie1.Look(ks,trie1);
              }
             _1=_2;
            }
           else
            {
             _1={
              $:1
             };
            }
           _=_1;
          }
         else
          {
           _={
            $:1
           };
          }
        }
       return _;
      },
      Lookup:function(trie,key)
      {
       return Trie1.Look(Seq.toList(key),trie);
      },
      Map:function(f,trie)
      {
       return Trie1.MapLoop(Runtime.New(T,{
        $:0
       }),f,trie);
      },
      MapLoop:function(loc,f,trie)
      {
       var _,x,mp,mapping,xs;
       if(trie.$==1)
        {
         _={
          $:1
         };
        }
       else
        {
         if(trie.$==2)
          {
           x=trie.$0;
           _={
            $:2,
            $0:(f(loc))(x)
           };
          }
         else
          {
           mp=trie.$0;
           mapping=function(k)
           {
            return function(v)
            {
             return Trie1.MapLoop(List.append(loc,List.ofArray([k])),f,v);
            };
           };
           xs=MapModule.Map(mapping,mp);
           _=Trie1.TrieBranch(xs);
          }
        }
       return _;
      },
      Mapi:function(f,trie)
      {
       var counter,next;
       counter=[0];
       next=function()
       {
        var c;
        c=counter[0];
        counter[0]=c+1;
        return c;
       };
       return Trie1.Map(function(x)
       {
        return(f(next(null)))(x);
       },trie);
      },
      Merge:function(ts)
      {
       var ts1,matchValue,_,_1,chooser,merge,mapping,maps,option;
       ts1=Seq.toArray(ts);
       matchValue=Arrays.length(ts1);
       if(matchValue===0)
        {
         _={
          $:1,
          $0:{
           $:1
          }
         };
        }
       else
        {
         if(matchValue===1)
          {
           _={
            $:1,
            $0:Arrays.get(ts1,0)
           };
          }
         else
          {
           if(Seq.exists(function(t)
           {
            return Trie1.IsLeaf(t);
           },ts1))
            {
             _1={
              $:0
             };
            }
           else
            {
             chooser=function(_arg1)
             {
              var _2,map;
              if(_arg1.$==0)
               {
                map=_arg1.$0;
                _2={
                 $:1,
                 $0:map
                };
               }
              else
               {
                _2={
                 $:0
                };
               }
              return _2;
             };
             merge=function(_arg00_)
             {
              return Trie1.Merge(_arg00_);
             };
             mapping=function(xs)
             {
              return Trie1.TrieBranch(xs);
             };
             maps=Seq.choose(chooser,ts1);
             option=Trie1.MergeMaps(merge,maps);
             _1=Option.map(mapping,option);
            }
           _=_1;
          }
        }
       return _;
      },
      MergeMaps:function(merge,maps)
      {
       var x,folder,state,x1,x2,mapping,x3,x4,mapping2;
       x=Seq.collect(function(table)
       {
        return MapModule.ToSeq(table);
       },maps);
       folder=function(s)
       {
        return function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return Trie1.MultiAdd(k,v,s);
        };
       };
       state=FSharpMap.New1([]);
       x1=Seq.fold(folder,state,x);
       x2=MapModule.ToSeq(x1);
       mapping=function(tupledArg)
       {
        var k,vs,mapping1,option;
        k=tupledArg[0];
        vs=tupledArg[1];
        mapping1=function(v)
        {
         return[k,v];
        };
        option=merge(vs);
        return Option.map(mapping1,option);
       };
       x3=Seq.map(mapping,x2);
       x4=Trie1.AllSome(x3);
       mapping2=function(elements)
       {
        return MapModule.OfArray(Seq.toArray(elements));
       };
       return Option.map(mapping2,x4);
      },
      MultiAdd:function(key,value,map)
      {
       return map.Add(key,Runtime.New(T,{
        $:1,
        $0:value,
        $1:Trie1.MultiFind(key,map)
       }));
      },
      MultiFind:function(key,map)
      {
       return Operators.DefaultArg(MapModule.TryFind(key,map),Runtime.New(T,{
        $:0
       }));
      },
      Prefix:function(key,trie)
      {
       return Trie1.TrieBranch(FSharpMap.New1(List.ofArray([[key,trie]])));
      },
      ToArray:function(trie)
      {
       var all,value;
       all=[];
       value=Trie1.Map(function()
       {
        return function(v)
        {
         return all.push(v);
        };
       },trie);
       return all.slice(0);
      },
      TrieBranch:function(xs)
      {
       return xs.get_IsEmpty()?{
        $:1
       }:{
        $:0,
        $0:xs
       };
      }
     },
     Var:Runtime.Class({
      Get:function()
      {
       return Var.Get(this);
      },
      Set:function(v)
      {
       return Var1.Set(this,v);
      },
      Update:function(f)
      {
       return Var1.Update(this,f);
      },
      UpdateMaybe:function(f)
      {
       var matchValue,_,v;
       matchValue=f(Var.Get(this));
       if(matchValue.$==1)
        {
         v=matchValue.$0;
         _=Var1.Set(this,v);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Id:function()
      {
       return"uinref"+Global.String(Var1.GetId(this));
      },
      get_Value:function()
      {
       return Var.Get(this);
      },
      get_View:function()
      {
       var _this=this;
       return{
        $:0,
        $0:function()
        {
         return Var1.Observe(_this);
        }
       };
      },
      get_View1:function()
      {
       return this.get_View();
      },
      set_Value:function(v)
      {
       return Var1.Set(this,v);
      }
     },{
      Create:function(v)
      {
       return Runtime.New(Var,{
        Const:false,
        Current:v,
        Snap:Snap1.CreateWithValue(v),
        Id:Fresh.Int()
       });
      },
      Get:function(_var)
      {
       return _var.Current;
      }
     }),
     Var1:Runtime.Class({},{
      GetId:function(_var)
      {
       return _var.Id;
      },
      Lens:function(iref,get,update)
      {
       return RefImpl.New(iref,get,update);
      },
      Observe:function(_var)
      {
       return _var.Snap;
      },
      Set:function(_var,value)
      {
       var _;
       if(_var.Const)
        {
         _=null;
        }
       else
        {
         Snap1.MarkObsolete(_var.Snap);
         _var.Current=value;
         _=void(_var.Snap=Snap1.CreateWithValue(value));
        }
       return _;
      },
      SetFinal:function(_var,value)
      {
       var _;
       if(_var.Const)
        {
         _=null;
        }
       else
        {
         _var.Const=true;
         _var.Current=value;
         _=void(_var.Snap=Snap1.CreateForever(value));
        }
       return _;
      },
      Update:function(_var,fn)
      {
       var arg10;
       arg10=fn(Var.Get(_var));
       return Var1.Set(_var,arg10);
      }
     }),
     View:Runtime.Class({},{
      ConvertSeqNode:function(conv,value)
      {
       var _var,view;
       _var=Var.Create(value);
       view=_var.get_View();
       return{
        NValue:conv(view),
        NVar:_var,
        NView:view
       };
      },
      CreateLazy:function(observe)
      {
       var cur,obs;
       cur=[{
        $:0
       }];
       obs=function()
       {
        var matchValue,_,sn,_1,sn1,sn2,sn3;
        matchValue=cur[0];
        if(matchValue.$==1)
         {
          sn=matchValue.$0;
          if(!Snap1.IsObsolete(sn))
           {
            sn1=matchValue.$0;
            _1=sn1;
           }
          else
           {
            sn2=observe(null);
            cur[0]={
             $:1,
             $0:sn2
            };
            _1=sn2;
           }
          _=_1;
         }
        else
         {
          sn3=observe(null);
          cur[0]={
           $:1,
           $0:sn3
          };
          _=sn3;
         }
        return _;
       };
       return{
        $:0,
        $0:obs
       };
      },
      CreateLazy2:function(snapFn,_arg4,_arg3)
      {
       var o1,o2;
       o1=_arg4.$0;
       o2=_arg3.$0;
       return View.CreateLazy(function()
       {
        var s1,s2;
        s1=o1(null);
        s2=o2(null);
        return(snapFn(s1))(s2);
       });
      },
      Map:function(fn,_arg1)
      {
       var observe;
       observe=_arg1.$0;
       return View.CreateLazy(function()
       {
        var _arg10_;
        _arg10_=observe(null);
        return Snap1.Map(fn,_arg10_);
       });
      },
      Map2:function(fn,v1,v2)
      {
       var arg00;
       arg00=function(_arg10_)
       {
        return function(_arg20_)
        {
         return Snap1.Map2(fn,_arg10_,_arg20_);
        };
       };
       return View.CreateLazy2(arg00,v1,v2);
      },
      MapAsync:function(fn,_arg5)
      {
       var observe;
       observe=_arg5.$0;
       return View.CreateLazy(function()
       {
        var _arg10_;
        _arg10_=observe(null);
        return Snap1.MapAsync(fn,_arg10_);
       });
      },
      MapAsync2:function(fn,v1,v2)
      {
       var arg00,arg10;
       arg00=function(x)
       {
        return x;
       };
       arg10=View.Map2(fn,v1,v2);
       return View.MapAsync(arg00,arg10);
      },
      MapCached:function(fn,_arg2)
      {
       var observe,vref;
       observe=_arg2.$0;
       vref=[{
        $:0
       }];
       return View.CreateLazy(function()
       {
        var _arg20_;
        _arg20_=observe(null);
        return Snap1.MapCached(vref,fn,_arg20_);
       });
      },
      MapSeqCached:function(conv,view)
      {
       var arg00;
       arg00=function(x)
       {
        return x;
       };
       return View.MapSeqCachedBy(arg00,conv,view);
      },
      MapSeqCachedBy:function(key,conv,view)
      {
       var state,arg00;
       state=[Dictionary.New12()];
       arg00=function(xs)
       {
        var prevState,newState,mapping,array,result;
        prevState=state[0];
        newState=Dictionary.New12();
        mapping=function(x)
        {
         var k,res;
         k=key(x);
         res=prevState.ContainsKey(k)?prevState.get_Item(k):conv(x);
         newState.set_Item(k,res);
         return res;
        };
        array=Seq.toArray(xs);
        result=Arrays.map(mapping,array);
        state[0]=newState;
        return result;
       };
       return View.Map(arg00,view);
      },
      MapSeqCachedView:function(conv,view)
      {
       var arg00,arg10;
       arg00=function(x)
       {
        return x;
       };
       arg10=function()
       {
        return function(v)
        {
         return conv(v);
        };
       };
       return View.MapSeqCachedViewBy(arg00,arg10,view);
      },
      MapSeqCachedViewBy:function(key,conv,view)
      {
       var state,arg00;
       state=[Dictionary.New12()];
       arg00=function(xs)
       {
        var prevState,newState,x,mapping,result;
        prevState=state[0];
        newState=Dictionary.New12();
        x=Seq.toArray(xs);
        mapping=function(x1)
        {
         var k,node,_,n,arg001,arg002;
         k=key(x1);
         if(prevState.ContainsKey(k))
          {
           n=prevState.get_Item(k);
           arg001=n.NVar;
           Var1.Set(arg001,x1);
           _=n;
          }
         else
          {
           arg002=function(v)
           {
            return(conv(k))(v);
           };
           _=View.ConvertSeqNode(arg002,x1);
          }
         node=_;
         newState.set_Item(k,node);
         return node.NValue;
        };
        result=Arrays.map(mapping,x);
        state[0]=newState;
        return result;
       };
       return View.Map(arg00,view);
      },
      SnapshotOn:function(def,_arg7,_arg6)
      {
       var o1,o2,sInit,obs;
       o1=_arg7.$0;
       o2=_arg6.$0;
       sInit=Snap1.CreateWithValue(def);
       obs=function()
       {
        var s1,s2,_,s;
        s1=o1(null);
        s2=o2(null);
        if(Snap1.IsObsolete(sInit))
         {
          _=Snap1.SnapshotOn(s1,s2);
         }
        else
         {
          s=Snap1.SnapshotOn(s1,s2);
          Snap1.When(s,function()
          {
          },function()
          {
           return Snap1.MarkObsolete(sInit);
          });
          _=sInit;
         }
        return _;
       };
       return View.CreateLazy(obs);
      },
      UpdateWhile:function(def,v1,v2)
      {
       var value,arg00;
       value=[def];
       arg00=function(pred)
       {
        return function(v)
        {
         pred?void(value[0]=v):null;
         return value[0];
        };
       };
       return View.Map2(arg00,v1,v2);
      },
      get_Do:function()
      {
       return{
        $:0
       };
      }
     }),
     View1:Runtime.Class({},{
      Apply:function(fn,view)
      {
       var arg00;
       arg00=function(f)
       {
        return function(x)
        {
         return f(x);
        };
       };
       return View.Map2(arg00,fn,view);
      },
      Bind:function(fn,view)
      {
       return View1.Join(View.Map(fn,view));
      },
      Const:function(x)
      {
       var o;
       o=Snap1.CreateForever(x);
       return{
        $:0,
        $0:function()
        {
         return o;
        }
       };
      },
      ConstAsync:function(a)
      {
       var o;
       o=Snap1.CreateForeverAsync(a);
       return{
        $:0,
        $0:function()
        {
         return o;
        }
       };
      },
      Join:function(_arg8)
      {
       var observe;
       observe=_arg8.$0;
       return View.CreateLazy(function()
       {
        var _arg00_,_arg10_;
        _arg00_=function(_arg2)
        {
         var obs;
         obs=_arg2.$0;
         return obs(null);
        };
        _arg10_=observe(null);
        return Snap1.Bind(_arg00_,_arg10_);
       });
      },
      Sequence:function(views)
      {
       return View.CreateLazy(function()
       {
        var mapping,_arg00_;
        mapping=function(_arg3)
        {
         var observe;
         observe=_arg3.$0;
         return observe(null);
        };
        _arg00_=Seq.map(mapping,views);
        return Snap1.Sequence(_arg00_);
       });
      },
      Sink:function(act,_arg11)
      {
       var observe,loop;
       observe=_arg11.$0;
       loop=function()
       {
        var sn;
        sn=observe(null);
        return Snap1.When(sn,act,function()
        {
         return Async.Schedule(loop);
        });
       };
       return Async.Schedule(loop);
      },
      TryFinally:function(f,_arg10)
      {
       var observe;
       observe=_arg10.$0;
       return View.CreateLazy(function()
       {
        var _;
        try
        {
         _=observe(null);
        }
        finally
        {
         f(null);
        }
        return _;
       });
      },
      TryWith:function(f,_arg9)
      {
       var observe;
       observe=_arg9.$0;
       return View.CreateLazy(function()
       {
        var _,exn,patternInput,obs;
        try
        {
         _=observe(null);
        }
        catch(exn)
        {
         patternInput=f(exn);
         obs=patternInput.$0;
         _=obs(null);
        }
        return _;
       });
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Array=Runtime.Safe(Global.Array);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Abbrev=Runtime.Safe(Next.Abbrev);
  Fresh=Runtime.Safe(Abbrev.Fresh);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  HashSet=Runtime.Safe(Abbrev.HashSet);
  Slot1=Runtime.Safe(Abbrev.Slot1);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  An=Runtime.Safe(Next.An);
  AppendList1=Runtime.Safe(Next.AppendList1);
  Anims=Runtime.Safe(Next.Anims);
  requestAnimationFrame=Runtime.Safe(Global.requestAnimationFrame);
  Trans=Runtime.Safe(Next.Trans);
  Option=Runtime.Safe(Global.WebSharper.Option);
  View=Runtime.Safe(Next.View);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  Array1=Runtime.Safe(Next.Array);
  Attrs=Runtime.Safe(Next.Attrs);
  DomUtility=Runtime.Safe(Next.DomUtility);
  AttrModule=Runtime.Safe(Next.AttrModule);
  AttrProxy=Runtime.Safe(Next.AttrProxy);
  List=Runtime.Safe(Global.WebSharper.List);
  AnimatedAttrNode=Runtime.Safe(Next.AnimatedAttrNode);
  Trans1=Runtime.Safe(Next.Trans1);
  DynamicAttrNode=Runtime.Safe(Next.DynamicAttrNode);
  View1=Runtime.Safe(Next.View1);
  document=Runtime.Safe(Global.document);
  Doc=Runtime.Safe(Next.Doc);
  Elt=Runtime.Safe(Next.Elt);
  Seq1=Runtime.Safe(Global.Seq);
  Docs=Runtime.Safe(Next.Docs);
  String=Runtime.Safe(Next.String);
  CheckedInput=Runtime.Safe(Next.CheckedInput);
  Mailbox=Runtime.Safe(Abbrev.Mailbox);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  T=Runtime.Safe(List.T);
  jQuery=Runtime.Safe(Global.jQuery);
  NodeSet=Runtime.Safe(Docs.NodeSet);
  DocElemNode=Runtime.Safe(Next.DocElemNode);
  DomNodes=Runtime.Safe(Docs.DomNodes);
  Easing=Runtime.Safe(Next.Easing);
  Easings=Runtime.Safe(Next.Easings);
  Var=Runtime.Safe(Next.Var);
  Var1=Runtime.Safe(Next.Var1);
  RegExp=Runtime.Safe(Global.RegExp);
  FlowBuilder=Runtime.Safe(Next.FlowBuilder);
  Flow=Runtime.Safe(Next.Flow);
  Input=Runtime.Safe(Next.Input);
  DoubleInterpolation=Runtime.Safe(Next.DoubleInterpolation);
  Key=Runtime.Safe(Next.Key);
  ListModels=Runtime.Safe(Next.ListModels);
  RefImpl1=Runtime.Safe(Next.RefImpl1);
  ListModel1=Runtime.Safe(Next.ListModel1);
  Storage1=Runtime.Safe(Next.Storage1);
  ListModel=Runtime.Safe(Next.ListModel);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Model1=Runtime.Safe(Next.Model1);
  Model=Runtime.Safe(Next.Model);
  encodeURIComponent=Runtime.Safe(Global.encodeURIComponent);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  Route=Runtime.Safe(Next.Route);
  decodeURIComponent=Runtime.Safe(Global.decodeURIComponent);
  Routing=Runtime.Safe(Next.Routing);
  Router=Runtime.Safe(Next.Router);
  Trie1=Runtime.Safe(Next.Trie1);
  window=Runtime.Safe(Global.window);
  Snap1=Runtime.Safe(Next.Snap1);
  Async=Runtime.Safe(Abbrev.Async);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  ArrayStorage=Runtime.Safe(Storage1.ArrayStorage);
  LocalStorageBackend=Runtime.Safe(Storage1.LocalStorageBackend);
  JSON=Runtime.Safe(Global.JSON);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Submitter=Runtime.Safe(Next.Submitter);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  MapModule=Runtime.Safe(Collections.MapModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  return RefImpl=Runtime.Safe(Next.RefImpl);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Elt,Doc);
  Input.MousePosSt1();
  Input.MouseBtnSt1();
  Input.KeyListenerState();
  Input.ActivateKeyListener();
  Input.ActivateButtonListener();
  Easings.CubicInOut();
  DomUtility.Doc();
  Attrs.EmptyAttr();
  Fresh.counter();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Html,Client,Implementation,Attribute,Pagelet,Element,Enumerator,Math,document,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,JQueryHtmlProvider,TagBuilder,Text,Attr,EventsPervasives,Tags;
 Runtime.Define(Global,{
  WebSharper:{
   Html:{
    Client:{
     Attr:{
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      })
     },
     Attribute:Runtime.Class({
      get_Body:function()
      {
       var attr;
       attr=this.HtmlProvider.CreateAttribute(this.Name);
       attr.value=this.Value;
       return attr;
      }
     },{
      New:function(htmlProvider,name,value)
      {
       var a;
       a=Attribute.New1(htmlProvider);
       a.Name=name;
       a.Value=value;
       return a;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     AttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Default:{
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,_,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       try
       {
        while(enumerator.MoveNext())
         {
          pl=enumerator.get_Current();
          el.AppendI(pl);
         }
       }
       finally
       {
        enumerator.Dispose!=undefined?enumerator.Dispose():null;
       }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var body,_,objectArg,arg00,objectArg1,arg001,arg10,_1,r;
       body=pl.get_Body();
       if(body.nodeType===2)
        {
         objectArg=this["HtmlProvider@33"];
         arg00=this.get_Body();
         _=objectArg.AppendAttribute(arg00,body);
        }
       else
        {
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         arg10=pl.get_Body();
         _=objectArg1.AppendNode(arg001,arg10);
        }
       if(this.IsRendered)
        {
         _1=pl.Render();
        }
       else
        {
         r=this.RenderInternal;
         _1=void(this.RenderInternal=function()
         {
          r(null);
          return pl.Render();
         });
        }
       return _1;
      },
      AppendN:function(node)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.AppendNode(arg00,node);
      },
      OnLoad:function(f)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.OnLoad(arg00,f);
      },
      Render:function()
      {
       var _;
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         _=void(this.IsRendered=true);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Body:function()
      {
       return this.Dom;
      },
      get_Html:function()
      {
       return this["HtmlProvider@33"].GetHtml(this.get_Body());
      },
      get_HtmlProvider:function()
      {
       return this["HtmlProvider@33"];
      },
      get_Id:function()
      {
       var objectArg,arg00,id,_,newId,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       id=objectArg.GetProperty(arg00,"id");
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         objectArg1.SetProperty(arg001,"id",newId);
         _=newId;
        }
       else
        {
         _=id;
        }
       return _;
      },
      get_Item:function(name)
      {
       var objectArg,arg00,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       objectArg.GetAttribute(arg00,name);
       objectArg1=this["HtmlProvider@33"];
       arg001=this.get_Body();
       return objectArg1.GetAttribute(arg001,name);
      },
      get_Text:function()
      {
       return this["HtmlProvider@33"].GetText(this.get_Body());
      },
      get_Value:function()
      {
       return this["HtmlProvider@33"].GetValue(this.get_Body());
      },
      set_Html:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetHtml(arg00,x);
      },
      set_Item:function(name,value)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetAttribute(arg00,name,value);
      },
      set_Text:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetText(arg00,x);
      },
      set_Value:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetValue(arg00,x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function()
       {
       };
       el.Dom=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r["HtmlProvider@33"]=HtmlProvider;
       return r;
      }
     }),
     Events:{
      JQueryEventSupport:Runtime.Class({
       OnBlur:function(f,el)
       {
        return jQuery(el.get_Body()).on("blur",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnChange:function(f,el)
       {
        return jQuery(el.get_Body()).on("change",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnClick:function(f,el)
       {
        return this.OnMouse("click",f,el);
       },
       OnDoubleClick:function(f,el)
       {
        return this.OnMouse("dblclick",f,el);
       },
       OnError:function(f,el)
       {
        return jQuery(el.get_Body()).on("error",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnEvent:function(ev,f,el)
       {
        return jQuery(el.get_Body()).on(ev,function(ev1)
        {
         return(f(el))(ev1);
        });
       },
       OnFocus:function(f,el)
       {
        return jQuery(el.get_Body()).on("focus",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnKeyDown:function(f,el)
       {
        return jQuery(el.get_Body()).on("keydown",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnKeyPress:function(f,el)
       {
        return jQuery(el.get_Body()).keypress(function(ev)
        {
         return(f(el))({
          CharacterCode:ev.which,
          Event:ev
         });
        });
       },
       OnKeyUp:function(f,el)
       {
        return jQuery(el.get_Body()).on("keyup",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).on("load",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnMouse:function(name,f,el)
       {
        return jQuery(el.get_Body()).on(name,function(ev)
        {
         return(f(el))({
          X:ev.pageX,
          Y:ev.pageY,
          Event:ev
         });
        });
       },
       OnMouseDown:function(f,el)
       {
        return this.OnMouse("mousedown",f,el);
       },
       OnMouseEnter:function(f,el)
       {
        return this.OnMouse("mouseenter",f,el);
       },
       OnMouseLeave:function(f,el)
       {
        return this.OnMouse("mouseleave",f,el);
       },
       OnMouseMove:function(f,el)
       {
        return this.OnMouse("mousemove",f,el);
       },
       OnMouseOut:function(f,el)
       {
        return this.OnMouse("mouseout",f,el);
       },
       OnMouseUp:function(f,el)
       {
        return this.OnMouse("mouseup",f,el);
       },
       OnResize:function(f,el)
       {
        return jQuery(el.get_Body()).on("resize",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnScroll:function(f,el)
       {
        return jQuery(el.get_Body()).on("scroll",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnSelect:function(f,el)
       {
        return jQuery(el.get_Body()).on("select",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnSubmit:function(f,el)
       {
        return jQuery(el.get_Body()).on("submit",function(ev)
        {
         return(f(el))(ev);
        });
       },
       OnUnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).on("unload",function(ev)
        {
         return(f(el))(ev);
        });
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     EventsPervasives:{
      Events:Runtime.Field(function()
      {
       return JQueryEventSupport.New();
      })
     },
     Implementation:{
      Attr:Runtime.Field(function()
      {
       return AttributeBuilder.New(Implementation.HtmlProvider());
      }),
      DeprecatedHtml:Runtime.Field(function()
      {
       return DeprecatedTagBuilder.New(Implementation.HtmlProvider());
      }),
      HtmlProvider:Runtime.Field(function()
      {
       return JQueryHtmlProvider.New();
      }),
      JQueryHtmlProvider:Runtime.Class({
       AddClass:function(node,cls)
       {
        return jQuery(node).addClass(cls);
       },
       AppendAttribute:function(node,attr)
       {
        var arg10,arg20;
        arg10=attr.nodeName;
        arg20=attr.value;
        return this.SetAttribute(node,arg10,arg20);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).contents().detach();
       },
       CreateAttribute:function(str)
       {
        return document.createAttribute(str);
       },
       CreateElement:function(name)
       {
        return document.createElement(name);
       },
       CreateTextNode:function(str)
       {
        return document.createTextNode(str);
       },
       GetAttribute:function(node,name)
       {
        return jQuery(node).attr(name);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        var x;
        x=jQuery(node).prop(name);
        return x;
       },
       GetText:function(node)
       {
        return node.textContent;
       },
       GetValue:function(node)
       {
        var x;
        x=jQuery(node).val();
        return x;
       },
       HasAttribute:function(node,name)
       {
        return jQuery(node).attr(name)!=null;
       },
       OnDocumentReady:function(f)
       {
        return jQuery(document).ready(function()
        {
         return f(null);
        });
       },
       OnLoad:function(node,f)
       {
        return jQuery(node).ready(function()
        {
         return f(null);
        });
       },
       Remove:function(node)
       {
        return jQuery(node).remove();
       },
       RemoveAttribute:function(node,name)
       {
        return jQuery(node).removeAttr(name);
       },
       RemoveClass:function(node,cls)
       {
        return jQuery(node).removeClass(cls);
       },
       SetAttribute:function(node,name,value)
       {
        return jQuery(node).attr(name,value);
       },
       SetCss:function(node,name,prop)
       {
        return jQuery(node).css(name,prop);
       },
       SetHtml:function(node,text)
       {
        return jQuery(node).html(text);
       },
       SetProperty:function(node,name,value)
       {
        var x;
        x=jQuery(node).prop(name,value);
        return x;
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        node.textContent=text;
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      }),
      Tags:Runtime.Field(function()
      {
       return TagBuilder.New(Implementation.HtmlProvider());
      })
     },
     Operators:{
      OnAfterRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        r.apply(w);
        return f(w);
       };
       return;
      },
      OnBeforeRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        f(w);
        return r.apply(w);
       };
       return;
      },
      add:function(el,inner)
      {
       var enumerator,_,pl;
       enumerator=Enumerator.Get(inner);
       try
       {
        while(enumerator.MoveNext())
         {
          pl=enumerator.get_Current();
          el.AppendI(pl);
         }
       }
       finally
       {
        enumerator.Dispose!=undefined?enumerator.Dispose():null;
       }
       return el;
      }
     },
     Pagelet:Runtime.Class({
      AppendTo:function(targetId)
      {
       var target,value;
       target=document.getElementById(targetId);
       value=target.appendChild(this.get_Body());
       return this.Render();
      },
      Render:function()
      {
       return null;
      },
      ReplaceInDom:function(node)
      {
       var value;
       value=node.parentNode.replaceChild(this.get_Body(),node);
       return this.Render();
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,_,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       try
       {
        while(enumerator.MoveNext())
         {
          pl=enumerator.get_Current();
          el.AppendI(pl);
         }
       }
       finally
       {
        enumerator.Dispose!=undefined?enumerator.Dispose():null;
       }
       return el;
      },
      text:function(data)
      {
       return Text.New(data);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Tags:{
      Deprecated:Runtime.Field(function()
      {
       return Implementation.DeprecatedHtml();
      }),
      Tags:Runtime.Field(function()
      {
       return Implementation.Tags();
      })
     },
     Text:Runtime.Class({
      get_Body:function()
      {
       return document.createTextNode(this.text);
      }
     },{
      New:function(text)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.text=text;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Implementation=Runtime.Safe(Client.Implementation);
  Attribute=Runtime.Safe(Client.Attribute);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Element=Runtime.Safe(Client.Element);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Math=Runtime.Safe(Global.Math);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Events=Runtime.Safe(Client.Events);
  JQueryEventSupport=Runtime.Safe(Events.JQueryEventSupport);
  AttributeBuilder=Runtime.Safe(Client.AttributeBuilder);
  DeprecatedTagBuilder=Runtime.Safe(Client.DeprecatedTagBuilder);
  JQueryHtmlProvider=Runtime.Safe(Implementation.JQueryHtmlProvider);
  TagBuilder=Runtime.Safe(Client.TagBuilder);
  Text=Runtime.Safe(Client.Text);
  Attr=Runtime.Safe(Client.Attr);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  return Tags=Runtime.Safe(Client.Tags);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Attribute,Pagelet);
  Runtime.Inherit(Element,Pagelet);
  Runtime.Inherit(Text,Pagelet);
  Tags.Tags();
  Tags.Deprecated();
  Implementation.Tags();
  Implementation.HtmlProvider();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Attr.Attr();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Seq,Option,Control,Disposable,Arrays,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Concurrency,Operators,TimeoutException,setTimeout,clearTimeout,LinkedList,T,MailboxProcessor,Observable,Observer,Ref,Observable1,List,T1,Observer1;
 Runtime.Define(Global,{
  WebSharper:{
   Control:{
    Disposable:{
     Of:function(dispose)
     {
      return{
       Dispose:dispose
      };
     }
    },
    Event:{
     Event:Runtime.Class({
      AddHandler:function(h)
      {
       return this.Handlers.Add(h);
      },
      RemoveHandler:function(h)
      {
       var predicate,objectArg,action,source,option;
       predicate=function(y)
       {
        return Unchecked.Equals(h,y);
       };
       objectArg=this.Handlers;
       action=function(arg00)
       {
        return objectArg.RemoveAt(arg00);
       };
       source=this.Handlers;
       option=Seq.tryFindIndex(predicate,source);
       return Option.iter(action,option);
      },
      Subscribe:function(observer)
      {
       var h,_this=this;
       h=function(x)
       {
        return observer.OnNext(x);
       };
       this.AddHandler(h);
       return Disposable.Of(function()
       {
        return _this.RemoveHandler(h);
       });
      },
      Trigger:function(x)
      {
       var arr,idx,h;
       arr=this.Handlers.ToArray();
       for(idx=0;idx<=arr.length-1;idx++){
        h=Arrays.get(arr,idx);
        h(x);
       }
       return;
      }
     })
    },
    EventModule:{
     Choose:function(c,e)
     {
      var r;
      r=FSharpEvent.New();
      Util.addListener(e,function(x)
      {
       var matchValue,_,y;
       matchValue=c(x);
       if(matchValue.$==0)
        {
         _=null;
        }
       else
        {
         y=matchValue.$0;
         _=r.event.Trigger(y);
        }
       return _;
      });
      return r.event;
     },
     Filter:function(ok,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return ok(x)?r.Trigger(x):null;
      });
      return r;
     },
     Map:function(f,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return r.Trigger(f(x));
      });
      return r;
     },
     Merge:function(e1,e2)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e1,function(arg00)
      {
       return r.Trigger(arg00);
      });
      Util.addListener(e2,function(arg00)
      {
       return r.Trigger(arg00);
      });
      return r;
     },
     Pairwise:function(e)
     {
      var buf,ev;
      buf=[{
       $:0
      }];
      ev=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       var matchValue,_,old;
       matchValue=buf[0];
       if(matchValue.$==1)
        {
         old=matchValue.$0;
         buf[0]={
          $:1,
          $0:x
         };
         _=ev.Trigger([old,x]);
        }
       else
        {
         _=void(buf[0]={
          $:1,
          $0:x
         });
        }
       return _;
      });
      return ev;
     },
     Partition:function(f,e)
     {
      return[EventModule.Filter(f,e),EventModule.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var state,f;
      state=[seed];
      f=function(value)
      {
       state[0]=(fold(state[0]))(value);
       return state[0];
      };
      return EventModule.Map(f,e);
     },
     Split:function(f,e)
     {
      var chooser,chooser1;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      return[EventModule.Choose(chooser,e),EventModule.Choose(chooser1,e)];
     }
    },
    FSharpEvent:Runtime.Class({},{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.event=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      return r;
     }
    }),
    HotStream:{
     HotStream:Runtime.Class({
      Subscribe:function(o)
      {
       var disp;
       this.Latest[0].$==1?o.OnNext(this.Latest[0].$0):null;
       disp=Util.subscribeTo(this.Event.event,function(v)
       {
        return o.OnNext(v);
       });
       return disp;
      },
      Trigger:function(v)
      {
       this.Latest[0]={
        $:1,
        $0:v
       };
       return this.Event.event.Trigger(v);
      }
     },{
      New:function()
      {
       return Runtime.New(HotStream1,{
        Latest:[{
         $:0
        }],
        Event:FSharpEvent.New()
       });
      }
     })
    },
    MailboxProcessor:Runtime.Class({
     PostAndAsyncReply:function(msgf,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.PostAndTryAsyncReply(msgf,timeout),function(_arg4)
       {
        var _,x;
        if(_arg4.$==1)
         {
          x=_arg4.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(TimeoutException.New());
         }
        return Concurrency.Return(_);
       });
      });
     },
     PostAndTryAsyncReply:function(msgf,timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg3,_arg4,_,arg001,waiting,arg002,value;
       ok=tupledArg[0];
       _arg3=tupledArg[1];
       _arg4=tupledArg[2];
       if(timeout1<0)
        {
         arg001=msgf(function(x)
         {
          return ok({
           $:1,
           $0:x
          });
         });
         _this.mailbox.AddLast(arg001);
         _=_this.resume();
        }
       else
        {
         waiting=[true];
         arg002=msgf(function(res)
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:1,
             $0:res
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         });
         _this.mailbox.AddLast(arg002);
         _this.resume();
         value=setTimeout(function()
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:0
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         },timeout1);
         _=void value;
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     Receive:function(timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryReceive(timeout),function(_arg3)
       {
        var _,x;
        if(_arg3.$==1)
         {
          x=_arg3.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(TimeoutException.New());
         }
        return Concurrency.Return(_);
       });
      });
     },
     Scan:function(scanner,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryScan(scanner,timeout),function(_arg8)
       {
        var _,x;
        if(_arg8.$==1)
         {
          x=_arg8.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(TimeoutException.New());
         }
        return Concurrency.Return(_);
       });
      });
     },
     Start:function()
     {
      var _,a,_this=this;
      if(this.started)
       {
        _=Operators.FailWith("The MailboxProcessor has already been started.");
       }
      else
       {
        this.started=true;
        a=Concurrency.Delay(function()
        {
         return Concurrency.TryWith(Concurrency.Delay(function()
         {
          return Concurrency.Bind(_this.initial.call(null,_this),function()
          {
           return Concurrency.Return(null);
          });
         }),function(_arg2)
         {
          _this.errorEvent.event.Trigger(_arg2);
          return Concurrency.Return(null);
         });
        });
        _=_this.startAsync(a);
       }
      return _;
     },
     TryReceive:function(timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg1,_arg2,_,_1,arg0,waiting,pending,arg02,arg03;
       ok=tupledArg[0];
       _arg1=tupledArg[1];
       _arg2=tupledArg[2];
       if(Unchecked.Equals(_this.mailbox.get_First(),null))
        {
         if(timeout1<0)
          {
           arg0=Concurrency.Delay(function()
           {
            var arg01;
            arg01=_this.dequeue();
            ok({
             $:1,
             $0:arg01
            });
            return Concurrency.Return(null);
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg0
           });
          }
         else
          {
           waiting=[true];
           pending=setTimeout(function()
           {
            var _2;
            if(waiting[0])
             {
              waiting[0]=false;
              _this.savedCont={
               $:0
              };
              _2=ok({
               $:0
              });
             }
            else
             {
              _2=null;
             }
            return _2;
           },timeout1);
           arg02=Concurrency.Delay(function()
           {
            var _2,arg01;
            if(waiting[0])
             {
              waiting[0]=false;
              clearTimeout(pending);
              arg01=_this.dequeue();
              ok({
               $:1,
               $0:arg01
              });
              _2=Concurrency.Return(null);
             }
            else
             {
              _2=Concurrency.Return(null);
             }
            return _2;
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg02
           });
          }
         _=_1;
        }
       else
        {
         arg03=_this.dequeue();
         _=ok({
          $:1,
          $0:arg03
         });
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     TryScan:function(scanner,timeout)
     {
      var timeout1,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      return Concurrency.Delay(function()
      {
       var scanInbox,matchValue1,_1,found1,arg00;
       scanInbox=function()
       {
        var m,found,matchValue,_;
        m=_this.mailbox.get_First();
        found={
         $:0
        };
        while(!Unchecked.Equals(m,null))
         {
          matchValue=scanner(m.v);
          if(matchValue.$==0)
           {
            _=m=m.n;
           }
          else
           {
            _this.mailbox.Remove(m);
            m=null;
            _=found=matchValue;
           }
         }
        return found;
       };
       matchValue1=scanInbox(null);
       if(matchValue1.$==1)
        {
         found1=matchValue1.$0;
         _1=Concurrency.Bind(found1,function(_arg5)
         {
          return Concurrency.Return({
           $:1,
           $0:_arg5
          });
         });
        }
       else
        {
         arg00=function(tupledArg)
         {
          var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
          ok=tupledArg[0];
          _arg5=tupledArg[1];
          _arg6=tupledArg[2];
          if(timeout1<0)
           {
            scanNext=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg61)
                {
                 ok({
                  $:1,
                  $0:_arg61
                 });
                 return Concurrency.Return(null);
                });
               }
              else
               {
                scanNext(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext(null);
           }
          else
           {
            waiting=[true];
            pending=setTimeout(function()
            {
             var _2;
             if(waiting[0])
              {
               waiting[0]=false;
               _this.savedCont={
                $:0
               };
               _2=ok({
                $:0
               });
              }
             else
              {
               _2=null;
              }
             return _2;
            },timeout1);
            scanNext1=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg7)
                {
                 var _3;
                 if(waiting[0])
                  {
                   waiting[0]=false;
                   clearTimeout(pending);
                   ok({
                    $:1,
                    $0:_arg7
                   });
                   _3=Concurrency.Return(null);
                  }
                 else
                  {
                   _3=Concurrency.Return(null);
                  }
                 return _3;
                });
               }
              else
               {
                scanNext1(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext1(null);
           }
          return _;
         };
         _1=Concurrency.FromContinuations(arg00);
        }
       return _1;
      });
     },
     dequeue:function()
     {
      var f;
      f=this.mailbox.get_First().v;
      this.mailbox.RemoveFirst();
      return f;
     },
     get_CurrentQueueLength:function()
     {
      return this.mailbox.get_Count();
     },
     get_DefaultTimeout:function()
     {
      return this["DefaultTimeout@"];
     },
     get_Error:function()
     {
      return this.errorEvent.event;
     },
     resume:function()
     {
      var matchValue,_,c;
      matchValue=this.savedCont;
      if(matchValue.$==1)
       {
        c=matchValue.$0;
        this.savedCont={
         $:0
        };
        _=this.startAsync(c);
       }
      else
       {
        _=null;
       }
      return _;
     },
     set_DefaultTimeout:function(v)
     {
      this["DefaultTimeout@"]=v;
      return;
     },
     startAsync:function(a)
     {
      return Concurrency.Start(a,this.token);
     }
    },{
     New:function(initial,token)
     {
      var r,matchValue,_,ct,value;
      r=Runtime.New(this,{});
      r.initial=initial;
      r.token=token;
      r.started=false;
      r.errorEvent=FSharpEvent.New();
      r.mailbox=T.New();
      r.savedCont={
       $:0
      };
      matchValue=r.token;
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        ct=matchValue.$0;
        value=Concurrency.Register(ct,function()
        {
         return function()
         {
          return r.resume();
         }();
        });
        _=void value;
       }
      r["DefaultTimeout@"]=-1;
      return r;
     },
     Start:function(initial,token)
     {
      var mb;
      mb=MailboxProcessor.New(initial,token);
      mb.Start();
      return mb;
     }
    }),
    Observable:{
     Aggregate:function(io,seed,fold)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Choose:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v);
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     CombineLatest:function(io1,io2,f)
     {
      var f1;
      f1=function(o)
      {
       var lv1,lv2,update,onNext,o1,onNext1,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=Observable.Protect(function()
            {
             return(f(v1))(v2);
            },function(arg00)
            {
             return o.OnNext(arg00);
            },function(arg00)
            {
             return o.OnError(arg00);
            });
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       };
       o1=Observer.New(onNext,function()
       {
       },function()
       {
       });
       onNext1=function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       };
       o2=Observer.New(onNext1,function()
       {
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.Of(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(f1);
     },
     Concat:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var innerDisp,outerDisp,dispose;
       innerDisp=[{
        $:0
       }];
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
       },function()
       {
        var arg0;
        arg0=io2.Subscribe(o);
        innerDisp[0]={
         $:1,
         $0:arg0
        };
       }));
       dispose=function()
       {
        innerDisp[0].$==1?innerDisp[0].$0.Dispose():null;
        return outerDisp.Dispose();
       };
       return Disposable.Of(dispose);
      };
      return Observable.New(f);
     },
     Drop:function(count,io)
     {
      var f;
      f=function(o1)
      {
       var index,on,arg00;
       index=[0];
       on=function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Filter:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v)?{
          $:1,
          $0:v
         }:{
          $:0
         };
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Map:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return f(v);
        },function(arg00)
        {
         return o1.OnNext(arg00);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Merge:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var completed1,completed2,arg00,disp1,arg002,disp2;
       completed1=[false];
       completed2=[false];
       arg00=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp1=io1.Subscribe(arg00);
       arg002=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp2=io2.Subscribe(arg002);
       return Disposable.Of(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(f);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.Of(function()
       {
       });
      });
     },
     New:function(f)
     {
      return Runtime.New(Observable1,{
       Subscribe1:f
      });
     },
     Observable:Runtime.Class({
      Subscribe:function(observer)
      {
       return this.Subscribe1.call(null,observer);
      }
     }),
     Of:function(f)
     {
      return Observable.New(function(o)
      {
       return Disposable.Of(f(function(x)
       {
        return o.OnNext(x);
       }));
      });
     },
     Protect:function(f,succeed,fail)
     {
      var matchValue,_,e,_1,e1,x;
      try
      {
       _={
        $:0,
        $0:f(null)
       };
      }
      catch(e)
      {
       _={
        $:1,
        $0:e
       };
      }
      matchValue=_;
      if(matchValue.$==1)
       {
        e1=matchValue.$0;
        _1=fail(e1);
       }
      else
       {
        x=matchValue.$0;
        _1=succeed(x);
       }
      return _1;
     },
     Range:function(start,count)
     {
      var f;
      f=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(v)
        {
         return o.OnNext(v);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.Of(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Observable.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T1,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Observable.Return(Runtime.New(T1,{
          $:0
         }));
        }
       return _;
      };
      return sequence(List.ofSeq(ios));
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index=[0];
       disp=[{
        $:0
       }];
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Ref.incr(index);
        disp[0].$==1?disp[0].$0.Dispose():null;
        currentIndex=index[0];
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index[0]?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp[0]=d;
        return;
       });
       return disp1;
      });
     }
    },
    ObservableModule:{
     Pairwise:function(e)
     {
      var f;
      f=function(o1)
      {
       var last,on,arg00;
       last=[{
        $:0
       }];
       on=function(v)
       {
        var matchValue,_,l;
        matchValue=last[0];
        if(matchValue.$==1)
         {
          l=matchValue.$0;
          _=o1.OnNext([l,v]);
         }
        else
         {
          _=null;
         }
        last[0]={
         $:1,
         $0:v
        };
        return;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Partition:function(f,e)
     {
      return[Observable.Filter(f,e),Observable.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Split:function(f,e)
     {
      var chooser,left,chooser1,right;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      left=Observable.Choose(chooser,e);
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      right=Observable.Choose(chooser1,e);
      return[left,right];
     }
    },
    Observer:{
     New:function(f,e,c)
     {
      return Runtime.New(Observer1,{
       onNext:f,
       onError:e,
       onCompleted:c
      });
     },
     Observer:Runtime.Class({
      OnCompleted:function()
      {
       return this.onCompleted.call(null,null);
      },
      OnError:function(e)
      {
       return this.onError.call(null,e);
      },
      OnNext:function(x)
      {
       return this.onNext.call(null,x);
      }
     }),
     Of:function(f)
     {
      return Runtime.New(Observer1,{
       onNext:function(x)
       {
        return f(x);
       },
       onError:function(x)
       {
        return Operators.Raise(x);
       },
       onCompleted:function()
       {
        return null;
       }
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Control=Runtime.Safe(Global.WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  TimeoutException=Runtime.Safe(Global.WebSharper.TimeoutException);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  T=Runtime.Safe(LinkedList.T);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

d3=function(){function n(n){return null!=n&&!isNaN(n)}function t(n){return n.length}function e(n){for(var t=1;n*t%1;)t*=10;return t}function r(n,t){try{for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}catch(r){n.prototype=t}}function u(){}function i(){}function o(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function a(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.substring(1);for(var e=0,r=Do.length;r>e;++e){var u=Do[e]+t;if(u in n)return u}}function c(){}function l(){}function s(n){function t(){for(var t,r=e,u=-1,i=r.length;++u<i;)(t=r[u].on)&&t.apply(this,arguments);return n}var e=[],r=new u;return t.on=function(t,u){var i,o=r.get(t);return arguments.length<2?o&&o.on:(o&&(o.on=null,e=e.slice(0,i=e.indexOf(o)).concat(e.slice(i+1)),r.remove(t)),u&&e.push(r.set(t,{on:u})),n)},t}function f(){mo.event.preventDefault()}function h(){for(var n,t=mo.event;n=t.sourceEvent;)t=n;return t}function g(n){for(var t=new l,e=0,r=arguments.length;++e<r;)t[arguments[e]]=s(t);return t.of=function(e,r){return function(u){try{var i=u.sourceEvent=mo.event;u.target=n,mo.event=u,t[u.type].apply(e,r)}finally{mo.event=i}}},t}function p(n){return Lo(n,Ro),n}function d(n){return"function"==typeof n?n:function(){return Ho(n,this)}}function v(n){return"function"==typeof n?n:function(){return Fo(n,this)}}function m(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function u(){this.setAttribute(n,t)}function i(){this.setAttributeNS(n.space,n.local,t)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=mo.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?a:o:n.local?i:u}function y(n){return n.trim().replace(/\s+/g," ")}function M(n){return new RegExp("(?:^|\\s+)"+mo.requote(n)+"(?:\\s+|$)","g")}function x(n,t){function e(){for(var e=-1;++e<u;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<u;)n[e](this,r)}n=n.trim().split(/\s+/).map(b);var u=n.length;return"function"==typeof t?r:e}function b(n){var t=M(n);return function(e,r){if(u=e.classList)return r?u.add(n):u.remove(n);var u=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(u)||e.setAttribute("class",y(u+" "+n))):e.setAttribute("class",y(u.replace(t," ")))}}function _(n,t,e){function r(){this.style.removeProperty(n)}function u(){this.style.setProperty(n,t,e)}function i(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?i:u}function w(n,t){function e(){delete this[n]}function r(){this[n]=t}function u(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?u:r}function S(n){return"function"==typeof n?n:(n=mo.ns.qualify(n)).local?function(){return xo.createElementNS(n.space,n.local)}:function(){return xo.createElementNS(this.namespaceURI,n)}}function E(n){return{__data__:n}}function k(n){return function(){return Oo(this,n)}}function A(n){return arguments.length||(n=mo.ascending),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function N(n,t){for(var e=0,r=n.length;r>e;e++)for(var u,i=n[e],o=0,a=i.length;a>o;o++)(u=i[o])&&t(u,o,e);return n}function T(n){return Lo(n,Io),n}function q(n){var t,e;return function(r,u,i){var o,a=n[i].update,c=a.length;for(i!=e&&(e=i,t=0),u>=t&&(t=u+1);!(o=a[t])&&++t<c;);return o}}function z(){var n=this.__transition__;n&&++n.active}function C(n,t,e){function r(){var t=this[o];t&&(this.removeEventListener(n,t,t.$),delete this[o])}function u(){var u=l(t,Mo(arguments));r.call(this),this.addEventListener(n,this[o]=u,u.$=e),u._=t}function i(){var t,e=new RegExp("^__on([^.]+)"+mo.requote(n)+"$");for(var r in this)if(t=r.match(e)){var u=this[r];this.removeEventListener(t[1],u,u.$),delete this[r]}}var o="__on"+n,a=n.indexOf("."),l=D;a>0&&(n=n.substring(0,a));var s=Zo.get(n);return s&&(n=s,l=j),a?t?u:r:t?c:i}function D(n,t){return function(e){var r=mo.event;mo.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{mo.event=r}}}function j(n,t){var e=D(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function L(){var n=".dragsuppress-"+ ++Xo,t="touchmove"+n,e="selectstart"+n,r="dragstart"+n,u="click"+n,i=mo.select(_o).on(t,f).on(e,f).on(r,f),o=bo.style,a=o[Vo];return o[Vo]="none",function(t){function e(){i.on(u,null)}i.on(n,null),o[Vo]=a,t&&(i.on(u,function(){f(),e()},!0),setTimeout(e,0))}}function H(n,t){t.changedTouches&&(t=t.changedTouches[0]);var e=n.ownerSVGElement||n;if(e.createSVGPoint){var r=e.createSVGPoint();if(0>$o&&(_o.scrollX||_o.scrollY)){e=mo.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var u=e[0][0].getScreenCTM();$o=!(u.f||u.e),e.remove()}return $o?(r.x=t.pageX,r.y=t.pageY):(r.x=t.clientX,r.y=t.clientY),r=r.matrixTransform(n.getScreenCTM().inverse()),[r.x,r.y]}var i=n.getBoundingClientRect();return[t.clientX-i.left-n.clientLeft,t.clientY-i.top-n.clientTop]}function F(n){return n>0?1:0>n?-1:0}function P(n){return n>1?0:-1>n?Bo:Math.acos(n)}function O(n){return n>1?Jo:-1>n?-Jo:Math.asin(n)}function R(n){return((n=Math.exp(n))-1/n)/2}function Y(n){return((n=Math.exp(n))+1/n)/2}function I(n){return((n=Math.exp(2*n))-1)/(n+1)}function U(n){return(n=Math.sin(n/2))*n}function Z(){}function V(n,t,e){return new X(n,t,e)}function X(n,t,e){this.h=n,this.s=t,this.l=e}function $(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?i+(o-i)*n/60:180>n?o:240>n?i+(o-i)*(240-n)/60:i}function u(n){return Math.round(255*r(n))}var i,o;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,o=.5>=e?e*(1+t):e+t-e*t,i=2*e-o,ot(u(n+120),u(n),u(n-120))}function B(n,t,e){return new W(n,t,e)}function W(n,t,e){this.h=n,this.c=t,this.l=e}function J(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),G(e,Math.cos(n*=Qo)*t,Math.sin(n)*t)}function G(n,t,e){return new K(n,t,e)}function K(n,t,e){this.l=n,this.a=t,this.b=e}function Q(n,t,e){var r=(n+16)/116,u=r+t/500,i=r-e/200;return u=tt(u)*sa,r=tt(r)*fa,i=tt(i)*ha,ot(rt(3.2404542*u-1.5371385*r-.4985314*i),rt(-.969266*u+1.8760108*r+.041556*i),rt(.0556434*u-.2040259*r+1.0572252*i))}function nt(n,t,e){return n>0?B(Math.atan2(e,t)*na,Math.sqrt(t*t+e*e),n):B(0/0,0/0,n)}function tt(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function et(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function rt(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function ut(n){return ot(n>>16,255&n>>8,255&n)}function it(n){return ut(n)+""}function ot(n,t,e){return new at(n,t,e)}function at(n,t,e){this.r=n,this.g=t,this.b=e}function ct(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function lt(n,t,e){var r,u,i,o=0,a=0,c=0;if(r=/([a-z]+)\((.*)\)/i.exec(n))switch(u=r[2].split(","),r[1]){case"hsl":return e(parseFloat(u[0]),parseFloat(u[1])/100,parseFloat(u[2])/100);case"rgb":return t(gt(u[0]),gt(u[1]),gt(u[2]))}return(i=da.get(n))?t(i.r,i.g,i.b):(null!=n&&"#"===n.charAt(0)&&(4===n.length?(o=n.charAt(1),o+=o,a=n.charAt(2),a+=a,c=n.charAt(3),c+=c):7===n.length&&(o=n.substring(1,3),a=n.substring(3,5),c=n.substring(5,7)),o=parseInt(o,16),a=parseInt(a,16),c=parseInt(c,16)),t(o,a,c))}function st(n,t,e){var r,u,i=Math.min(n/=255,t/=255,e/=255),o=Math.max(n,t,e),a=o-i,c=(o+i)/2;return a?(u=.5>c?a/(o+i):a/(2-o-i),r=n==o?(t-e)/a+(e>t?6:0):t==o?(e-n)/a+2:(n-t)/a+4,r*=60):(r=0/0,u=c>0&&1>c?0:r),V(r,u,c)}function ft(n,t,e){n=ht(n),t=ht(t),e=ht(e);var r=et((.4124564*n+.3575761*t+.1804375*e)/sa),u=et((.2126729*n+.7151522*t+.072175*e)/fa),i=et((.0193339*n+.119192*t+.9503041*e)/ha);return G(116*u-16,500*(r-u),200*(u-i))}function ht(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function gt(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function pt(n){return"function"==typeof n?n:function(){return n}}function dt(n){return n}function vt(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),mt(t,e,n,r)}}function mt(n,t,e,r){function u(){var n,t=c.status;if(!t&&c.responseText||t>=200&&300>t||304===t){try{n=e.call(i,c)}catch(r){return o.error.call(i,r),void 0}o.load.call(i,n)}else o.error.call(i,c)}var i={},o=mo.dispatch("beforesend","progress","load","error"),a={},c=new XMLHttpRequest,l=null;return!_o.XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(n)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=u:c.onreadystatechange=function(){c.readyState>3&&u()},c.onprogress=function(n){var t=mo.event;mo.event=n;try{o.progress.call(i,c)}finally{mo.event=t}},i.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?a[n]:(null==t?delete a[n]:a[n]=t+"",i)},i.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",i):t},i.responseType=function(n){return arguments.length?(l=n,i):l},i.response=function(n){return e=n,i},["get","post"].forEach(function(n){i[n]=function(){return i.send.apply(i,[n].concat(Mo(arguments)))}}),i.send=function(e,r,u){if(2===arguments.length&&"function"==typeof r&&(u=r,r=null),c.open(e,n,!0),null==t||"accept"in a||(a.accept=t+",*/*"),c.setRequestHeader)for(var s in a)c.setRequestHeader(s,a[s]);return null!=t&&c.overrideMimeType&&c.overrideMimeType(t),null!=l&&(c.responseType=l),null!=u&&i.on("error",u).on("load",function(n){u(null,n)}),o.beforesend.call(i,c),c.send(null==r?null:r),i},i.abort=function(){return c.abort(),i},mo.rebind(i,o,"on"),null==r?i:i.get(yt(r))}function yt(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Mt(){var n=bt(),t=_t()-n;t>24?(isFinite(t)&&(clearTimeout(Ma),Ma=setTimeout(Mt,t)),ya=0):(ya=1,ba(Mt))}function xt(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now()),xa.callback=n,xa.time=e+t}function bt(){var n=Date.now();for(xa=va;xa;)n>=xa.time&&(xa.flush=xa.callback(n-xa.time)),xa=xa.next;return n}function _t(){for(var n,t=va,e=1/0;t;)t.flush?t=n?n.next=t.next:va=t.next:(t.time<e&&(e=t.time),t=(n=t).next);return ma=n,e}function wt(n,t){var e=Math.pow(10,3*Math.abs(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function St(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Et(n){return n+""}function kt(){}function At(n,t,e){var r=e.s=n+t,u=r-n,i=r-u;e.t=n-i+(t-u)}function Nt(n,t){n&&Da.hasOwnProperty(n.type)&&Da[n.type](n,t)}function Tt(n,t,e){var r,u=-1,i=n.length-e;for(t.lineStart();++u<i;)r=n[u],t.point(r[0],r[1],r[2]);t.lineEnd()}function qt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)Tt(n[e],t,1);t.polygonEnd()}function zt(){function n(n,t){n*=Qo,t=t*Qo/2+Bo/4;var e=n-r,o=Math.cos(t),a=Math.sin(t),c=i*a,l=u*o+c*Math.cos(e),s=c*Math.sin(e);La.add(Math.atan2(s,l)),r=n,u=o,i=a}var t,e,r,u,i;Ha.point=function(o,a){Ha.point=n,r=(t=o)*Qo,u=Math.cos(a=(e=a)*Qo/2+Bo/4),i=Math.sin(a)},Ha.lineEnd=function(){n(t,e)}}function Ct(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function Dt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function jt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Lt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function Ht(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function Ft(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function Pt(n){return[Math.atan2(n[1],n[0]),O(n[2])]}function Ot(n,t){return Math.abs(n[0]-t[0])<Go&&Math.abs(n[1]-t[1])<Go}function Rt(n,t){n*=Qo;var e=Math.cos(t*=Qo);Yt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function Yt(n,t,e){++Fa,Oa+=(n-Oa)/Fa,Ra+=(t-Ra)/Fa,Ya+=(e-Ya)/Fa}function It(){function n(n,u){n*=Qo;var i=Math.cos(u*=Qo),o=i*Math.cos(n),a=i*Math.sin(n),c=Math.sin(u),l=Math.atan2(Math.sqrt((l=e*c-r*a)*l+(l=r*o-t*c)*l+(l=t*a-e*o)*l),t*o+e*a+r*c);Pa+=l,Ia+=l*(t+(t=o)),Ua+=l*(e+(e=a)),Za+=l*(r+(r=c)),Yt(t,e,r)}var t,e,r;Ba.point=function(u,i){u*=Qo;var o=Math.cos(i*=Qo);t=o*Math.cos(u),e=o*Math.sin(u),r=Math.sin(i),Ba.point=n,Yt(t,e,r)}}function Ut(){Ba.point=Rt}function Zt(){function n(n,t){n*=Qo;var e=Math.cos(t*=Qo),o=e*Math.cos(n),a=e*Math.sin(n),c=Math.sin(t),l=u*c-i*a,s=i*o-r*c,f=r*a-u*o,h=Math.sqrt(l*l+s*s+f*f),g=r*o+u*a+i*c,p=h&&-P(g)/h,d=Math.atan2(h,g);Va+=p*l,Xa+=p*s,$a+=p*f,Pa+=d,Ia+=d*(r+(r=o)),Ua+=d*(u+(u=a)),Za+=d*(i+(i=c)),Yt(r,u,i)}var t,e,r,u,i;Ba.point=function(o,a){t=o,e=a,Ba.point=n,o*=Qo;var c=Math.cos(a*=Qo);r=c*Math.cos(o),u=c*Math.sin(o),i=Math.sin(a),Yt(r,u,i)},Ba.lineEnd=function(){n(t,e),Ba.lineEnd=Ut,Ba.point=Rt}}function Vt(){return!0}function Xt(n,t,e,r,u){var i=[],o=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(Ot(e,r)){u.lineStart();for(var a=0;t>a;++a)u.point((e=n[a])[0],e[1]);return u.lineEnd(),void 0}var c={point:e,points:n,other:null,visited:!1,entry:!0,subject:!0},l={point:e,points:[e],other:c,visited:!1,entry:!1,subject:!1};c.other=l,i.push(c),o.push(l),c={point:r,points:[r],other:null,visited:!1,entry:!1,subject:!0},l={point:r,points:[r],other:c,visited:!1,entry:!0,subject:!1},c.other=l,i.push(c),o.push(l)}}),o.sort(t),$t(i),$t(o),i.length){for(var a=0,c=e,l=o.length;l>a;++a)o[a].entry=c=!c;for(var s,f,h,g=i[0];;){for(s=g;s.visited;)if((s=s.next)===g)return;f=s.points,u.lineStart();do{if(s.visited=s.other.visited=!0,s.entry){if(s.subject)for(var a=0;a<f.length;a++)u.point((h=f[a])[0],h[1]);else r(s.point,s.next.point,1,u);s=s.next}else{if(s.subject){f=s.prev.points;for(var a=f.length;--a>=0;)u.point((h=f[a])[0],h[1])}else r(s.point,s.prev.point,-1,u);s=s.prev}s=s.other,f=s.points}while(!s.visited);u.lineEnd()}}}function $t(n){if(t=n.length){for(var t,e,r=0,u=n[0];++r<t;)u.next=e=n[r],e.prev=u,u=e;u.next=e=n[0],e.prev=u}}function Bt(n,t,e,r){return function(u,i){function o(t,e){var r=u(t,e);n(t=r[0],e=r[1])&&i.point(t,e)}function a(n,t){var e=u(n,t);v.point(e[0],e[1])}function c(){y.point=a,v.lineStart()}function l(){y.point=o,v.lineEnd()}function s(n,t){d.push([n,t]);var e=u(n,t);x.point(e[0],e[1])}function f(){x.lineStart(),d=[]}function h(){s(d[0][0],d[0][1]),x.lineEnd();var n,t=x.clean(),e=M.buffer(),r=e.length;if(d.pop(),p.push(d),d=null,r){if(1&t){n=e[0];var u,r=n.length-1,o=-1;for(i.lineStart();++o<r;)i.point((u=n[o])[0],u[1]);return i.lineEnd(),void 0}r>1&&2&t&&e.push(e.pop().concat(e.shift())),g.push(e.filter(Wt))}}var g,p,d,v=t(i),m=u.invert(r[0],r[1]),y={point:o,lineStart:c,lineEnd:l,polygonStart:function(){y.point=s,y.lineStart=f,y.lineEnd=h,g=[],p=[],i.polygonStart()},polygonEnd:function(){y.point=o,y.lineStart=c,y.lineEnd=l,g=mo.merge(g);var n=Kt(m,p);g.length?Xt(g,Gt,n,e,i):n&&(i.lineStart(),e(null,null,1,i),i.lineEnd()),i.polygonEnd(),g=p=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},M=Jt(),x=t(M);return y}}function Wt(n){return n.length>1}function Jt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:c,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Gt(n,t){return((n=n.point)[0]<0?n[1]-Jo-Go:Jo-n[1])-((t=t.point)[0]<0?t[1]-Jo-Go:Jo-t[1])}function Kt(n,t){var e=n[0],r=n[1],u=[Math.sin(e),-Math.cos(e),0],i=0,o=0;La.reset();for(var a=0,c=t.length;c>a;++a){var l=t[a],s=l.length;if(s)for(var f=l[0],h=f[0],g=f[1]/2+Bo/4,p=Math.sin(g),d=Math.cos(g),v=1;;){v===s&&(v=0),n=l[v];var m=n[0],y=n[1]/2+Bo/4,M=Math.sin(y),x=Math.cos(y),b=m-h,_=Math.abs(b)>Bo,w=p*M;if(La.add(Math.atan2(w*Math.sin(b),d*x+w*Math.cos(b))),i+=_?b+(b>=0?2:-2)*Bo:b,_^h>=e^m>=e){var S=jt(Ct(f),Ct(n));Ft(S);var E=jt(u,S);Ft(E);var k=(_^b>=0?-1:1)*O(E[2]);(r>k||r===k&&(S[0]||S[1]))&&(o+=_^b>=0?1:-1)}if(!v++)break;h=m,p=M,d=x,f=n}}return(-Go>i||Go>i&&0>La)^1&o}function Qt(n){var t,e=0/0,r=0/0,u=0/0;return{lineStart:function(){n.lineStart(),t=1},point:function(i,o){var a=i>0?Bo:-Bo,c=Math.abs(i-e);Math.abs(c-Bo)<Go?(n.point(e,r=(r+o)/2>0?Jo:-Jo),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(a,r),n.point(i,r),t=0):u!==a&&c>=Bo&&(Math.abs(e-u)<Go&&(e-=u*Go),Math.abs(i-a)<Go&&(i-=a*Go),r=ne(e,r,i,o),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(a,r),t=0),n.point(e=i,r=o),u=a},lineEnd:function(){n.lineEnd(),e=r=0/0},clean:function(){return 2-t}}}function ne(n,t,e,r){var u,i,o=Math.sin(n-e);return Math.abs(o)>Go?Math.atan((Math.sin(t)*(i=Math.cos(r))*Math.sin(e)-Math.sin(r)*(u=Math.cos(t))*Math.sin(n))/(u*i*o)):(t+r)/2}function te(n,t,e,r){var u;if(null==n)u=e*Jo,r.point(-Bo,u),r.point(0,u),r.point(Bo,u),r.point(Bo,0),r.point(Bo,-u),r.point(0,-u),r.point(-Bo,-u),r.point(-Bo,0),r.point(-Bo,u);else if(Math.abs(n[0]-t[0])>Go){var i=(n[0]<t[0]?1:-1)*Bo;u=e*i/2,r.point(-i,u),r.point(0,u),r.point(i,u)}else r.point(t[0],t[1])}function ee(n){function t(n,t){return Math.cos(n)*Math.cos(t)>i}function e(n){var e,i,c,l,s;return{lineStart:function(){l=c=!1,s=1},point:function(f,h){var g,p=[f,h],d=t(f,h),v=o?d?0:u(f,h):d?u(f+(0>f?Bo:-Bo),h):0;if(!e&&(l=c=d)&&n.lineStart(),d!==c&&(g=r(e,p),(Ot(e,g)||Ot(p,g))&&(p[0]+=Go,p[1]+=Go,d=t(p[0],p[1]))),d!==c)s=0,d?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(a&&e&&o^d){var m;v&i||!(m=r(p,e,!0))||(s=0,o?(n.lineStart(),n.point(m[0][0],m[0][1]),n.point(m[1][0],m[1][1]),n.lineEnd()):(n.point(m[1][0],m[1][1]),n.lineEnd(),n.lineStart(),n.point(m[0][0],m[0][1])))}!d||e&&Ot(e,p)||n.point(p[0],p[1]),e=p,c=d,i=v},lineEnd:function(){c&&n.lineEnd(),e=null},clean:function(){return s|(l&&c)<<1}}}function r(n,t,e){var r=Ct(n),u=Ct(t),o=[1,0,0],a=jt(r,u),c=Dt(a,a),l=a[0],s=c-l*l;if(!s)return!e&&n;var f=i*c/s,h=-i*l/s,g=jt(o,a),p=Ht(o,f),d=Ht(a,h);Lt(p,d);var v=g,m=Dt(p,v),y=Dt(v,v),M=m*m-y*(Dt(p,p)-1);if(!(0>M)){var x=Math.sqrt(M),b=Ht(v,(-m-x)/y);if(Lt(b,p),b=Pt(b),!e)return b;var _,w=n[0],S=t[0],E=n[1],k=t[1];w>S&&(_=w,w=S,S=_);var A=S-w,N=Math.abs(A-Bo)<Go,T=N||Go>A;if(!N&&E>k&&(_=E,E=k,k=_),T?N?E+k>0^b[1]<(Math.abs(b[0]-w)<Go?E:k):E<=b[1]&&b[1]<=k:A>Bo^(w<=b[0]&&b[0]<=S)){var q=Ht(v,(-m+x)/y);return Lt(q,p),[b,Pt(q)]}}}function u(t,e){var r=o?n:Bo-n,u=0;return-r>t?u|=1:t>r&&(u|=2),-r>e?u|=4:e>r&&(u|=8),u}var i=Math.cos(n),o=i>0,a=Math.abs(i)>Go,c=Te(n,6*Qo);return Bt(t,e,c,o?[0,-n]:[-Bo,n-Bo])}function re(n,t,e,r){function u(r,u){return Math.abs(r[0]-n)<Go?u>0?0:3:Math.abs(r[0]-e)<Go?u>0?2:1:Math.abs(r[1]-t)<Go?u>0?1:0:u>0?3:2}function i(n,t){return o(n.point,t.point)}function o(n,t){var e=u(n,1),r=u(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}function a(u,i){var o=i[0]-u[0],a=i[1]-u[1],c=[0,1];return Math.abs(o)<Go&&Math.abs(a)<Go?n<=u[0]&&u[0]<=e&&t<=u[1]&&u[1]<=r:ue(n-u[0],o,c)&&ue(u[0]-e,-o,c)&&ue(t-u[1],a,c)&&ue(u[1]-r,-a,c)?(c[1]<1&&(i[0]=u[0]+c[1]*o,i[1]=u[1]+c[1]*a),c[0]>0&&(u[0]+=c[0]*o,u[1]+=c[0]*a),!0):!1}return function(c){function l(n){for(var t=0,e=y.length,r=n[1],u=0;e>u;++u)for(var i,o=1,a=y[u],c=a.length,l=a[0];c>o;++o)i=a[o],l[1]<=r?i[1]>r&&s(l,i,n)>0&&++t:i[1]<=r&&s(l,i,n)<0&&--t,l=i;return 0!==t}function s(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(e[0]-n[0])*(t[1]-n[1])}function f(i,a,c,l){var s=0,f=0;if(null==i||(s=u(i,c))!==(f=u(a,c))||o(i,a)<0^c>0){do l.point(0===s||3===s?n:e,s>1?r:t);while((s=(s+c+4)%4)!==f)}else l.point(a[0],a[1])}function h(u,i){return u>=n&&e>=u&&i>=t&&r>=i}function g(n,t){h(n,t)&&c.point(n,t)}function p(){q.point=v,y&&y.push(M=[]),k=!0,E=!1,w=S=0/0}function d(){m&&(v(x,b),_&&E&&T.rejoin(),m.push(T.buffer())),q.point=g,E&&c.lineEnd()}function v(n,t){n=Math.max(-Ja,Math.min(Ja,n)),t=Math.max(-Ja,Math.min(Ja,t));var e=h(n,t);if(y&&M.push([n,t]),k)x=n,b=t,_=e,k=!1,e&&(c.lineStart(),c.point(n,t));else if(e&&E)c.point(n,t);else{var r=[w,S],u=[n,t];a(r,u)?(E||(c.lineStart(),c.point(r[0],r[1])),c.point(u[0],u[1]),e||c.lineEnd(),A=!1):e&&(c.lineStart(),c.point(n,t),A=!1)}w=n,S=t,E=e}var m,y,M,x,b,_,w,S,E,k,A,N=c,T=Jt(),q={point:g,lineStart:p,lineEnd:d,polygonStart:function(){c=T,m=[],y=[],A=!0},polygonEnd:function(){c=N,m=mo.merge(m);var t=l([n,r]),e=A&&t,u=m.length;(e||u)&&(c.polygonStart(),e&&(c.lineStart(),f(null,null,1,c),c.lineEnd()),u&&Xt(m,i,t,f,c),c.polygonEnd()),m=y=M=null}};return q}}function ue(n,t,e){if(Math.abs(t)<Go)return 0>=n;var r=n/t;if(t>0){if(r>e[1])return!1;r>e[0]&&(e[0]=r)}else{if(r<e[0])return!1;r<e[1]&&(e[1]=r)}return!0}function ie(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function oe(n){var t=0,e=Bo/3,r=be(n),u=r(t,e);return u.parallels=function(n){return arguments.length?r(t=n[0]*Bo/180,e=n[1]*Bo/180):[180*(t/Bo),180*(e/Bo)]},u}function ae(n,t){function e(n,t){var e=Math.sqrt(i-2*u*Math.sin(t))/u;return[e*Math.sin(n*=u),o-e*Math.cos(n)]}var r=Math.sin(n),u=(r+Math.sin(t))/2,i=1+r*(2*u-r),o=Math.sqrt(i)/u;return e.invert=function(n,t){var e=o-t;return[Math.atan2(n,e)/u,O((i-(n*n+e*e)*u*u)/(2*u))]},e}function ce(){function n(n,t){Ka+=u*n-r*t,r=n,u=t}var t,e,r,u;rc.point=function(i,o){rc.point=n,t=r=i,e=u=o},rc.lineEnd=function(){n(t,e)}}function le(n,t){Qa>n&&(Qa=n),n>tc&&(tc=n),nc>t&&(nc=t),t>ec&&(ec=t)}function se(){function n(n,t){o.push("M",n,",",t,i)}function t(n,t){o.push("M",n,",",t),a.point=e}function e(n,t){o.push("L",n,",",t)}function r(){a.point=n}function u(){o.push("Z")}var i=fe(4.5),o=[],a={point:n,lineStart:function(){a.point=t},lineEnd:r,polygonStart:function(){a.lineEnd=u},polygonEnd:function(){a.lineEnd=r,a.point=n},pointRadius:function(n){return i=fe(n),a},result:function(){if(o.length){var n=o.join("");return o=[],n}}};return a}function fe(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function he(n,t){Oa+=n,Ra+=t,++Ya}function ge(){function n(n,r){var u=n-t,i=r-e,o=Math.sqrt(u*u+i*i);Ia+=o*(t+n)/2,Ua+=o*(e+r)/2,Za+=o,he(t=n,e=r)}var t,e;ic.point=function(r,u){ic.point=n,he(t=r,e=u)}}function pe(){ic.point=he}function de(){function n(n,t){var e=n-r,i=t-u,o=Math.sqrt(e*e+i*i);Ia+=o*(r+n)/2,Ua+=o*(u+t)/2,Za+=o,o=u*n-r*t,Va+=o*(r+n),Xa+=o*(u+t),$a+=3*o,he(r=n,u=t)}var t,e,r,u;ic.point=function(i,o){ic.point=n,he(t=r=i,e=u=o)},ic.lineEnd=function(){n(t,e)}}function ve(n){function t(t,e){n.moveTo(t,e),n.arc(t,e,o,0,Wo)}function e(t,e){n.moveTo(t,e),a.point=r}function r(t,e){n.lineTo(t,e)}function u(){a.point=t}function i(){n.closePath()}var o=4.5,a={point:t,lineStart:function(){a.point=e},lineEnd:u,polygonStart:function(){a.lineEnd=i},polygonEnd:function(){a.lineEnd=u,a.point=t},pointRadius:function(n){return o=n,a},result:c};return a}function me(n){function t(t){function r(e,r){e=n(e,r),t.point(e[0],e[1])}function u(){M=0/0,S.point=o,t.lineStart()}function o(r,u){var o=Ct([r,u]),a=n(r,u);e(M,x,y,b,_,w,M=a[0],x=a[1],y=r,b=o[0],_=o[1],w=o[2],i,t),t.point(M,x)}function a(){S.point=r,t.lineEnd()}function c(){u(),S.point=l,S.lineEnd=s}function l(n,t){o(f=n,h=t),g=M,p=x,d=b,v=_,m=w,S.point=o}function s(){e(M,x,y,b,_,w,g,p,f,d,v,m,i,t),S.lineEnd=a,a()}var f,h,g,p,d,v,m,y,M,x,b,_,w,S={point:r,lineStart:u,lineEnd:a,polygonStart:function(){t.polygonStart(),S.lineStart=c},polygonEnd:function(){t.polygonEnd(),S.lineStart=u}};return S}function e(t,i,o,a,c,l,s,f,h,g,p,d,v,m){var y=s-t,M=f-i,x=y*y+M*M;if(x>4*r&&v--){var b=a+g,_=c+p,w=l+d,S=Math.sqrt(b*b+_*_+w*w),E=Math.asin(w/=S),k=Math.abs(Math.abs(w)-1)<Go?(o+h)/2:Math.atan2(_,b),A=n(k,E),N=A[0],T=A[1],q=N-t,z=T-i,C=M*q-y*z;(C*C/x>r||Math.abs((y*q+M*z)/x-.5)>.3||u>a*g+c*p+l*d)&&(e(t,i,o,a,c,l,N,T,k,b/=S,_/=S,w,v,m),m.point(N,T),e(N,T,k,b,_,w,s,f,h,g,p,d,v,m))}}var r=.5,u=Math.cos(30*Qo),i=16;return t.precision=function(n){return arguments.length?(i=(r=n*n)>0&&16,t):Math.sqrt(r)},t}function ye(n){this.stream=n}function Me(n){var t=me(function(t,e){return n([t*na,e*na])});return function(n){var e=new ye(n=t(n));return e.point=function(t,e){n.point(t*Qo,e*Qo)},e}}function xe(n){return be(function(){return n})()}function be(n){function t(n){return n=a(n[0]*Qo,n[1]*Qo),[n[0]*h+c,l-n[1]*h]}function e(n){return n=a.invert((n[0]-c)/h,(l-n[1])/h),n&&[n[0]*na,n[1]*na]}function r(){a=ie(o=Ee(m,y,M),i);var n=i(d,v);return c=g-n[0]*h,l=p+n[1]*h,u()}function u(){return s&&(s.valid=!1,s=null),t}var i,o,a,c,l,s,f=me(function(n,t){return n=i(n,t),[n[0]*h+c,l-n[1]*h]}),h=150,g=480,p=250,d=0,v=0,m=0,y=0,M=0,x=Wa,b=dt,_=null,w=null;return t.stream=function(n){return s&&(s.valid=!1),s=_e(x(o,f(b(n)))),s.valid=!0,s},t.clipAngle=function(n){return arguments.length?(x=null==n?(_=n,Wa):ee((_=+n)*Qo),u()):_},t.clipExtent=function(n){return arguments.length?(w=n,b=n?re(n[0][0],n[0][1],n[1][0],n[1][1]):dt,u()):w},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(d=n[0]%360*Qo,v=n[1]%360*Qo,r()):[d*na,v*na]},t.rotate=function(n){return arguments.length?(m=n[0]%360*Qo,y=n[1]%360*Qo,M=n.length>2?n[2]%360*Qo:0,r()):[m*na,y*na,M*na]},mo.rebind(t,f,"precision"),function(){return i=n.apply(this,arguments),t.invert=i.invert&&e,r()}}function _e(n){var t=new ye(n);return t.point=function(t,e){n.point(t*Qo,e*Qo)},t}function we(n,t){return[n,t]}function Se(n,t){return[n>Bo?n-Wo:-Bo>n?n+Wo:n,t]}function Ee(n,t,e){return n?t||e?ie(Ae(n),Ne(t,e)):Ae(n):t||e?Ne(t,e):Se}function ke(n){return function(t,e){return t+=n,[t>Bo?t-Wo:-Bo>t?t+Wo:t,e]}}function Ae(n){var t=ke(n);return t.invert=ke(-n),t}function Ne(n,t){function e(n,t){var e=Math.cos(t),a=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*r+a*u;return[Math.atan2(c*i-s*o,a*r-l*u),O(s*i+c*o)]}var r=Math.cos(n),u=Math.sin(n),i=Math.cos(t),o=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),a=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*i-c*o;return[Math.atan2(c*i+l*o,a*r+s*u),O(s*r-a*u)]},e}function Te(n,t){var e=Math.cos(n),r=Math.sin(n);return function(u,i,o,a){var c=o*t;null!=u?(u=qe(e,u),i=qe(e,i),(o>0?i>u:u>i)&&(u+=o*Wo)):(u=n+o*Wo,i=n-.5*c);for(var l,s=u;o>0?s>i:i>s;s-=c)a.point((l=Pt([e,-r*Math.cos(s),-r*Math.sin(s)]))[0],l[1])}}function qe(n,t){var e=Ct(t);e[0]-=n,Ft(e);var r=P(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Go)%(2*Math.PI)}function ze(n,t,e){var r=mo.range(n,t-Go,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function Ce(n,t,e){var r=mo.range(n,t-Go,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function De(n){return n.source}function je(n){return n.target}function Le(n,t,e,r){var u=Math.cos(t),i=Math.sin(t),o=Math.cos(r),a=Math.sin(r),c=u*Math.cos(n),l=u*Math.sin(n),s=o*Math.cos(e),f=o*Math.sin(e),h=2*Math.asin(Math.sqrt(U(r-t)+u*o*U(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*c+t*s,u=e*l+t*f,o=e*i+t*a;return[Math.atan2(u,r)*na,Math.atan2(o,Math.sqrt(r*r+u*u))*na]}:function(){return[n*na,t*na]};return p.distance=h,p}function He(){function n(n,u){var i=Math.sin(u*=Qo),o=Math.cos(u),a=Math.abs((n*=Qo)-t),c=Math.cos(a);oc+=Math.atan2(Math.sqrt((a=o*Math.sin(a))*a+(a=r*i-e*o*c)*a),e*i+r*o*c),t=n,e=i,r=o}var t,e,r;ac.point=function(u,i){t=u*Qo,e=Math.sin(i*=Qo),r=Math.cos(i),ac.point=n},ac.lineEnd=function(){ac.point=ac.lineEnd=c}}function Fe(n,t){function e(t,e){var r=Math.cos(t),u=Math.cos(e),i=n(r*u);return[i*u*Math.sin(t),i*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),u=t(r),i=Math.sin(u),o=Math.cos(u);return[Math.atan2(n*i,r*o),Math.asin(r&&e*i/r)]},e}function Pe(n,t){function e(n,t){var e=Math.abs(Math.abs(t)-Jo)<Go?0:o/Math.pow(u(t),i);return[e*Math.sin(i*n),o-e*Math.cos(i*n)]}var r=Math.cos(n),u=function(n){return Math.tan(Bo/4+n/2)},i=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(u(t)/u(n)),o=r*Math.pow(u(n),i)/i;return i?(e.invert=function(n,t){var e=o-t,r=F(i)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/i,2*Math.atan(Math.pow(o/r,1/i))-Jo]},e):Re}function Oe(n,t){function e(n,t){var e=i-t;return[e*Math.sin(u*n),i-e*Math.cos(u*n)]}var r=Math.cos(n),u=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),i=r/u+n;return Math.abs(u)<Go?we:(e.invert=function(n,t){var e=i-t;return[Math.atan2(n,e)/u,i-F(u)*Math.sqrt(n*n+e*e)]},e)}function Re(n,t){return[n,Math.log(Math.tan(Bo/4+t/2))]}function Ye(n){var t,e=xe(n),r=e.scale,u=e.translate,i=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=u.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var o=i.apply(e,arguments);if(o===e){if(t=null==n){var a=Bo*r(),c=u();i([[c[0]-a,c[1]-a],[c[0]+a,c[1]+a]])}}else t&&(o=null);return o},e.clipExtent(null)}function Ie(n,t){var e=Math.cos(t)*Math.sin(n);return[Math.log((1+e)/(1-e))/2,Math.atan2(Math.tan(t),Math.cos(n))]}function Ue(n){function t(t){function o(){l.push("M",i(n(s),a))}for(var c,l=[],s=[],f=-1,h=t.length,g=pt(e),p=pt(r);++f<h;)u.call(this,c=t[f],f)?s.push([+g.call(this,c,f),+p.call(this,c,f)]):s.length&&(o(),s=[]);return s.length&&o(),l.length?l.join(""):null}var e=Ze,r=Ve,u=Vt,i=Xe,o=i.key,a=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(u=n,t):u},t.interpolate=function(n){return arguments.length?(o="function"==typeof n?i=n:(i=gc.get(n)||Xe).key,t):o},t.tension=function(n){return arguments.length?(a=n,t):a},t}function Ze(n){return n[0]}function Ve(n){return n[1]}function Xe(n){return n.join("L")}function $e(n){return Xe(n)+"Z"}function Be(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&u.push("H",r[0]),u.join("")}function We(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("V",(r=n[t])[1],"H",r[0]);return u.join("")}function Je(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r=n[t])[0],"V",r[1]);return u.join("")}function Ge(n,t){return n.length<4?Xe(n):n[1]+nr(n.slice(1,n.length-1),tr(n,t))}function Ke(n,t){return n.length<3?Xe(n):n[0]+nr((n.push(n[0]),n),tr([n[n.length-2]].concat(n,[n[1]]),t))}function Qe(n,t){return n.length<3?Xe(n):n[0]+nr(n,tr(n,t))}function nr(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return Xe(n);var e=n.length!=t.length,r="",u=n[0],i=n[1],o=t[0],a=o,c=1;if(e&&(r+="Q"+(i[0]-2*o[0]/3)+","+(i[1]-2*o[1]/3)+","+i[0]+","+i[1],u=n[1],c=2),t.length>1){a=t[1],i=n[c],c++,r+="C"+(u[0]+o[0])+","+(u[1]+o[1])+","+(i[0]-a[0])+","+(i[1]-a[1])+","+i[0]+","+i[1];for(var l=2;l<t.length;l++,c++)i=n[c],a=t[l],r+="S"+(i[0]-a[0])+","+(i[1]-a[1])+","+i[0]+","+i[1]}if(e){var s=n[c];r+="Q"+(i[0]+2*a[0]/3)+","+(i[1]+2*a[1]/3)+","+s[0]+","+s[1]}return r}function tr(n,t){for(var e,r=[],u=(1-t)/2,i=n[0],o=n[1],a=1,c=n.length;++a<c;)e=i,i=o,o=n[a],r.push([u*(o[0]-e[0]),u*(o[1]-e[1])]);return r}function er(n){if(n.length<3)return Xe(n);var t=1,e=n.length,r=n[0],u=r[0],i=r[1],o=[u,u,u,(r=n[1])[0]],a=[i,i,i,r[1]],c=[u,",",i,"L",or(vc,o),",",or(vc,a)];for(n.push(n[e-1]);++t<=e;)r=n[t],o.shift(),o.push(r[0]),a.shift(),a.push(r[1]),ar(c,o,a);return n.pop(),c.push("L",r),c.join("")}function rr(n){if(n.length<4)return Xe(n);for(var t,e=[],r=-1,u=n.length,i=[0],o=[0];++r<3;)t=n[r],i.push(t[0]),o.push(t[1]);for(e.push(or(vc,i)+","+or(vc,o)),--r;++r<u;)t=n[r],i.shift(),i.push(t[0]),o.shift(),o.push(t[1]),ar(e,i,o);return e.join("")}function ur(n){for(var t,e,r=-1,u=n.length,i=u+4,o=[],a=[];++r<4;)e=n[r%u],o.push(e[0]),a.push(e[1]);for(t=[or(vc,o),",",or(vc,a)],--r;++r<i;)e=n[r%u],o.shift(),o.push(e[0]),a.shift(),a.push(e[1]),ar(t,o,a);return t.join("")}function ir(n,t){var e=n.length-1;if(e)for(var r,u,i=n[0][0],o=n[0][1],a=n[e][0]-i,c=n[e][1]-o,l=-1;++l<=e;)r=n[l],u=l/e,r[0]=t*r[0]+(1-t)*(i+u*a),r[1]=t*r[1]+(1-t)*(o+u*c);return er(n)}function or(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function ar(n,t,e){n.push("C",or(pc,t),",",or(pc,e),",",or(dc,t),",",or(dc,e),",",or(vc,t),",",or(vc,e))}function cr(n,t){return(t[1]-n[1])/(t[0]-n[0])}function lr(n){for(var t=0,e=n.length-1,r=[],u=n[0],i=n[1],o=r[0]=cr(u,i);++t<e;)r[t]=(o+(o=cr(u=i,i=n[t+1])))/2;return r[t]=o,r
}function sr(n){for(var t,e,r,u,i=[],o=lr(n),a=-1,c=n.length-1;++a<c;)t=cr(n[a],n[a+1]),Math.abs(t)<Go?o[a]=o[a+1]=0:(e=o[a]/t,r=o[a+1]/t,u=e*e+r*r,u>9&&(u=3*t/Math.sqrt(u),o[a]=u*e,o[a+1]=u*r));for(a=-1;++a<=c;)u=(n[Math.min(c,a+1)][0]-n[Math.max(0,a-1)][0])/(6*(1+o[a]*o[a])),i.push([u||0,o[a]*u||0]);return i}function fr(n){return n.length<3?Xe(n):n[0]+nr(n,sr(n))}function hr(n,t,e,r){var u,i,o,a,c,l,s;return u=r[n],i=u[0],o=u[1],u=r[t],a=u[0],c=u[1],u=r[e],l=u[0],s=u[1],(s-o)*(a-i)-(c-o)*(l-i)>0}function gr(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function pr(n,t,e,r){var u=n[0],i=e[0],o=t[0]-u,a=r[0]-i,c=n[1],l=e[1],s=t[1]-c,f=r[1]-l,h=(a*(c-l)-f*(u-i))/(f*o-a*s);return[u+h*o,c+h*s]}function dr(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function vr(n,t){var e={list:n.map(function(n,t){return{index:t,x:n[0],y:n[1]}}).sort(function(n,t){return n.y<t.y?-1:n.y>t.y?1:n.x<t.x?-1:n.x>t.x?1:0}),bottomSite:null},r={list:[],leftEnd:null,rightEnd:null,init:function(){r.leftEnd=r.createHalfEdge(null,"l"),r.rightEnd=r.createHalfEdge(null,"l"),r.leftEnd.r=r.rightEnd,r.rightEnd.l=r.leftEnd,r.list.unshift(r.leftEnd,r.rightEnd)},createHalfEdge:function(n,t){return{edge:n,side:t,vertex:null,l:null,r:null}},insert:function(n,t){t.l=n,t.r=n.r,n.r.l=t,n.r=t},leftBound:function(n){var t=r.leftEnd;do t=t.r;while(t!=r.rightEnd&&u.rightOf(t,n));return t=t.l},del:function(n){n.l.r=n.r,n.r.l=n.l,n.edge=null},right:function(n){return n.r},left:function(n){return n.l},leftRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[n.side]},rightRegion:function(n){return null==n.edge?e.bottomSite:n.edge.region[yc[n.side]]}},u={bisect:function(n,t){var e={region:{l:n,r:t},ep:{l:null,r:null}},r=t.x-n.x,u=t.y-n.y,i=r>0?r:-r,o=u>0?u:-u;return e.c=n.x*r+n.y*u+.5*(r*r+u*u),i>o?(e.a=1,e.b=u/r,e.c/=r):(e.b=1,e.a=r/u,e.c/=u),e},intersect:function(n,t){var e=n.edge,r=t.edge;if(!e||!r||e.region.r==r.region.r)return null;var u=e.a*r.b-e.b*r.a;if(Math.abs(u)<1e-10)return null;var i,o,a=(e.c*r.b-r.c*e.b)/u,c=(r.c*e.a-e.c*r.a)/u,l=e.region.r,s=r.region.r;l.y<s.y||l.y==s.y&&l.x<s.x?(i=n,o=e):(i=t,o=r);var f=a>=o.region.r.x;return f&&"l"===i.side||!f&&"r"===i.side?null:{x:a,y:c}},rightOf:function(n,t){var e=n.edge,r=e.region.r,u=t.x>r.x;if(u&&"l"===n.side)return 1;if(!u&&"r"===n.side)return 0;if(1===e.a){var i=t.y-r.y,o=t.x-r.x,a=0,c=0;if(!u&&e.b<0||u&&e.b>=0?c=a=i>=e.b*o:(c=t.x+t.y*e.b>e.c,e.b<0&&(c=!c),c||(a=1)),!a){var l=r.x-e.region.l.x;c=e.b*(o*o-i*i)<l*i*(1+2*o/l+e.b*e.b),e.b<0&&(c=!c)}}else{var s=e.c-e.a*t.x,f=t.y-s,h=t.x-r.x,g=s-r.y;c=f*f>h*h+g*g}return"l"===n.side?c:!c},endPoint:function(n,e,r){n.ep[e]=r,n.ep[yc[e]]&&t(n)},distance:function(n,t){var e=n.x-t.x,r=n.y-t.y;return Math.sqrt(e*e+r*r)}},i={list:[],insert:function(n,t,e){n.vertex=t,n.ystar=t.y+e;for(var r=0,u=i.list,o=u.length;o>r;r++){var a=u[r];if(!(n.ystar>a.ystar||n.ystar==a.ystar&&t.x>a.vertex.x))break}u.splice(r,0,n)},del:function(n){for(var t=0,e=i.list,r=e.length;r>t&&e[t]!=n;++t);e.splice(t,1)},empty:function(){return 0===i.list.length},nextEvent:function(n){for(var t=0,e=i.list,r=e.length;r>t;++t)if(e[t]==n)return e[t+1];return null},min:function(){var n=i.list[0];return{x:n.vertex.x,y:n.ystar}},extractMin:function(){return i.list.shift()}};r.init(),e.bottomSite=e.list.shift();for(var o,a,c,l,s,f,h,g,p,d,v,m,y,M=e.list.shift();;)if(i.empty()||(o=i.min()),M&&(i.empty()||M.y<o.y||M.y==o.y&&M.x<o.x))a=r.leftBound(M),c=r.right(a),h=r.rightRegion(a),m=u.bisect(h,M),f=r.createHalfEdge(m,"l"),r.insert(a,f),d=u.intersect(a,f),d&&(i.del(a),i.insert(a,d,u.distance(d,M))),a=f,f=r.createHalfEdge(m,"r"),r.insert(a,f),d=u.intersect(f,c),d&&i.insert(f,d,u.distance(d,M)),M=e.list.shift();else{if(i.empty())break;a=i.extractMin(),l=r.left(a),c=r.right(a),s=r.right(c),h=r.leftRegion(a),g=r.rightRegion(c),v=a.vertex,u.endPoint(a.edge,a.side,v),u.endPoint(c.edge,c.side,v),r.del(a),i.del(c),r.del(c),y="l",h.y>g.y&&(p=h,h=g,g=p,y="r"),m=u.bisect(h,g),f=r.createHalfEdge(m,y),r.insert(l,f),u.endPoint(m,yc[y],v),d=u.intersect(l,f),d&&(i.del(l),i.insert(l,d,u.distance(d,h))),d=u.intersect(f,s),d&&i.insert(f,d,u.distance(d,h))}for(a=r.right(r.leftEnd);a!=r.rightEnd;a=r.right(a))t(a.edge)}function mr(n){return n.x}function yr(n){return n.y}function Mr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function xr(n,t,e,r,u,i){if(!n(t,e,r,u,i)){var o=.5*(e+u),a=.5*(r+i),c=t.nodes;c[0]&&xr(n,c[0],e,r,o,a),c[1]&&xr(n,c[1],o,r,u,a),c[2]&&xr(n,c[2],e,a,o,i),c[3]&&xr(n,c[3],o,a,u,i)}}function br(n,t){n=mo.rgb(n),t=mo.rgb(t);var e=n.r,r=n.g,u=n.b,i=t.r-e,o=t.g-r,a=t.b-u;return function(n){return"#"+ct(Math.round(e+i*n))+ct(Math.round(r+o*n))+ct(Math.round(u+a*n))}}function _r(n,t){var e,r={},u={};for(e in n)e in t?r[e]=Er(n[e],t[e]):u[e]=n[e];for(e in t)e in n||(u[e]=t[e]);return function(n){for(e in r)u[e]=r[e](n);return u}}function wr(n,t){return t-=n=+n,function(e){return n+t*e}}function Sr(n,t){var e,r,u,i,o,a=0,c=0,l=[],s=[];for(n+="",t+="",Mc.lastIndex=0,r=0;e=Mc.exec(t);++r)e.index&&l.push(t.substring(a,c=e.index)),s.push({i:l.length,x:e[0]}),l.push(null),a=Mc.lastIndex;for(a<t.length&&l.push(t.substring(a)),r=0,i=s.length;(e=Mc.exec(n))&&i>r;++r)if(o=s[r],o.x==e[0]){if(o.i)if(null==l[o.i+1])for(l[o.i-1]+=o.x,l.splice(o.i,1),u=r+1;i>u;++u)s[u].i--;else for(l[o.i-1]+=o.x+l[o.i+1],l.splice(o.i,2),u=r+1;i>u;++u)s[u].i-=2;else if(null==l[o.i+1])l[o.i]=o.x;else for(l[o.i]=o.x+l[o.i+1],l.splice(o.i+1,1),u=r+1;i>u;++u)s[u].i--;s.splice(r,1),i--,r--}else o.x=wr(parseFloat(e[0]),parseFloat(o.x));for(;i>r;)o=s.pop(),null==l[o.i+1]?l[o.i]=o.x:(l[o.i]=o.x+l[o.i+1],l.splice(o.i+1,1)),i--;return 1===l.length?null==l[0]?(o=s[0].x,function(n){return o(n)+""}):function(){return t}:function(n){for(r=0;i>r;++r)l[(o=s[r]).i]=o.x(n);return l.join("")}}function Er(n,t){for(var e,r=mo.interpolators.length;--r>=0&&!(e=mo.interpolators[r](n,t)););return e}function kr(n,t){var e,r=[],u=[],i=n.length,o=t.length,a=Math.min(n.length,t.length);for(e=0;a>e;++e)r.push(Er(n[e],t[e]));for(;i>e;++e)u[e]=n[e];for(;o>e;++e)u[e]=t[e];return function(n){for(e=0;a>e;++e)u[e]=r[e](n);return u}}function Ar(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function Nr(n){return function(t){return 1-n(1-t)}}function Tr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function qr(n){return n*n}function zr(n){return n*n*n}function Cr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function Dr(n){return function(t){return Math.pow(t,n)}}function jr(n){return 1-Math.cos(n*Jo)}function Lr(n){return Math.pow(2,10*(n-1))}function Hr(n){return 1-Math.sqrt(1-n*n)}function Fr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/Wo*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*Wo/t)}}function Pr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Or(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Rr(n,t){n=mo.hcl(n),t=mo.hcl(t);var e=n.h,r=n.c,u=n.l,i=t.h-e,o=t.c-r,a=t.l-u;return isNaN(o)&&(o=0,r=isNaN(r)?t.c:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return J(e+i*n,r+o*n,u+a*n)+""}}function Yr(n,t){n=mo.hsl(n),t=mo.hsl(t);var e=n.h,r=n.s,u=n.l,i=t.h-e,o=t.s-r,a=t.l-u;return isNaN(o)&&(o=0,r=isNaN(r)?t.s:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return $(e+i*n,r+o*n,u+a*n)+""}}function Ir(n,t){n=mo.lab(n),t=mo.lab(t);var e=n.l,r=n.a,u=n.b,i=t.l-e,o=t.a-r,a=t.b-u;return function(n){return Q(e+i*n,r+o*n,u+a*n)+""}}function Ur(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Zr(n){var t=[n.a,n.b],e=[n.c,n.d],r=Xr(t),u=Vr(t,e),i=Xr($r(e,t,-u))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,u*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*na,this.translate=[n.e,n.f],this.scale=[r,i],this.skew=i?Math.atan2(u,i)*na:0}function Vr(n,t){return n[0]*t[0]+n[1]*t[1]}function Xr(n){var t=Math.sqrt(Vr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function $r(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Br(n,t){var e,r=[],u=[],i=mo.transform(n),o=mo.transform(t),a=i.translate,c=o.translate,l=i.rotate,s=o.rotate,f=i.skew,h=o.skew,g=i.scale,p=o.scale;return a[0]!=c[0]||a[1]!=c[1]?(r.push("translate(",null,",",null,")"),u.push({i:1,x:wr(a[0],c[0])},{i:3,x:wr(a[1],c[1])})):c[0]||c[1]?r.push("translate("+c+")"):r.push(""),l!=s?(l-s>180?s+=360:s-l>180&&(l+=360),u.push({i:r.push(r.pop()+"rotate(",null,")")-2,x:wr(l,s)})):s&&r.push(r.pop()+"rotate("+s+")"),f!=h?u.push({i:r.push(r.pop()+"skewX(",null,")")-2,x:wr(f,h)}):h&&r.push(r.pop()+"skewX("+h+")"),g[0]!=p[0]||g[1]!=p[1]?(e=r.push(r.pop()+"scale(",null,",",null,")"),u.push({i:e-4,x:wr(g[0],p[0])},{i:e-2,x:wr(g[1],p[1])})):(1!=p[0]||1!=p[1])&&r.push(r.pop()+"scale("+p+")"),e=u.length,function(n){for(var t,i=-1;++i<e;)r[(t=u[i]).i]=t.x(n);return r.join("")}}function Wr(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return(e-n)*t}}function Jr(n,t){return t=t-(n=+n)?1/(t-n):0,function(e){return Math.max(0,Math.min(1,(e-n)*t))}}function Gr(n){for(var t=n.source,e=n.target,r=Qr(t,e),u=[t];t!==r;)t=t.parent,u.push(t);for(var i=u.length;e!==r;)u.splice(i,0,e),e=e.parent;return u}function Kr(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Qr(n,t){if(n===t)return n;for(var e=Kr(n),r=Kr(t),u=e.pop(),i=r.pop(),o=null;u===i;)o=u,u=e.pop(),i=r.pop();return o}function nu(n){n.fixed|=2}function tu(n){n.fixed&=-7}function eu(n){n.fixed|=4,n.px=n.x,n.py=n.y}function ru(n){n.fixed&=-5}function uu(n,t,e){var r=0,u=0;if(n.charge=0,!n.leaf)for(var i,o=n.nodes,a=o.length,c=-1;++c<a;)i=o[c],null!=i&&(uu(i,t,e),n.charge+=i.charge,r+=i.charge*i.cx,u+=i.charge*i.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var l=t*e[n.point.index];n.charge+=n.pointCharge=l,r+=l*n.point.x,u+=l*n.point.y}n.cx=r/n.charge,n.cy=u/n.charge}function iu(n,t){return mo.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=lu,n}function ou(n){return n.children}function au(n){return n.value}function cu(n,t){return t.value-n.value}function lu(n){return mo.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function su(n){return n.x}function fu(n){return n.y}function hu(n,t,e){n.y0=t,n.y=e}function gu(n){return mo.range(n.length)}function pu(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function du(n){for(var t,e=1,r=0,u=n[0][1],i=n.length;i>e;++e)(t=n[e][1])>u&&(r=e,u=t);return r}function vu(n){return n.reduce(mu,0)}function mu(n,t){return n+t[1]}function yu(n,t){return Mu(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function Mu(n,t){for(var e=-1,r=+n[0],u=(n[1]-r)/t,i=[];++e<=t;)i[e]=u*e+r;return i}function xu(n){return[mo.min(n),mo.max(n)]}function bu(n,t){return n.parent==t.parent?1:2}function _u(n){var t=n.children;return t&&t.length?t[0]:n._tree.thread}function wu(n){var t,e=n.children;return e&&(t=e.length)?e[t-1]:n._tree.thread}function Su(n,t){var e=n.children;if(e&&(u=e.length))for(var r,u,i=-1;++i<u;)t(r=Su(e[i],t),n)>0&&(n=r);return n}function Eu(n,t){return n.x-t.x}function ku(n,t){return t.x-n.x}function Au(n,t){return n.depth-t.depth}function Nu(n,t){function e(n,r){var u=n.children;if(u&&(o=u.length))for(var i,o,a=null,c=-1;++c<o;)i=u[c],e(i,a),a=i;t(n,r)}e(n,null)}function Tu(n){for(var t,e=0,r=0,u=n.children,i=u.length;--i>=0;)t=u[i]._tree,t.prelim+=e,t.mod+=e,e+=t.shift+(r+=t.change)}function qu(n,t,e){n=n._tree,t=t._tree;var r=e/(t.number-n.number);n.change+=r,t.change-=r,t.shift+=e,t.prelim+=e,t.mod+=e}function zu(n,t,e){return n._tree.ancestor.parent==t.parent?n._tree.ancestor:e}function Cu(n,t){return n.value-t.value}function Du(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function ju(n,t){n._pack_next=t,t._pack_prev=n}function Lu(n,t){var e=t.x-n.x,r=t.y-n.y,u=n.r+t.r;return.999*u*u>e*e+r*r}function Hu(n){function t(n){s=Math.min(n.x-n.r,s),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(l=e.length)){var e,r,u,i,o,a,c,l,s=1/0,f=-1/0,h=1/0,g=-1/0;if(e.forEach(Fu),r=e[0],r.x=-r.r,r.y=0,t(r),l>1&&(u=e[1],u.x=u.r,u.y=0,t(u),l>2))for(i=e[2],Ru(r,u,i),t(i),Du(r,i),r._pack_prev=i,Du(i,u),u=r._pack_next,o=3;l>o;o++){Ru(r,u,i=e[o]);var p=0,d=1,v=1;for(a=u._pack_next;a!==u;a=a._pack_next,d++)if(Lu(a,i)){p=1;break}if(1==p)for(c=r._pack_prev;c!==a._pack_prev&&!Lu(c,i);c=c._pack_prev,v++);p?(v>d||d==v&&u.r<r.r?ju(r,u=a):ju(r=c,u),o--):(Du(r,i),u=i,t(i))}var m=(s+f)/2,y=(h+g)/2,M=0;for(o=0;l>o;o++)i=e[o],i.x-=m,i.y-=y,M=Math.max(M,i.r+Math.sqrt(i.x*i.x+i.y*i.y));n.r=M,e.forEach(Pu)}}function Fu(n){n._pack_next=n._pack_prev=n}function Pu(n){delete n._pack_next,delete n._pack_prev}function Ou(n,t,e,r){var u=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,u)for(var i=-1,o=u.length;++i<o;)Ou(u[i],t,e,r)}function Ru(n,t,e){var r=n.r+e.r,u=t.x-n.x,i=t.y-n.y;if(r&&(u||i)){var o=t.r+e.r,a=u*u+i*i;o*=o,r*=r;var c=.5+(r-o)/(2*a),l=Math.sqrt(Math.max(0,2*o*(r+a)-(r-=a)*r-o*o))/(2*a);e.x=n.x+c*u+l*i,e.y=n.y+c*i-l*u}else e.x=n.x+r,e.y=n.y}function Yu(n){return 1+mo.max(n,function(n){return n.y})}function Iu(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Uu(n){var t=n.children;return t&&t.length?Uu(t[0]):n}function Zu(n){var t,e=n.children;return e&&(t=e.length)?Zu(e[t-1]):n}function Vu(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Xu(n,t){var e=n.x+t[3],r=n.y+t[0],u=n.dx-t[1]-t[3],i=n.dy-t[0]-t[2];return 0>u&&(e+=u/2,u=0),0>i&&(r+=i/2,i=0),{x:e,y:r,dx:u,dy:i}}function $u(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Bu(n){return n.rangeExtent?n.rangeExtent():$u(n.range())}function Wu(n,t,e,r){var u=e(n[0],n[1]),i=r(t[0],t[1]);return function(n){return i(u(n))}}function Ju(n,t){var e,r=0,u=n.length-1,i=n[r],o=n[u];return i>o&&(e=r,r=u,u=e,e=i,i=o,o=e),n[r]=t.floor(i),n[u]=t.ceil(o),n}function Gu(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:Tc}function Ku(n,t,e,r){var u=[],i=[],o=0,a=Math.min(n.length,t.length)-1;for(n[a]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++o<=a;)u.push(e(n[o-1],n[o])),i.push(r(t[o-1],t[o]));return function(t){var e=mo.bisect(n,t,1,a)-1;return i[e](u[e](t))}}function Qu(n,t,e,r){function u(){var u=Math.min(n.length,t.length)>2?Ku:Wu,c=r?Jr:Wr;return o=u(n,t,c,e),a=u(t,n,c,Er),i}function i(n){return o(n)}var o,a;return i.invert=function(n){return a(n)},i.domain=function(t){return arguments.length?(n=t.map(Number),u()):n},i.range=function(n){return arguments.length?(t=n,u()):t},i.rangeRound=function(n){return i.range(n).interpolate(Ur)},i.clamp=function(n){return arguments.length?(r=n,u()):r},i.interpolate=function(n){return arguments.length?(e=n,u()):e},i.ticks=function(t){return ri(n,t)},i.tickFormat=function(t,e){return ui(n,t,e)},i.nice=function(t){return ti(n,t),u()},i.copy=function(){return Qu(n,t,e,r)},u()}function ni(n,t){return mo.rebind(n,t,"range","rangeRound","interpolate","clamp")}function ti(n,t){return Ju(n,Gu(ei(n,t)[2]))}function ei(n,t){null==t&&(t=10);var e=$u(n),r=e[1]-e[0],u=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),i=t/r*u;return.15>=i?u*=10:.35>=i?u*=5:.75>=i&&(u*=2),e[0]=Math.ceil(e[0]/u)*u,e[1]=Math.floor(e[1]/u)*u+.5*u,e[2]=u,e}function ri(n,t){return mo.range.apply(mo,ei(n,t))}function ui(n,t,e){var r=-Math.floor(Math.log(ei(n,t)[2])/Math.LN10+.01);return mo.format(e?e.replace(Aa,function(n,t,e,u,i,o,a,c,l,s){return[t,e,u,i,o,a,c,l||"."+(r-2*("%"===s)),s].join("")}):",."+r+"f")}function ii(n,t,e,r){function u(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function i(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function o(t){return n(u(t))}return o.invert=function(t){return i(n.invert(t))},o.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(u)),o):r},o.base=function(e){return arguments.length?(t=+e,n.domain(r.map(u)),o):t},o.nice=function(){var t=Ju(r.map(u),e?Math:zc);return n.domain(t),r=t.map(i),o},o.ticks=function(){var n=$u(r),o=[],a=n[0],c=n[1],l=Math.floor(u(a)),s=Math.ceil(u(c)),f=t%1?2:t;if(isFinite(s-l)){if(e){for(;s>l;l++)for(var h=1;f>h;h++)o.push(i(l)*h);o.push(i(l))}else for(o.push(i(l));l++<s;)for(var h=f-1;h>0;h--)o.push(i(l)*h);for(l=0;o[l]<a;l++);for(s=o.length;o[s-1]>c;s--);o=o.slice(l,s)}return o},o.tickFormat=function(n,t){if(!arguments.length)return qc;arguments.length<2?t=qc:"function"!=typeof t&&(t=mo.format(t));var r,a=Math.max(.1,n/o.ticks().length),c=e?(r=1e-12,Math.ceil):(r=-1e-12,Math.floor);return function(n){return n/i(c(u(n)+r))<=a?t(n):""}},o.copy=function(){return ii(n.copy(),t,e,r)},ni(o,n)}function oi(n,t,e){function r(t){return n(u(t))}var u=ai(t),i=ai(1/t);return r.invert=function(t){return i(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(u)),r):e},r.ticks=function(n){return ri(e,n)},r.tickFormat=function(n,t){return ui(e,n,t)},r.nice=function(n){return r.domain(ti(e,n))},r.exponent=function(o){return arguments.length?(u=ai(t=o),i=ai(1/t),n.domain(e.map(u)),r):t},r.copy=function(){return oi(n.copy(),t,e)},ni(r,n)}function ai(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function ci(n,t){function e(e){return o[((i.get(e)||"range"===t.t&&i.set(e,n.push(e)))-1)%o.length]}function r(t,e){return mo.range(n.length).map(function(n){return t+e*n})}var i,o,a;return e.domain=function(r){if(!arguments.length)return n;n=[],i=new u;for(var o,a=-1,c=r.length;++a<c;)i.has(o=r[a])||i.set(o,n.push(o));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(o=n,a=0,t={t:"range",a:arguments},e):o},e.rangePoints=function(u,i){arguments.length<2&&(i=0);var c=u[0],l=u[1],s=(l-c)/(Math.max(1,n.length-1)+i);return o=r(n.length<2?(c+l)/2:c+s*i/2,s),a=0,t={t:"rangePoints",a:arguments},e},e.rangeBands=function(u,i,c){arguments.length<2&&(i=0),arguments.length<3&&(c=i);var l=u[1]<u[0],s=u[l-0],f=u[1-l],h=(f-s)/(n.length-i+2*c);return o=r(s+h*c,h),l&&o.reverse(),a=h*(1-i),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(u,i,c){arguments.length<2&&(i=0),arguments.length<3&&(c=i);var l=u[1]<u[0],s=u[l-0],f=u[1-l],h=Math.floor((f-s)/(n.length-i+2*c)),g=f-s-(n.length-i)*h;return o=r(s+Math.round(g/2),h),l&&o.reverse(),a=Math.round(h*(1-i)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return a},e.rangeExtent=function(){return $u(t.a[0])},e.copy=function(){return ci(n,t)},e.domain(n)}function li(n,t){function e(){var e=0,i=t.length;for(u=[];++e<i;)u[e-1]=mo.quantile(n,e/i);return r}function r(n){return isNaN(n=+n)?void 0:t[mo.bisect(u,n)]}var u;return r.domain=function(t){return arguments.length?(n=t.filter(function(n){return!isNaN(n)}).sort(mo.ascending),e()):n},r.range=function(n){return arguments.length?(t=n,e()):t},r.quantiles=function(){return u},r.invertExtent=function(e){return e=t.indexOf(e),0>e?[0/0,0/0]:[e>0?u[e-1]:n[0],e<u.length?u[e]:n[n.length-1]]},r.copy=function(){return li(n,t)},e()}function si(n,t,e){function r(t){return e[Math.max(0,Math.min(o,Math.floor(i*(t-n))))]}function u(){return i=e.length/(t-n),o=e.length-1,r}var i,o;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],u()):[n,t]},r.range=function(n){return arguments.length?(e=n,u()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?0/0:t/i+n,[t,t+1/i]},r.copy=function(){return si(n,t,e)},u()}function fi(n,t){function e(e){return e>=e?t[mo.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return fi(n,t)},e}function hi(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return ri(n,t)},t.tickFormat=function(t,e){return ui(n,t,e)},t.copy=function(){return hi(n)},t}function gi(n){return n.innerRadius}function pi(n){return n.outerRadius}function di(n){return n.startAngle}function vi(n){return n.endAngle}function mi(n){for(var t,e,r,u=-1,i=n.length;++u<i;)t=n[u],e=t[0],r=t[1]+Hc,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function yi(n){function t(t){function c(){d.push("M",a(n(m),f),s,l(n(v.reverse()),f),"Z")}for(var h,g,p,d=[],v=[],m=[],y=-1,M=t.length,x=pt(e),b=pt(u),_=e===r?function(){return g}:pt(r),w=u===i?function(){return p}:pt(i);++y<M;)o.call(this,h=t[y],y)?(v.push([g=+x.call(this,h,y),p=+b.call(this,h,y)]),m.push([+_.call(this,h,y),+w.call(this,h,y)])):v.length&&(c(),v=[],m=[]);return v.length&&c(),d.length?d.join(""):null}var e=Ze,r=Ze,u=0,i=Ve,o=Vt,a=Xe,c=a.key,l=a,s="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(u=i=n,t):i},t.y0=function(n){return arguments.length?(u=n,t):u},t.y1=function(n){return arguments.length?(i=n,t):i},t.defined=function(n){return arguments.length?(o=n,t):o},t.interpolate=function(n){return arguments.length?(c="function"==typeof n?a=n:(a=gc.get(n)||Xe).key,l=a.reverse||a,s=a.closed?"M":"L",t):c},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Mi(n){return n.radius}function xi(n){return[n.x,n.y]}function bi(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]+Hc;return[e*Math.cos(r),e*Math.sin(r)]}}function _i(){return 64}function wi(){return"circle"}function Si(n){var t=Math.sqrt(n/Bo);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Ei(n,t){return Lo(n,Uc),n.id=t,n}function ki(n,t,e,r){var u=n.id;return N(n,"function"==typeof e?function(n,i,o){n.__transition__[u].tween.set(t,r(e.call(n,n.__data__,i,o)))}:(e=r(e),function(n){n.__transition__[u].tween.set(t,e)}))}function Ai(n){return null==n&&(n=""),function(){this.textContent=n}}function Ni(n,t,e,r){var i=n.__transition__||(n.__transition__={active:0,count:0}),o=i[e];if(!o){var a=r.time;o=i[e]={tween:new u,time:a,ease:r.ease,delay:r.delay,duration:r.duration},++i.count,mo.timer(function(r){function u(r){return i.active>e?l():(i.active=e,o.event&&o.event.start.call(n,s,t),o.tween.forEach(function(e,r){(r=r.call(n,s,t))&&p.push(r)}),c(r||1)?1:(xt(c,h,a),void 0))}function c(r){if(i.active!==e)return l();for(var u=r/g,a=f(u),c=p.length;c>0;)p[--c].call(n,a);return u>=1?(o.event&&o.event.end.call(n,s,t),l()):void 0}function l(){return--i.count?delete i[e]:delete n.__transition__,1}var s=n.__data__,f=o.ease,h=o.delay,g=o.duration,p=[];return r>=h?u(r-h):(xt(u,h,a),void 0)},0,a)}}function Ti(n,t){n.attr("transform",function(n){return"translate("+t(n)+",0)"})}function qi(n,t){n.attr("transform",function(n){return"translate(0,"+t(n)+")"})}function zi(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function Ci(n,t,e){function r(t){var e=n(t),r=i(e,1);return r-t>t-e?e:r}function u(e){return t(e=n(new Jc(e-1)),1),e}function i(n,e){return t(n=new Jc(+n),e),n}function o(n,r,i){var o=u(n),a=[];if(i>1)for(;r>o;)e(o)%i||a.push(new Date(+o)),t(o,1);else for(;r>o;)a.push(new Date(+o)),t(o,1);return a}function a(n,t,e){try{Jc=zi;var r=new zi;return r._=n,o(r,t,e)}finally{Jc=Date}}n.floor=n,n.round=r,n.ceil=u,n.offset=i,n.range=o;var c=n.utc=Di(n);return c.floor=c,c.round=Di(r),c.ceil=Di(u),c.offset=Di(i),c.range=a,n}function Di(n){return function(t,e){try{Jc=zi;var r=new zi;return r._=t,n(r,e)._}finally{Jc=Date}}}function ji(n){function t(t){for(var r,u,i,o=[],a=-1,c=0;++a<e;)37===n.charCodeAt(a)&&(o.push(n.substring(c,a)),null!=(u=dl[r=n.charAt(++a)])&&(r=n.charAt(++a)),(i=vl[r])&&(r=i(t,null==u?"e"===r?" ":"0":u)),o.push(r),c=a+1);return o.push(n.substring(c,a)),o.join("")}var e=n.length;return t.parse=function(t){var e={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},r=Li(e,n,t,0);if(r!=t.length)return null;"p"in e&&(e.H=e.H%12+12*e.p);var u=null!=e.Z&&Jc!==zi,i=new(u?zi:Jc);return"j"in e?i.setFullYear(e.y,0,e.j):"w"in e&&("W"in e||"U"in e)?(i.setFullYear(e.y,0,1),i.setFullYear(e.y,0,"W"in e?(e.w+6)%7+7*e.W-(i.getDay()+5)%7:e.w+7*e.U-(i.getDay()+6)%7)):i.setFullYear(e.y,e.m,e.d),i.setHours(e.H+Math.floor(e.Z/100),e.M+e.Z%100,e.S,e.L),u?i._:i},t.toString=function(){return n},t}function Li(n,t,e,r){for(var u,i,o,a=0,c=t.length,l=e.length;c>a;){if(r>=l)return-1;if(u=t.charCodeAt(a++),37===u){if(o=t.charAt(a++),i=ml[o in dl?t.charAt(a++):o],!i||(r=i(n,e,r))<0)return-1}else if(u!=e.charCodeAt(r++))return-1}return r}function Hi(n){return new RegExp("^(?:"+n.map(mo.requote).join("|")+")","i")}function Fi(n){for(var t=new u,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function Pi(n,t,e){var r=0>n?"-":"",u=(r?-n:n)+"",i=u.length;return r+(e>i?new Array(e-i+1).join(t)+u:u)}function Oi(n,t,e){cl.lastIndex=0;var r=cl.exec(t.substring(e));return r?(n.w=ll.get(r[0].toLowerCase()),e+r[0].length):-1}function Ri(n,t,e){ol.lastIndex=0;var r=ol.exec(t.substring(e));return r?(n.w=al.get(r[0].toLowerCase()),e+r[0].length):-1}function Yi(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Ii(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e));return r?(n.U=+r[0],e+r[0].length):-1}function Ui(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e));return r?(n.W=+r[0],e+r[0].length):-1}function Zi(n,t,e){hl.lastIndex=0;var r=hl.exec(t.substring(e));return r?(n.m=gl.get(r[0].toLowerCase()),e+r[0].length):-1}function Vi(n,t,e){sl.lastIndex=0;var r=sl.exec(t.substring(e));return r?(n.m=fl.get(r[0].toLowerCase()),e+r[0].length):-1}function Xi(n,t,e){return Li(n,vl.c.toString(),t,e)}function $i(n,t,e){return Li(n,vl.x.toString(),t,e)}function Bi(n,t,e){return Li(n,vl.X.toString(),t,e)}function Wi(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Ji(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+2));return r?(n.y=Ki(+r[0]),e+r[0].length):-1}function Gi(n,t,e){return/^[+-]\d{4}$/.test(t=t.substring(e,e+5))?(n.Z=+t,e+5):-1}function Ki(n){return n+(n>68?1900:2e3)}function Qi(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function no(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function to(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function eo(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function ro(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function uo(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function io(n,t,e){yl.lastIndex=0;var r=yl.exec(t.substring(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function oo(n,t,e){var r=Ml.get(t.substring(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}function ao(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=~~(Math.abs(t)/60),u=Math.abs(t)%60;return e+Pi(r,"0",2)+Pi(u,"0",2)}function co(n,t,e){pl.lastIndex=0;var r=pl.exec(t.substring(e,e+1));return r?e+r[0].length:-1}function lo(n){function t(n){try{Jc=zi;var t=new Jc;return t._=n,e(t)}finally{Jc=Date}}var e=ji(n);return t.parse=function(n){try{Jc=zi;var t=e.parse(n);return t&&t._}finally{Jc=Date}},t.toString=e.toString,t}function so(n){return n.toISOString()}function fo(n,t,e){function r(t){return n(t)}function u(n,e){var r=n[1]-n[0],u=r/e,i=mo.bisect(bl,u);return i==bl.length?[t.year,ei(n.map(function(n){return n/31536e6}),e)[2]]:i?t[u/bl[i-1]<bl[i]/u?i-1:i]:[El,ei(n,e)[2]]}return r.invert=function(t){return ho(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(ho)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,ho(+e+1),t).length}var i=r.domain(),o=$u(i),a=null==n?u(o,10):"number"==typeof n&&u(o,n);return a&&(n=a[0],t=a[1]),r.domain(Ju(i,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=ho(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=ho(+t+1);return t}}:n))},r.ticks=function(n,t){var e=$u(r.domain()),i=null==n?u(e,10):"number"==typeof n?u(e,n):!n.range&&[{range:n},t];return i&&(n=i[0],t=i[1]),n.range(e[0],ho(+e[1]+1),1>t?1:t)},r.tickFormat=function(){return e},r.copy=function(){return fo(n.copy(),t,e)},ni(r,n)}function ho(n){return new Date(n)}function go(n){return function(t){for(var e=n.length-1,r=n[e];!r[1](t);)r=n[--e];return r[0](t)}}function po(n){return JSON.parse(n.responseText)}function vo(n){var t=xo.createRange();return t.selectNode(xo.body),t.createContextualFragment(n.responseText)}var mo={version:"3.3.6"};Date.now||(Date.now=function(){return+new Date});var yo=[].slice,Mo=function(n){return yo.call(n)},xo=document,bo=xo.documentElement,_o=window;try{Mo(bo.childNodes)[0].nodeType}catch(wo){Mo=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}try{xo.createElement("div").style.setProperty("opacity",0,"")}catch(So){var Eo=_o.Element.prototype,ko=Eo.setAttribute,Ao=Eo.setAttributeNS,No=_o.CSSStyleDeclaration.prototype,To=No.setProperty;Eo.setAttribute=function(n,t){ko.call(this,n,t+"")},Eo.setAttributeNS=function(n,t,e){Ao.call(this,n,t,e+"")},No.setProperty=function(n,t,e){To.call(this,n,t+"",e)}}mo.ascending=function(n,t){return t>n?-1:n>t?1:n>=t?0:0/0},mo.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:0/0},mo.min=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i&&!(null!=(e=n[u])&&e>=e);)e=void 0;for(;++u<i;)null!=(r=n[u])&&e>r&&(e=r)}else{for(;++u<i&&!(null!=(e=t.call(n,n[u],u))&&e>=e);)e=void 0;for(;++u<i;)null!=(r=t.call(n,n[u],u))&&e>r&&(e=r)}return e},mo.max=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i&&!(null!=(e=n[u])&&e>=e);)e=void 0;for(;++u<i;)null!=(r=n[u])&&r>e&&(e=r)}else{for(;++u<i&&!(null!=(e=t.call(n,n[u],u))&&e>=e);)e=void 0;for(;++u<i;)null!=(r=t.call(n,n[u],u))&&r>e&&(e=r)}return e},mo.extent=function(n,t){var e,r,u,i=-1,o=n.length;if(1===arguments.length){for(;++i<o&&!(null!=(e=u=n[i])&&e>=e);)e=u=void 0;for(;++i<o;)null!=(r=n[i])&&(e>r&&(e=r),r>u&&(u=r))}else{for(;++i<o&&!(null!=(e=u=t.call(n,n[i],i))&&e>=e);)e=void 0;for(;++i<o;)null!=(r=t.call(n,n[i],i))&&(e>r&&(e=r),r>u&&(u=r))}return[e,u]},mo.sum=function(n,t){var e,r=0,u=n.length,i=-1;if(1===arguments.length)for(;++i<u;)isNaN(e=+n[i])||(r+=e);else for(;++i<u;)isNaN(e=+t.call(n,n[i],i))||(r+=e);return r},mo.mean=function(t,e){var r,u=t.length,i=0,o=-1,a=0;if(1===arguments.length)for(;++o<u;)n(r=t[o])&&(i+=(r-i)/++a);else for(;++o<u;)n(r=e.call(t,t[o],o))&&(i+=(r-i)/++a);return a?i:void 0},mo.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),u=+n[r-1],i=e-r;return i?u+i*(n[r]-u):u},mo.median=function(t,e){return arguments.length>1&&(t=t.map(e)),t=t.filter(n),t.length?mo.quantile(t.sort(mo.ascending),.5):void 0},mo.bisector=function(n){return{left:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n.call(t,t[i],i)<e?r=i+1:u=i}return r},right:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;e<n.call(t,t[i],i)?u=i:r=i+1}return r}}};var qo=mo.bisector(function(n){return n});mo.bisectLeft=qo.left,mo.bisect=mo.bisectRight=qo.right,mo.shuffle=function(n){for(var t,e,r=n.length;r;)e=0|Math.random()*r--,t=n[r],n[r]=n[e],n[e]=t;return n},mo.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},mo.pairs=function(n){for(var t,e=0,r=n.length-1,u=n[0],i=new Array(0>r?0:r);r>e;)i[e]=[t=u,u=n[++e]];return i},mo.zip=function(){if(!(u=arguments.length))return[];for(var n=-1,e=mo.min(arguments,t),r=new Array(e);++n<e;)for(var u,i=-1,o=r[n]=new Array(u);++i<u;)o[i]=arguments[i][n];return r},mo.transpose=function(n){return mo.zip.apply(mo,n)},mo.keys=function(n){var t=[];for(var e in n)t.push(e);return t},mo.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},mo.entries=function(n){var t=[];
for(var e in n)t.push({key:e,value:n[e]});return t},mo.merge=function(n){return Array.prototype.concat.apply([],n)},mo.range=function(n,t,r){if(arguments.length<3&&(r=1,arguments.length<2&&(t=n,n=0)),1/0===(t-n)/r)throw new Error("infinite range");var u,i=[],o=e(Math.abs(r)),a=-1;if(n*=o,t*=o,r*=o,0>r)for(;(u=n+r*++a)>t;)i.push(u/o);else for(;(u=n+r*++a)<t;)i.push(u/o);return i},mo.map=function(n){var t=new u;if(n instanceof u)n.forEach(function(n,e){t.set(n,e)});else for(var e in n)t.set(e,n[e]);return t},r(u,{has:function(n){return zo+n in this},get:function(n){return this[zo+n]},set:function(n,t){return this[zo+n]=t},remove:function(n){return n=zo+n,n in this&&delete this[n]},keys:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},values:function(){var n=[];return this.forEach(function(t,e){n.push(e)}),n},entries:function(){var n=[];return this.forEach(function(t,e){n.push({key:t,value:e})}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Co&&n.call(this,t.substring(1),this[t])}});var zo="\x00",Co=zo.charCodeAt(0);mo.nest=function(){function n(t,a,c){if(c>=o.length)return r?r.call(i,a):e?a.sort(e):a;for(var l,s,f,h,g=-1,p=a.length,d=o[c++],v=new u;++g<p;)(h=v.get(l=d(s=a[g])))?h.push(s):v.set(l,[s]);return t?(s=t(),f=function(e,r){s.set(e,n(t,r,c))}):(s={},f=function(e,r){s[e]=n(t,r,c)}),v.forEach(f),s}function t(n,e){if(e>=o.length)return n;var r=[],u=a[e++];return n.forEach(function(n,u){r.push({key:n,values:t(u,e)})}),u?r.sort(function(n,t){return u(n.key,t.key)}):r}var e,r,i={},o=[],a=[];return i.map=function(t,e){return n(e,t,0)},i.entries=function(e){return t(n(mo.map,e,0),0)},i.key=function(n){return o.push(n),i},i.sortKeys=function(n){return a[o.length-1]=n,i},i.sortValues=function(n){return e=n,i},i.rollup=function(n){return r=n,i},i},mo.set=function(n){var t=new i;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},r(i,{has:function(n){return zo+n in this},add:function(n){return this[zo+n]=!0,n},remove:function(n){return n=zo+n,n in this&&delete this[n]},values:function(){var n=[];return this.forEach(function(t){n.push(t)}),n},forEach:function(n){for(var t in this)t.charCodeAt(0)===Co&&n.call(this,t.substring(1))}}),mo.behavior={},mo.rebind=function(n,t){for(var e,r=1,u=arguments.length;++r<u;)n[e=arguments[r]]=o(n,t,t[e]);return n};var Do=["webkit","ms","moz","Moz","o","O"];mo.dispatch=function(){for(var n=new l,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=s(n);return n},l.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.substring(e+1),n=n.substring(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},mo.event=null,mo.requote=function(n){return n.replace(jo,"\\$&")};var jo=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,Lo={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},Ho=function(n,t){return t.querySelector(n)},Fo=function(n,t){return t.querySelectorAll(n)},Po=bo[a(bo,"matchesSelector")],Oo=function(n,t){return Po.call(n,t)};"function"==typeof Sizzle&&(Ho=function(n,t){return Sizzle(n,t)[0]||null},Fo=function(n,t){return Sizzle.uniqueSort(Sizzle(n,t))},Oo=Sizzle.matchesSelector),mo.selection=function(){return Uo};var Ro=mo.selection.prototype=[];Ro.select=function(n){var t,e,r,u,i=[];n=d(n);for(var o=-1,a=this.length;++o<a;){i.push(t=[]),t.parentNode=(r=this[o]).parentNode;for(var c=-1,l=r.length;++c<l;)(u=r[c])?(t.push(e=n.call(u,u.__data__,c,o)),e&&"__data__"in u&&(e.__data__=u.__data__)):t.push(null)}return p(i)},Ro.selectAll=function(n){var t,e,r=[];n=v(n);for(var u=-1,i=this.length;++u<i;)for(var o=this[u],a=-1,c=o.length;++a<c;)(e=o[a])&&(r.push(t=Mo(n.call(e,e.__data__,a,u))),t.parentNode=e);return p(r)};var Yo={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};mo.ns={prefix:Yo,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&(e=n.substring(0,t),n=n.substring(t+1)),Yo.hasOwnProperty(e)?{space:Yo[e],local:n}:n}},Ro.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=mo.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(m(t,n[t]));return this}return this.each(m(n,t))},Ro.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=n.trim().split(/^|\s+/g)).length,u=-1;if(t=e.classList){for(;++u<r;)if(!t.contains(n[u]))return!1}else for(t=e.getAttribute("class");++u<r;)if(!M(n[u]).test(t))return!1;return!0}for(t in n)this.each(x(t,n[t]));return this}return this.each(x(n,t))},Ro.style=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t="");for(e in n)this.each(_(e,n[e],t));return this}if(2>r)return _o.getComputedStyle(this.node(),null).getPropertyValue(n);e=""}return this.each(_(n,t,e))},Ro.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(w(t,n[t]));return this}return this.each(w(n,t))},Ro.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Ro.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Ro.append=function(n){return n=S(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Ro.insert=function(n,t){return n=S(n),t=d(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments))})},Ro.remove=function(){return this.each(function(){var n=this.parentNode;n&&n.removeChild(this)})},Ro.data=function(n,t){function e(n,e){var r,i,o,a=n.length,f=e.length,h=Math.min(a,f),g=new Array(f),p=new Array(f),d=new Array(a);if(t){var v,m=new u,y=new u,M=[];for(r=-1;++r<a;)v=t.call(i=n[r],i.__data__,r),m.has(v)?d[r]=i:m.set(v,i),M.push(v);for(r=-1;++r<f;)v=t.call(e,o=e[r],r),(i=m.get(v))?(g[r]=i,i.__data__=o):y.has(v)||(p[r]=E(o)),y.set(v,o),m.remove(v);for(r=-1;++r<a;)m.has(M[r])&&(d[r]=n[r])}else{for(r=-1;++r<h;)i=n[r],o=e[r],i?(i.__data__=o,g[r]=i):p[r]=E(o);for(;f>r;++r)p[r]=E(e[r]);for(;a>r;++r)d[r]=n[r]}p.update=g,p.parentNode=g.parentNode=d.parentNode=n.parentNode,c.push(p),l.push(g),s.push(d)}var r,i,o=-1,a=this.length;if(!arguments.length){for(n=new Array(a=(r=this[0]).length);++o<a;)(i=r[o])&&(n[o]=i.__data__);return n}var c=T([]),l=p([]),s=p([]);if("function"==typeof n)for(;++o<a;)e(r=this[o],n.call(r,r.parentNode.__data__,o));else for(;++o<a;)e(r=this[o],n);return l.enter=function(){return c},l.exit=function(){return s},l},Ro.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Ro.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=k(n));for(var i=0,o=this.length;o>i;i++){u.push(t=[]),t.parentNode=(e=this[i]).parentNode;for(var a=0,c=e.length;c>a;a++)(r=e[a])&&n.call(r,r.__data__,a)&&t.push(r)}return p(u)},Ro.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],u=r.length-1,i=r[u];--u>=0;)(e=r[u])&&(i&&i!==e.nextSibling&&i.parentNode.insertBefore(e,i),i=e);return this},Ro.sort=function(n){n=A.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Ro.each=function(n){return N(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Ro.call=function(n){var t=Mo(arguments);return n.apply(t[0]=this,t),this},Ro.empty=function(){return!this.node()},Ro.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,u=e.length;u>r;r++){var i=e[r];if(i)return i}return null},Ro.size=function(){var n=0;return this.each(function(){++n}),n};var Io=[];mo.selection.enter=T,mo.selection.enter.prototype=Io,Io.append=Ro.append,Io.empty=Ro.empty,Io.node=Ro.node,Io.call=Ro.call,Io.size=Ro.size,Io.select=function(n){for(var t,e,r,u,i,o=[],a=-1,c=this.length;++a<c;){r=(u=this[a]).update,o.push(t=[]),t.parentNode=u.parentNode;for(var l=-1,s=u.length;++l<s;)(i=u[l])?(t.push(r[l]=e=n.call(u.parentNode,i.__data__,l,a)),e.__data__=i.__data__):t.push(null)}return p(o)},Io.insert=function(n,t){return arguments.length<2&&(t=q(this)),Ro.insert.call(this,n,t)},Ro.transition=function(){for(var n,t,e=Oc||++Zc,r=[],u=Rc||{time:Date.now(),ease:Cr,delay:0,duration:250},i=-1,o=this.length;++i<o;){r.push(n=[]);for(var a=this[i],c=-1,l=a.length;++c<l;)(t=a[c])&&Ni(t,c,e,u),n.push(t)}return Ei(r,e)},Ro.interrupt=function(){return this.each(z)},mo.select=function(n){var t=["string"==typeof n?Ho(n,xo):n];return t.parentNode=bo,p([t])},mo.selectAll=function(n){var t=Mo("string"==typeof n?Fo(n,xo):n);return t.parentNode=bo,p([t])};var Uo=mo.select(bo);Ro.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(C(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(C(n,t,e))};var Zo=mo.map({mouseenter:"mouseover",mouseleave:"mouseout"});Zo.forEach(function(n){"on"+n in xo&&Zo.remove(n)});var Vo=a(bo.style,"userSelect"),Xo=0;mo.mouse=function(n){return H(n,h())};var $o=/WebKit/.test(_o.navigator.userAgent)?-1:0;mo.touches=function(n,t){return arguments.length<2&&(t=h().touches),t?Mo(t).map(function(t){var e=H(n,t);return e.identifier=t.identifier,e}):[]},mo.behavior.drag=function(){function n(){this.on("mousedown.drag",o).on("touchstart.drag",a)}function t(){return mo.event.changedTouches[0].identifier}function e(n,t){return mo.touches(n).filter(function(n){return n.identifier===t})[0]}function r(n,t,e,r){return function(){function o(){var n=t(s,g),e=n[0]-d[0],r=n[1]-d[1];v|=e|r,d=n,f({type:"drag",x:n[0]+c[0],y:n[1]+c[1],dx:e,dy:r})}function a(){m.on(e+"."+p,null).on(r+"."+p,null),y(v&&mo.event.target===h),f({type:"dragend"})}var c,l=this,s=l.parentNode,f=u.of(l,arguments),h=mo.event.target,g=n(),p=null==g?"drag":"drag-"+g,d=t(s,g),v=0,m=mo.select(_o).on(e+"."+p,o).on(r+"."+p,a),y=L();i?(c=i.apply(l,arguments),c=[c.x-d[0],c.y-d[1]]):c=[0,0],f({type:"dragstart"})}}var u=g(n,"drag","dragstart","dragend"),i=null,o=r(c,mo.mouse,"mousemove","mouseup"),a=r(t,e,"touchmove","touchend");return n.origin=function(t){return arguments.length?(i=t,n):i},mo.rebind(n,u,"on")};var Bo=Math.PI,Wo=2*Bo,Jo=Bo/2,Go=1e-6,Ko=Go*Go,Qo=Bo/180,na=180/Bo,ta=Math.SQRT2,ea=2,ra=4;mo.interpolateZoom=function(n,t){function e(n){var t=n*y;if(m){var e=Y(d),o=i/(ea*h)*(e*I(ta*t+d)-R(d));return[r+o*l,u+o*s,i*e/Y(ta*t+d)]}return[r+n*l,u+n*s,i*Math.exp(ta*t)]}var r=n[0],u=n[1],i=n[2],o=t[0],a=t[1],c=t[2],l=o-r,s=a-u,f=l*l+s*s,h=Math.sqrt(f),g=(c*c-i*i+ra*f)/(2*i*ea*h),p=(c*c-i*i-ra*f)/(2*c*ea*h),d=Math.log(Math.sqrt(g*g+1)-g),v=Math.log(Math.sqrt(p*p+1)-p),m=v-d,y=(m||Math.log(c/i))/ta;return e.duration=1e3*y,e},mo.behavior.zoom=function(){function n(n){n.on(A,l).on(oa+".zoom",h).on(N,p).on("dblclick.zoom",d).on(q,s)}function t(n){return[(n[0]-S.x)/S.k,(n[1]-S.y)/S.k]}function e(n){return[n[0]*S.k+S.x,n[1]*S.k+S.y]}function r(n){S.k=Math.max(k[0],Math.min(k[1],n))}function u(n,t){t=e(t),S.x+=n[0]-t[0],S.y+=n[1]-t[1]}function i(){b&&b.domain(x.range().map(function(n){return(n-S.x)/S.k}).map(x.invert)),w&&w.domain(_.range().map(function(n){return(n-S.y)/S.k}).map(_.invert))}function o(n){n({type:"zoomstart"})}function a(n){i(),n({type:"zoom",scale:S.k,translate:[S.x,S.y]})}function c(n){n({type:"zoomend"})}function l(){function n(){s=1,u(mo.mouse(r),h),a(i)}function e(){f.on(N,_o===r?p:null).on(T,null),g(s&&mo.event.target===l),c(i)}var r=this,i=C.of(r,arguments),l=mo.event.target,s=0,f=mo.select(_o).on(N,n).on(T,e),h=t(mo.mouse(r)),g=L();z.call(r),o(i)}function s(){function n(){var n=mo.touches(p);return g=S.k,n.forEach(function(n){n.identifier in v&&(v[n.identifier]=t(n))}),n}function e(){for(var t=mo.event.changedTouches,e=0,i=t.length;i>e;++e)v[t[e].identifier]=null;var o=n(),c=Date.now();if(1===o.length){if(500>c-M){var l=o[0],s=v[l.identifier];r(2*S.k),u(l,s),f(),a(d)}M=c}else if(o.length>1){var l=o[0],h=o[1],g=l[0]-h[0],p=l[1]-h[1];m=g*g+p*p}}function i(){for(var n,t,e,i,o=mo.touches(p),c=0,l=o.length;l>c;++c,i=null)if(e=o[c],i=v[e.identifier]){if(t)break;n=e,t=i}if(i){var s=(s=e[0]-n[0])*s+(s=e[1]-n[1])*s,f=m&&Math.sqrt(s/m);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+i[0])/2,(t[1]+i[1])/2],r(f*g)}M=null,u(n,t),a(d)}function h(){if(mo.event.touches.length){for(var t=mo.event.changedTouches,e=0,r=t.length;r>e;++e)delete v[t[e].identifier];for(var u in v)return void n()}_.on(x,null).on(b,null),w.on(A,l).on(q,s),E(),c(d)}var g,p=this,d=C.of(p,arguments),v={},m=0,y=mo.event.changedTouches[0].identifier,x="touchmove.zoom-"+y,b="touchend.zoom-"+y,_=mo.select(_o).on(x,i).on(b,h),w=mo.select(p).on(A,null).on(q,e),E=L();z.call(p),e(),o(d)}function h(){var n=C.of(this,arguments);y?clearTimeout(y):(z.call(this),o(n)),y=setTimeout(function(){y=null,c(n)},50),f();var e=m||mo.mouse(this);v||(v=t(e)),r(Math.pow(2,.002*ua())*S.k),u(e,v),a(n)}function p(){v=null}function d(){var n=C.of(this,arguments),e=mo.mouse(this),i=t(e),l=Math.log(S.k)/Math.LN2;o(n),r(Math.pow(2,mo.event.shiftKey?Math.ceil(l)-1:Math.floor(l)+1)),u(e,i),a(n),c(n)}var v,m,y,M,x,b,_,w,S={x:0,y:0,k:1},E=[960,500],k=ia,A="mousedown.zoom",N="mousemove.zoom",T="mouseup.zoom",q="touchstart.zoom",C=g(n,"zoomstart","zoom","zoomend");return n.event=function(n){n.each(function(){var n=C.of(this,arguments),t=S;Oc?mo.select(this).transition().each("start.zoom",function(){S=this.__chart__||{x:0,y:0,k:1},o(n)}).tween("zoom:zoom",function(){var e=E[0],r=E[1],u=e/2,i=r/2,o=mo.interpolateZoom([(u-S.x)/S.k,(i-S.y)/S.k,e/S.k],[(u-t.x)/t.k,(i-t.y)/t.k,e/t.k]);return function(t){var r=o(t),c=e/r[2];this.__chart__=S={x:u-r[0]*c,y:i-r[1]*c,k:c},a(n)}}).each("end.zoom",function(){c(n)}):(this.__chart__=S,o(n),a(n),c(n))})},n.translate=function(t){return arguments.length?(S={x:+t[0],y:+t[1],k:S.k},i(),n):[S.x,S.y]},n.scale=function(t){return arguments.length?(S={x:S.x,y:S.y,k:+t},i(),n):S.k},n.scaleExtent=function(t){return arguments.length?(k=null==t?ia:[+t[0],+t[1]],n):k},n.center=function(t){return arguments.length?(m=t&&[+t[0],+t[1]],n):m},n.size=function(t){return arguments.length?(E=t&&[+t[0],+t[1]],n):E},n.x=function(t){return arguments.length?(b=t,x=t.copy(),S={x:0,y:0,k:1},n):b},n.y=function(t){return arguments.length?(w=t,_=t.copy(),S={x:0,y:0,k:1},n):w},mo.rebind(n,C,"on")};var ua,ia=[0,1/0],oa="onwheel"in xo?(ua=function(){return-mo.event.deltaY*(mo.event.deltaMode?120:1)},"wheel"):"onmousewheel"in xo?(ua=function(){return mo.event.wheelDelta},"mousewheel"):(ua=function(){return-mo.event.detail},"MozMousePixelScroll");Z.prototype.toString=function(){return this.rgb()+""},mo.hsl=function(n,t,e){return 1===arguments.length?n instanceof X?V(n.h,n.s,n.l):lt(""+n,st,V):V(+n,+t,+e)};var aa=X.prototype=new Z;aa.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),V(this.h,this.s,this.l/n)},aa.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),V(this.h,this.s,n*this.l)},aa.rgb=function(){return $(this.h,this.s,this.l)},mo.hcl=function(n,t,e){return 1===arguments.length?n instanceof W?B(n.h,n.c,n.l):n instanceof K?nt(n.l,n.a,n.b):nt((n=ft((n=mo.rgb(n)).r,n.g,n.b)).l,n.a,n.b):B(+n,+t,+e)};var ca=W.prototype=new Z;ca.brighter=function(n){return B(this.h,this.c,Math.min(100,this.l+la*(arguments.length?n:1)))},ca.darker=function(n){return B(this.h,this.c,Math.max(0,this.l-la*(arguments.length?n:1)))},ca.rgb=function(){return J(this.h,this.c,this.l).rgb()},mo.lab=function(n,t,e){return 1===arguments.length?n instanceof K?G(n.l,n.a,n.b):n instanceof W?J(n.l,n.c,n.h):ft((n=mo.rgb(n)).r,n.g,n.b):G(+n,+t,+e)};var la=18,sa=.95047,fa=1,ha=1.08883,ga=K.prototype=new Z;ga.brighter=function(n){return G(Math.min(100,this.l+la*(arguments.length?n:1)),this.a,this.b)},ga.darker=function(n){return G(Math.max(0,this.l-la*(arguments.length?n:1)),this.a,this.b)},ga.rgb=function(){return Q(this.l,this.a,this.b)},mo.rgb=function(n,t,e){return 1===arguments.length?n instanceof at?ot(n.r,n.g,n.b):lt(""+n,ot,$):ot(~~n,~~t,~~e)};var pa=at.prototype=new Z;pa.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,u=30;return t||e||r?(t&&u>t&&(t=u),e&&u>e&&(e=u),r&&u>r&&(r=u),ot(Math.min(255,~~(t/n)),Math.min(255,~~(e/n)),Math.min(255,~~(r/n)))):ot(u,u,u)},pa.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),ot(~~(n*this.r),~~(n*this.g),~~(n*this.b))},pa.hsl=function(){return st(this.r,this.g,this.b)},pa.toString=function(){return"#"+ct(this.r)+ct(this.g)+ct(this.b)};var da=mo.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});da.forEach(function(n,t){da.set(n,ut(t))}),mo.functor=pt,mo.xhr=vt(dt),mo.dsv=function(n,t){function e(n,e,i){arguments.length<3&&(i=e,e=null);var o=mo.xhr(n,t,i);return o.row=function(n){return arguments.length?o.response(null==(e=n)?r:u(n)):e},o.row(e)}function r(n){return e.parse(n.responseText)}function u(n){return function(t){return e.parse(t.responseText,n)}}function o(t){return t.map(a).join(n)}function a(n){return c.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var c=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var u=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(u(n),e)}:u})},e.parseRows=function(n,t){function e(){if(s>=c)return o;if(u)return u=!1,i;var t=s;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}s=e+2;var r=n.charCodeAt(e+1);return 13===r?(u=!0,10===n.charCodeAt(e+2)&&++s):10===r&&(u=!0),n.substring(t+1,e).replace(/""/g,'"')}for(;c>s;){var r=n.charCodeAt(s++),a=1;if(10===r)u=!0;else if(13===r)u=!0,10===n.charCodeAt(s)&&(++s,++a);else if(r!==l)continue;return n.substring(t,s-a)}return n.substring(t)}for(var r,u,i={},o={},a=[],c=n.length,s=0,f=0;(r=e())!==o;){for(var h=[];r!==i&&r!==o;)h.push(r),r=e();(!t||(h=t(h,f++)))&&a.push(h)}return a},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new i,u=[];return t.forEach(function(n){for(var t in n)r.has(t)||u.push(r.add(t))}),[u.map(a).join(n)].concat(t.map(function(t){return u.map(function(n){return a(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(o).join("\n")},e},mo.csv=mo.dsv(",","text/csv"),mo.tsv=mo.dsv("	","text/tab-separated-values");var va,ma,ya,Ma,xa,ba=_o[a(_o,"requestAnimationFrame")]||function(n){setTimeout(n,17)};mo.timer=function(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var u=e+t,i={callback:n,time:u,next:null};ma?ma.next=i:va=i,ma=i,ya||(Ma=clearTimeout(Ma),ya=1,ba(Mt))},mo.timer.flush=function(){bt(),_t()};var _a=".",wa=",",Sa=[3,3],Ea="$",ka=["y","z","a","f","p","n","\xb5","m","","k","M","G","T","P","E","Z","Y"].map(wt);mo.formatPrefix=function(n,t){var e=0;return n&&(0>n&&(n*=-1),t&&(n=mo.round(n,St(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((0>=e?e+1:e-1)/3)))),ka[8+e/3]},mo.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)},mo.format=function(n){var t=Aa.exec(n),e=t[1]||" ",r=t[2]||">",u=t[3]||"",i=t[4]||"",o=t[5],a=+t[6],c=t[7],l=t[8],s=t[9],f=1,h="",g=!1;switch(l&&(l=+l.substring(1)),(o||"0"===e&&"="===r)&&(o=e="0",r="=",c&&(a-=Math.floor((a-1)/4))),s){case"n":c=!0,s="g";break;case"%":f=100,h="%",s="f";break;case"p":f=100,h="%",s="r";break;case"b":case"o":case"x":case"X":"#"===i&&(i="0"+s.toLowerCase());case"c":case"d":g=!0,l=0;break;case"s":f=-1,s="r"}"#"===i?i="":"$"===i&&(i=Ea),"r"!=s||l||(s="g"),null!=l&&("g"==s?l=Math.max(1,Math.min(21,l)):("e"==s||"f"==s)&&(l=Math.max(0,Math.min(20,l)))),s=Na.get(s)||Et;var p=o&&c;return function(n){if(g&&n%1)return"";var t=0>n||0===n&&0>1/n?(n=-n,"-"):u;if(0>f){var d=mo.formatPrefix(n,l);n=d.scale(n),h=d.symbol}else n*=f;n=s(n,l);var v=n.lastIndexOf("."),m=0>v?n:n.substring(0,v),y=0>v?"":_a+n.substring(v+1);!o&&c&&(m=Ta(m));var M=i.length+m.length+y.length+(p?0:t.length),x=a>M?new Array(M=a-M+1).join(e):"";return p&&(m=Ta(x+m)),t+=i,n=m+y,("<"===r?t+n+x:">"===r?x+t+n:"^"===r?x.substring(0,M>>=1)+t+n+x.substring(M):t+(p?n:x+n))+h}};var Aa=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,Na=mo.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=mo.round(n,St(n,t))).toFixed(Math.max(0,Math.min(20,St(n*(1+1e-15),t))))}}),Ta=dt;if(Sa){var qa=Sa.length;Ta=function(n){for(var t=n.length,e=[],r=0,u=Sa[0];t>0&&u>0;)e.push(n.substring(t-=u,t+u)),u=Sa[r=(r+1)%qa];return e.reverse().join(wa)}}mo.geo={},kt.prototype={s:0,t:0,add:function(n){At(n,this.t,za),At(za.s,this.s,this),this.s?this.t+=za.t:this.s=za.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var za=new kt;mo.geo.stream=function(n,t){n&&Ca.hasOwnProperty(n.type)?Ca[n.type](n,t):Nt(n,t)};var Ca={Feature:function(n,t){Nt(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,u=e.length;++r<u;)Nt(e[r].geometry,t)}},Da={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){Tt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)Tt(e[r],t,0)},Polygon:function(n,t){qt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)qt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,u=e.length;++r<u;)Nt(e[r],t)}};mo.geo.area=function(n){return ja=0,mo.geo.stream(n,Ha),ja};var ja,La=new kt,Ha={sphere:function(){ja+=4*Bo},point:c,lineStart:c,lineEnd:c,polygonStart:function(){La.reset(),Ha.lineStart=zt},polygonEnd:function(){var n=2*La;ja+=0>n?4*Bo+n:n,Ha.lineStart=Ha.lineEnd=Ha.point=c}};mo.geo.bounds=function(){function n(n,t){M.push(x=[s=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=Ct([t*Qo,e*Qo]);if(m){var u=jt(m,r),i=[u[1],-u[0],0],o=jt(i,u);Ft(o),o=Pt(o);var c=t-p,l=c>0?1:-1,d=o[0]*na*l,v=Math.abs(c)>180;if(v^(d>l*p&&l*t>d)){var y=o[1]*na;y>g&&(g=y)}else if(d=(d+360)%360-180,v^(d>l*p&&l*t>d)){var y=-o[1]*na;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);v?p>t?a(s,t)>a(s,h)&&(h=t):a(t,h)>a(s,h)&&(s=t):h>=s?(s>t&&(s=t),t>h&&(h=t)):t>p?a(s,t)>a(s,h)&&(h=t):a(t,h)>a(s,h)&&(s=t)}else n(t,e);m=r,p=t}function e(){b.point=t}function r(){x[0]=s,x[1]=h,b.point=n,m=null}function u(n,e){if(m){var r=n-p;y+=Math.abs(r)>180?r+(r>0?360:-360):r}else d=n,v=e;Ha.point(n,e),t(n,e)}function i(){Ha.lineStart()}function o(){u(d,v),Ha.lineEnd(),Math.abs(y)>Go&&(s=-(h=180)),x[0]=s,x[1]=h,m=null}function a(n,t){return(t-=n)<0?t+360:t}function c(n,t){return n[0]-t[0]}function l(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var s,f,h,g,p,d,v,m,y,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=u,b.lineStart=i,b.lineEnd=o,y=0,Ha.polygonStart()},polygonEnd:function(){Ha.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>La?(s=-(h=180),f=-(g=90)):y>Go?g=90:-Go>y&&(f=-90),x[0]=s,x[1]=h}};return function(n){g=h=-(s=f=1/0),M=[],mo.geo.stream(n,b);var t=M.length;if(t){M.sort(c);for(var e,r=1,u=M[0],i=[u];t>r;++r)e=M[r],l(e[0],u)||l(e[1],u)?(a(u[0],e[1])>a(u[0],u[1])&&(u[1]=e[1]),a(e[0],u[1])>a(u[0],u[1])&&(u[0]=e[0])):i.push(u=e);for(var o,e,p=-1/0,t=i.length-1,r=0,u=i[t];t>=r;u=e,++r)e=i[r],(o=a(u[1],e[0]))>p&&(p=o,s=e[0],h=u[1])}return M=x=null,1/0===s||1/0===f?[[0/0,0/0],[0/0,0/0]]:[[s,f],[h,g]]}}(),mo.geo.centroid=function(n){Fa=Pa=Oa=Ra=Ya=Ia=Ua=Za=Va=Xa=$a=0,mo.geo.stream(n,Ba);var t=Va,e=Xa,r=$a,u=t*t+e*e+r*r;return Ko>u&&(t=Ia,e=Ua,r=Za,Go>Pa&&(t=Oa,e=Ra,r=Ya),u=t*t+e*e+r*r,Ko>u)?[0/0,0/0]:[Math.atan2(e,t)*na,O(r/Math.sqrt(u))*na]};var Fa,Pa,Oa,Ra,Ya,Ia,Ua,Za,Va,Xa,$a,Ba={sphere:c,point:Rt,lineStart:It,lineEnd:Ut,polygonStart:function(){Ba.lineStart=Zt},polygonEnd:function(){Ba.lineStart=It}},Wa=Bt(Vt,Qt,te,[-Bo,-Bo/2]),Ja=1e9;mo.geo.clipExtent=function(){var n,t,e,r,u,i,o={stream:function(n){return u&&(u.valid=!1),u=i(n),u.valid=!0,u},extent:function(a){return arguments.length?(i=re(n=+a[0][0],t=+a[0][1],e=+a[1][0],r=+a[1][1]),u&&(u.valid=!1,u=null),o):[[n,t],[e,r]]}};return o.extent([[0,0],[960,500]])},(mo.geo.conicEqualArea=function(){return oe(ae)}).raw=ae,mo.geo.albers=function(){return mo.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},mo.geo.albersUsa=function(){function n(n){var i=n[0],o=n[1];return t=null,e(i,o),t||(r(i,o),t)||u(i,o),t}var t,e,r,u,i=mo.geo.albers(),o=mo.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),a=mo.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),c={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=i.scale(),e=i.translate(),r=(n[0]-e[0])/t,u=(n[1]-e[1])/t;return(u>=.12&&.234>u&&r>=-.425&&-.214>r?o:u>=.166&&.234>u&&r>=-.214&&-.115>r?a:i).invert(n)},n.stream=function(n){var t=i.stream(n),e=o.stream(n),r=a.stream(n);return{point:function(n,u){t.point(n,u),e.point(n,u),r.point(n,u)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(i.precision(t),o.precision(t),a.precision(t),n):i.precision()},n.scale=function(t){return arguments.length?(i.scale(t),o.scale(.35*t),a.scale(t),n.translate(i.translate())):i.scale()},n.translate=function(t){if(!arguments.length)return i.translate();var l=i.scale(),s=+t[0],f=+t[1];return e=i.translate(t).clipExtent([[s-.455*l,f-.238*l],[s+.455*l,f+.238*l]]).stream(c).point,r=o.translate([s-.307*l,f+.201*l]).clipExtent([[s-.425*l+Go,f+.12*l+Go],[s-.214*l-Go,f+.234*l-Go]]).stream(c).point,u=a.translate([s-.205*l,f+.212*l]).clipExtent([[s-.214*l+Go,f+.166*l+Go],[s-.115*l-Go,f+.234*l-Go]]).stream(c).point,n},n.scale(1070)};var Ga,Ka,Qa,nc,tc,ec,rc={point:c,lineStart:c,lineEnd:c,polygonStart:function(){Ka=0,rc.lineStart=ce},polygonEnd:function(){rc.lineStart=rc.lineEnd=rc.point=c,Ga+=Math.abs(Ka/2)}},uc={point:le,lineStart:c,lineEnd:c,polygonStart:c,polygonEnd:c},ic={point:he,lineStart:ge,lineEnd:pe,polygonStart:function(){ic.lineStart=de},polygonEnd:function(){ic.point=he,ic.lineStart=ge,ic.lineEnd=pe}};mo.geo.transform=function(n){return{stream:function(t){var e=new ye(t);for(var r in n)e[r]=n[r];return e}}},ye.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},mo.geo.path=function(){function n(n){return n&&("function"==typeof a&&i.pointRadius(+a.apply(this,arguments)),o&&o.valid||(o=u(i)),mo.geo.stream(n,o)),i.result()}function t(){return o=null,n}var e,r,u,i,o,a=4.5;return n.area=function(n){return Ga=0,mo.geo.stream(n,u(rc)),Ga},n.centroid=function(n){return Oa=Ra=Ya=Ia=Ua=Za=Va=Xa=$a=0,mo.geo.stream(n,u(ic)),$a?[Va/$a,Xa/$a]:Za?[Ia/Za,Ua/Za]:Ya?[Oa/Ya,Ra/Ya]:[0/0,0/0]},n.bounds=function(n){return tc=ec=-(Qa=nc=1/0),mo.geo.stream(n,u(uc)),[[Qa,nc],[tc,ec]]},n.projection=function(n){return arguments.length?(u=(e=n)?n.stream||Me(n):dt,t()):e},n.context=function(n){return arguments.length?(i=null==(r=n)?new se:new ve(n),"function"!=typeof a&&i.pointRadius(a),t()):r},n.pointRadius=function(t){return arguments.length?(a="function"==typeof t?t:(i.pointRadius(+t),+t),n):a},n.projection(mo.geo.albersUsa()).context(null)},mo.geo.projection=xe,mo.geo.projectionMutator=be,(mo.geo.equirectangular=function(){return xe(we)}).raw=we.invert=we,mo.geo.rotation=function(n){function t(t){return t=n(t[0]*Qo,t[1]*Qo),t[0]*=na,t[1]*=na,t}return n=Ee(n[0]%360*Qo,n[1]*Qo,n.length>2?n[2]*Qo:0),t.invert=function(t){return t=n.invert(t[0]*Qo,t[1]*Qo),t[0]*=na,t[1]*=na,t},t},Se.invert=we,mo.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=Ee(-n[0]*Qo,-n[1]*Qo,0).invert,u=[];return e(null,null,1,{point:function(n,e){u.push(n=t(n,e)),n[0]*=na,n[1]*=na}}),{type:"Polygon",coordinates:[u]}}var t,e,r=[0,0],u=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=Te((t=+r)*Qo,u*Qo),n):t},n.precision=function(r){return arguments.length?(e=Te(t*Qo,(u=+r)*Qo),n):u},n.angle(90)},mo.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Qo,u=n[1]*Qo,i=t[1]*Qo,o=Math.sin(r),a=Math.cos(r),c=Math.sin(u),l=Math.cos(u),s=Math.sin(i),f=Math.cos(i);return Math.atan2(Math.sqrt((e=f*o)*e+(e=l*s-c*f*a)*e),c*s+l*f*a)},mo.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return mo.range(Math.ceil(i/v)*v,u,v).map(h).concat(mo.range(Math.ceil(l/m)*m,c,m).map(g)).concat(mo.range(Math.ceil(r/p)*p,e,p).filter(function(n){return Math.abs(n%v)>Go
}).map(s)).concat(mo.range(Math.ceil(a/d)*d,o,d).filter(function(n){return Math.abs(n%m)>Go}).map(f))}var e,r,u,i,o,a,c,l,s,f,h,g,p=10,d=p,v=90,m=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(i).concat(g(c).slice(1),h(u).reverse().slice(1),g(l).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(i=+t[0][0],u=+t[1][0],l=+t[0][1],c=+t[1][1],i>u&&(t=i,i=u,u=t),l>c&&(t=l,l=c,c=t),n.precision(y)):[[i,l],[u,c]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],a=+t[0][1],o=+t[1][1],r>e&&(t=r,r=e,e=t),a>o&&(t=a,a=o,o=t),n.precision(y)):[[r,a],[e,o]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(v=+t[0],m=+t[1],n):[v,m]},n.minorStep=function(t){return arguments.length?(p=+t[0],d=+t[1],n):[p,d]},n.precision=function(t){return arguments.length?(y=+t,s=ze(a,o,90),f=Ce(r,e,y),h=ze(l,c,90),g=Ce(i,u,y),n):y},n.majorExtent([[-180,-90+Go],[180,90-Go]]).minorExtent([[-180,-80-Go],[180,80+Go]])},mo.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||u.apply(this,arguments)]}}var t,e,r=De,u=je;return n.distance=function(){return mo.geo.distance(t||r.apply(this,arguments),e||u.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(u=t,e="function"==typeof t?null:t,n):u},n.precision=function(){return arguments.length?n:0},n},mo.geo.interpolate=function(n,t){return Le(n[0]*Qo,n[1]*Qo,t[0]*Qo,t[1]*Qo)},mo.geo.length=function(n){return oc=0,mo.geo.stream(n,ac),oc};var oc,ac={sphere:c,point:c,lineStart:He,lineEnd:c,polygonStart:c,polygonEnd:c},cc=Fe(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(mo.geo.azimuthalEqualArea=function(){return xe(cc)}).raw=cc;var lc=Fe(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},dt);(mo.geo.azimuthalEquidistant=function(){return xe(lc)}).raw=lc,(mo.geo.conicConformal=function(){return oe(Pe)}).raw=Pe,(mo.geo.conicEquidistant=function(){return oe(Oe)}).raw=Oe;var sc=Fe(function(n){return 1/n},Math.atan);(mo.geo.gnomonic=function(){return xe(sc)}).raw=sc,Re.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Jo]},(mo.geo.mercator=function(){return Ye(Re)}).raw=Re;var fc=Fe(function(){return 1},Math.asin);(mo.geo.orthographic=function(){return xe(fc)}).raw=fc;var hc=Fe(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(mo.geo.stereographic=function(){return xe(hc)}).raw=hc,Ie.invert=function(n,t){return[Math.atan2(R(n),Math.cos(t)),O(Math.sin(t)/Y(n))]},(mo.geo.transverseMercator=function(){return Ye(Ie)}).raw=Ie,mo.geom={},mo.svg={},mo.svg.line=function(){return Ue(dt)};var gc=mo.map({linear:Xe,"linear-closed":$e,step:Be,"step-before":We,"step-after":Je,basis:er,"basis-open":rr,"basis-closed":ur,bundle:ir,cardinal:Qe,"cardinal-open":Ge,"cardinal-closed":Ke,monotone:fr});gc.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var pc=[0,2/3,1/3,0],dc=[0,1/3,2/3,0],vc=[0,1/6,2/3,1/6];mo.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,u,i,o,a,c,l,s,f,h,g,p,d=pt(e),v=pt(r),m=n.length,y=m-1,M=[],x=[],b=0;if(d===Ze&&r===Ve)t=n;else for(i=0,t=[];m>i;++i)t.push([+d.call(this,u=n[i],i),+v.call(this,u,i)]);for(i=1;m>i;++i)(t[i][1]<t[b][1]||t[i][1]==t[b][1]&&t[i][0]<t[b][0])&&(b=i);for(i=0;m>i;++i)i!==b&&(c=t[i][1]-t[b][1],a=t[i][0]-t[b][0],M.push({angle:Math.atan2(c,a),index:i}));for(M.sort(function(n,t){return n.angle-t.angle}),g=M[0].angle,h=M[0].index,f=0,i=1;y>i;++i){if(o=M[i].index,g==M[i].angle){if(a=t[h][0]-t[b][0],c=t[h][1]-t[b][1],l=t[o][0]-t[b][0],s=t[o][1]-t[b][1],a*a+c*c>=l*l+s*s){M[i].index=-1;continue}M[f].index=-1}g=M[i].angle,f=i,h=o}for(x.push(b),i=0,o=0;2>i;++o)M[o].index>-1&&(x.push(M[o].index),i++);for(p=x.length;y>o;++o)if(!(M[o].index<0)){for(;!hr(x[p-2],x[p-1],M[o].index,t);)--p;x[p++]=M[o].index}var _=[];for(i=p-1;i>=0;--i)_.push(n[x[i]]);return _}var e=Ze,r=Ve;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},mo.geom.polygon=function(n){return Lo(n,mc),n};var mc=mo.geom.polygon.prototype=[];mc.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],u=0;++t<e;)n=r,r=this[t],u+=n[1]*r[0]-n[0]*r[1];return.5*u},mc.centroid=function(n){var t,e,r=-1,u=this.length,i=0,o=0,a=this[u-1];for(arguments.length||(n=-1/(6*this.area()));++r<u;)t=a,a=this[r],e=t[0]*a[1]-a[0]*t[1],i+=(t[0]+a[0])*e,o+=(t[1]+a[1])*e;return[i*n,o*n]},mc.clip=function(n){for(var t,e,r,u,i,o,a=dr(n),c=-1,l=this.length-dr(this),s=this[l-1];++c<l;){for(t=n.slice(),n.length=0,u=this[c],i=t[(r=t.length-a)-1],e=-1;++e<r;)o=t[e],gr(o,s,u)?(gr(i,s,u)||n.push(pr(i,o,s,u)),n.push(o)):gr(i,s,u)&&n.push(pr(i,o,s,u)),i=o;a&&n.push(n[0]),s=u}return n},mo.geom.delaunay=function(n){var t=n.map(function(){return[]}),e=[];return vr(n,function(e){t[e.region.l.index].push(n[e.region.r.index])}),t.forEach(function(t,r){var u=n[r],i=u[0],o=u[1];t.forEach(function(n){n.angle=Math.atan2(n[0]-i,n[1]-o)}),t.sort(function(n,t){return n.angle-t.angle});for(var a=0,c=t.length-1;c>a;a++)e.push([u,t[a],t[a+1]])}),e},mo.geom.voronoi=function(n){function t(n){var t,i,o,a=n.map(function(){return[]}),c=pt(e),l=pt(r),s=n.length,f=1e6;if(c===Ze&&l===Ve)t=n;else for(t=new Array(s),o=0;s>o;++o)t[o]=[+c.call(this,i=n[o],o),+l.call(this,i,o)];if(vr(t,function(n){var t,e,r,u,i,o;1===n.a&&n.b>=0?(t=n.ep.r,e=n.ep.l):(t=n.ep.l,e=n.ep.r),1===n.a?(i=t?t.y:-f,r=n.c-n.b*i,o=e?e.y:f,u=n.c-n.b*o):(r=t?t.x:-f,i=n.c-n.a*r,u=e?e.x:f,o=n.c-n.a*u);var c=[r,i],l=[u,o];a[n.region.l.index].push(c,l),a[n.region.r.index].push(c,l)}),a=a.map(function(n,e){var r=t[e][0],u=t[e][1],i=n.map(function(n){return Math.atan2(n[0]-r,n[1]-u)}),o=mo.range(n.length).sort(function(n,t){return i[n]-i[t]});return o.filter(function(n,t){return!t||i[n]-i[o[t-1]]>Go}).map(function(t){return n[t]})}),a.forEach(function(n,e){var r=n.length;if(!r)return n.push([-f,-f],[-f,f],[f,f],[f,-f]);if(!(r>2)){var u=t[e],i=n[0],o=n[1],a=u[0],c=u[1],l=i[0],s=i[1],h=o[0],g=o[1],p=Math.abs(h-l),d=g-s;if(Math.abs(d)<Go){var v=s>c?-f:f;n.push([-f,v],[f,v])}else if(Go>p){var m=l>a?-f:f;n.push([m,-f],[m,f])}else{var v=(l-a)*(g-s)>(h-l)*(s-c)?f:-f,y=Math.abs(d)-p;Math.abs(y)<Go?n.push([0>d?v:-v,v]):(y>0&&(v*=-1),n.push([-f,v],[f,v]))}}}),u)for(o=0;s>o;++o)u.clip(a[o]);for(o=0;s>o;++o)a[o].point=n[o];return a}var e=Ze,r=Ve,u=null;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.clipExtent=function(n){if(!arguments.length)return u&&[u[0],u[2]];if(null==n)u=null;else{var e=+n[0][0],r=+n[0][1],i=+n[1][0],o=+n[1][1];u=mo.geom.polygon([[e,r],[e,o],[i,o],[i,r]])}return t},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):u&&u[2]},t.links=function(n){var t,u,i,o=n.map(function(){return[]}),a=[],c=pt(e),l=pt(r),s=n.length;if(c===Ze&&l===Ve)t=n;else for(t=new Array(s),i=0;s>i;++i)t[i]=[+c.call(this,u=n[i],i),+l.call(this,u,i)];return vr(t,function(t){var e=t.region.l.index,r=t.region.r.index;o[e][r]||(o[e][r]=o[r][e]=!0,a.push({source:n[e],target:n[r]}))}),a},t.triangles=function(n){if(e===Ze&&r===Ve)return mo.geom.delaunay(n);for(var t,u=new Array(c),i=pt(e),o=pt(r),a=-1,c=n.length;++a<c;)(u[a]=[+i.call(this,t=n[a],a),+o.call(this,t,a)]).data=t;return mo.geom.delaunay(u).map(function(n){return n.map(function(n){return n.data})})},t)};var yc={l:"r",r:"l"};mo.geom.quadtree=function(n,t,e,r,u){function i(n){function i(n,t,e,r,u,i,o,a){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var c=n.x,s=n.y;if(null!=c)if(Math.abs(c-e)+Math.abs(s-r)<.01)l(n,t,e,r,u,i,o,a);else{var f=n.point;n.x=n.y=n.point=null,l(n,f,c,s,u,i,o,a),l(n,t,e,r,u,i,o,a)}else n.x=e,n.y=r,n.point=t}else l(n,t,e,r,u,i,o,a)}function l(n,t,e,r,u,o,a,c){var l=.5*(u+a),s=.5*(o+c),f=e>=l,h=r>=s,g=(h<<1)+f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=Mr()),f?u=l:a=l,h?o=s:c=s,i(n,t,e,r,u,o,a,c)}var s,f,h,g,p,d,v,m,y,M=pt(a),x=pt(c);if(null!=t)d=t,v=e,m=r,y=u;else if(m=y=-(d=v=1/0),f=[],h=[],p=n.length,o)for(g=0;p>g;++g)s=n[g],s.x<d&&(d=s.x),s.y<v&&(v=s.y),s.x>m&&(m=s.x),s.y>y&&(y=s.y),f.push(s.x),h.push(s.y);else for(g=0;p>g;++g){var b=+M(s=n[g],g),_=+x(s,g);d>b&&(d=b),v>_&&(v=_),b>m&&(m=b),_>y&&(y=_),f.push(b),h.push(_)}var w=m-d,S=y-v;w>S?y=v+w:m=d+S;var E=Mr();if(E.add=function(n){i(E,n,+M(n,++g),+x(n,g),d,v,m,y)},E.visit=function(n){xr(n,E,d,v,m,y)},g=-1,null==t){for(;++g<p;)i(E,n[g],f[g],h[g],d,v,m,y);--g}else n.forEach(E.add);return f=h=n=s=null,E}var o,a=Ze,c=Ve;return(o=arguments.length)?(a=mr,c=yr,3===o&&(u=e,r=t,e=t=0),i(n)):(i.x=function(n){return arguments.length?(a=n,i):a},i.y=function(n){return arguments.length?(c=n,i):c},i.extent=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],u=+n[1][1]),i):null==t?null:[[t,e],[r,u]]},i.size=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=e=0,r=+n[0],u=+n[1]),i):null==t?null:[r-t,u-e]},i)},mo.interpolateRgb=br,mo.interpolateObject=_r,mo.interpolateNumber=wr,mo.interpolateString=Sr;var Mc=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;mo.interpolate=Er,mo.interpolators=[function(n,t){var e=typeof t;return("string"===e?da.has(t)||/^(#|rgb\(|hsl\()/.test(t)?br:Sr:t instanceof Z?br:"object"===e?Array.isArray(t)?kr:_r:wr)(n,t)}],mo.interpolateArray=kr;var xc=function(){return dt},bc=mo.map({linear:xc,poly:Dr,quad:function(){return qr},cubic:function(){return zr},sin:function(){return jr},exp:function(){return Lr},circle:function(){return Hr},elastic:Fr,back:Pr,bounce:function(){return Or}}),_c=mo.map({"in":dt,out:Nr,"in-out":Tr,"out-in":function(n){return Tr(Nr(n))}});mo.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.substring(0,t):n,r=t>=0?n.substring(t+1):"in";return e=bc.get(e)||xc,r=_c.get(r)||dt,Ar(r(e.apply(null,Array.prototype.slice.call(arguments,1))))},mo.interpolateHcl=Rr,mo.interpolateHsl=Yr,mo.interpolateLab=Ir,mo.interpolateRound=Ur,mo.transform=function(n){var t=xo.createElementNS(mo.ns.prefix.svg,"g");return(mo.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Zr(e?e.matrix:wc)})(n)},Zr.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var wc={a:1,b:0,c:0,d:1,e:0,f:0};mo.interpolateTransform=Br,mo.layout={},mo.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Gr(n[e]));return t}},mo.layout.chord=function(){function n(){var n,l,f,h,g,p={},d=[],v=mo.range(i),m=[];for(e=[],r=[],n=0,h=-1;++h<i;){for(l=0,g=-1;++g<i;)l+=u[h][g];d.push(l),m.push(mo.range(i)),n+=l}for(o&&v.sort(function(n,t){return o(d[n],d[t])}),a&&m.forEach(function(n,t){n.sort(function(n,e){return a(u[t][n],u[t][e])})}),n=(Wo-s*i)/n,l=0,h=-1;++h<i;){for(f=l,g=-1;++g<i;){var y=v[h],M=m[y][g],x=u[y][M],b=l,_=l+=x*n;p[y+"-"+M]={index:y,subindex:M,startAngle:b,endAngle:_,value:x}}r[y]={index:y,startAngle:f,endAngle:l,value:(l-f)/n},l+=s}for(h=-1;++h<i;)for(g=h-1;++g<i;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}c&&t()}function t(){e.sort(function(n,t){return c((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,u,i,o,a,c,l={},s=0;return l.matrix=function(n){return arguments.length?(i=(u=n)&&u.length,e=r=null,l):u},l.padding=function(n){return arguments.length?(s=n,e=r=null,l):s},l.sortGroups=function(n){return arguments.length?(o=n,e=r=null,l):o},l.sortSubgroups=function(n){return arguments.length?(a=n,e=null,l):a},l.sortChords=function(n){return arguments.length?(c=n,e&&t(),l):c},l.chords=function(){return e||n(),e},l.groups=function(){return r||n(),r},l},mo.layout.force=function(){function n(n){return function(t,e,r,u){if(t.point!==n){var i=t.cx-n.x,o=t.cy-n.y,a=1/Math.sqrt(i*i+o*o);if(d>(u-e)*a){var c=t.charge*a*a;return n.px-=i*c,n.py-=o*c,!0}if(t.point&&isFinite(a)){var c=t.pointCharge*a*a;n.px-=i*c,n.py-=o*c}}return!t.charge}}function t(n){n.px=mo.event.x,n.py=mo.event.y,a.resume()}var e,r,u,i,o,a={},c=mo.dispatch("start","tick","end"),l=[1,1],s=.9,f=Sc,h=Ec,g=-30,p=.1,d=.8,v=[],m=[];return a.tick=function(){if((r*=.99)<.005)return c.end({type:"end",alpha:r=0}),!0;var t,e,a,f,h,d,y,M,x,b=v.length,_=m.length;for(e=0;_>e;++e)a=m[e],f=a.source,h=a.target,M=h.x-f.x,x=h.y-f.y,(d=M*M+x*x)&&(d=r*i[e]*((d=Math.sqrt(d))-u[e])/d,M*=d,x*=d,h.x-=M*(y=f.weight/(h.weight+f.weight)),h.y-=x*y,f.x+=M*(y=1-y),f.y+=x*y);if((y=r*p)&&(M=l[0]/2,x=l[1]/2,e=-1,y))for(;++e<b;)a=v[e],a.x+=(M-a.x)*y,a.y+=(x-a.y)*y;if(g)for(uu(t=mo.geom.quadtree(v),r,o),e=-1;++e<b;)(a=v[e]).fixed||t.visit(n(a));for(e=-1;++e<b;)a=v[e],a.fixed?(a.x=a.px,a.y=a.py):(a.x-=(a.px-(a.px=a.x))*s,a.y-=(a.py-(a.py=a.y))*s);c.tick({type:"tick",alpha:r})},a.nodes=function(n){return arguments.length?(v=n,a):v},a.links=function(n){return arguments.length?(m=n,a):m},a.size=function(n){return arguments.length?(l=n,a):l},a.linkDistance=function(n){return arguments.length?(f="function"==typeof n?n:+n,a):f},a.distance=a.linkDistance,a.linkStrength=function(n){return arguments.length?(h="function"==typeof n?n:+n,a):h},a.friction=function(n){return arguments.length?(s=+n,a):s},a.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,a):g},a.gravity=function(n){return arguments.length?(p=+n,a):p},a.theta=function(n){return arguments.length?(d=+n,a):d},a.alpha=function(n){return arguments.length?(n=+n,r?r=n>0?n:0:n>0&&(c.start({type:"start",alpha:r=n}),mo.timer(a.tick)),a):r},a.start=function(){function n(n,r){for(var u,i=t(e),o=-1,a=i.length;++o<a;)if(!isNaN(u=i[o][n]))return u;return Math.random()*r}function t(){if(!c){for(c=[],r=0;p>r;++r)c[r]=[];for(r=0;d>r;++r){var n=m[r];c[n.source.index].push(n.target),c[n.target.index].push(n.source)}}return c[e]}var e,r,c,s,p=v.length,d=m.length,y=l[0],M=l[1];for(e=0;p>e;++e)(s=v[e]).index=e,s.weight=0;for(e=0;d>e;++e)s=m[e],"number"==typeof s.source&&(s.source=v[s.source]),"number"==typeof s.target&&(s.target=v[s.target]),++s.source.weight,++s.target.weight;for(e=0;p>e;++e)s=v[e],isNaN(s.x)&&(s.x=n("x",y)),isNaN(s.y)&&(s.y=n("y",M)),isNaN(s.px)&&(s.px=s.x),isNaN(s.py)&&(s.py=s.y);if(u=[],"function"==typeof f)for(e=0;d>e;++e)u[e]=+f.call(this,m[e],e);else for(e=0;d>e;++e)u[e]=f;if(i=[],"function"==typeof h)for(e=0;d>e;++e)i[e]=+h.call(this,m[e],e);else for(e=0;d>e;++e)i[e]=h;if(o=[],"function"==typeof g)for(e=0;p>e;++e)o[e]=+g.call(this,v[e],e);else for(e=0;p>e;++e)o[e]=g;return a.resume()},a.resume=function(){return a.alpha(.1)},a.stop=function(){return a.alpha(0)},a.drag=function(){return e||(e=mo.behavior.drag().origin(dt).on("dragstart.force",nu).on("drag.force",t).on("dragend.force",tu)),arguments.length?(this.on("mouseover.force",eu).on("mouseout.force",ru).call(e),void 0):e},mo.rebind(a,c,"on")};var Sc=20,Ec=1;mo.layout.hierarchy=function(){function n(t,o,a){var c=u.call(e,t,o);if(t.depth=o,a.push(t),c&&(l=c.length)){for(var l,s,f=-1,h=t.children=[],g=0,p=o+1;++f<l;)s=n(c[f],p,a),s.parent=t,h.push(s),g+=s.value;r&&h.sort(r),i&&(t.value=g)}else i&&(t.value=+i.call(e,t,o)||0);return t}function t(n,r){var u=n.children,o=0;if(u&&(a=u.length))for(var a,c=-1,l=r+1;++c<a;)o+=t(u[c],l);else i&&(o=+i.call(e,n,r)||0);return i&&(n.value=o),o}function e(t){var e=[];return n(t,0,e),e}var r=cu,u=ou,i=au;return e.sort=function(n){return arguments.length?(r=n,e):r},e.children=function(n){return arguments.length?(u=n,e):u},e.value=function(n){return arguments.length?(i=n,e):i},e.revalue=function(n){return t(n,0),n},e},mo.layout.partition=function(){function n(t,e,r,u){var i=t.children;if(t.x=e,t.y=t.depth*u,t.dx=r,t.dy=u,i&&(o=i.length)){var o,a,c,l=-1;for(r=t.value?r/t.value:0;++l<o;)n(a=i[l],e,c=a.value*r,u),e+=c}}function t(n){var e=n.children,r=0;if(e&&(u=e.length))for(var u,i=-1;++i<u;)r=Math.max(r,t(e[i]));return 1+r}function e(e,i){var o=r.call(this,e,i);return n(o[0],0,u[0],u[1]/t(o[0])),o}var r=mo.layout.hierarchy(),u=[1,1];return e.size=function(n){return arguments.length?(u=n,e):u},iu(e,r)},mo.layout.pie=function(){function n(i){var o=i.map(function(e,r){return+t.call(n,e,r)}),a=+("function"==typeof r?r.apply(this,arguments):r),c=(("function"==typeof u?u.apply(this,arguments):u)-a)/mo.sum(o),l=mo.range(i.length);null!=e&&l.sort(e===kc?function(n,t){return o[t]-o[n]}:function(n,t){return e(i[n],i[t])});var s=[];return l.forEach(function(n){var t;s[n]={data:i[n],value:t=o[n],startAngle:a,endAngle:a+=t*c}}),s}var t=Number,e=kc,r=0,u=Wo;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(u=t,n):u},n};var kc={};mo.layout.stack=function(){function n(a,c){var l=a.map(function(e,r){return t.call(n,e,r)}),s=l.map(function(t){return t.map(function(t,e){return[i.call(n,t,e),o.call(n,t,e)]})}),f=e.call(n,s,c);l=mo.permute(l,f),s=mo.permute(s,f);var h,g,p,d=r.call(n,s,c),v=l.length,m=l[0].length;for(g=0;m>g;++g)for(u.call(n,l[0][g],p=d[g],s[0][g][1]),h=1;v>h;++h)u.call(n,l[h][g],p+=s[h-1][g][1],s[h][g][1]);return a}var t=dt,e=gu,r=pu,u=hu,i=su,o=fu;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:Ac.get(t)||gu,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:Nc.get(t)||pu,n):r},n.x=function(t){return arguments.length?(i=t,n):i},n.y=function(t){return arguments.length?(o=t,n):o},n.out=function(t){return arguments.length?(u=t,n):u},n};var Ac=mo.map({"inside-out":function(n){var t,e,r=n.length,u=n.map(du),i=n.map(vu),o=mo.range(r).sort(function(n,t){return u[n]-u[t]}),a=0,c=0,l=[],s=[];for(t=0;r>t;++t)e=o[t],c>a?(a+=i[e],l.push(e)):(c+=i[e],s.push(e));return s.reverse().concat(l)},reverse:function(n){return mo.range(n.length).reverse()},"default":gu}),Nc=mo.map({silhouette:function(n){var t,e,r,u=n.length,i=n[0].length,o=[],a=0,c=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];r>a&&(a=r),o.push(r)}for(e=0;i>e;++e)c[e]=(a-o[e])/2;return c},wiggle:function(n){var t,e,r,u,i,o,a,c,l,s=n.length,f=n[0],h=f.length,g=[];for(g[0]=c=l=0,e=1;h>e;++e){for(t=0,u=0;s>t;++t)u+=n[t][e][1];for(t=0,i=0,a=f[e][0]-f[e-1][0];s>t;++t){for(r=0,o=(n[t][e][1]-n[t][e-1][1])/(2*a);t>r;++r)o+=(n[r][e][1]-n[r][e-1][1])/a;i+=o*n[t][e][1]}g[e]=c-=u?i/u*a:0,l>c&&(l=c)}for(e=0;h>e;++e)g[e]-=l;return g},expand:function(n){var t,e,r,u=n.length,i=n[0].length,o=1/u,a=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];if(r)for(t=0;u>t;t++)n[t][e][1]/=r;else for(t=0;u>t;t++)n[t][e][1]=o}for(e=0;i>e;++e)a[e]=0;return a},zero:pu});mo.layout.histogram=function(){function n(n,i){for(var o,a,c=[],l=n.map(e,this),s=r.call(this,l,i),f=u.call(this,s,l,i),i=-1,h=l.length,g=f.length-1,p=t?1:1/h;++i<g;)o=c[i]=[],o.dx=f[i+1]-(o.x=f[i]),o.y=0;if(g>0)for(i=-1;++i<h;)a=l[i],a>=s[0]&&a<=s[1]&&(o=c[mo.bisect(f,a,1,g)-1],o.y+=p,o.push(n[i]));return c}var t=!0,e=Number,r=xu,u=yu;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=pt(t),n):r},n.bins=function(t){return arguments.length?(u="number"==typeof t?function(n){return Mu(n,t)}:pt(t),n):u},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},mo.layout.tree=function(){function n(n,i){function o(n,t){var r=n.children,u=n._tree;if(r&&(i=r.length)){for(var i,a,l,s=r[0],f=s,h=-1;++h<i;)l=r[h],o(l,a),f=c(l,a,f),a=l;Tu(n);var g=.5*(s._tree.prelim+l._tree.prelim);t?(u.prelim=t._tree.prelim+e(n,t),u.mod=u.prelim-g):u.prelim=g}else t&&(u.prelim=t._tree.prelim+e(n,t))}function a(n,t){n.x=n._tree.prelim+t;var e=n.children;if(e&&(r=e.length)){var r,u=-1;for(t+=n._tree.mod;++u<r;)a(e[u],t)}}function c(n,t,r){if(t){for(var u,i=n,o=n,a=t,c=n.parent.children[0],l=i._tree.mod,s=o._tree.mod,f=a._tree.mod,h=c._tree.mod;a=wu(a),i=_u(i),a&&i;)c=_u(c),o=wu(o),o._tree.ancestor=n,u=a._tree.prelim+f-i._tree.prelim-l+e(a,i),u>0&&(qu(zu(a,n,r),n,u),l+=u,s+=u),f+=a._tree.mod,l+=i._tree.mod,h+=c._tree.mod,s+=o._tree.mod;a&&!wu(o)&&(o._tree.thread=a,o._tree.mod+=f-s),i&&!_u(c)&&(c._tree.thread=i,c._tree.mod+=l-h,r=n)}return r}var l=t.call(this,n,i),s=l[0];Nu(s,function(n,t){n._tree={ancestor:n,prelim:0,mod:0,change:0,shift:0,number:t?t._tree.number+1:0}}),o(s),a(s,-s._tree.prelim);var f=Su(s,ku),h=Su(s,Eu),g=Su(s,Au),p=f.x-e(f,h)/2,d=h.x+e(h,f)/2,v=g.depth||1;return Nu(s,u?function(n){n.x*=r[0],n.y=n.depth*r[1],delete n._tree}:function(n){n.x=(n.x-p)/(d-p)*r[0],n.y=n.depth/v*r[1],delete n._tree}),l}var t=mo.layout.hierarchy().sort(null).value(null),e=bu,r=[1,1],u=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(u=null==(r=t),n):u?null:r},n.nodeSize=function(t){return arguments.length?(u=null!=(r=t),n):u?r:null},iu(n,t)},mo.layout.pack=function(){function n(n,i){var o=e.call(this,n,i),a=o[0],c=u[0],l=u[1],s=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(a.x=a.y=0,Nu(a,function(n){n.r=+s(n.value)}),Nu(a,Hu),r){var f=r*(t?1:Math.max(2*a.r/c,2*a.r/l))/2;Nu(a,function(n){n.r+=f}),Nu(a,Hu),Nu(a,function(n){n.r-=f})}return Ou(a,c/2,l/2,t?1:1/Math.max(2*a.r/c,2*a.r/l)),o}var t,e=mo.layout.hierarchy().sort(Cu),r=0,u=[1,1];return n.size=function(t){return arguments.length?(u=t,n):u},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},iu(n,e)},mo.layout.cluster=function(){function n(n,i){var o,a=t.call(this,n,i),c=a[0],l=0;Nu(c,function(n){var t=n.children;t&&t.length?(n.x=Iu(t),n.y=Yu(t)):(n.x=o?l+=e(n,o):0,n.y=0,o=n)});var s=Uu(c),f=Zu(c),h=s.x-e(s,f)/2,g=f.x+e(f,s)/2;return Nu(c,u?function(n){n.x=(n.x-c.x)*r[0],n.y=(c.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(c.y?n.y/c.y:1))*r[1]}),a}var t=mo.layout.hierarchy().sort(null).value(null),e=bu,r=[1,1],u=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(u=null==(r=t),n):u?null:r},n.nodeSize=function(t){return arguments.length?(u=null!=(r=t),n):u?r:null},iu(n,t)},mo.layout.treemap=function(){function n(n,t){for(var e,r,u=-1,i=n.length;++u<i;)r=(e=n[u]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var i=e.children;if(i&&i.length){var o,a,c,l=f(e),s=[],h=i.slice(),p=1/0,d="slice"===g?l.dx:"dice"===g?l.dy:"slice-dice"===g?1&e.depth?l.dy:l.dx:Math.min(l.dx,l.dy);for(n(h,l.dx*l.dy/e.value),s.area=0;(c=h.length)>0;)s.push(o=h[c-1]),s.area+=o.area,"squarify"!==g||(a=r(s,d))<=p?(h.pop(),p=a):(s.area-=s.pop().area,u(s,d,l,!1),d=Math.min(l.dx,l.dy),s.length=s.area=0,p=1/0);s.length&&(u(s,d,l,!0),s.length=s.area=0),i.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var i,o=f(t),a=r.slice(),c=[];for(n(a,o.dx*o.dy/t.value),c.area=0;i=a.pop();)c.push(i),c.area+=i.area,null!=i.z&&(u(c,i.z?o.dx:o.dy,o,!a.length),c.length=c.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,u=0,i=1/0,o=-1,a=n.length;++o<a;)(e=n[o].area)&&(i>e&&(i=e),e>u&&(u=e));return r*=r,t*=t,r?Math.max(t*u*p/r,r/(t*i*p)):1/0}function u(n,t,e,r){var u,i=-1,o=n.length,a=e.x,l=e.y,s=t?c(n.area/t):0;if(t==e.dx){for((r||s>e.dy)&&(s=e.dy);++i<o;)u=n[i],u.x=a,u.y=l,u.dy=s,a+=u.dx=Math.min(e.x+e.dx-a,s?c(u.area/s):0);u.z=!0,u.dx+=e.x+e.dx-a,e.y+=s,e.dy-=s}else{for((r||s>e.dx)&&(s=e.dx);++i<o;)u=n[i],u.x=a,u.y=l,u.dx=s,l+=u.dy=Math.min(e.y+e.dy-l,s?c(u.area/s):0);u.z=!1,u.dy+=e.y+e.dy-l,e.x+=s,e.dx-=s}}function i(r){var u=o||a(r),i=u[0];return i.x=0,i.y=0,i.dx=l[0],i.dy=l[1],o&&a.revalue(i),n([i],i.dx*i.dy/i.value),(o?e:t)(i),h&&(o=u),u}var o,a=mo.layout.hierarchy(),c=Math.round,l=[1,1],s=null,f=Vu,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));return i.size=function(n){return arguments.length?(l=n,i):l},i.padding=function(n){function t(t){var e=n.call(i,t,t.depth);return null==e?Vu(t):Xu(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Xu(t,n)}if(!arguments.length)return s;var r;return f=null==(s=n)?Vu:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,i},i.round=function(n){return arguments.length?(c=n?Math.round:Number,i):c!=Number},i.sticky=function(n){return arguments.length?(h=n,o=null,i):h},i.ratio=function(n){return arguments.length?(p=n,i):p},i.mode=function(n){return arguments.length?(g=n+"",i):g},iu(i,a)},mo.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,u;do e=2*Math.random()-1,r=2*Math.random()-1,u=e*e+r*r;while(!u||u>1);return n+t*e*Math.sqrt(-2*Math.log(u)/u)}},logNormal:function(){var n=mo.random.normal.apply(mo,arguments);return function(){return Math.exp(n())}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t/n}}},mo.scale={};var Tc={floor:dt,ceil:dt};mo.scale.linear=function(){return Qu([0,1],[0,1],Er,!1)},mo.scale.log=function(){return ii(mo.scale.linear().domain([0,1]),10,!0,[1,10])};var qc=mo.format(".0e"),zc={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};mo.scale.pow=function(){return oi(mo.scale.linear(),1,[0,1])},mo.scale.sqrt=function(){return mo.scale.pow().exponent(.5)},mo.scale.ordinal=function(){return ci([],{t:"range",a:[[]]})},mo.scale.category10=function(){return mo.scale.ordinal().range(Cc)},mo.scale.category20=function(){return mo.scale.ordinal().range(Dc)},mo.scale.category20b=function(){return mo.scale.ordinal().range(jc)},mo.scale.category20c=function(){return mo.scale.ordinal().range(Lc)};var Cc=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(it),Dc=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(it),jc=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(it),Lc=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(it);mo.scale.quantile=function(){return li([],[])},mo.scale.quantize=function(){return si(0,1,[0,1])},mo.scale.threshold=function(){return fi([.5],[0,1])},mo.scale.identity=function(){return hi([0,1])},mo.svg.arc=function(){function n(){var n=t.apply(this,arguments),i=e.apply(this,arguments),o=r.apply(this,arguments)+Hc,a=u.apply(this,arguments)+Hc,c=(o>a&&(c=o,o=a,a=c),a-o),l=Bo>c?"0":"1",s=Math.cos(o),f=Math.sin(o),h=Math.cos(a),g=Math.sin(a);return c>=Fc?n?"M0,"+i+"A"+i+","+i+" 0 1,1 0,"+-i+"A"+i+","+i+" 0 1,1 0,"+i+"M0,"+n+"A"+n+","+n+" 0 1,0 0,"+-n+"A"+n+","+n+" 0 1,0 0,"+n+"Z":"M0,"+i+"A"+i+","+i+" 0 1,1 0,"+-i+"A"+i+","+i+" 0 1,1 0,"+i+"Z":n?"M"+i*s+","+i*f+"A"+i+","+i+" 0 "+l+",1 "+i*h+","+i*g+"L"+n*h+","+n*g+"A"+n+","+n+" 0 "+l+",0 "+n*s+","+n*f+"Z":"M"+i*s+","+i*f+"A"+i+","+i+" 0 "+l+",1 "+i*h+","+i*g+"L0,0"+"Z"}var t=gi,e=pi,r=di,u=vi;return n.innerRadius=function(e){return arguments.length?(t=pt(e),n):t},n.outerRadius=function(t){return arguments.length?(e=pt(t),n):e},n.startAngle=function(t){return arguments.length?(r=pt(t),n):r},n.endAngle=function(t){return arguments.length?(u=pt(t),n):u},n.centroid=function(){var n=(t.apply(this,arguments)+e.apply(this,arguments))/2,i=(r.apply(this,arguments)+u.apply(this,arguments))/2+Hc;return[Math.cos(i)*n,Math.sin(i)*n]},n};var Hc=-Jo,Fc=Wo-Go;mo.svg.line.radial=function(){var n=Ue(mi);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},We.reverse=Je,Je.reverse=We,mo.svg.area=function(){return yi(dt)},mo.svg.area.radial=function(){var n=yi(mi);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},mo.svg.chord=function(){function n(n,a){var c=t(this,i,n,a),l=t(this,o,n,a);return"M"+c.p0+r(c.r,c.p1,c.a1-c.a0)+(e(c,l)?u(c.r,c.p1,c.r,c.p0):u(c.r,c.p1,l.r,l.p0)+r(l.r,l.p1,l.a1-l.a0)+u(l.r,l.p1,c.r,c.p0))+"Z"}function t(n,t,e,r){var u=t.call(n,e,r),i=a.call(n,u,r),o=c.call(n,u,r)+Hc,s=l.call(n,u,r)+Hc;return{r:i,a0:o,a1:s,p0:[i*Math.cos(o),i*Math.sin(o)],p1:[i*Math.cos(s),i*Math.sin(s)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>Bo)+",1 "+t}function u(n,t,e,r){return"Q 0,0 "+r}var i=De,o=je,a=Mi,c=di,l=vi;return n.radius=function(t){return arguments.length?(a=pt(t),n):a},n.source=function(t){return arguments.length?(i=pt(t),n):i},n.target=function(t){return arguments.length?(o=pt(t),n):o},n.startAngle=function(t){return arguments.length?(c=pt(t),n):c},n.endAngle=function(t){return arguments.length?(l=pt(t),n):l},n},mo.svg.diagonal=function(){function n(n,u){var i=t.call(this,n,u),o=e.call(this,n,u),a=(i.y+o.y)/2,c=[i,{x:i.x,y:a},{x:o.x,y:a},o];return c=c.map(r),"M"+c[0]+"C"+c[1]+" "+c[2]+" "+c[3]}var t=De,e=je,r=xi;return n.source=function(e){return arguments.length?(t=pt(e),n):t},n.target=function(t){return arguments.length?(e=pt(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},mo.svg.diagonal.radial=function(){var n=mo.svg.diagonal(),t=xi,e=n.projection;return n.projection=function(n){return arguments.length?e(bi(t=n)):t},n},mo.svg.symbol=function(){function n(n,r){return(Pc.get(t.call(this,n,r))||Si)(e.call(this,n,r))}var t=wi,e=_i;return n.type=function(e){return arguments.length?(t=pt(e),n):t},n.size=function(t){return arguments.length?(e=pt(t),n):e},n};var Pc=mo.map({circle:Si,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Ic)),e=t*Ic;return"M0,"+-t+"L"+e+",0"+" 0,"+t+" "+-e+",0"+"Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/Yc),e=t*Yc/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/Yc),e=t*Yc/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});mo.svg.symbolTypes=Pc.keys();var Oc,Rc,Yc=Math.sqrt(3),Ic=Math.tan(30*Qo),Uc=[],Zc=0;Uc.call=Ro.call,Uc.empty=Ro.empty,Uc.node=Ro.node,Uc.size=Ro.size,mo.transition=function(n){return arguments.length?Oc?n.transition():n:Uo.transition()},mo.transition.prototype=Uc,Uc.select=function(n){var t,e,r,u=this.id,i=[];n=d(n);for(var o=-1,a=this.length;++o<a;){i.push(t=[]);for(var c=this[o],l=-1,s=c.length;++l<s;)(r=c[l])&&(e=n.call(r,r.__data__,l,o))?("__data__"in r&&(e.__data__=r.__data__),Ni(e,l,u,r.__transition__[u]),t.push(e)):t.push(null)}return Ei(i,u)},Uc.selectAll=function(n){var t,e,r,u,i,o=this.id,a=[];n=v(n);for(var c=-1,l=this.length;++c<l;)for(var s=this[c],f=-1,h=s.length;++f<h;)if(r=s[f]){i=r.__transition__[o],e=n.call(r,r.__data__,f,c),a.push(t=[]);for(var g=-1,p=e.length;++g<p;)(u=e[g])&&Ni(u,g,o,i),t.push(u)}return Ei(a,o)},Uc.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=k(n));for(var i=0,o=this.length;o>i;i++){u.push(t=[]);for(var e=this[i],a=0,c=e.length;c>a;a++)(r=e[a])&&n.call(r,r.__data__,a)&&t.push(r)}return Ei(u,this.id)},Uc.tween=function(n,t){var e=this.id;return arguments.length<2?this.node().__transition__[e].tween.get(n):N(this,null==t?function(t){t.__transition__[e].tween.remove(n)}:function(r){r.__transition__[e].tween.set(n,t)})},Uc.attr=function(n,t){function e(){this.removeAttribute(a)}function r(){this.removeAttributeNS(a.space,a.local)}function u(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(a);return e!==n&&(t=o(e,n),function(n){this.setAttribute(a,t(n))})})}function i(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(a.space,a.local);return e!==n&&(t=o(e,n),function(n){this.setAttributeNS(a.space,a.local,t(n))
})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var o="transform"==n?Br:Er,a=mo.ns.qualify(n);return ki(this,"attr."+n,t,a.local?i:u)},Uc.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(u));return r&&function(n){this.setAttribute(u,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(u.space,u.local));return r&&function(n){this.setAttributeNS(u.space,u.local,r(n))}}var u=mo.ns.qualify(n);return this.tween("attr."+n,u.local?r:e)},Uc.style=function(n,t,e){function r(){this.style.removeProperty(n)}function u(t){return null==t?r:(t+="",function(){var r,u=_o.getComputedStyle(this,null).getPropertyValue(n);return u!==t&&(r=Er(u,t),function(t){this.style.setProperty(n,r(t),e)})})}var i=arguments.length;if(3>i){if("string"!=typeof n){2>i&&(t="");for(e in n)this.style(e,n[e],t);return this}e=""}return ki(this,"style."+n,t,u)},Uc.styleTween=function(n,t,e){function r(r,u){var i=t.call(this,r,u,_o.getComputedStyle(this,null).getPropertyValue(n));return i&&function(t){this.style.setProperty(n,i(t),e)}}return arguments.length<3&&(e=""),this.tween("style."+n,r)},Uc.text=function(n){return ki(this,"text",n,Ai)},Uc.remove=function(){return this.each("end.transition",function(){var n;this.__transition__.count<2&&(n=this.parentNode)&&n.removeChild(this)})},Uc.ease=function(n){var t=this.id;return arguments.length<1?this.node().__transition__[t].ease:("function"!=typeof n&&(n=mo.ease.apply(mo,arguments)),N(this,function(e){e.__transition__[t].ease=n}))},Uc.delay=function(n){var t=this.id;return N(this,"function"==typeof n?function(e,r,u){e.__transition__[t].delay=+n.call(e,e.__data__,r,u)}:(n=+n,function(e){e.__transition__[t].delay=n}))},Uc.duration=function(n){var t=this.id;return N(this,"function"==typeof n?function(e,r,u){e.__transition__[t].duration=Math.max(1,n.call(e,e.__data__,r,u))}:(n=Math.max(1,n),function(e){e.__transition__[t].duration=n}))},Uc.each=function(n,t){var e=this.id;if(arguments.length<2){var r=Rc,u=Oc;Oc=e,N(this,function(t,r,u){Rc=t.__transition__[e],n.call(t,t.__data__,r,u)}),Rc=r,Oc=u}else N(this,function(r){var u=r.__transition__[e];(u.event||(u.event=mo.dispatch("start","end"))).on(n,t)});return this},Uc.transition=function(){for(var n,t,e,r,u=this.id,i=++Zc,o=[],a=0,c=this.length;c>a;a++){o.push(n=[]);for(var t=this[a],l=0,s=t.length;s>l;l++)(e=t[l])&&(r=Object.create(e.__transition__[u]),r.delay+=r.duration,Ni(e,l,i,r)),n.push(e)}return Ei(o,i)},mo.svg.axis=function(){function n(n){n.each(function(){var n,l=mo.select(this),s=this.__chart__||e,f=this.__chart__=e.copy(),h=null==c?f.ticks?f.ticks.apply(f,a):f.domain():c,g=null==t?f.tickFormat?f.tickFormat.apply(f,a):dt:t,p=l.selectAll(".tick").data(h,f),d=p.enter().insert("g",".domain").attr("class","tick").style("opacity",Go),v=mo.transition(p.exit()).style("opacity",Go).remove(),m=mo.transition(p).style("opacity",1),y=Bu(f),M=l.selectAll(".domain").data([0]),x=(M.enter().append("path").attr("class","domain"),mo.transition(M));d.append("line"),d.append("text");var b=d.select("line"),_=m.select("line"),w=p.select("text").text(g),S=d.select("text"),E=m.select("text");switch(r){case"bottom":n=Ti,b.attr("y2",u),S.attr("y",Math.max(u,0)+o),_.attr("x2",0).attr("y2",u),E.attr("x",0).attr("y",Math.max(u,0)+o),w.attr("dy",".71em").style("text-anchor","middle"),x.attr("d","M"+y[0]+","+i+"V0H"+y[1]+"V"+i);break;case"top":n=Ti,b.attr("y2",-u),S.attr("y",-(Math.max(u,0)+o)),_.attr("x2",0).attr("y2",-u),E.attr("x",0).attr("y",-(Math.max(u,0)+o)),w.attr("dy","0em").style("text-anchor","middle"),x.attr("d","M"+y[0]+","+-i+"V0H"+y[1]+"V"+-i);break;case"left":n=qi,b.attr("x2",-u),S.attr("x",-(Math.max(u,0)+o)),_.attr("x2",-u).attr("y2",0),E.attr("x",-(Math.max(u,0)+o)).attr("y",0),w.attr("dy",".32em").style("text-anchor","end"),x.attr("d","M"+-i+","+y[0]+"H0V"+y[1]+"H"+-i);break;case"right":n=qi,b.attr("x2",u),S.attr("x",Math.max(u,0)+o),_.attr("x2",u).attr("y2",0),E.attr("x",Math.max(u,0)+o).attr("y",0),w.attr("dy",".32em").style("text-anchor","start"),x.attr("d","M"+i+","+y[0]+"H0V"+y[1]+"H"+i)}if(f.rangeBand){var k=f.rangeBand()/2,A=function(n){return f(n)+k};d.call(n,A),m.call(n,A)}else d.call(n,s),m.call(n,f),v.call(n,f)})}var t,e=mo.scale.linear(),r=Vc,u=6,i=6,o=3,a=[10],c=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Xc?t+"":Vc,n):r},n.ticks=function(){return arguments.length?(a=arguments,n):a},n.tickValues=function(t){return arguments.length?(c=t,n):c},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(u=+t,i=+arguments[e-1],n):u},n.innerTickSize=function(t){return arguments.length?(u=+t,n):u},n.outerTickSize=function(t){return arguments.length?(i=+t,n):i},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(){return arguments.length&&n},n};var Vc="bottom",Xc={top:1,right:1,bottom:1,left:1};mo.svg.brush=function(){function n(i){i.each(function(){var i=mo.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",u).on("touchstart.brush",u),o=i.selectAll(".background").data([0]);o.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),i.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var a=i.selectAll(".resize").data(v,dt);a.exit().remove(),a.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return $c[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),a.style("display",n.empty()?"none":null);var s,f=mo.transition(i),h=mo.transition(o);c&&(s=Bu(c),h.attr("x",s[0]).attr("width",s[1]-s[0]),e(f)),l&&(s=Bu(l),h.attr("y",s[0]).attr("height",s[1]-s[0]),r(f)),t(f)})}function t(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+s[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function e(n){n.select(".extent").attr("x",s[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",s[1]-s[0])}function r(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function u(){function u(){32==mo.event.keyCode&&(N||(M=null,q[0]-=s[1],q[1]-=h[1],N=2),f())}function g(){32==mo.event.keyCode&&2==N&&(q[0]+=s[1],q[1]+=h[1],N=0,f())}function v(){var n=mo.mouse(b),u=!1;x&&(n[0]+=x[0],n[1]+=x[1]),N||(mo.event.altKey?(M||(M=[(s[0]+s[1])/2,(h[0]+h[1])/2]),q[0]=s[+(n[0]<M[0])],q[1]=h[+(n[1]<M[1])]):M=null),k&&m(n,c,0)&&(e(S),u=!0),A&&m(n,l,1)&&(r(S),u=!0),u&&(t(S),w({type:"brush",mode:N?"move":"resize"}))}function m(n,t,e){var r,u,a=Bu(t),c=a[0],l=a[1],f=q[e],g=e?h:s,v=g[1]-g[0];return N&&(c-=f,l-=v+f),r=(e?d:p)?Math.max(c,Math.min(l,n[e])):n[e],N?u=(r+=f)+v:(M&&(f=Math.max(c,Math.min(l,2*M[e]-r))),r>f?(u=r,r=f):u=f),g[0]!=r||g[1]!=u?(e?o=null:i=null,g[0]=r,g[1]=u,!0):void 0}function y(){v(),S.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),mo.select("body").style("cursor",null),z.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),T(),w({type:"brushend"})}var M,x,b=this,_=mo.select(mo.event.target),w=a.of(b,arguments),S=mo.select(b),E=_.datum(),k=!/^(n|s)$/.test(E)&&c,A=!/^(e|w)$/.test(E)&&l,N=_.classed("extent"),T=L(),q=mo.mouse(b),z=mo.select(_o).on("keydown.brush",u).on("keyup.brush",g);if(mo.event.changedTouches?z.on("touchmove.brush",v).on("touchend.brush",y):z.on("mousemove.brush",v).on("mouseup.brush",y),S.interrupt().selectAll("*").interrupt(),N)q[0]=s[0]-q[0],q[1]=h[0]-q[1];else if(E){var C=+/w$/.test(E),D=+/^n/.test(E);x=[s[1-C]-q[0],h[1-D]-q[1]],q[0]=s[C],q[1]=h[D]}else mo.event.altKey&&(M=q.slice());S.style("pointer-events","none").selectAll(".resize").style("display",null),mo.select("body").style("cursor",_.style("cursor")),w({type:"brushstart"}),v()}var i,o,a=g(n,"brushstart","brush","brushend"),c=null,l=null,s=[0,0],h=[0,0],p=!0,d=!0,v=Bc[0];return n.event=function(n){n.each(function(){var n=a.of(this,arguments),t={x:s,y:h,i:i,j:o},e=this.__chart__||t;this.__chart__=t,Oc?mo.select(this).transition().each("start.brush",function(){i=e.i,o=e.j,s=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=kr(s,t.x),r=kr(h,t.y);return i=o=null,function(u){s=t.x=e(u),h=t.y=r(u),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){i=t.i,o=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(c=t,v=Bc[!c<<1|!l],n):c},n.y=function(t){return arguments.length?(l=t,v=Bc[!c<<1|!l],n):l},n.clamp=function(t){return arguments.length?(c&&l?(p=!!t[0],d=!!t[1]):c?p=!!t:l&&(d=!!t),n):c&&l?[p,d]:c?p:l?d:null},n.extent=function(t){var e,r,u,a,f;return arguments.length?(c&&(e=t[0],r=t[1],l&&(e=e[0],r=r[0]),i=[e,r],c.invert&&(e=c(e),r=c(r)),e>r&&(f=e,e=r,r=f),(e!=s[0]||r!=s[1])&&(s=[e,r])),l&&(u=t[0],a=t[1],c&&(u=u[1],a=a[1]),o=[u,a],l.invert&&(u=l(u),a=l(a)),u>a&&(f=u,u=a,a=f),(u!=h[0]||a!=h[1])&&(h=[u,a])),n):(c&&(i?(e=i[0],r=i[1]):(e=s[0],r=s[1],c.invert&&(e=c.invert(e),r=c.invert(r)),e>r&&(f=e,e=r,r=f))),l&&(o?(u=o[0],a=o[1]):(u=h[0],a=h[1],l.invert&&(u=l.invert(u),a=l.invert(a)),u>a&&(f=u,u=a,a=f))),c&&l?[[e,u],[r,a]]:c?[e,r]:l&&[u,a])},n.clear=function(){return n.empty()||(s=[0,0],h=[0,0],i=o=null),n},n.empty=function(){return!!c&&s[0]==s[1]||!!l&&h[0]==h[1]},mo.rebind(n,a,"on")};var $c={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Bc=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Wc=mo.time={},Jc=Date,Gc=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];zi.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){Kc.setUTCDate.apply(this._,arguments)},setDay:function(){Kc.setUTCDay.apply(this._,arguments)},setFullYear:function(){Kc.setUTCFullYear.apply(this._,arguments)},setHours:function(){Kc.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){Kc.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){Kc.setUTCMinutes.apply(this._,arguments)},setMonth:function(){Kc.setUTCMonth.apply(this._,arguments)},setSeconds:function(){Kc.setUTCSeconds.apply(this._,arguments)},setTime:function(){Kc.setTime.apply(this._,arguments)}};var Kc=Date.prototype,Qc="%a %b %e %X %Y",nl="%m/%d/%Y",tl="%H:%M:%S",el=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],rl=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],ul=["January","February","March","April","May","June","July","August","September","October","November","December"],il=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];Wc.year=Ci(function(n){return n=Wc.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),Wc.years=Wc.year.range,Wc.years.utc=Wc.year.utc.range,Wc.day=Ci(function(n){var t=new Jc(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),Wc.days=Wc.day.range,Wc.days.utc=Wc.day.utc.range,Wc.dayOfYear=function(n){var t=Wc.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},Gc.forEach(function(n,t){n=n.toLowerCase(),t=7-t;var e=Wc[n]=Ci(function(n){return(n=Wc.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=Wc.year(n).getDay();return Math.floor((Wc.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});Wc[n+"s"]=e.range,Wc[n+"s"].utc=e.utc.range,Wc[n+"OfYear"]=function(n){var e=Wc.year(n).getDay();return Math.floor((Wc.dayOfYear(n)+(e+t)%7)/7)}}),Wc.week=Wc.sunday,Wc.weeks=Wc.sunday.range,Wc.weeks.utc=Wc.sunday.utc.range,Wc.weekOfYear=Wc.sundayOfYear,Wc.format=ji;var ol=Hi(el),al=Fi(el),cl=Hi(rl),ll=Fi(rl),sl=Hi(ul),fl=Fi(ul),hl=Hi(il),gl=Fi(il),pl=/^%/,dl={"-":"",_:" ",0:"0"},vl={a:function(n){return rl[n.getDay()]},A:function(n){return el[n.getDay()]},b:function(n){return il[n.getMonth()]},B:function(n){return ul[n.getMonth()]},c:ji(Qc),d:function(n,t){return Pi(n.getDate(),t,2)},e:function(n,t){return Pi(n.getDate(),t,2)},H:function(n,t){return Pi(n.getHours(),t,2)},I:function(n,t){return Pi(n.getHours()%12||12,t,2)},j:function(n,t){return Pi(1+Wc.dayOfYear(n),t,3)},L:function(n,t){return Pi(n.getMilliseconds(),t,3)},m:function(n,t){return Pi(n.getMonth()+1,t,2)},M:function(n,t){return Pi(n.getMinutes(),t,2)},p:function(n){return n.getHours()>=12?"PM":"AM"},S:function(n,t){return Pi(n.getSeconds(),t,2)},U:function(n,t){return Pi(Wc.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Pi(Wc.mondayOfYear(n),t,2)},x:ji(nl),X:ji(tl),y:function(n,t){return Pi(n.getFullYear()%100,t,2)},Y:function(n,t){return Pi(n.getFullYear()%1e4,t,4)},Z:ao,"%":function(){return"%"}},ml={a:Oi,A:Ri,b:Zi,B:Vi,c:Xi,d:no,e:no,H:eo,I:eo,j:to,L:io,m:Qi,M:ro,p:oo,S:uo,U:Ii,w:Yi,W:Ui,x:$i,X:Bi,y:Ji,Y:Wi,Z:Gi,"%":co},yl=/^\s*\d+/,Ml=mo.map({am:0,pm:1});ji.utc=lo;var xl=lo("%Y-%m-%dT%H:%M:%S.%LZ");ji.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?so:xl,so.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},so.toString=xl.toString,Wc.second=Ci(function(n){return new Jc(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),Wc.seconds=Wc.second.range,Wc.seconds.utc=Wc.second.utc.range,Wc.minute=Ci(function(n){return new Jc(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),Wc.minutes=Wc.minute.range,Wc.minutes.utc=Wc.minute.utc.range,Wc.hour=Ci(function(n){var t=n.getTimezoneOffset()/60;return new Jc(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),Wc.hours=Wc.hour.range,Wc.hours.utc=Wc.hour.utc.range,Wc.month=Ci(function(n){return n=Wc.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),Wc.months=Wc.month.range,Wc.months.utc=Wc.month.utc.range;var bl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],_l=[[Wc.second,1],[Wc.second,5],[Wc.second,15],[Wc.second,30],[Wc.minute,1],[Wc.minute,5],[Wc.minute,15],[Wc.minute,30],[Wc.hour,1],[Wc.hour,3],[Wc.hour,6],[Wc.hour,12],[Wc.day,1],[Wc.day,2],[Wc.week,1],[Wc.month,1],[Wc.month,3],[Wc.year,1]],wl=[[ji("%Y"),Vt],[ji("%B"),function(n){return n.getMonth()}],[ji("%b %d"),function(n){return 1!=n.getDate()}],[ji("%a %d"),function(n){return n.getDay()&&1!=n.getDate()}],[ji("%I %p"),function(n){return n.getHours()}],[ji("%I:%M"),function(n){return n.getMinutes()}],[ji(":%S"),function(n){return n.getSeconds()}],[ji(".%L"),function(n){return n.getMilliseconds()}]],Sl=go(wl);_l.year=Wc.year,Wc.scale=function(){return fo(mo.scale.linear(),_l,Sl)};var El={range:function(n,t,e){return mo.range(+n,+t,e).map(ho)}},kl=_l.map(function(n){return[n[0].utc,n[1]]}),Al=[[lo("%Y"),Vt],[lo("%B"),function(n){return n.getUTCMonth()}],[lo("%b %d"),function(n){return 1!=n.getUTCDate()}],[lo("%a %d"),function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],[lo("%I %p"),function(n){return n.getUTCHours()}],[lo("%I:%M"),function(n){return n.getUTCMinutes()}],[lo(":%S"),function(n){return n.getUTCSeconds()}],[lo(".%L"),function(n){return n.getUTCMilliseconds()}]],Nl=go(Al);return kl.year=Wc.year.utc,Wc.scale.utc=function(){return fo(mo.scale.linear(),kl,Nl)},mo.text=vt(function(n){return n.responseText}),mo.json=function(n,t){return mt(n,"application/json",po,t)},mo.html=function(n,t){return mt(n,"text/html",vo,t)},mo.xml=vt(function(n){return n.responseXML}),mo}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Seq,Operators,d3,Arrays,Math,document,D3,Demo,Client;
 Runtime.Define(Global,{
  D3:{
   Demo:{
    Client:{
     Data:Runtime.Field(function()
     {
      return Seq.toArray(Operators.step(10,10,100));
     }),
     Join:function(data,context)
     {
      var ctx,joined,value;
      ctx=d3.select(context).append("svg").attr("height",500);
      joined=ctx.selectAll("circle").data(data);
      value=joined.enter().append("circle").attr("cx",function(x)
      {
       return x*5;
      }).attr("cy",function(x)
      {
       return 50+x*x/40;
      }).attr("r",function(x,i)
      {
       var p;
       p=+i/+Arrays.length(data);
       return 7+5*Math.sin(3*p*Math.PI);
      });
      return;
     },
     Main:Runtime.Field(function()
     {
      var main;
      main=document.getElementById("main");
      return Client.Join(Client.Data(),main);
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  d3=Runtime.Safe(Global.d3);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Math=Runtime.Safe(Global.Math);
  document=Runtime.Safe(Global.document);
  D3=Runtime.Safe(Global.D3);
  Demo=Runtime.Safe(D3.Demo);
  return Client=Runtime.Safe(Demo.Client);
 });
 Runtime.OnLoad(function()
 {
  Client.Main();
  Client.Data();
  return;
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();
